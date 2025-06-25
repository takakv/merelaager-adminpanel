import { createFileRoute, Link } from '@tanstack/react-router'
import { getUserShift } from '@/utils.ts'
import { shiftTentFetchQueryOptions, type TentScore } from '@/requests/tents.ts'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Separator } from '@/components/ui/separator.tsx'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
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
import type { ColumnDef } from '@tanstack/table-core'

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
  score: z.number().min(0).max(10),
})

const AddGradeCard = () => {
  const form = useForm<z.infer<typeof AddGradeSchema>>({
    resolver: zodResolver(AddGradeSchema),
    defaultValues: {
      score: 0,
    },
  })

  const onSubmit = async (values: z.infer<typeof AddGradeSchema>) => {
    console.log(values)
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
      <AddGradeCard />
      <div className="border rounded-md p-6">
        <div>Hinded</div>
        <Separator className="my-4" />
        <DataTable columns={scoreTableColumns} data={scores} />
      </div>
    </div>
  )
}
