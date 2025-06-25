import { createFileRoute, Link } from '@tanstack/react-router'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/table-core'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { getUserShift } from '@/utils.ts'

import {
  addTentScore,
  shiftTentFetchQueryOptions,
  type TentScore,
} from '@/requests/tents.ts'
import { Separator } from '@/components/ui/separator.tsx'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Button } from '@/components/ui/button.tsx'
import { DataTable } from '@/components/data-table.tsx'
import { toast } from 'sonner'

export const Route = createFileRoute('/_auth/telgid/$tentNr')({
  component: RouteComponent,
  loader: ({ context: { queryClient }, params }) => {
    const tentNrString = params.tentNr
    const tentNr = parseInt(tentNrString, 10)
    queryClient.ensureQueryData(
      shiftTentFetchQueryOptions(getUserShift(), tentNr),
    )
  },
})

const AddGradeSchema = z.object({
  score: z.coerce.number().min(0).max(10),
})

type AddGradeCardProps = {
  shiftNr: number
  tentNr: number
}

const AddGradeCard = ({ shiftNr, tentNr }: AddGradeCardProps) => {
  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof AddGradeSchema>>({
    resolver: zodResolver(AddGradeSchema),
    defaultValues: {
      score: '' as unknown as number,
    },
  })

  const mutation = useMutation({
    mutationFn: (score: number) => {
      return addTentScore(shiftNr, tentNr, score)
    },
    onSuccess: async () => {
      // TODO: do not re-fetch all, but only add the returned score to list.
      await queryClient.invalidateQueries({
        queryKey: ['tent', shiftNr, tentNr],
        refetchType: 'active',
      })
      form.setValue('score', 0)
    },
    onError: (error: Error) => {
      toast.error('Viga hindamisel!', {
        description: error.message,
      })
    },
  })

  const onSubmit = async (values: z.infer<typeof AddGradeSchema>) => {
    mutation.mutate(values.score)
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
            name="score"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hinne</FormLabel>
                <FormControl>
                  <Input {...field} type="number" min="0" max="10" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Hinda</Button>
        </form>
      </Form>
    </div>
  )
}

const scoreTableColumns: ColumnDef<TentScore>[] = [
  {
    accessorKey: 'createdAt',
    header: 'Kuupäev',
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt)
      return date.toLocaleString('et', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    },
  },
  {
    accessorKey: 'score',
    header: 'Hinne',
  },
]

function RouteComponent() {
  const shiftNr = getUserShift()
  const tentNr = parseInt(Route.useParams().tentNr, 10)

  const {
    data: { campers, scores },
  } = useSuspenseQuery(shiftTentFetchQueryOptions(shiftNr, tentNr))

  // Sort newest to oldest to prominently display more recent grades.
  const revScores = scores.sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  )

  return (
    <div className="px-6 pb-6 flex flex-col gap-6 overflow-y-scroll h-[calc((100%-var(--spacing)*16))]">
      <div className="border rounded-md p-6">
        <div>{tentNr}. telk</div>
        <Separator className="my-4" />
        <div className="flex flex-col gap-2">
          {campers.map((camper) => (
            <p key={camper}>{camper}</p>
          ))}
        </div>
      </div>
      <div className="flex justify-between">
        {tentNr - 1 >= 1 && (
          <Button asChild>
            <Link to={Route.to} params={{ tentNr: `${tentNr - 1}` }}>
              Telk {tentNr - 1}
            </Link>
          </Button>
        )}
        <div></div>
        {tentNr + 1 <= 10 && (
          <Button asChild>
            <Link to={Route.to} params={{ tentNr: `${tentNr + 1}` }}>
              Telk {tentNr + 1}
            </Link>
          </Button>
        )}
      </div>
      <AddGradeCard shiftNr={shiftNr} tentNr={tentNr} />
      <div className="border rounded-md p-6">
        <div>Hinded</div>
        <Separator className="my-4" />
        <DataTable columns={scoreTableColumns} data={revScores} />
      </div>
    </div>
  )
}
