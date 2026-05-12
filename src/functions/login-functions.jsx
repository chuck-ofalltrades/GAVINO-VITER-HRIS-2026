import { devNavUrl, urlAdmin, urlDeveloper } from "./functions-general";

export const checkRoleToRedirect = (navigate, data) => {
  // Explicitly route based on role to avoid missing index pages
  if (data?.role_name?.toLowerCase() === "admin") {
    navigate(`${devNavUrl}/${urlAdmin}/employees`);
  } else {
    navigate(`${devNavUrl}/${urlDeveloper}/dashboard`);
  }
};
