import { Guild } from "types";

const isAdmin = (permissions: any) => {
  // @NOTE https://github.com/discord/discord-api-docs/blob/main/docs/topics/Permissions.md#permissions
  return (permissions & 0x8) === 0x8;
};

export const getGuilds = async (token: string) => {
  return await fetch("https://discord.com/api/users/@me/guilds", {
    headers: {
      authorization: token,
    },
  })
    .then((data) => data.json())
    .then((guilds: Array<Guild>) =>
      guilds.filter((guild) => isAdmin(guild.permissions_new)),
    );
};
