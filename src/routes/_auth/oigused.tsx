import * as React from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import {
  type ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
} from '@tanstack/table-core'
import { flexRender, useReactTable } from '@tanstack/react-table'

import { useAuthStore, type User } from '@/stores/authStore.ts'

import { ArrowUpDown } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button.tsx'

import { Route as homeRoute } from './index.tsx'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.tsx'

import {
  type ShiftUser,
  shiftUsersFetchQueryOptions,
} from '@/requests/shift-users.ts'

export const Route = createFileRoute('/_auth/oigused')({
  component: RouteComponent,
  errorComponent: ErrorComponent,
  loader: ({ context: { queryClient } }) => {
    // The route is authenticated so we know that the info is available.
    const user = useAuthStore.getState().user as User
    const shiftNr = user.currentShift
    queryClient.ensureQueryData(shiftUsersFetchQueryOptions(shiftNr))
  },
})

const columns: ColumnDef<ShiftUser>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nimi
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'role',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Roll
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
]

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  return (
    <div className="rounded-md border max-w-md">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && 'selected'}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function ErrorComponent({ error }: { error: Error }) {
  const router = useRouter()

  React.useEffect(() => {
    toast.error('Viga lehe laadimisel!', {
      description: error.message,
      duration: Infinity,
      action: {
        label: 'Tagasi kaldale',
        onClick: () => router.navigate(homeRoute),
      },
    })
  }, [])

  return null
}

function RouteComponent() {
  const user = useAuthStore.getState().user as User
  const shiftNr = user.currentShift

  const { data: users } = useSuspenseQuery(shiftUsersFetchQueryOptions(shiftNr))
  const sortedUsers = users.sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="mx-6">
      <p>Õiguseid veel ei saa kambüüsis muuta.</p>
      <DataTable columns={columns} data={sortedUsers} />
    </div>
  )
}
