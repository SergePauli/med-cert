import { AdminPage } from "./pages/AdminPage"
import { CertificatePage } from "./pages/CertificatePage"
import { ErrorPage } from "./pages/ErrorPage"
import { ListPage } from "./pages/ListPage"
import LoginPage from "./pages/LoginPage"
import MainPage from "./pages/MainPage"
import { MessagePage } from "./pages/MessagePage"
import { PassordRecoveryPage } from "./pages/PasswordRecoveryPage"
import { RegistrationPage } from "./pages/RegistrationPage"
import {
  ADMIN_ROUTE,
  CERTIFICATE_ROUTE,
  ERROR_ROUTE,
  HOME_ROUTE,
  LIST_ROUTE,
  LOGIN_ROUTE,
  MESSAGE_ROUTE,
  PWD_RECOVERY_ROUTE,
  REGISTRATION_ROUTE,
} from "./utils/consts"

export const AUTH_ROUTES = [
  { path: HOME_ROUTE, Component: MainPage },
  { path: ADMIN_ROUTE, Component: AdminPage },
  { path: LIST_ROUTE, Component: ListPage },
  { path: CERTIFICATE_ROUTE, Component: CertificatePage },
  { path: LOGIN_ROUTE, Component: MainPage },
]
export const NON_AUTH_ROUTES = [
  { path: LOGIN_ROUTE, Component: LoginPage },
  { path: REGISTRATION_ROUTE, Component: RegistrationPage },
  { path: PWD_RECOVERY_ROUTE + "/:code", Component: PassordRecoveryPage },
  { path: HOME_ROUTE, Component: LoginPage },
]
export const PUBLIC_ROUTES = [
  { path: MESSAGE_ROUTE + "/:message", Component: MessagePage },
  { path: ERROR_ROUTE + "/:error", Component: ErrorPage },
]
