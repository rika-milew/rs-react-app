import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL, DEFAULT_CACHE_TTL } from '@/constants/constants';

const CACHE_TTL = Number(import.meta.env.VITE_CACHE_TTL) || DEFAULT_CACHE_TTL;
const TIMEOUT = 15_000;

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    timeout: TIMEOUT,
  }),
  keepUnusedDataFor: CACHE_TTL,
  tagTypes: ['List', 'Search', 'Detail'],
  endpoints: () => ({}),
});
