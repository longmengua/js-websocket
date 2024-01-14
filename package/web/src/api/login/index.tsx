import axios from "axios";
import { Util } from "../../utils/util";
import { LoginStore } from "../../redux/slice/login";
import { ReduxStore } from "../../redux";
import { LoginType } from "../../redux/slice/login/types";

export type LoginAPIProps = {
  account: string;
  password: string;
};

export const LoginAPI = async (p: LoginAPIProps) => {
  const loginUrl = "http://34.27.102.148/api/manager/login";
  const headers = {
    "Content-Type": "application/json",
  };

  return await axios
    .post(loginUrl, p, { headers })
    .then((response) => {
      const { data } = response?.data;

      ReduxStore.dispatch(LoginStore.slice.actions.login(data));

      // Set the JWT token in a cookie with a one-day expiration time
      Util.setCookie("authToken", data?.authToken, 1);

      return true;
    })
    .catch((error) => {
      // Handle the error
      console.error(error);
      return false;
    });
};
