import { devNavUrl, urlDeveloper } from "../functions/functions-general";
import Dashboard from "../pages/developer/dashboard/Dashboard";
import Employees from "../pages/developer/employees/Employees";
import Memo from "../pages/developer/memo/Memo";
import Department from "../pages/developer/settings/department/Department";
import Notification from "../pages/developer/settings/notification/Notification";
import Roles from "../pages/developer/settings/roles/Roles";
import Users from "../pages/developer/settings/users/Users";
// ADDED IMPORT HERE:
import DirectReport from "../pages/developer/settings/direct-report/DirectReport";
import ProtectedRoute from "../pages/access/ProtectedRoute";

export const routesDeveloper = [
  {
    path: `${devNavUrl}/${urlDeveloper}/`,
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: `${devNavUrl}/${urlDeveloper}/dashboard`,
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: `${devNavUrl}/${urlDeveloper}/employees`,
    element: (
      <ProtectedRoute>
        <Employees />
      </ProtectedRoute>
    ),
  },
  {
    path: `${devNavUrl}/${urlDeveloper}/settings/roles`,
    element: (
      <ProtectedRoute>
        <Roles />
      </ProtectedRoute>
    ),
  },
  {
    path: `${devNavUrl}/${urlDeveloper}/settings/users`,
    element: (
      <ProtectedRoute>
        <Users />
      </ProtectedRoute>
    ),
  },
  {
    path: `${devNavUrl}/${urlDeveloper}/settings/department`,
    element: (
      <ProtectedRoute>
        <Department />
      </ProtectedRoute>
    ),
  },
  {
    path: `${devNavUrl}/${urlDeveloper}/settings/notification`,
    element: (
      <ProtectedRoute>
        <Notification />
      </ProtectedRoute>
    ),
  },
  // ADDED ROUTE HERE:
  {
    path: `${devNavUrl}/${urlDeveloper}/settings/direct-report`,
    element: (
      <ProtectedRoute>
        <DirectReport />
      </ProtectedRoute>
    ),
  },
  {
    path: `${devNavUrl}/${urlDeveloper}/memo`,
    element: (
      <ProtectedRoute>
        <Memo />
      </ProtectedRoute>
    ),
  },
];
