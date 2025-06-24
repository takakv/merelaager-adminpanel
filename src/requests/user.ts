import { type Static, Type } from '@sinclair/typebox'

import { apiFetch } from '@/api/apiFetch.ts'
import { StatusCodes } from 'http-status-codes'

export const PatchUserSchema = Type.Partial(
  Type.Object({
    currentShift: Type.Integer(),
  }),
)

export type PatchUserBody = Static<typeof PatchUserSchema>

export const SignupSchema = Type.Object({
  username: Type.String(),
  email: Type.String(),
  name: Type.String(),
  nickname: Type.Optional(Type.String()),
  password: Type.String(),
  token: Type.String(),
})

export type SignupBody = Static<typeof SignupSchema>

export const CreateInviteSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  name: Type.String(),
  shiftNr: Type.Integer(),
  role: Type.String(),
})

export type CreateInviteBody = Static<typeof CreateInviteSchema>

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

export const signupUser = async (data: SignupBody) => {
  const response = await apiFetch(`/auth/signup`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const jsRes = await response.json()
    switch (response.status) {
      case StatusCodes.FORBIDDEN:
        throw new Error(jsRes.data.token)
      case StatusCodes.INTERNAL_SERVER_ERROR:
        throw new Error(jsRes.message)
      case StatusCodes.CONFLICT:
        throw new Error(jsRes.data.conflict)
      default:
        console.error(jsRes)
        throw new Error('Ootamatu viga: rohkem infot konsoolis.')
    }
  }
}

export const sendInvite = async (data: CreateInviteBody) => {
  const response = await apiFetch(`/users/invites`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const jsRes = await response.json()
    switch (response.status) {
      case StatusCodes.FORBIDDEN:
        throw new Error(jsRes.data.permissions)
      case StatusCodes.INTERNAL_SERVER_ERROR:
        throw new Error(jsRes.message)
      case StatusCodes.UNPROCESSABLE_ENTITY:
        throw new Error(jsRes.data.role)
      default:
        console.error(jsRes)
        throw new Error('Ootamatu viga: rohkem infot konsoolis.')
    }
  }
}
