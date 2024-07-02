import { UserNS } from "../types";

const signup = async (user: UserNS.User) => {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response: Response) => {
      if (response.status === 201) return true;
      else return false;
      return true;
    })
    .catch((error: Error) => {
      console.error(error.message);
      return false;
    });
};

export default signup;
