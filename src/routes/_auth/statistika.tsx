import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import { getUserShift } from '@/utils.ts'

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

import { shiftRecordsFetchQueryOptions } from '@/requests/shift-records.ts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx'
import { Separator } from '@/components/ui/separator.tsx'

export const Route = createFileRoute('/_auth/statistika')({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) => {
    const shiftNr = getUserShift()
    queryClient.ensureQueryData(shiftRecordsFetchQueryOptions(shiftNr))
  },
})

const chartConfig = {
  mCount: {
    label: 'Poisid',
    color: '#2563eb',
  },
  fCount: {
    label: 'Tüdrukud',
    color: '#60a5fa',
  },
  age: {
    label: 'Kokku',
  },
} satisfies ChartConfig

function RouteComponent() {
  const shiftNr = getUserShift()

  const { data: records } = useSuspenseQuery(
    shiftRecordsFetchQueryOptions(shiftNr),
  )

  type ageData = {
    age: number
    mCount: number
    fCount: number
  }
  const ageMap = new Map<number, ageData>()

  let mAgeTotal = 0
  let mCount = 0
  let fAgeTotal = 0
  let fCount = 0

  records.forEach((record) => {
    const entry = ageMap.get(record.ageAtCamp)
    const isMale = record.childSex === 'M'
    if (!entry) {
      ageMap.set(record.ageAtCamp, {
        age: record.ageAtCamp,
        mCount: isMale ? 1 : 0,
        fCount: isMale ? 0 : 1,
      })
    } else {
      if (isMale) entry.mCount += 1
      else entry.fCount += 1
    }

    if (isMale) {
      mAgeTotal += record.ageAtCamp
      mCount += 1
    } else {
      fAgeTotal += record.ageAtCamp
      fCount += 1
    }
  })

  const ages = Array.from(ageMap.values()).sort((a, b) => a.age - b.age)

  return (
    <div className="px-6 flex flex-col gap-6 overflow-y-scroll h-[calc((100%-var(--spacing)*22))]">
      <Card>
        <CardHeader>
          <CardTitle>{shiftNr}v laste vanus</CardTitle>
          <CardDescription className="flex gap-2 h-4 items-center flex-wrap">
            <div>
              Keskmine:{' '}
              {((mAgeTotal + fAgeTotal) / (mCount + fCount)).toFixed(1)}
            </div>
            <Separator orientation="vertical" />
            <div>Poiste keskmine: {(mAgeTotal / mCount).toFixed(1)}</div>
            <Separator orientation="vertical" />
            <div>Tüdrukute keskmine: {(fAgeTotal / fCount).toFixed(1)}</div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="min-h-[100px] w-full">
            <BarChart accessibilityLayer data={ages}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="age"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent labelKey="age" />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="mCount" fill="var(--color-mCount)" radius={4} />
              <Bar dataKey="fCount" fill="var(--color-fCount)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
