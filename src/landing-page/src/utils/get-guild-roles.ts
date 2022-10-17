export const getGuildRoles = async (
  id: string,
): Promise<
  Array<{ name: string; id: string }> | { message: string; error: unknown }
> => {
  return await fetch(
    `${process.env.REACT_APP_BOT_API_URL}/get-roles?guild_id=${id}`,
  )
    .then((data) => data.json())
    .then((roles) => roles);
};
