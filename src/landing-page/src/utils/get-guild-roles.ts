export const getGuildRoles = async (
  id: string,
): Promise<Array<{ name: string; id: string }>> => {
  return await fetch(
    `https://pys1t4otpl.execute-api.us-east-1.amazonaws.com/prod/get-roles?guild_id=${id}`,
  )
    .then((data) => data.json())
    .then((roles) => roles);
};
