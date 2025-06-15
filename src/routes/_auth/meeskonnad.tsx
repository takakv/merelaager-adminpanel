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
  return (
    <div className="p-6 border rounded-md w-full md:w-56">
      <div className="text-center">{team.name}</div>
      <Separator className="my-4" />
      <div className="flex flex-col gap-2">
        {members.map((record) => (
          <div key={record.id}>{record.childName}</div>
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
  records.forEach((record) => {
    teamlessCampers.push(record)
  })

  teamlessCampers.sort((a, b) => a.childName.localeCompare(b.childName))
  teams.sort((a, b) => a.name.localeCompare(b.name))

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
          <TeamBox key={team.id} team={team} members={records} />
        ))}
      </div>
    </div>
  )
}
