import { createFileRoute } from '@tanstack/react-router'
import { getUserShift } from '@/utils.ts'
import { useSuspenseQuery } from '@tanstack/react-query'
import {
  type CamperRecord,
  shiftRecordsFetchQueryOptions,
} from '@/requests/shift-records.ts'
import { useTimer } from 'react-timer-hook'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button.tsx'

export const Route = createFileRoute('/_auth/taimer')({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) => {
    const shiftNr = getUserShift()
    queryClient.ensureQueryData(shiftRecordsFetchQueryOptions(shiftNr))
  },
})

type ChildTimerEntryProps = {
  record: CamperRecord
  timerLength: number
  timerVersion: number
  onStart: () => void
}

const ChildTimerEntry = ({
  record,
  timerLength,
  timerVersion,
  onStart,
}: ChildTimerEntryProps) => {
  const [isExpired, setIsExpired] = useState(false)

  const initialTime = new Date()
  initialTime.setSeconds(initialTime.getSeconds() + timerLength)

  const { seconds, minutes, isRunning, start, pause, resume, restart } =
    useTimer({
      expiryTimestamp: initialTime,
      autoStart: false,
      onExpire: () => {
        setIsExpired(true)
      },
      interval: 1000,
    })

  useEffect(() => {
    if (!isRunning) {
      const newTime = new Date()
      newTime.setSeconds(newTime.getSeconds() + timerLength)
      restart(newTime, false)
      setIsExpired(false)
    }
  }, [timerVersion])

  const handleStart = () => {
    if (isRunning) {
      const time = new Date()
      time.setSeconds(time.getSeconds() + timerLength)
      restart(time, false)
    } else {
      setIsExpired(false)
      onStart()
      start()
    }
  }

  const handlePause = () => {
    if (isRunning) {
      pause()
    } else {
      setIsExpired(false)
      resume()
    }
  }

  return (
    <div className="mb-2">
      <div
        className={
          'flex gap-2 justify-between ' +
          `${isExpired ? 'bg-red-500 text-white' : 'bg-white'}`
        }
      >
        <span>{record.childName}</span>
        <div>
          <span>{String(minutes).padStart(2, '0')}</span>:
          <span>{String(seconds).padStart(2, '0')}</span>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Button onClick={handleStart}>
          {isRunning ? 'Lähtesta' : 'Käivita'}
        </Button>
        <Button onClick={handlePause} disabled={isExpired}>
          {isRunning ? 'Pausi' : 'Jätka'}
        </Button>
      </div>
    </div>
  )
}

function RouteComponent() {
  const shiftNr = getUserShift()

  const { data: records } = useSuspenseQuery(
    shiftRecordsFetchQueryOptions(shiftNr),
  )

  const [recentStarts, setRecentStarts] = useState<number[]>([])

  const sortedRecords = useMemo(() => {
    const baseList = [...records].sort((a, b) =>
      a.childName.localeCompare(b.childName),
    )

    if (recentStarts.length === 0) return baseList

    return [
      ...(recentStarts
        .map((id) => baseList.find((r) => r.id === id))
        .filter(Boolean) as typeof baseList),
      ...baseList.filter((r) => !recentStarts.includes(r.id)),
    ]
  }, [records, recentStarts])

  const handleStart = useCallback((id: number) => {
    setRecentStarts((prev) => [
      id,
      ...prev.filter((existingId) => existingId !== id),
    ])
  }, [])

  const [timerLength, setTimerLength] = useState(5)
  const [timerVersion, setTimerVersion] = useState(0)

  const editTimer = (t: HTMLInputElement) => {
    setTimerLength(Number(t.value))
    setTimerVersion((v) => v + 1)
  }

  return (
    <div className="px-6 pb-6 flex flex-col gap-6 overflow-y-scroll h-[calc((100%-var(--spacing)*16))]">
      <div className="flex gap-2">
        <label htmlFor="timer">Pikkus:</label>
        <input
          className="border-2 rounded max-w-8"
          id="timer"
          defaultValue={timerLength}
          onBlur={(e) => editTimer(e.target)}
        ></input>
        <span>min</span>
      </div>
      <div>
        {sortedRecords.map((record) => (
          <ChildTimerEntry
            key={record.id}
            record={record}
            timerLength={timerLength * 60}
            timerVersion={timerVersion}
            onStart={() => handleStart(record.id)}
          />
        ))}
      </div>
    </div>
  )
}
