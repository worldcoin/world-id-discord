import { Modal } from '@/components/Modal'
import { VerificationScreen } from '@/features/verification/components/VerificationScreen'
import { fetchBotConfig } from '@/lib/discord-integration-api/fetch-bot-config'
import { fetchAvailableGuildRoles } from '@/lib/discord/fetch-available-guild-roles'
import { getGuildData } from '@/lib/discord/get-guild-data'
import { generateMetaTitle } from '@/utils/generate-meta-title'
import { prepareConfigFormInitialValues } from '@/utils/prepare-ui-bot-config'
import { getTranslations } from 'next-intl/server'

export const generateMetadata = async () => {
  const t = await getTranslations()
  return { title: generateMetaTitle(t('Discord_Integration_Verify_Page_Meta_Title')) }
}

type VerificationProps = {
  searchParams: Promise<{
    guild_id: string
    user_id: string
    token: string
    interactions_token: string
  }>
}

const Verification = async ({ searchParams }: VerificationProps) => {
  const { guild_id } = await searchParams
  const guild = await getGuildData(guild_id)
  const botConfig = await fetchBotConfig(guild_id)
  const roles = await fetchAvailableGuildRoles(guild_id)

  if (!botConfig) {
    throw new Error('Something went wrong. Try again')
  }

  const initialConfigFormValues = prepareConfigFormInitialValues({
    botConfig,
    roles,
    guild_id,
  })

  if (!process.env.NEXT_PUBLIC_APP_ID) {
    throw new Error('Something went wrong. Try again')
  }

  return (
    <Modal>
      <VerificationScreen configFormValues={initialConfigFormValues} guild={guild} />
    </Modal>
  )
}

export default Verification
