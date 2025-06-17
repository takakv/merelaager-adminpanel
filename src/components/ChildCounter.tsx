import { Separator } from '@/components/ui/separator.tsx'

type ChildCounterProps = {
  regMCount: number
  regFCount: number
  resMCount: number
  resFCount: number
}

export const ChildCounter = ({
  regMCount,
  regFCount,
  resMCount,
  resFCount,
}: ChildCounterProps) => {
  return (
    <div className="px-6 pb-4 flex gap-4 flex-wrap">
      <div className="inline-flex gap-4">
        <div>
          poisid: <span className="font-mono">{regMCount}</span>
        </div>
        <div>
          tüdrukud: <span className="font-mono">{regFCount}</span>
        </div>
        <div>
          kokku: <span className="font-mono">{regMCount + regFCount}</span>
        </div>
      </div>
      <Separator orientation="vertical" />
      <div className="inline-flex gap-4">
        <div>res. poisid: {resMCount}</div>
        <div>res. tüdrukud: {resFCount}</div>
      </div>
    </div>
  )
}
