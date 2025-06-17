import type { ReactNode } from 'react'
import * as React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { BadgeEuroIcon, MailCheckIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input.tsx'
import { Badge } from '@/components/ui/badge.tsx'

import {
  type PatchKeys,
  type PatchObject,
  patchRegistrations,
  type RegistrationEntry,
} from '@/requests/registrations.ts'
import { toast } from 'sonner'

const TableHeadCell = ({ children }: { children: ReactNode }) => {
  return (
    <th className="px-4 py-3 first:sticky first:left-0 first:bg-inherit border-r last:border-r-0 border-gray-200">
      {children}
    </th>
  )
}

const TableCell = ({
  children,
  isFirst = false,
  isLast = false,
  textCenter = false,
}: {
  children: ReactNode
  isFirst?: boolean
  isLast?: boolean
  textCenter?: boolean
}) => {
  const firstClasses = isFirst ? ' sticky left-0 bg-inherit' : ''
  const lastClasses = isLast ? ' border-r-0 p-0' : ''
  const textCenterClass = textCenter ? ' text-center' : ''

  return (
    <td
      className={`px-4 py-3 border-r border-gray-200${firstClasses}${lastClasses}${textCenterClass}`}
    >
      {children}
    </td>
  )
}

type RegistrationMutation = {
  regId: number
  patch: PatchObject
}

const TableDataRow = ({
  registration,
  isDetailView,
  isPriceEditable,
}: {
  registration: RegistrationEntry
  isDetailView: boolean
  isPriceEditable: boolean
}) => {
  const queryClient = useQueryClient()

  const [priceEditField, setPriceEditField] =
    React.useState<HTMLInputElement | null>(null)

  const mutation = useMutation({
    mutationFn: (newState: RegistrationMutation) =>
      patchRegistrations(newState.regId, newState.patch),
    // onMutate: (newState) => {
    //   const staleData = queryClient.getQueryData<RegistrationEntry[]>([
    //     'registrations',
    //     registration.shiftNr,
    //   ])
    //   if (!staleData) return
    //
    //   const updatedData = [...staleData]
    //   const index = updatedData.findIndex((r) => r.id === newState.regId)
    //   if (index === -1) return
    //
    //   updatedData[index] = {
    //     ...updatedData[index],
    //     ...newState.patch,
    //   }
    //
    //   queryClient.setQueryData(
    //     ['registrations', registration.shiftNr],
    //     updatedData,
    //   )
    // },
    onSuccess: (_, newState, __) => {
      const staleData = queryClient.getQueryData<RegistrationEntry[]>([
        'registrations',
        registration.shiftNr,
      ])
      if (!staleData) return

      const updatedData = [...staleData]
      const index = updatedData.findIndex((r) => r.id === newState.regId)
      if (index === -1) return

      updatedData[index] = {
        ...updatedData[index],
        ...newState.patch,
      }

      queryClient.setQueryData(
        ['registrations', registration.shiftNr],
        updatedData,
      )
    },
    onError: (error, newState, __) => {
      const message = error.message
      toast.error('Viga andmete uuendamisel!', {
        description: message,
      })
      // Reset the price to avoid confusion.
      if (!priceEditField) return
      if (newState.patch.pricePaid !== undefined) {
        priceEditField.value = `${registration.pricePaid}`
      }
      if (newState.patch.priceToPay !== undefined) {
        priceEditField.value = `${registration.priceToPay}`
      }
    },
    mutationKey: ['patchRegistration', registration.id],
  })

  const toggleRegistration = () => {
    mutation.mutate({
      regId: registration.id,
      patch: { isRegistered: !registration.isRegistered },
    })
  }

  const updatePrice = (
    e: React.FocusEvent<HTMLInputElement>,
    type: PatchKeys,
  ) => {
    setPriceEditField(e.target)
    const priceText = e.target.value
    const price = parseInt(priceText, 10)
    if (!price) {
      e.target.value = `${registration[type]}`
      return
    }
    mutation.mutate({
      regId: registration.id,
      patch: { [type]: price },
    })
  }

  let pricePaidField = (
    <span className="font-mono">{registration.pricePaid}</span>
  )
  let priceToPayField = (
    <span className="font-mono">{registration.priceToPay}</span>
  )

  if (isPriceEditable) {
    pricePaidField = (
      <Input
        className="w-16 font-mono"
        defaultValue={registration.pricePaid}
        onBlur={(e) => updatePrice(e, 'pricePaid')}
      />
    )
    priceToPayField = (
      <Input
        className="w-16 font-mono"
        defaultValue={registration.priceToPay}
        onBlur={(e) => updatePrice(e, 'priceToPay')}
      />
    )
  }

  const [isSelected, _] = React.useState(false)

  const classList = isSelected
    ? 'bg-secondary-100'
    : 'even:bg-white odd:bg-gray-100 hover:bg-secondary-50'

  const isFinanceAvailable = registration.pricePaid !== undefined
  const displayFinanceBadge = !isDetailView && isFinanceAvailable
  const isPaid = registration.pricePaid === registration.priceToPay

  return (
    <tr className={classList}>
      <TableCell isFirst={true}>
        <div className="flex justify-between gap-4">
          {registration.child.name}
          {displayFinanceBadge && isPaid && (
            <Badge variant="outline">
              <BadgeEuroIcon />
            </Badge>
          )}
        </div>
      </TableCell>
      {isDetailView && (
        <React.Fragment>
          <TableCell textCenter={true}>
            <Button
              variant="outline"
              className="w-12"
              onClick={toggleRegistration}
            >
              {registration.isRegistered ? 'Jah' : 'Ei'}
            </Button>
          </TableCell>
          {isFinanceAvailable && (
            <React.Fragment>
              <TableCell>{pricePaidField}</TableCell>
              <TableCell>{priceToPayField}</TableCell>
              <TableCell>
                <span className="font-mono">{registration.billId}</span>
              </TableCell>
            </React.Fragment>
          )}
        </React.Fragment>
      )}
      {registration.contactName && (
        <React.Fragment>
          <TableCell>{registration.contactName}</TableCell>
          <TableCell>
            <div className="flex justify-between gap-4">
              <a
                href={`mailto:${registration.contactEmail}`}
                className="hover:underline"
              >
                {registration.contactEmail}
              </a>
              {registration.notifSent && (
                <Badge variant="outline">
                  <MailCheckIcon />
                </Badge>
              )}
            </div>
          </TableCell>
        </React.Fragment>
      )}
      <TableCell>{registration.isOld ? 'Jah' : 'Ei'}</TableCell>
      <TableCell>{registration.child.currentAge}a</TableCell>
      {/*<TableCell textCenter={true}>*/}
      {/*  <button*/}
      {/*    className="material-symbols-outlined w-8 h-8 rounded-full hover:border-2 hover:bg-gray-100"*/}
      {/*    title="Lisatoimingud"*/}
      {/*  >*/}
      {/*    more_horiz*/}
      {/*  </button>*/}
      {/*</TableCell>*/}
    </tr>
  )
}

const TableHead = ({
  keys,
  isDetailView,
}: {
  keys: Set<string>
  isDetailView: boolean
}) => {
  return (
    <thead>
      <tr className="bg-white">
        <TableHeadCell>Nimi</TableHeadCell>
        {isDetailView && (
          <>
            <TableHeadCell>Reg?</TableHeadCell>
            {keys.has('pricePaid') && (
              <>
                <TableHeadCell>Makstud</TableHeadCell>
                <TableHeadCell>Maksta</TableHeadCell>
                <TableHeadCell>Arve Nr.</TableHeadCell>
              </>
            )}
          </>
        )}
        {keys.has('contactName') && (
          <>
            <TableHeadCell>Kontakt</TableHeadCell>
            <TableHeadCell>Meil</TableHeadCell>
          </>
        )}
        <TableHeadCell>Vana?</TableHeadCell>
        <TableHeadCell>Vanus</TableHeadCell>
        {/*<TableHeadCell>*/}
        {/*  <div className="flex justify-center items-center">*/}
        {/*    <span className="material-symbols-outlined">bolt</span>*/}
        {/*  </div>*/}
        {/*</TableHeadCell>*/}
      </tr>
    </thead>
  )
}

const TableBody = ({
  header,
  registrations,
  isDetailView,
  isPriceEditable,
}: {
  header: string
  registrations: RegistrationEntry[]
  isDetailView: boolean
  isPriceEditable: boolean
}) => {
  return (
    <tbody>
      <tr className="border-y border-black">
        <th className="px-4 py-3 bg-gray-300 sticky left-0">{header}</th>
        <th colSpan={10} className="bg-gray-300" />
      </tr>
      {registrations.map((registration) => (
        <TableDataRow
          key={registration.id}
          registration={registration}
          isDetailView={isDetailView}
          isPriceEditable={isPriceEditable}
        />
      ))}
    </tbody>
  )
}

type RegistrationTableProps = {
  tableHeadings: Set<string>
  isDetailView: boolean
  isPriceEditable: boolean
  regM: RegistrationEntry[]
  regF: RegistrationEntry[]
  resM: RegistrationEntry[]
  resF: RegistrationEntry[]
}

export const RegistrationTable = ({
  tableHeadings,
  isDetailView,
  isPriceEditable,
  regM,
  regF,
  resM,
  resF,
}: RegistrationTableProps) => {
  return (
    <div className="mx-6 border-t border-gray-200">
      <table className="w-full text-left border-separate border-spacing-0">
        <TableHead keys={tableHeadings} isDetailView={isDetailView} />
        <TableBody
          header="Poisid"
          registrations={regM}
          isDetailView={isDetailView}
          isPriceEditable={isPriceEditable}
        />
        <TableBody
          header="Tüdrukud"
          registrations={regF}
          isDetailView={isDetailView}
          isPriceEditable={isPriceEditable}
        />
        <TableBody
          header="Reserv Poisid"
          registrations={resM}
          isDetailView={isDetailView}
          isPriceEditable={isPriceEditable}
        />
        <TableBody
          header="Reserv Tüdrukud"
          registrations={resF}
          isDetailView={isDetailView}
          isPriceEditable={isPriceEditable}
        />
      </table>
    </div>
  )
}
