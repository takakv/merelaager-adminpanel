import * as React from 'react'
import { Fragment, type ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input.tsx'

import type { RegistrationEntry } from '@/requests/registrations.ts'

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

const RegistrationForm = ({
  id,
  isRegistered,
}: {
  id: number
  isRegistered: boolean
}) => {
  return (
    <Button variant="outline" className="w-12">
      {isRegistered ? 'Jah' : 'Ei'}
    </Button>
  )
}

const TableDataRow = ({
  registration,
  isReserve,
  isDetailView,
  isPriceEditable,
}: {
  registration: RegistrationEntry
  isReserve: boolean
  isDetailView: boolean
  isPriceEditable: boolean
}) => {
  const [isSelected, _] = React.useState(false)

  const classList = isSelected
    ? 'bg-secondary-100'
    : 'even:bg-white odd:bg-gray-100 hover:bg-secondary-50'

  let pricePaidField = (
    <span className="font-mono">{registration.pricePaid}</span>
  )
  let priceToPayField = (
    <span className="font-mono">{registration.priceToPay}</span>
  )

  if (isPriceEditable) {
    pricePaidField = (
      <Input className="w-16 font-mono" defaultValue={registration.pricePaid} />
    )
    priceToPayField = (
      <Input
        className="w-16 font-mono"
        defaultValue={registration.priceToPay}
      />
    )
  }

  return (
    <tr className={classList}>
      <TableCell isFirst={true}>{registration.child.name}</TableCell>
      {isDetailView && (
        <Fragment>
          <TableCell textCenter={true}>
            <RegistrationForm
              id={registration.id}
              isRegistered={registration.isRegistered}
            />
          </TableCell>
          {registration.pricePaid !== undefined && (
            <Fragment>
              <TableCell>{pricePaidField}</TableCell>
              <TableCell>{priceToPayField}</TableCell>
            </Fragment>
          )}
        </Fragment>
      )}
      {registration.contactName && (
        <Fragment>
          <TableCell>{registration.contactName}</TableCell>
          <TableCell>
            <a
              href={`mailto:${registration.contactEmail}`}
              className="hover:underline"
            >
              {registration.contactEmail}
            </a>
          </TableCell>
        </Fragment>
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
          <Fragment>
            <TableHeadCell>Reg?</TableHeadCell>
            {keys.has('pricePaid') && (
              <Fragment>
                <TableHeadCell>Makstud</TableHeadCell>
                <TableHeadCell>Maksta</TableHeadCell>
              </Fragment>
            )}
          </Fragment>
        )}
        {keys.has('contactName') && (
          <Fragment>
            <TableHeadCell>Kontakt</TableHeadCell>
            <TableHeadCell>Meil</TableHeadCell>
          </Fragment>
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
  isReserve = false,
  isDetailView,
  isPriceEditable,
}: {
  header: string
  registrations: RegistrationEntry[]
  isReserve?: boolean
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
          isReserve={isReserve}
          isDetailView={isDetailView}
          isPriceEditable={isPriceEditable}
        />
      ))}
    </tbody>
  )
}

type RegistrationTableProps = {
  isDetailView: boolean
  isPriceEditable: boolean
  regM: RegistrationEntry[]
  regF: RegistrationEntry[]
  resM: RegistrationEntry[]
  resF: RegistrationEntry[]
}

export const RegistrationTable = ({
  isDetailView,
  isPriceEditable,
  regM,
  regF,
  resM,
  resF,
}: RegistrationTableProps) => {
  return (
    <div className="mx-6 overflow-y-scroll h-[calc(100%-50px)] border-t border-gray-200">
      <table className="w-full text-left border-separate border-spacing-0">
        <TableHead
          keys={new Set(Object.keys(regM[0]))}
          isDetailView={isDetailView}
        />
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
          isReserve={true}
          isDetailView={isDetailView}
          isPriceEditable={isPriceEditable}
        />
        <TableBody
          header="Reserv Tüdrukud"
          registrations={resF}
          isReserve={true}
          isDetailView={isDetailView}
          isPriceEditable={isPriceEditable}
        />
      </table>
    </div>
  )
}
