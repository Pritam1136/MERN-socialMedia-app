import axios from "axios";

export const loginCall = async (userCredentials, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axios.post("/auth/login", userCredentials);
    dispatch({ type: "LOGIN_SUCCESSFUL", payload: res.data });
  } catch (error) {
    dispatch({ type: "LOGIN_FAILED", payload: error });
  }
};
