import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'

import { useAuthStore, type User } from '@/stores/authStore.ts'

import { Button } from '@/components/ui/button.tsx'
import { Switch } from '@/components/ui/switch.tsx'
import { Label } from '@/components/ui/label'

import { ChildCounter } from '@/components/ChildCounter.tsx'
import { ShiftNav } from '@/components/ShiftMenu.tsx'

import {
  fetchShiftPdf,
  type RegistrationEntry,
  registrationsQueryOptions,
  Sex,
} from '@/requests/registrations.ts'
import { RegistrationTable } from '@/components/RegistrationTable.tsx'

export const Route = createFileRoute('/_auth/nimekiri/$shiftNr')({
  component: RouteComponent,
  loader: ({ context: { queryClient }, params }) => {
    // TODO: check the shiftNr and redirect to selected shift, if invalid.
    const shiftNrString = params.shiftNr
    const shiftNr = parseInt(shiftNrString, 10)
    queryClient.ensureQueryData(registrationsQueryOptions(shiftNr))
  },
})

// const regTableColumns: ColumnDef<RegistrationEntry>[] = [
//   {
//     accessorKey: 'child.name',
//     header: 'Nimi',
//   },
//   {
//     accessorKey: 'child.currentAge',
//     header: 'Vanus',
//   },
// ]
//
// const regTableContactColumns: ColumnDef<RegistrationEntry>[] = [
//   {
//     accessorKey: 'contactName',
//     header: 'Kontakt',
//   },
//   {
//     accessorKey: 'contactEmai',
//     header: 'Meil',
//   },
// ]

function RouteComponent() {
  const shiftNr = parseInt(Route.useParams().shiftNr, 10)

  // https://github.com/TanStack/router/discussions/1563#discussion-6616426
  const { data: registrations } = useSuspenseQuery(
    registrationsQueryOptions(shiftNr),
  )

  // const setRegistrationShift = useSetAtom(registrationShiftAtom)
  // setRegistrationShift(shiftNr)
  // const { data: registrations } = useAtomValue(registrationsAtom)

  // const registeredCampers: RegistrationEntry[] = []
  // const reserveCampers: RegistrationEntry[] = []
  //
  // registrations.forEach((registration) => {
  //   if (registration.isRegistered) registeredCampers.push(registration)
  //   else reserveCampers.push(registration)
  // })

  const regCategories: {
    [key: string]: { [key in Sex]: RegistrationEntry[] }
  } = {
    reg: { M: [], F: [] },
    res: { M: [], F: [] },
  }

  registrations.forEach((registration) => {
    if (registration.isRegistered) {
      if (registration.child.sex === Sex.M)
        regCategories.reg.M.push(registration)
      else regCategories.reg.F.push(registration)
    } else {
      if (registration.child.sex === Sex.M)
        regCategories.res.M.push(registration)
      else regCategories.res.F.push(registration)
    }
  })

  const [isDetailView, setDetailView] = React.useState(false)
  const [isPriceEditable, setPriceEditable] = React.useState(false)

  const setDetailVisibility = (isDetailed: boolean) => {
    // Prices cannot be edited in the simple view.
    if (isPriceEditable) setPriceEditable(isDetailed)
    setDetailView(isDetailed)
  }

  const setPriceEditingView = (isEditable: boolean) => {
    // Price editing requires the detailed view.
    if (!isDetailView) setDetailView(isEditable)
    setPriceEditable(isEditable)
  }

  const defaultHeadings = ['Nimi', 'Vana?', 'Vanus']
  const tableHeadings = new Set(
    Object.keys(registrations.length > 0 ? registrations[0] : defaultHeadings),
  )

  const print = async () => {
    const pdfBlob = await fetchShiftPdf(shiftNr)

    const obj = {
      filename: `${shiftNr}v_nimekiri.pdf`,
      blob: pdfBlob,
    }

    const newBlob = new Blob([obj.blob], { type: 'application/pdf' })
    const objUrl = window.URL.createObjectURL(newBlob)
    window.open(objUrl, '_blank')
  }

  const displayPrintButton =
    registrations.length > 0 &&
    registrations[0].birthday !== undefined &&
    registrations[0].contactEmail !== undefined
  const displayPriceEditSwitch = (useAuthStore.getState().user as User).isRoot

  return (
    <div className="pb-6 overflow-y-scroll h-[calc((100%-var(--spacing)*16))]">
      <div className="px-6 flex flex-wrap gap-4 sticky top-0 z-10 bg-white pb-4">
        <ShiftNav />
        {displayPrintButton && (
          <Button variant="outline" onClick={print}>
            Prindi
          </Button>
        )}
        <div className="flex items-center space-x-2">
          <Switch
            id="detail-view"
            checked={isDetailView}
            onCheckedChange={() => setDetailVisibility(!isDetailView)}
          />
          <Label htmlFor="detail-view">Detailvaade</Label>
        </div>
        {displayPriceEditSwitch && (
          <div className="flex items-center space-x-2">
            <Switch
              id="price-editable"
              checked={isPriceEditable}
              onCheckedChange={() => setPriceEditingView(!isPriceEditable)}
            />
            <Label htmlFor="price-editable">Majanda</Label>
          </div>
        )}
      </div>
      <ChildCounter
        regMCount={regCategories.reg.M.length}
        regFCount={regCategories.reg.F.length}
        resMCount={regCategories.res.M.length}
        resFCount={regCategories.res.F.length}
      />
      <RegistrationTable
        tableHeadings={tableHeadings}
        isDetailView={isDetailView}
        isPriceEditable={isPriceEditable}
        regM={regCategories.reg.M}
        regF={regCategories.reg.F}
        resM={regCategories.res.M}
        resF={regCategories.res.F}
      />
      {/*<DataTable columns={regTableColumns} data={registeredCampers} />*/}
    </div>
  )
}
