import client from "./client";

export const signUp = (payload) =>
  client.post("/auth/signup", payload).then((res) => res.data);

export const signIn = (email, password) =>
  client.post("/auth/signin", { email, password }).then((res) => res.data);

// ✅ Add default export object
const authApi = {
  signUp,
  signIn,
};

export default authApi;