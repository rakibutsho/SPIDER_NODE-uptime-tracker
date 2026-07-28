import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

const baseUrl =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? process.env.NEXT_PUBLIC_BASE_URL
    : process.env.NEXT_PUBLIC_DEV_BASE_URL;

if (!baseUrl) {
  throw new Error("Environment variable NEXT_PUBLIC_BASE_URL is not set");
}

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state?.auth?.token;

      if (token) {
        headers.set("Authorization", `${token}`);
      }

      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: [],
});

export default baseApi;
