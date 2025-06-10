import { Link } from '@tanstack/react-router'

import { Button } from '@/components/ui/button.tsx'

import { Route as registrationRoute } from '../routes/_auth/nimekiri.$shiftNr.tsx'

export const ShiftNav = () => {
  return [1, 2, 3, 4].map((shiftId) => (
    <Button asChild variant="outline" key={shiftId}>
      <Link
        to={registrationRoute.to}
        params={{ shiftNr: `${shiftId}` }}
        key={shiftId}
      >
        {shiftId}v
      </Link>
    </Button>
  ))
}
