import { Modal } from '@/components/Modal'
import { GeneralConfigInfo } from '@/features/admin/components/GeneralConfigInfo'
import { IconsSection } from '@/features/admin/components/IconsSection'
import { SubmitSection } from '@/features/admin/components/SubmitSection'
import { SubmitStatus } from '@/features/admin/components/SubmitStatus'
import { VerificationLevels } from '@/features/admin/components/VerificationLevels'
import { ConfigForm } from '@/features/admin/providers/ConfigForm'
import { fetchBotConfig } from '@/lib/discord-integration-api/fetch-bot-config'
import { fetchAvailableGuildRoles } from '@/lib/discord/fetch-available-guild-roles'
import { authOptions } from '@/server/auth-options'
import { generateMetaTitle } from '@/utils/generate-meta-title'
import { prepareConfigFormInitialValues } from '@/utils/prepare-ui-bot-config'
import { routes } from '@/utils/routes'
import { getServerSession } from 'next-auth'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'

export const generateMetadata = async () => {
  const t = await getTranslations()
  return { title: generateMetaTitle(t('Discord_Integration_Admin_Meta_Title')) }
}

const Admin = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.guild.id) {
    redirect(routes.signIn({ callbackUrl: routes.admin() }))
  }

  const roles = await fetchAvailableGuildRoles(session?.guild.id)
  const botConfig = await fetchBotConfig(session?.guild.id)

  const initialConfigFormValues = prepareConfigFormInitialValues({
    botConfig,
    roles,
    guild_id: session?.guild.id,
  })

  return (
    <Modal className="max-w-[648px] w-full relative">
      <IconsSection className="absolute -top-15 -inset-x-0" />

      <ConfigForm initialValues={initialConfigFormValues}>
        <GeneralConfigInfo />
        <VerificationLevels initialRoles={roles} />
        <SubmitSection />
        <SubmitStatus className="absolute -bottom-8 inset-x-0" />
      </ConfigForm>
    </Modal>
  )
}

export default Admin
