/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LoginImport } from './routes/login'
import { Route as AuthRouteImport } from './routes/_auth/route'
import { Route as AuthIndexImport } from './routes/_auth/index'
import { Route as AuthTelgidImport } from './routes/_auth/telgid'
import { Route as AuthOigusedImport } from './routes/_auth/oigused'
import { Route as AuthNimekiriImport } from './routes/_auth/nimekiri'
import { Route as AuthMeeskonnadImport } from './routes/_auth/meeskonnad'
import { Route as AuthHindedImport } from './routes/_auth/hinded'
import { Route as AuthArvedImport } from './routes/_auth/arved'
import { Route as AuthNimekiriShiftNrImport } from './routes/_auth/nimekiri.$shiftNr'

// Create/Update Routes

const LoginRoute = LoginImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const AuthRouteRoute = AuthRouteImport.update({
  id: '/_auth',
  getParentRoute: () => rootRoute,
} as any)

const AuthIndexRoute = AuthIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => AuthRouteRoute,
} as any)

const AuthTelgidRoute = AuthTelgidImport.update({
  id: '/telgid',
  path: '/telgid',
  getParentRoute: () => AuthRouteRoute,
} as any)

const AuthOigusedRoute = AuthOigusedImport.update({
  id: '/oigused',
  path: '/oigused',
  getParentRoute: () => AuthRouteRoute,
} as any)

const AuthNimekiriRoute = AuthNimekiriImport.update({
  id: '/nimekiri',
  path: '/nimekiri',
  getParentRoute: () => AuthRouteRoute,
} as any)

const AuthMeeskonnadRoute = AuthMeeskonnadImport.update({
  id: '/meeskonnad',
  path: '/meeskonnad',
  getParentRoute: () => AuthRouteRoute,
} as any)

const AuthHindedRoute = AuthHindedImport.update({
  id: '/hinded',
  path: '/hinded',
  getParentRoute: () => AuthRouteRoute,
} as any)

const AuthArvedRoute = AuthArvedImport.update({
  id: '/arved',
  path: '/arved',
  getParentRoute: () => AuthRouteRoute,
} as any)

const AuthNimekiriShiftNrRoute = AuthNimekiriShiftNrImport.update({
  id: '/$shiftNr',
  path: '/$shiftNr',
  getParentRoute: () => AuthNimekiriRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_auth': {
      id: '/_auth'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthRouteImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/_auth/arved': {
      id: '/_auth/arved'
      path: '/arved'
      fullPath: '/arved'
      preLoaderRoute: typeof AuthArvedImport
      parentRoute: typeof AuthRouteImport
    }
    '/_auth/hinded': {
      id: '/_auth/hinded'
      path: '/hinded'
      fullPath: '/hinded'
      preLoaderRoute: typeof AuthHindedImport
      parentRoute: typeof AuthRouteImport
    }
    '/_auth/meeskonnad': {
      id: '/_auth/meeskonnad'
      path: '/meeskonnad'
      fullPath: '/meeskonnad'
      preLoaderRoute: typeof AuthMeeskonnadImport
      parentRoute: typeof AuthRouteImport
    }
    '/_auth/nimekiri': {
      id: '/_auth/nimekiri'
      path: '/nimekiri'
      fullPath: '/nimekiri'
      preLoaderRoute: typeof AuthNimekiriImport
      parentRoute: typeof AuthRouteImport
    }
    '/_auth/oigused': {
      id: '/_auth/oigused'
      path: '/oigused'
      fullPath: '/oigused'
      preLoaderRoute: typeof AuthOigusedImport
      parentRoute: typeof AuthRouteImport
    }
    '/_auth/telgid': {
      id: '/_auth/telgid'
      path: '/telgid'
      fullPath: '/telgid'
      preLoaderRoute: typeof AuthTelgidImport
      parentRoute: typeof AuthRouteImport
    }
    '/_auth/': {
      id: '/_auth/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof AuthIndexImport
      parentRoute: typeof AuthRouteImport
    }
    '/_auth/nimekiri/$shiftNr': {
      id: '/_auth/nimekiri/$shiftNr'
      path: '/$shiftNr'
      fullPath: '/nimekiri/$shiftNr'
      preLoaderRoute: typeof AuthNimekiriShiftNrImport
      parentRoute: typeof AuthNimekiriImport
    }
  }
}

// Create and export the route tree

interface AuthNimekiriRouteChildren {
  AuthNimekiriShiftNrRoute: typeof AuthNimekiriShiftNrRoute
}

const AuthNimekiriRouteChildren: AuthNimekiriRouteChildren = {
  AuthNimekiriShiftNrRoute: AuthNimekiriShiftNrRoute,
}

const AuthNimekiriRouteWithChildren = AuthNimekiriRoute._addFileChildren(
  AuthNimekiriRouteChildren,
)

interface AuthRouteRouteChildren {
  AuthArvedRoute: typeof AuthArvedRoute
  AuthHindedRoute: typeof AuthHindedRoute
  AuthMeeskonnadRoute: typeof AuthMeeskonnadRoute
  AuthNimekiriRoute: typeof AuthNimekiriRouteWithChildren
  AuthOigusedRoute: typeof AuthOigusedRoute
  AuthTelgidRoute: typeof AuthTelgidRoute
  AuthIndexRoute: typeof AuthIndexRoute
}

