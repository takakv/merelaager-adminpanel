import { createFileRoute } from '@tanstack/react-router'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'

import { getUserShift } from '@/utils.ts'

import { CircleMinus } from 'lucide-react'
import { toast } from 'sonner'

import type { CheckedState } from '@radix-ui/react-checkbox'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator.tsx'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip.tsx'
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
  type CamperRecord,
  patchShiftRecord,
  type RecordPatchObject,
  shiftRecordsFetchQueryOptions,
} from '@/requests/shift-records.ts'

export const Route = createFileRoute('/_auth/telgid')({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) => {
    const shiftNr = getUserShift()
    queryClient.ensureQueryData(shiftRecordsFetchQueryOptions(shiftNr))
  },
})

type TentlessChildProps = {
  record: CamperRecord
}

const TentlessChild = ({ record }: TentlessChildProps) => {
  const mutation = usePatchShiftRecord(record)

  const onValueChange = (value: string) => {
    const tentNr = parseInt(value, 10)
    mutation.mutate({ tentNr })
  }

  return (
    <div>
      <div>{record.childName}</div>
      <Select onValueChange={onValueChange}>
        <SelectTrigger className="w-auto">
          <SelectValue placeholder="Telk" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Telk</SelectLabel>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((tentNr) => (
              <SelectItem value={`${tentNr}`} key={tentNr}>
                {tentNr}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

type TentlessChildrenProps = {
  heading: string
  records: CamperRecord[]
}

function TentlessChildren({ heading, records }: TentlessChildrenProps) {
  return (
    <div className="p-6 border rounded-md">
      <div>{heading}</div>
      <Separator className="my-4" />
      <div className="flex flex-wrap gap-4">
        {records.map((record) => (
          <TentlessChild key={record.id} record={record} />
        ))}
      </div>
    </div>
  )
}

type TentCamperEntryProps = {
  record: CamperRecord
}

const TentCamperEntry = ({ record }: TentCamperEntryProps) => {
  const mutation = usePatchShiftRecord(record)

  const onCheckedChange = (checked: CheckedState) => {
    if (checked === 'indeterminate') return
    mutation.mutate({ isPresent: checked })
  }

  const onClick = () => {
    mutation.mutate({ tentNr: null })
  }

  return (
    <div className="flex justify-between items-center gap-4">
      <p>{record.childName}</p>
      <div className="flex gap-4 items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Checkbox
              id={`${record.id}`}
              defaultChecked={record.isPresent}
              onCheckedChange={onCheckedChange}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>{record.isPresent ? 'Eemalda' : 'Märgi'} kohalolek</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <CircleMinus
              className="w-5 text-[var(--input)]"
              onClick={onClick}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Eemalda laps telgist</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}

type TentBoxProps = {
  tentKey: string
  records: CamperRecord[]
}

const TentBox = ({ tentKey, records }: TentBoxProps) => {
  return (
    <div className="p-6 border rounded-md w-full md:w-56">
      <div>{tentKey}</div>
      <Separator className="my-4" />
      <div className="flex flex-col gap-2">
        {records.map((record) => (
          <TentCamperEntry key={`${tentKey}.${record.id}`} record={record} />
        ))}
      </div>
    </div>
  )
}

function RouteComponent() {
  const shiftNr = getUserShift()

  const { data: records } = useSuspenseQuery(
    shiftRecordsFetchQueryOptions(shiftNr),
  )

  const tentlessBoys: CamperRecord[] = []
  const tentlessGirls: CamperRecord[] = []
  const tentList: { [key: number]: CamperRecord[] } = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
  }

  records.forEach((record) => {
    if (record.tentNr) tentList[record.tentNr].push(record)
    else if (record.childSex === 'M') tentlessBoys.push(record)
    else tentlessGirls.push(record)
  })

  tentlessBoys.sort((a, b) => a.childName.localeCompare(b.childName))
  tentlessGirls.sort((a, b) => a.childName.localeCompare(b.childName))

  return (
    <div className="px-6 flex flex-col gap-6 overflow-y-scroll h-[calc((100%-var(--spacing)*22))]">
      <div className="flex flex-wrap md:flex-nowrap gap-6">
        <TentlessChildren heading="Poisid" records={tentlessBoys} />
        <TentlessChildren heading="Tüdrukud" records={tentlessGirls} />
      </div>
      {tentlessBoys.length + tentlessGirls.length !== records.length && (
        <p className="sm:hidden">
          Märkeruut näitab, kas laps on laagris kohal.
        </p>
      )}
      <div className="flex flex-wrap gap-6">
        {Object.entries(tentList).map(([tentKey, tentRecords]) => {
          if (tentRecords.length === 0) return null
          return (
            <TentBox key={tentKey} tentKey={tentKey} records={tentRecords} />
          )
        })}
      </div>
    </div>
  )
}

export const usePatchShiftRecord = (record: CamperRecord) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (patchData: RecordPatchObject) => {
      return patchShiftRecord(record.id, patchData)
    },
    onSuccess: (_, newState) => {
      const queryKey = ['records', record.shiftNr]
      const staleData = queryClient.getQueryData<CamperRecord[]>(queryKey)
      if (!staleData) return

      const updatedData = [...staleData]
      const index = updatedData.findIndex((r) => r.id === record.id)
      if (index === -1) return

      updatedData[index] = {
        ...updatedData[index],
        ...newState,
      }

      queryClient.setQueryData(queryKey, updatedData)
    },
    onError: (error: Error) => {
      toast.error('Viga andmete uuendamisel!', {
        description: error.message,
      })
    },
  })
}
