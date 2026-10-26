let hasWarnedAboutDeprecatedAppId = false

/**
 * Resolves the identifier used to call the Developer Portal v4 verify endpoint.
 *
 * IDKit 4 identifies the relying party by its RP id (`rp_...`), configured via
 * `NEXT_PUBLIC_RP_ID`. The v4 verify endpoint also accepts an `app_id` as the
 * route parameter (for migrated apps), so deployments that still only set the
 * deprecated `NEXT_PUBLIC_APP_ID` keep working for one release; a deprecation
 * warning is logged in that case.
 */
export const resolveRpId = () => {
  if (process.env.NEXT_PUBLIC_RP_ID) {
    return process.env.NEXT_PUBLIC_RP_ID
  }

  if (process.env.NEXT_PUBLIC_APP_ID) {
    if (!hasWarnedAboutDeprecatedAppId) {
      hasWarnedAboutDeprecatedAppId = true

      console.warn(
        'NEXT_PUBLIC_APP_ID is deprecated as the World ID verification identifier. ' +
          'Set NEXT_PUBLIC_RP_ID to the RP id from the Developer Portal; ' +
          'the NEXT_PUBLIC_APP_ID fallback will be removed in the next release.'
      )
    }

    return process.env.NEXT_PUBLIC_APP_ID
  }

  return undefined
}
