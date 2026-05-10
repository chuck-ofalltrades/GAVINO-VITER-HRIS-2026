import React from "react";
import { setIsLogin } from "../../store/StoreAction";
import { StoreContext } from "../../store/StoreContext";
import { checkLocalStorage } from "../CheckLocalStorage";
import { apiVersion } from "../functions-general";
import { checkRoleToRedirect } from "../login-functions";
import { queryData } from "./queryData";

const userLogin = (navigate) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [loginLoading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    const fetchLogin = async () => {
      const login = await queryData(`${apiVersion}/other-user/token`, "post", {
        token: checkLocalStorage().token,
      });

      if (typeof login === "undefined" || !login?.success) {
        localStorage.removeItem("wfstoken");
        setLoading(false);
      } else {
        checkRoleToRedirect(navigate, login.data);
        // setLoading(false);
      }
    };
    if (
      checkLocalStorage() !== null &&
      checkLocalStorage().token !== undefined
    ) {
      fetchLogin();
      dispatch(setIsLogin(false));
    } else {
      setLoading(false);
      dispatch(setIsLogin(true));
    }
  }, []);

  return { loginLoading };
};

export default userLogin;
