import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { queryData } from "../../functions/custom-hooks/queryData";
import {
  apiVersion,
  devNavUrl,
  urlAdmin,
  urlDeveloper,
} from "../../functions/functions-general";
import PageNotFound from "../../partials/PageNotFound";
import FetchingSpinner from "../../partials/spinners/FetchingSpinner";
import { setCredentials } from "../../store/StoreAction";
import { StoreContext } from "../../store/StoreContext";

const ProtectedRoute = ({ children }) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [loading, setLoading] = React.useState(true);
  const [isAuth, setIsAuth] = React.useState("");
  const [pageStatus, setPageStatus] = React.useState(false);

  // FIXED: Using React Router's useLocation instead of the raw window object
  const location = useLocation();
  const hristoken = JSON.parse(localStorage.getItem("hristoken"));

  // Safely extract the current base path (admin or developer)
  const currentPath =
    location.pathname.split("/")[1] === devNavUrl.replace("/", "")
      ? location.pathname.split("/")[2]
      : location.pathname.split("/")[1];

  React.useEffect(() => {
    const fetchLogin = async () => {
      const login = await queryData(
        `${apiVersion}/controllers/developers/settings/users/token.php`,
        "post",
        {
          token: hristoken?.token,
        },
      );

      const isUserKeyMatched =
        login?.success === true && login?.data?.user_is_key_matched;

      // check if the password from database is matched to the password used to login
      if (isUserKeyMatched === false) {
        setLoading(false);
        setIsAuth("456");
        localStorage.removeItem("hristoken");
        return;
      }

      if (typeof login === "undefined" || !login.success) {
        setIsAuth("456");
        setLoading(false);
      } else {
        dispatch(
          setCredentials({
            ...login.data,
          }),
        );
        setIsAuth("123");
        setLoading(false);
        // Clean up sensitive data before putting it in the store
        delete login.data.user_other_password;
        delete login.data.user_key;
        delete login.data.role_description;
        delete login.data.role_created;
        delete login.data.role_datetime;
      }

      // FIXED SECURITY CHECKS: Cleaner URL verification
      if (login?.success) {
        const roleName = login.data.role_name.toLowerCase(); // e.g., "admin" or "developer"

        // Block access if a Developer tries to go to Admin URLs, or vice versa
        if (
          currentPath &&
          (currentPath.toLowerCase() === urlDeveloper.toLowerCase() ||
            currentPath.toLowerCase() === urlAdmin.toLowerCase()) &&
          currentPath.toLowerCase() !== roleName
        ) {
          setPageStatus(true);
        }
      } else {
        setPageStatus(true);
      }
    };

    if (hristoken !== null) {
      setLoading(true);
      fetchLogin();
    } else {
      setIsAuth("456");
      setLoading(false);
      localStorage.removeItem("hristoken");
    }
  }, [dispatch, currentPath, hristoken?.token]);

  if (pageStatus) {
    return <PageNotFound />;
  } else {
    return (
      <>
        {loading ? (
          <FetchingSpinner />
        ) : isAuth === "123" ? (
          children
        ) : (
          <Navigate to={`${devNavUrl}/login`} />
        )}
      </>
    );
  }
};

export default ProtectedRoute;
