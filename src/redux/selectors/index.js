import { store } from "../store";

export function getToken() {
  try {
    return store.getState().authSlice?.token;
  } catch (error) { 
    console.log(error)

  }
}