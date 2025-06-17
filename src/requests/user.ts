import { type Static, Type } from '@sinclair/typebox'

import { apiFetch } from '@/api/apiFetch.ts'
import { StatusCodes } from 'http-status-codes'

export const PatchUserSchema = Type.Partial(
  Type.Object({
    currentShift: Type.Integer(),
  }),
)

export type PatchUserBody = Static<typeof PatchUserSchema>

export const patchUser = async (userId: number, data: PatchUserBody) => {
  const response = await apiFetch(`/users/${userId}`, {
    method: 'PATCH',
    mode: 'cors',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const jsRes = await response.json()
    switch (response.status) {
      case StatusCodes.FORBIDDEN:
        if (jsRes.data.currentShift !== undefined) {
          throw new Error(jsRes.data.currentShift)
        }
        if (jsRes.data.userId !== undefined) {
          throw new Error(jsRes.data.userId)
        }
      // fallthrough
      default:
        console.error(jsRes)
        throw new Error('Ootamatu viga: rohkem infot konsoolis.')
    }
  }
}
