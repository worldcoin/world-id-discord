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
  useState
} from "react";
import { Selector } from "./Selector";
import type { Option } from "./types/option";

const discordRolesList: Array<Option> = [
  { label: "Moderator", value: "moderator" },
  { label: "Server admin", value: "server admin" },
  { label: "Community MVP", value: "community mvp" },
  { label: "Community MVP 2", value: "community mvp 2" },
  { label: "Community MVP 3", value: "community mvp 3" },
  { label: "Community MVP 4", value: "community mvp 4" },
];

export const Configuration = memo(function Configuration() {
  const [active, setActive] = useState(false);
  const [actionId, setActionsId] = useState<string>();
  const toggleActive = useCallback(() => setActive((p) => !p), []);
  const [isStaging, setIsStaging] = useState(false);
  const [discordRoles, setDiscordRoles] = useState<Array<Option>>([]);

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
    return active && actionId?.length && discordRoles.length;
  }, [actionId?.length, active, discordRoles.length]);

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

          <div className="grid grid-cols-[100%] gap-y-8.5 px-8 py-12">
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
                  "w-full mt-4 p-6 border-2 bg-transparent border-f9f9f9/20 rounded-xl outline-none bg-0c0e10",
                  "text-14 font-semibold placeholder:text-ffffff/20 hover:border-6673b9/50 focus:border-6673b9",
                  "transition-colors",
                )}
                type="text"
                placeholder="wid_fb74a74cc94d3ffbe3f6669f556b36e4"
                value={actionId}
                onChange={handleChangeActionId}
              />

              {/* FIXME: add link */}
              <a
                href="https://developer.worldcoin.org"
                target="_blank"
                rel="noopener"
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
                options={discordRolesList}
                selected={discordRoles}
                onChange={setDiscordRoles}
              />

              <span className="block mt-3 text-6673b9">
                These are the roles that a verified person will get assigned
              </span>
            </div>

            <Button
              className="w-full disabled:opacity-20 mt-12"
              disabled={!formValid}
            >
              Save changes
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
});
