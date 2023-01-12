import { createGlobalCommand } from 'services/discord'
import { ApplicationCommandType } from 'discord-api-types/v10'

export const getServerSideProps = async () => {
  await createGlobalCommand({
    type: ApplicationCommandType.ChatInput,
    name: 'ping',
    description: 'reply pong'
  })
  return { props:{} }
}

export default function RegisterPage() {
  return (
    <div>
      command registered
    </div>
  )
}
