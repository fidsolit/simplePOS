import { useNavigate } from "react-router-dom";
import { login } from "../services";
import { useContext, useState } from "react";
import { UserContext } from "../components/providers/user.provider";
import useNotification from "./notification.hook";
import React from "react";

const useSignin = () => {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const [validLogin, setValidLogin] = useState<boolean>(true);
  const { setNotification } = useNotification();

  const handleValidation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;
    try {
      const user = await login(email, password);
      if (user.state) {
        if (userContext.setUser) {
          userContext.setUser(user.value);
          sessionStorage.setItem("user", JSON.stringify(user.value));
        }

        setValidLogin(true);
        setNotification({
          message: `Welcome ${user.value.fullName}`,
          status: "info",
        });
        navigate("/", { replace: true });
        return true;
      } else if (user.value == null) {
        setNotification({ message: "server time out", status: "error" });
        return false;
      } else {
        setValidLogin(false);
        return false;
      }
    } catch (error) {
      console.error(error);
      setNotification({ message: "server time out", status: "error" });
    }
  };

  React.useEffect(() => {
    if (userContext.user) {
      navigate("/", { replace: true });
    }
  }, [userContext, navigate]);

  return {
    user: userContext.user,
    validLogin,
    handleValidation,
  };
};
export default useSignin;
