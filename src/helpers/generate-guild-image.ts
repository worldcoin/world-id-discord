export const generateGuildImage = (id: string, iconHash: string | null | undefined) => {
  if (!iconHash || !id) {
    return `https://cdn.discordapp.com/embed/avatars/0.png`
  }

  return `https://cdn.discordapp.com/icons/${id}/${iconHash}.png`
}
