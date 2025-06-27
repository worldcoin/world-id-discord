import { assignGuildMemberRole } from '@/lib/discord/assign-guild-member-role'
import { PostHogClient } from '@/lib/posthog'
import { APIGuild } from 'discord-api-types/v10'

export type AssignRolesInput = {
  guild: APIGuild
  userId: string
  rolesToAssign: string[]
}

export const assignRoles = async (input: AssignRolesInput) => {
  const { guild, userId, rolesToAssign } = input
  const assignRolePromises: Promise<unknown>[] = []

  for (const roleId of rolesToAssign) {
    assignRolePromises.push(assignGuildMemberRole(guild.id, userId, roleId))
  }

  await Promise.all(assignRolePromises)
  const assignedRoles = guild.roles.filter(role => rolesToAssign.includes(role.id))

  if (process.env.NODE_ENV === 'production') {
    const posthog = PostHogClient()

    const captureResult = await posthog.capture({
      event: 'discord integration verification',
      distinctId: userId,
    })

    if (!captureResult.success) {
      console.error(captureResult.error)
    }

    await posthog.shutdown()
  }

  return assignedRoles
}
