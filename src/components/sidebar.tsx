import { Link } from '@tanstack/react-router'
import { Fragment } from 'react'

import { Route as registrationsRoute } from '../routes/_auth/nimekiri.tsx'

type NavLinks = {
  href: string
  title: string
}

type NavGroupProps = {
  navLinks: NavLinks[]
}

const NavGroup = ({ navLinks }: NavGroupProps) => {
  return (
    <Fragment>
      {navLinks.map((link, idx, arr) => (
        <li
          key={link.href}
          className={idx === arr.length - 1 ? 'mb-6' : 'mb-2'}
        >
          <Link to={link.href}>{link.title}</Link>
        </li>
      ))}
    </Fragment>
  )
}

const navLinks: NavLinks[][] = [
  [
    {
      href: '/',
      title: 'Kambüüs',
    },
  ],
  [
    {
      href: registrationsRoute.to,
      title: 'Nimekiri',
    },
    {
      href: '/arved/',
      title: 'Arvegeneraator',
    },
  ],
]

const Navbar = () => {
  return (
    <nav className="m-8">
      <ul>
        {navLinks.map((links, idx) => (
          <NavGroup key={idx} navLinks={links} />
        ))}
      </ul>
    </nav>
  )
}

type SidebarProps = {
  isVisible: boolean
}

const Sidebar = ({ isVisible }: SidebarProps) => {
  let classList =
    'h-full w-[220px] flex flex-col bg-gray-100 transition-transform fixed sm:static sm:[grid-area:sb] sm:transform-none'
  if (!isVisible) classList += ' -translate-x-full'

  return (
    <div className={classList}>
      <div className="mx-8 mt-8">
        <Link to="/" className="block w-[50px]">
          <img
            src="https://merelaager.ee/img/merelaager_ship.svg"
            alt="Merelaagri logo"
          />
        </Link>
      </div>
      <Navbar />
    </div>
  )
}

export default Sidebar
