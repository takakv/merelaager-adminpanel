import { createFileRoute } from '@tanstack/react-router'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { type ColumnDef } from '@tanstack/table-core'
import { toast } from 'sonner'

import { getUserShift } from '@/utils.ts'

import {
  type ChildBillData,
  fetchBillPdf,
  generateBill,
  type ParentBillData,
  sendBill,
  shiftBillingFetchQueryOptions,
} from '@/requests/billing.ts'

import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer.tsx'
import { Tooltip, TooltipContent } from '@/components/ui/tooltip'
import { TooltipTrigger } from '@/components/ui/tooltip.tsx'

import { DataTable } from '@/components/data-table.tsx'

export const Route = createFileRoute('/_auth/arved')({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) => {
    const shiftNr = getUserShift()
    queryClient.ensureQueryData(shiftBillingFetchQueryOptions(shiftNr))
  },
})

const childrenTableColumns: ColumnDef<ChildBillData>[] = [
  {
    accessorKey: 'childName',
    header: 'Nimi',
  },
  {
    accessorKey: 'shiftNr',
    header: 'Vahetus',
  },
  {
    accessorKey: 'pricePaid',
    header: 'Makstud',
  },
  {
    accessorKey: 'priceToPay',
    header: 'Maksta',
  },
  {
    accessorKey: 'billSent',
    header: 'Arve saadetud?',
    cell: ({ row }) => {
      const billSent = row.original.billSent
      return billSent ? 'Jah' : 'Ei'
    },
  },
]

const billTableColumns: ColumnDef<ParentBillData>[] = [
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
    header: 'Makstud',
    cell: ({ row }) => {
      let pricePaid = 0
      row.original.records.forEach((record) => {
        pricePaid += record.pricePaid
      })
      return pricePaid
    },
  },
  {
    header: 'Maksta',
    cell: ({ row }) => {
      let priceToPay = 0
      row.original.records.forEach((record) => {
        priceToPay += record.priceToPay
      })
      return priceToPay
    },
  },
  {
    accessorKey: 'billNr',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Arve nr
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const billNr = row.original.billNr
      const records = row.original.records
      records.sort((a, b) => a.childName.localeCompare(b.childName))

      let billSent = true
      records.forEach((record) => {
        if (!record.billSent) billSent = false
      })

      return (
        <div className="flex justify-between items-center gap-2">
          <Drawer>
            <DrawerTrigger asChild>
              <span className="cursor-pointer hover:underline">
                {billNr || '-'}
              </span>
            </DrawerTrigger>
            <DrawerContent className="mx-auto w-auto">
              <div className="px-24 pb-24">
                <DrawerHeader>
                  <DrawerTitle>
                    Arve {billNr || 'pole veel genereeritud'}
                  </DrawerTitle>
                  <DrawerDescription>{row.original.email}</DrawerDescription>
                </DrawerHeader>
                <DataTable columns={childrenTableColumns} data={records} />
              </div>
            </DrawerContent>
          </Drawer>
          <div>
            <GenerateBillButton email={row.original.email} />
            <PrintBillButton billNr={billNr} />
            <SendBillButton
              name={row.original.name}
              email={row.original.email}
              billSent={billSent}
            />
          </div>
        </div>
      )
    },
  },
]

const GenerateBillButton = ({ email }: { email: string }) => {
  const mutation = useMutation({
    mutationFn: (email: string) => {
      return generateBill(email)
    },
    onError: (error: Error) => {
      toast.error('Viga arve genereerimisel!', {
        description: error.message,
      })
    },
  })

  const onClick = () => {
    mutation.mutate(email)
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" className="mr-2" onClick={onClick}>
          Genereeri
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Genereerib uue arve.</p>
      </TooltipContent>
    </Tooltip>
  )
}

const SendBillButton = ({
  name,
  email,
  billSent,
}: {
  name: string
  email: string
  billSent: boolean
}) => {
  const queryClient = useQueryClient()
  const shiftNr = getUserShift()

  const mutation = useMutation({
    mutationFn: async (email: string) => {
      await sendBill(email)
      return email
    },
    onError: (error: Error) => {
      toast.error('Viga arve saatmisel!', {
        description: error.message,
      })
    },
    onSuccess: (email) => {
      toast.success('Arve edukalt saadetud.', {
        description: `Saaja: ${name} (${email})`,
      })

      const staleData = queryClient.getQueryData<ParentBillData[]>([
        'billing',
        shiftNr,
      ])
      if (!staleData) return

      const updatedData = [...staleData]
      const index = updatedData.findIndex((r) => r.email === email)
      if (index === -1) return

      const staleRecords = staleData[index].records
      const freshRecords: ChildBillData[] = []
      staleRecords.forEach((record) => {
        freshRecords.push({ ...record, billSent: true })
      })

      updatedData[index] = {
        ...updatedData[index],
        records: freshRecords,
      }

      queryClient.setQueryData(['billing', shiftNr], updatedData)
    },
  })

  const onClick = () => {
    mutation.mutate(email)
  }

  return (
    <Button variant="outline" disabled={billSent} onClick={onClick}>
      Saada arve
    </Button>
  )
}

const PrintBillButton = ({ billNr }: { billNr: number }) => {
  const print = async () => {
    let pdfBlob: Blob

    try {
      pdfBlob = await fetchBillPdf(billNr)
    } catch (err: unknown) {
      toast.warning('Viga arve pärimisel!', {
        description: (err as Error).message,
      })
      return
    }

    const obj = {
      filename: `arve-${billNr}.pdf`,
      blob: pdfBlob,
    }

    const newBlob = new Blob([obj.blob], { type: 'application/pdf' })
    const objUrl = window.URL.createObjectURL(newBlob)
    window.open(objUrl, '_blank')
  }

  return (
    <Button
      variant="outline"
      className="mr-2"
      disabled={billNr === 0}
      onClick={print}
    >
      Kuva PDF
    </Button>
  )
}

function RouteComponent() {
  const shiftNr = getUserShift()

  const { data: records } = useSuspenseQuery(
    shiftBillingFetchQueryOptions(shiftNr),
  )

  records.sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="px-6 pb-6 flex flex-col gap-6 overflow-y-scroll h-[calc((100%-var(--spacing)*16))]">
      <DataTable columns={billTableColumns} data={records} />
    </div>
  )
}
