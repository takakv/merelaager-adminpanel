import { createFileRoute, Link } from '@tanstack/react-router'

import { getUserShift } from '@/utils.ts'

import {
  shiftStaffFetchQueryOptions,
  type ShiftStaffMember,
  type StaffCertificate,
} from '@/requests/shift-staff.ts'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Separator } from '@/components/ui/separator.tsx'
import { Badge } from '@/components/ui/badge.tsx'
import { CircleAlertIcon } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export const Route = createFileRoute('/_auth/')({
  component: App,
  loader: ({ context: { queryClient } }) => {
    const shiftNr = getUserShift()
    queryClient.ensureQueryData(shiftStaffFetchQueryOptions(shiftNr))
  },
})

const MissingCertificateTooltip = () => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant="outline">
          <CircleAlertIcon />
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p>Puudub kehtiv tunnistus!</p>
      </TooltipContent>
    </Tooltip>
  )
}

type ActiveCertificatesProps = {
  certificates: StaffCertificate[]
}

const ActiveCertificates = ({ certificates }: ActiveCertificatesProps) => {
  const urlPrefix = 'https://www.kutseregister.ee/ctrl/et/Tunnistused/vaata/'
  return (
    <div>
      {certificates.map((certificate) => (
        <Tooltip key={certificate.certId}>
          <TooltipTrigger asChild>
            <Badge variant="outline">
              <Link to={urlPrefix + certificate.urlId} target="_blank">
                {certificate.certId}
              </Link>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>{certificate.name}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  )
}

type TeamCardEntryProps = {
  member: ShiftStaffMember
}

const TeamCardEntry = ({ member }: TeamCardEntryProps) => {
  let displayCertificateWarning = false

  if (member.role === 'boss' || member.role === 'full') {
    if (member.certificates.length === 0) displayCertificateWarning = true
  }

  const roles: { [key: string]: string } = {
    boss: 'Juhataja',
    full: 'Kasvataja',
    part: 'Abikasvataja',
  }
  const displayRole = roles[member.role]

  return (
    <div key={member.id}>
      <div>{member.name}</div>
      <div className="flex gap-2 items-center">
        <div className="text-sm">{displayRole}</div>
        {displayCertificateWarning ? (
          <MissingCertificateTooltip />
        ) : (
          <ActiveCertificates certificates={member.certificates} />
        )}
      </div>
    </div>
  )
}

type TeamCardProps = {
  staff: ShiftStaffMember[]
}

const TeamCard = ({ staff }: TeamCardProps) => {
  return (
    <div className="border rounded-md p-6">
      <div>Meeskond</div>
      <Separator className="my-4" />
      <div className="flex flex-col gap-4">
        {staff.map((member) => (
          <TeamCardEntry key={member.id} member={member} />
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
