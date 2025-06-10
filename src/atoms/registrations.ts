import { atom } from 'jotai'

import type { RegistrationEntry } from '@/requests/registrations.ts'

const endpoint = 'http://localhost:4000/api'

export const registrationsAtom = atom<RegistrationEntry[]>([])

export const fetchRegistrationsAtom = atom(
  async (get) => {
    const response = await fetch(`${endpoint}/registrations?shiftNr=${shiftNr}`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    })
  }
)
