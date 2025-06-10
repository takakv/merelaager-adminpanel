import { atom } from 'jotai'

import {
  fetchRegistrations,
  type RegistrationEntry,
} from '@/requests/registrations.ts'
import { atomWithSuspenseQuery } from 'jotai-tanstack-query'

export const registrationShiftAtom = atom(0)

export const registrationsAtom = atomWithSuspenseQuery<RegistrationEntry[]>(
  (get) => ({
    queryKey: ['registrations', get(registrationShiftAtom)],
    queryFn: async () => {
      const shiftNr = get(registrationShiftAtom)
      return fetchRegistrations(shiftNr)
    },
  }),
)
