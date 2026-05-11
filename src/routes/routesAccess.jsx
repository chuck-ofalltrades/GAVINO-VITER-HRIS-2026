import { devNavUrl } from "../functions/functions-general";
import CreatePassword from "../pages/access/CreatePassword";
import ForgotPassword from "../pages/access/ForgotPassword";
import Login from "../pages/access/Login";
import VerifyEmailUser from "../pages/access/VerifyEmailUser";


export const routesAccess = [
  {
    path: `${devNavUrl}/`,
    element: <Login />,
  },
  {
    path: `${devNavUrl}/login`,
    element: <Login />,
  },
  {
    path: `${devNavUrl}/forgot-password`,
    element: <ForgotPassword />,
  },
  {
    path: `${devNavUrl}/verify-email`,
    element: <VerifyEmailUser />,
  },
  {
    path: `${devNavUrl}/create-password`,
    element: <CreatePassword />,
  },
];