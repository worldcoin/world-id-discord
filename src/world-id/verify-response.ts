/** TODO: We may want to merge those functions from World ID JS SDK */

import type { WorldIdValidationResponse } from "./events";

/**
 * Verifies that the response from the WLD app is valid
 *
 * @param result - Expects a valid `VerificationResponse`
 */
export function verifyVerificationResponseStructure(
  result: unknown,
): result is WorldIdValidationResponse {
  if (typeof result !== "object" || !result) return false;
  const requiredKeys = new Set(["merkle_root", "nullifier_hash", "proof"]);
  for (const [key, value] of Object.entries(result)) {
    if (!requiredKeys.has(key)) continue;
    requiredKeys.delete(key);
    if (typeof value !== "string" || !isABILikeEncoding(value)) return false;
  }
  return requiredKeys.size === 0;
}

/**
 * Validates that an string looks like an ABI-encoded string. Very basic
 * format-like check. The WLD app validates the actual values.
 *
 * @param   value - String to validate
 *
 * @returns       `true` if the value looks like an ABI-encoded string; `false` otherwise
 */
const ABI_REGEX = /^0x[\dabcdef]+$/;
export function isABILikeEncoding(value: string): value is `0x${string}` {
  return value.length >= 66 && !!value.match(ABI_REGEX); // Because `0` contains 66 characters
}
