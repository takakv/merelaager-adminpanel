import { createFileRoute } from '@tanstack/react-router'

import { getUserShift } from '@/utils.ts'

import {
  shiftStaffFetchQueryOptions,
  type ShiftStaffMember,
} from '@/requests/shift-staff.ts'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Separator } from '@/components/ui/separator.tsx'

export const Route = createFileRoute('/_auth/')({
  component: App,
  loader: ({ context: { queryClient } }) => {
    const shiftNr = getUserShift()
    queryClient.ensureQueryData(shiftStaffFetchQueryOptions(shiftNr))
  },
})

type TeamCardProps = {
  staff: ShiftStaffMember[]
}

const TeamCard = ({ staff }: TeamCardProps) => {
  const roles: { [key: string]: string } = {
    boss: 'Juhataja',
    full: 'Kasvataja',
    part: 'Abikasvataja',
  }

  return (
    <div className="border rounded-md p-6">
      <div>Meeskond</div>
      <Separator className="my-4" />
      <div className="flex flex-col gap-4">
        {staff.map((member) => (
          <div key={member.id}>
            <div>{member.name}</div>
            <div className="text-sm">{roles[member.role]}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function App() {
  const shiftNr = getUserShift()

  const { data: staff } = useSuspenseQuery(shiftStaffFetchQueryOptions(shiftNr))

  return (
    <div className="px-6 pb-6 flex flex-col gap-6 overflow-y-scroll h-[calc((100%-var(--spacing)*16))]">
      <div>Kambüüs on veel töös</div>
      <TeamCard staff={staff} />
    </div>
  )
}
