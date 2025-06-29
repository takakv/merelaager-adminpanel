import { createFileRoute } from '@tanstack/react-router'
import { registrationsQueryOptions } from '@/requests/registrations.ts'
import { getUserShift } from '@/utils.ts'
import { useSuspenseQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/_auth/sargid')({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(registrationsQueryOptions(getUserShift()))
  },
})

function RouteComponent() {
  const shiftNr = getUserShift()

  const { data: registrations } = useSuspenseQuery(
    registrationsQueryOptions(shiftNr),
  )

  const activeRegistrations = registrations.filter(
    (registration) => registration.isRegistered,
  )

  const shirtMap = new Map<string, number>()
  activeRegistrations.forEach((registration) => {
    const sizeCount = shirtMap.get(registration.tsSize)
    if (!sizeCount) shirtMap.set(registration.tsSize, 1)
    else shirtMap.set(registration.tsSize, sizeCount + 1)
  })

  const sortedShirts = new Map(
    [...shirtMap].sort((a, b) => String(a[0]).localeCompare(b[0])),
  )
  console.log(sortedShirts)

  return (
    <div className="px-6 pb-6 flex flex-col gap-6 overflow-y-scroll h-[calc((100%-var(--spacing)*16))]">
      <p>Laste t-särkide arvud</p>
      <table className="max-w-24">
        <tbody>
          {Array.from(sortedShirts.entries()).map((entry) => (
            <tr key={entry[0]}>
              <td>{entry[0]}:</td>
              <td>{entry[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
