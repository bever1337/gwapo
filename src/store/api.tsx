import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "cache",
  baseQuery: fetchBaseQuery({ baseUrl: "http://foo.com" }),
  endpoints(builder) {
    return {};
  },
});
