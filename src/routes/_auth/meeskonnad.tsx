import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'

import { getUserShift } from '@/utils.ts'

import {
  type CamperRecord,
  shiftRecordsFetchQueryOptions,
} from '@/requests/shift-records.ts'
import {
  shiftTeamsFetchQueryOptions,
  type TeamRecord,
} from '@/requests/teams.ts'

import { Separator } from '@/components/ui/separator.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Button } from '@/components/ui/button.tsx'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx'

export const Route = createFileRoute('/_auth/meeskonnad')({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) => {
    const shiftNr = getUserShift()
    queryClient.ensureQueryData(shiftRecordsFetchQueryOptions(shiftNr))
    queryClient.ensureQueryData(shiftTeamsFetchQueryOptions(shiftNr))
  },
})

type TeamlessChildProps = {
  record: CamperRecord
  teams: TeamRecord[]
}

const TeamlessChild = ({ record, teams }: TeamlessChildProps) => {
  return (
    <div>
      <div>{record.childName}</div>
      <Select>
        <SelectTrigger className="w-auto">
          <SelectValue placeholder="Meeskond" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Meeskond</SelectLabel>
            {teams.map((team) => (
              <SelectItem value={team.name} key={team.id}>
                {team.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

function RouteComponent() {
  const shiftNr = getUserShift()

  const { data: records } = useSuspenseQuery(
    shiftRecordsFetchQueryOptions(shiftNr),
  )
  const { data: teams } = useSuspenseQuery(shiftTeamsFetchQueryOptions(shiftNr))

  const teamlessCampers: CamperRecord[] = []
  records.forEach((record) => {
    teamlessCampers.push(record)
  })

  teamlessCampers.sort((a, b) => a.childName.localeCompare(b.childName))
  teams.sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="px-6 flex flex-col gap-6 overflow-y-scroll h-[calc((100%-var(--spacing)*22))]">
      {teamlessCampers.length > 0 && (
        <div className="p-6 border rounded-md">
          <div>Lapsed</div>
          <Separator className="my-4" />
          <div className="flex flex-wrap gap-4">
            {teamlessCampers.map((record) => (
              <TeamlessChild key={record.id} record={record} teams={teams} />
            ))}
          </div>
        </div>
      )}
      <div className="p-6 border rounded-md flex gap-4 flex-col">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            type="string"
            placeholder="Meeskonna nimi"
            className="w-full md:max-w-64"
          />
          <Button>Loo meeskond</Button>
        </div>
        <div>Meeskonna nime saab hiljem muuta.</div>
      </div>
    </div>
  )
}
