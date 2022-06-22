export const WORLD_ID_EVENTS_SOURCE = "world.id";
export const ON_VERIFIED_EVENT = "User successfully verified" as const;

export interface WorldIdValidationResponse {
  merkle_root: `0x${string}`;
  nullifier_hash: `0x${string}`;
  proof: `0x${string}`;
}

export interface UserCompletedVerification {
  application_id: string;
  guild_id: string;
  guild_locale: string;
  interaction_token: string;
  user: {
    id: string;
    username: string;
    roles: string[];
  };
  validation_response: WorldIdValidationResponse;
}
