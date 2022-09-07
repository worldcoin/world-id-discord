import { Icon } from "components/common/Icon";
import { Layout } from "components/common/Layout";
import { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Guild } from "types";

const searchParams = new URLSearchParams(
  new URL(window.location.href).hash.substring(1),
);

const discordData = {
  tokenType: searchParams.get("token_type"),
  token: searchParams.get("access_token"),
};

const isAdmin = (permissions: any) => {
  // @NOTE https://github.com/discord/discord-api-docs/blob/main/docs/topics/Permissions.md#permissions
  return (permissions & 0x8) === 0x8;
};

const getGuilds = async () => {
  return await fetch("https://discord.com/api/users/@me/guilds", {
    headers: {
      authorization: `${discordData.tokenType} ${discordData.token}`,
    },
  })
    .then((data) => data.json())
    .then((guilds: Array<Guild>) =>
      guilds.filter((guild) => isAdmin(guild.permissions_new)),
    );
};

export const Auth = memo(function Auth() {
  const navigate = useNavigate();

  const [administeredGuilds, setAdministeredGuilds] =
    useState<Array<Guild> | null>(null);

  useEffect(() => {
    try {
      getGuilds().then((data) => setAdministeredGuilds(data));
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (!administeredGuilds) {
      return;
    }

    navigate("/configuration", {
      replace: true,
      state: { administeredGuilds },
    });
  }, [administeredGuilds, navigate]);

  return (
    <Layout>
      <div className="h-screen w-full flex justify-center items-center">
        <Icon
          className="w-32 h-32 animate animate-ping"
          name="logo"
        />
      </div>
    </Layout>
  );
});
