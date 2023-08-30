import { useEffect } from "react";
import { useStateValue } from "../../utils/Utils";
import { useHistory } from "react-router-dom";

const Logout = ({ state }) => {
  console.log("Inside Logout");
  let history = useHistory();
  // eslint-disable-next-line no-unused-vars
  const [{ authenticated }, dispatch] = useStateValue();

  const clearSessionStorage = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("refresh_token");
    sessionStorage.removeItem("tokenTime");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("status");
    sessionStorage.removeItem("customerId");
    sessionStorage.removeItem("view_as_client");
    sessionStorage.removeItem("readonly_customer");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("lastLoginTime");
    sessionStorage.removeItem("customerRegistrationAppliedDate");
    sessionStorage.removeItem('module');
    sessionStorage.removeItem('access');
    sessionStorage.removeItem('ht');
  };

  const handleLogout = () => {
    dispatch({
      type: "changeAuthenticated",
      authenticated: false
    });
    history.push("/");
  };

  useEffect(() => {
    if (state && state === "Password") {
      console.log("Normal Logout");
    } else {
      sessionStorage.setItem("logout", "unauthorized");
    }
    clearSessionStorage();
    handleLogout();
  }, []);

  return null;
};

export default Logout;
