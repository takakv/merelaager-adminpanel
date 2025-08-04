import { apiFetch } from '@/api/apiFetch.ts'
import { StatusCodes } from 'http-status-codes'

export const submitPasswordResetRequest = async (email: string) => {
  const response = await apiFetch(`/account/password`, {
    method: 'PUT',
    mode: 'cors',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })

  if (!response.ok) {
    const jsRes = await response.json()
    switch (response.status) {
      case StatusCodes.NOT_FOUND:
        throw new Error(jsRes.data.message)
      default:
        console.error(jsRes)
        throw new Error('Ootamatu viga: rohkem infot konsoolis.')
    }
  }
}

export const resetPassword = async (password: string, token: string) => {
  const response = await apiFetch(`/account/password`, {
    method: 'PUT',
    mode: 'cors',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password, token }),
  })

  if (!response.ok) {
    const jsRes = await response.json()
    switch (response.status) {
      case StatusCodes.NOT_FOUND:
        throw new Error(jsRes.data.message)
      default:
        console.error(jsRes)
        throw new Error('Ootamatu viga: rohkem infot konsoolis.')
    }
  }
}
