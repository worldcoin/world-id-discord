import {ISuccessResult} from '@worldcoin/idkit'

export type VerificationCompletePayload = {
  guildId: string
  userId: string
  result: ISuccessResult
}