const AuthRouteRouteChildren: AuthRouteRouteChildren = {
  AuthArvedRoute: AuthArvedRoute,
  AuthHindedRoute: AuthHindedRoute,
  AuthMeeskonnadRoute: AuthMeeskonnadRoute,
  AuthNimekiriRoute: AuthNimekiriRouteWithChildren,
  AuthOigusedRoute: AuthOigusedRoute,
  AuthTelgidRoute: AuthTelgidRoute,
  AuthIndexRoute: AuthIndexRoute,
}

const AuthRouteRouteWithChildren = AuthRouteRoute._addFileChildren(
  AuthRouteRouteChildren,
)

export interface FileRoutesByFullPath {
  '': typeof AuthRouteRouteWithChildren
  '/login': typeof LoginRoute
  '/arved': typeof AuthArvedRoute
  '/hinded': typeof AuthHindedRoute
  '/meeskonnad': typeof AuthMeeskonnadRoute
  '/nimekiri': typeof AuthNimekiriRouteWithChildren
  '/oigused': typeof AuthOigusedRoute
  '/telgid': typeof AuthTelgidRoute
  '/': typeof AuthIndexRoute
  '/nimekiri/$shiftNr': typeof AuthNimekiriShiftNrRoute
}

export interface FileRoutesByTo {
  '/login': typeof LoginRoute
  '/arved': typeof AuthArvedRoute
  '/hinded': typeof AuthHindedRoute
  '/meeskonnad': typeof AuthMeeskonnadRoute
  '/nimekiri': typeof AuthNimekiriRouteWithChildren
  '/oigused': typeof AuthOigusedRoute
  '/telgid': typeof AuthTelgidRoute
  '/': typeof AuthIndexRoute
  '/nimekiri/$shiftNr': typeof AuthNimekiriShiftNrRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_auth': typeof AuthRouteRouteWithChildren
  '/login': typeof LoginRoute
  '/_auth/arved': typeof AuthArvedRoute
  '/_auth/hinded': typeof AuthHindedRoute
  '/_auth/meeskonnad': typeof AuthMeeskonnadRoute
  '/_auth/nimekiri': typeof AuthNimekiriRouteWithChildren
  '/_auth/oigused': typeof AuthOigusedRoute
  '/_auth/telgid': typeof AuthTelgidRoute
  '/_auth/': typeof AuthIndexRoute
  '/_auth/nimekiri/$shiftNr': typeof AuthNimekiriShiftNrRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | ''
    | '/login'
    | '/arved'
    | '/hinded'
    | '/meeskonnad'
    | '/nimekiri'
    | '/oigused'
    | '/telgid'
    | '/'
    | '/nimekiri/$shiftNr'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/login'
    | '/arved'
    | '/hinded'
    | '/meeskonnad'
    | '/nimekiri'
    | '/oigused'
    | '/telgid'
    | '/'
    | '/nimekiri/$shiftNr'
  id:
    | '__root__'
    | '/_auth'
    | '/login'
    | '/_auth/arved'
    | '/_auth/hinded'
    | '/_auth/meeskonnad'
    | '/_auth/nimekiri'
    | '/_auth/oigused'
    | '/_auth/telgid'
    | '/_auth/'
    | '/_auth/nimekiri/$shiftNr'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  AuthRouteRoute: typeof AuthRouteRouteWithChildren
  LoginRoute: typeof LoginRoute
}

const rootRouteChildren: RootRouteChildren = {
  AuthRouteRoute: AuthRouteRouteWithChildren,
  LoginRoute: LoginRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_auth",
        "/login"
      ]
    },
    "/_auth": {
      "filePath": "_auth/route.tsx",
      "children": [
        "/_auth/arved",
        "/_auth/hinded",
        "/_auth/meeskonnad",
        "/_auth/nimekiri",
        "/_auth/oigused",
        "/_auth/telgid",
        "/_auth/"
      ]
    },
    "/login": {
      "filePath": "login.tsx"
    },
    "/_auth/arved": {
      "filePath": "_auth/arved.tsx",
      "parent": "/_auth"
    },
    "/_auth/hinded": {
      "filePath": "_auth/hinded.tsx",
      "parent": "/_auth"
    },
    "/_auth/meeskonnad": {
      "filePath": "_auth/meeskonnad.tsx",
      "parent": "/_auth"
    },
    "/_auth/nimekiri": {
      "filePath": "_auth/nimekiri.tsx",
      "parent": "/_auth",
      "children": [
        "/_auth/nimekiri/$shiftNr"
      ]
    },
    "/_auth/oigused": {
      "filePath": "_auth/oigused.tsx",
      "parent": "/_auth"
    },
    "/_auth/telgid": {
      "filePath": "_auth/telgid.tsx",
      "parent": "/_auth"
    },
    "/_auth/": {
      "filePath": "_auth/index.tsx",
      "parent": "/_auth"
    },
    "/_auth/nimekiri/$shiftNr": {
      "filePath": "_auth/nimekiri.$shiftNr.tsx",
      "parent": "/_auth/nimekiri"
    }
  }
}
ROUTE_MANIFEST_END */
