import { createApi , fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
    reducerPath:"api",
    baseQuery:fetchBaseQuery({
        baseUrl:process.env.NEXT_BASE_URL,
        credentials:"include",
    }),
    endpoints:(builder) => ({}),
})

export const {} = apiSlice; 