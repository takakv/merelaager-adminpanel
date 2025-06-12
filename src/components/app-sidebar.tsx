import { Link } from '@tanstack/react-router'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

import { Route as homeRoute } from '../routes/_auth/index.tsx'
import { Route as registrationsRoute } from '../routes/_auth/nimekiri.tsx'
import { Route as permissionsRoute } from '../routes/_auth/oigused.tsx'
import { Route as tentsRoute } from '../routes/_auth/telgid.tsx'

const topItems = [
  {
    title: 'Kambüüs',
    url: homeRoute.to,
  },
]

const shiftItems = [
  {
    title: 'Telgid',
    url: tentsRoute.to,
  },
  {
    title: 'Meeskonnad',
    url: registrationsRoute.to,
  },
  {
    title: 'Hinded',
    url: registrationsRoute.to,
  },
]

const adminItems = [
  {
    title: 'Nimekiri',
    url: registrationsRoute.to,
  },
  {
    title: 'Arved',
    url: permissionsRoute.to,
  },
  {
    title: 'Õigused',
    url: permissionsRoute.to,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      {/*<SidebarHeader />*/}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="p-6">
              <Link to={homeRoute.to} className="block w-[50px]">
                <img
                  src="https://merelaager.ee/img/merelaager_ship.svg"
                  alt="Merelaagri logo"
                />
              </Link>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            {topItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link to={item.url}>
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            {shiftItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link to={item.url}>
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            {adminItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link to={item.url}>
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/*<SidebarFooter />*/}
    </Sidebar>
  )
}
