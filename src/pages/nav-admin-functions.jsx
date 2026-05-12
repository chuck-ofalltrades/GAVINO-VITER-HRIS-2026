import { FaUsers } from "react-icons/fa";
import { devNavUrl, urlAdmin } from "../functions/functions-general";

export const navAdminList = [
  {
    label: "Employees",
    icon: <FaUsers />,
    menu: "employees",
    path: `${devNavUrl}/${urlAdmin}/employees`,
    submenu: "",
  },
];
