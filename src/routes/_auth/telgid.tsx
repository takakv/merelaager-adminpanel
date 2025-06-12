import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'

import { getUserShift } from '@/utils.ts'

import {
  type CamperRecord,
  shiftRecordsFetchQueryOptions,
} from '@/requests/shift-records.ts'
import { Separator } from '@/components/ui/separator.tsx'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx'

export const Route = createFileRoute('/_auth/telgid')({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) => {
    const shiftNr = getUserShift()
    queryClient.ensureQueryData(shiftRecordsFetchQueryOptions(shiftNr))
  },
})

type TentlessChildrenProps = {
  heading: string
  children: CamperRecord[]
}

function TentlessChildren({ heading, children }: TentlessChildrenProps) {
  return (
    <div className="p-6 border rounded-md">
      <div>{heading}</div>
      <Separator className="my-4" />
      <div className="flex flex-wrap gap-4">
        {children.map((child) => (
          <div key={child.childId}>
            <div>{child.childName}</div>
            <Select>
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
  console.log(records)

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
    <div className="flex flex-wrap md:flex-nowrap gap-6 mx-6">
      <TentlessChildren heading="Poisid" children={tentlessBoys} />
      <TentlessChildren heading="Tüdrukud" children={tentlessGirls} />
    </div>
  )
}
