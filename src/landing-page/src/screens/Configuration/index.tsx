import cn from "classnames";
import { Button } from "components/common/Button";
import { Header } from "components/common/Header";
import { Icon } from "components/common/Icon";
import { Layout } from "components/common/Layout";
import {
  ChangeEventHandler,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Guild } from "types";
import { getBotConfig, getGuildRoles, saveBotConfig } from "utils";
import type { GetBotConfigResult } from "~/types";
import { Selector } from "./Selector";
import type { Option } from "./types/option";

type LocationState = {
  administeredGuilds?: Array<Guild>;
};

export const Configuration = memo(function Configuration() {
  const location = useLocation();
  const navigate = useNavigate();

  const administratedGuilds: Array<Option> | undefined = (
    location.state as LocationState
  )?.administeredGuilds?.map((guild) => ({
    label: guild.name,
    value: guild.id,
  }));

  // @NOTE redirects to /auth in case user skips bot installation
  useEffect(() => {
    if (!administratedGuilds) {
      navigate("/auth");
    }
  }, [administratedGuilds, navigate]);

  const [active, setActive] = useState(false);
  const [actionId, setActionsId] = useState<string>("");
  const toggleActive = useCallback(() => setActive((p) => !p), []);
  const [isStaging, setIsStaging] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<Array<Option>>([]);
  const [roles, setRoles] = useState<Array<Option>>([]);
  const [savingInProgress, setSavingInProgress] = useState(false);
  const [savedSuccessfully, setSavedSuccessfully] = useState<boolean | null>(
    null,
  );
  const [selectedGuild, setSelectedGuild] = useState<Option | null>(null);
  const [fetchRolesError, setFetchRolesError] = useState("");
  const [formDataLoading, setFormDataLoading] = useState(false);

  // FIXME: mocked staging status
  useEffect(() => {
    setIsStaging(active);
  }, [active]);

  const handleChangeActionId: ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      setActionsId(e.target.value);
    }, []);

  // FIXME: mocked validation function
  const formValid = useMemo(() => {
    return active && selectedGuild && actionId?.length && selectedRoles.length;
  }, [actionId?.length, active, selectedGuild, selectedRoles.length]);

  const hideStatus = useCallback(() => {
    const timer = setTimeout(() => {
      setSavedSuccessfully(null);
      clearTimeout(timer);
    }, 2000);
  }, []);

  const saveChanges = useCallback(async () => {
    if (!selectedGuild || !actionId || selectedRoles.length === 0) {
      setSavedSuccessfully(false);
      return hideStatus();
    }

    setSavingInProgress(true);

    const success = await saveBotConfig({
      guild_id: selectedGuild.value,
      action_id: actionId,
      roles: selectedRoles.map((role) => role.value),
    });

    if (!success) {
      setSavedSuccessfully(false);
      setSavingInProgress(false);
      hideStatus();
    }

    if (success) {
      setActionsId("");
      setSelectedRoles([]);
      setSelectedGuild(null);
      setActive(false);
      setSavingInProgress(false);
      setSavedSuccessfully(true);
      hideStatus();
    }
  }, [actionId, hideStatus, selectedGuild, selectedRoles]);

  const toggleRoles = useCallback((value: Option) => {
    setSelectedRoles((prevValues) => {
      if (prevValues.includes(value)) {
        return prevValues.filter((prevValue) => prevValue !== value);
      }

      return [...prevValues, value];
    });
  }, []);

  const prefillFrom = useCallback(
    (props: {
      botConfigData: GetBotConfigResult["data"];
      existingRoles: Array<{ label: string; value: string }>;
    }) => {
      if (!props.botConfigData) {
        return;
      }

      setActionsId(props.botConfigData.action_id);

      setSelectedRoles(
        props.existingRoles.filter((role) =>
          props.botConfigData?.roles.find(
            (fetchedRole) => fetchedRole === role.value,
          ),
        ),
      );
    },
    [],
  );

  const clearForm = useCallback(() => {
    setActionsId("");
    setSelectedRoles([]);
  }, []);

  const selectGuild = useCallback(
    async (guild: Option) => {
      setFormDataLoading(true);
      try {
        const guildRoles = await getGuildRoles(guild.value);
        clearForm();

        if (!Array.isArray(guildRoles)) {
          throw guildRoles;
        }

        setFetchRolesError("");
        const existingRoles = guildRoles
          .filter((role) => role.name !== "@everyone")
          .map((role) => ({ label: role.name, value: role.id }));

        setRoles(existingRoles);

        const botConfig = await getBotConfig(guild.value);
        console.log("botConfig: ", botConfig);

        if (botConfig.error) {
          return;
        }

        prefillFrom({
          botConfigData: botConfig.data,
          existingRoles,
        });

        setSelectedGuild(guild);
      } catch (error: any) {
        setFormDataLoading(false);
        if (!error.message) {
          return console.log(error);
        }

        setFetchRolesError(error.message);
      }
      setFormDataLoading(false);
    },
    [clearForm, prefillFrom],
  );

  return (
    <Layout className="grid grid-rows-auto/fr min-h-screen pb-8">
      <Header hideLinks />

      <div className="grid grid-cols-container place-items-center justify-center px-2">
        <div
          className={cn(
            "w-full md:w-[660px] col-start-2 relative border-2 border-f9f9f9/20 rounded-xl bg-0f1328 overflow-hidden",
            "before:absolute before:h-60 before:top-[calc(100%-20px)] before:left-0 before:right-0 before:blur-[360px]",
            "before:rounded-[100%] before:bg-gradient-81.5 before:from-4940e0 before:to-a39dff",
          )}
        >
          {formDataLoading && (
            <div className="z-50 flex items-center justify-center absolute inset-0 bg-000000/80">
              <Icon
                className="w-16 h-16 animate animate-ping"
                name="logo"
              />
            </div>
          )}

          <div className="grid grid-flow-col justify-between auto-cols-max items-center p-8 border-b border-[color:inherit]">
            <span className="text-20 font-semibold">
              World ID Bot Configuration
            </span>

            <a
              className="hover:opacity-70 transition-opacity p-2"
              href="/"
            >
              <Icon
                className="w-5 h-5 md:w-2.5 md:h-2.5"
                name="cross"
              />
            </a>
          </div>

          <div className="grid grid-cols-[100%] gap-y-8.5 px-8 pt-12 pb-4">
            <div className="grid grid-flow-col justify-between">
              <span>Bot Status</span>
              <span
                className={cn(
                  "relative rounded-full p-0.5 w-10 h-6 cursor-pointer select-none",
                  "before:absolute before:h-[20px] before:aspect-square before:top-2px before:bg-ffffff",
                  "before:rounded-full before:transition-all before:ease-in-out",
                  {
                    "bg-gradient-81.5 from-4940e0 to-a39dff before:left-[calc(100%-2px)] before:-translate-x-full":
                      active,
                  },
                  { "bg-3e4152 before:left-0.5": !active },
                )}
                onClick={toggleActive}
              />
            </div>

            <div className="mt-6">
              <span>Server</span>

              <Selector
                className="mt-4"
                options={administratedGuilds || []}
                selected={selectedGuild}
                onChange={selectGuild}
                placeholder="Choose a server"
              />

              <span
                className={cn("block mt-3", {
                  "text-6673b9": !fetchRolesError,
                  "text-red-500": fetchRolesError,
                })}
              >
                {fetchRolesError ||
                  "The server to which the changes will be applied"}
              </span>
            </div>

            <div className="mt-8">
              <div className="grid grid-flow-col auto-cols-max items-center justify-between">
                <span>Action ID</span>
                <span
                  className={cn(
                    "grid grid-flow-col auto-cols-max items-center px-3 py-1 gap-x-2.5 border rounded-md text-12",
                    "transition-[color,background-color,border-color,opacity]",
                    {
                      "text-ffffff/50 bg-ffffff/10 border-ffffff/50 opacity-20":
                        !isStaging,
                    },
                    {
                      "text-6673b9/50 bg-6673b9/10 border-6673b9/50": isStaging,
                    },
                  )}
                >
                  <Icon
                    className="w-3 h-3"
                    name="chart"
                  />
                  Staging
                </span>
              </div>

              <input
                className={cn(
                  "w-full mt-4 p-6 border-2 border-f9f9f9/20 rounded-xl outline-none bg-0c0e10",
                  "text-14 font-semibold placeholder:text-ffffff/20 hover:border-6673b9/50 focus:border-6673b9",
                  "transition-colors disabled:bg-0c0e10/50",
                )}
                type="text"
                placeholder="wid_fb74a74cc94d3ffbe3f6669f556b36e4"
                value={actionId}
                onChange={handleChangeActionId}
                disabled={!selectedGuild}
              />

              {/* FIXME: add link */}
              <a
                href="https://developer.worldcoin.org"
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-3 text-6673b9 hover:opacity-70 transition-opacity"
              >
                Get your Action ID from Worldcoin’s&nbsp;
                <span className="text-ffffff">Developer Portal</span>
                <Icon
                  className="text-ffffff w-4 h-[21px] align-bottom ml-1.5"
                  name="external"
                />
              </a>
            </div>

            <div className="mt-6">
              <span>Roles to assign</span>

              <Selector
                className="mt-4"
                options={roles}
                setOptions={setRoles}
                selected={selectedRoles}
                onChange={toggleRoles}
                placeholder="Choose a role"
                info="You can create more roles in your Discord server settings"
                multiple
                disabled={!selectedGuild}
              />

              <span className="block mt-3 text-6673b9">
                These are the roles that a verified person will get assigned
              </span>
            </div>

            <div className="grid justify-items-center gap-y-4 mt-12">
              <Button
                className="w-full disabled:opacity-20"
                disabled={!formValid || savingInProgress}
                onClick={saveChanges}
              >
                {savingInProgress ? "Saving..." : "Save changes"}
              </Button>

              <span
                className={cn(
                  "transition-visibility/opacity col-start-1 row-start-2",
                  { "visible opacity-100": savedSuccessfully === true },
                  { "invisible opacity-0": savedSuccessfully !== true },
                )}
              >
                Your changes have been successfully saved!
              </span>

              <span
                className={cn(
                  "transition-visibility/opacity col-start-1 row-start-2 text-red-500",
                  { "visible opacity-100": savedSuccessfully === false },
                  { "invisible opacity-0": savedSuccessfully !== false },
                )}
              >
                Something went wrong. Try again, please.
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
});
