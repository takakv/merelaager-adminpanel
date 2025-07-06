import { createFileRoute } from '@tanstack/react-router'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { getUserShift } from '@/utils.ts'

import {
  type CamperRecord,
  shiftRecordsFetchQueryOptions,
} from '@/requests/shift-records.ts'
import {
  createShiftTeam,
  shiftTeamsFetchQueryOptions,
  type TeamCreationData,
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx'
import { toast } from 'sonner'
import { usePatchShiftRecord } from '@/routes/_auth/telgid.index.tsx'
import { useEffect } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip.tsx'
import { CircleMinus } from 'lucide-react'

export const Route = createFileRoute('/_auth/meeskonnad')({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) => {
    const shiftNr = getUserShift()
    queryClient.ensureQueryData(shiftRecordsFetchQueryOptions(shiftNr))
    queryClient.ensureQueryData(shiftTeamsFetchQueryOptions(shiftNr))
  },
})

type TeamBoxProps = {
  members: CamperRecord[]
  team: TeamRecord
}

const TeamBox = ({ members, team }: TeamBoxProps) => {
  members.sort((a, b) => a.childName.localeCompare(b.childName))

  let extraInfo = `${members.length} liiget`
  if (team.place) extraInfo += `, ${team.place}. koht`

  return (
    <div className="p-6 border rounded-md w-full md:w-56 relative">
      <p className="text-center">{team.name}</p>
      <p className="text-center text-xs pt-2">{extraInfo}</p>
      <Separator className="my-4" />
      <div className="flex flex-col gap-2">
        {members.map((record) => (
          <TeamCamperEntry key={record.id} record={record} />
        ))}
      </div>
    </div>
  )
}

type TeamlessChildProps = {
  record: CamperRecord
  teams: TeamRecord[]
}

const TeamlessChild = ({ record, teams }: TeamlessChildProps) => {
  const mutation = usePatchShiftRecord(record)

  const onValueChange = (value: string) => {
    const teamId = parseInt(value, 10)
    mutation.mutate({ teamId: teamId })
  }

  return (
    <Select onValueChange={onValueChange}>
      <SelectTrigger className="w-auto">
        <SelectValue placeholder={record.childName} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Meeskond</SelectLabel>
          {teams.map((team) => (
            <SelectItem value={`${team.id}`} key={team.id}>
              {team.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

type TeamCamperEntryProps = {
  record: CamperRecord
}

const TeamCamperEntry = ({ record }: TeamCamperEntryProps) => {
  const mutation = usePatchShiftRecord(record)

  const onClick = () => {
    mutation.mutate({ teamId: null })
  }

  return (
    <div className="flex justify-between items-center gap-4">
      <div>
        <p>{record.childName}</p>
        <p>{record.ageAtCamp}</p>
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-5 text-[var(--input)]">
            <CircleMinus onClick={onClick} className="w-5" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Eemalda laps telgist</p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

const TeamCreateSchema = z.object({
  teamName: z.string().min(1, {
    message: 'Meeskonna nimi ei tohi olla tühi!',
  }),
})

const CreateTeamCard = ({ shiftNr }: { shiftNr: number }) => {
  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof TeamCreateSchema>>({
    resolver: zodResolver(TeamCreateSchema),
    defaultValues: {
      teamName: '',
    },
  })

  const mutation = useMutation({
    mutationFn: (createData: TeamCreationData) => {
      return createShiftTeam(createData.shiftNr, createData.name)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['teams', shiftNr],
        refetchType: 'active',
      })
      form.setValue('teamName', '')
    },
    onError: (error: Error) => {
      toast.error('Viga meeskonna loomisel!', {
        description: error.message,
      })
    },
  })

  const onSubmit = async (values: z.infer<typeof TeamCreateSchema>) => {
    const { teamName } = values
    mutation.mutate({ shiftNr, name: teamName })
  }

  return (
    <div className="p-6 border rounded-md flex gap-4 flex-col">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col md:flex-row gap-4 md:items-end"
        >
          <FormField
            control={form.control}
            name="teamName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meeskonna nimi</FormLabel>
                <FormControl>
                  <Input placeholder="Kasvatajad" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Loo meeskond</Button>
        </form>
      </Form>
      <div>Meeskonna nime saab hiljem muuta.</div>
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
  const assignedCampers = new Map<number, CamperRecord[]>()

  teams.forEach((team) => {
    assignedCampers.set(team.id, [])
  })

  const warningQueue: string[] = []

  records.forEach((record) => {
    if (record.teamId === null) teamlessCampers.push(record)
    else {
      const teamMembers = assignedCampers.get(record.teamId) as CamperRecord[]
      if (!teamMembers) {
        warningQueue.push(
          `${record.childName} on vale vahetuse meeskonnas. (recordRef: ${record.id})`,
        )
        return
      }
      teamMembers.push(record)
    }
  })

  teamlessCampers.sort((a, b) => a.childName.localeCompare(b.childName))
  teams.sort((a, b) => a.name.localeCompare(b.name))

  useEffect(() => {
    warningQueue.forEach((message) => {
      toast.warning('Ebakõla andmetes!', {
        description: message,
      })
    })
  }, [])

  return (
    <div className="px-6 pb-6 flex flex-col gap-6 overflow-y-scroll h-[calc((100%-var(--spacing)*16))]">
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
      <CreateTeamCard shiftNr={shiftNr} />
      <div className="flex flex-wrap gap-6">
        {teams.map((team) => (
          <TeamBox
            key={team.id}
            team={team}
            members={assignedCampers.get(team.id) as CamperRecord[]}
          />
        ))}
      </div>
    </div>
  )
}
