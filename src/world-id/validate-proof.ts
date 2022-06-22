import fetch from "node-fetch";

export async function verifyVerificationValidness(
  _verificationResponse: {
    merkle_root: `0x${string}`;
    nullifier_hash: `0x${string}`;
    proof: `0x${string}`;
  },
  signal: string,
  action_id: string,
) {
  const body = {
    ..._verificationResponse,
    signal,
    action_id,
  };
  const response = await fetch(
    "https://developer.worldcoin.org/api/v1/verify",
    {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return response.ok;
}
