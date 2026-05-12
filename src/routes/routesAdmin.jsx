import { devNavUrl, urlAdmin } from "../functions/functions-general";
import Employees from "../pages/developer/employees/Employees";
import ProtectedRoute from "../pages/access/ProtectedRoute";

export const routesAdmin = [
  {
    path: `${devNavUrl}/${urlAdmin}/`,
    element: (
      <ProtectedRoute>
        <Employees />
      </ProtectedRoute>
    ),
  },
  {
    path: `${devNavUrl}/${urlAdmin}/employees`,
    element: (
      <ProtectedRoute>
        <Employees />
      </ProtectedRoute>
    ),
  },
];
