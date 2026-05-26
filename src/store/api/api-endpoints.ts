import { apiSlice } from './api-slice';
import { getData } from '@/services/data-service';
import { getItemFull } from '@/services/api';
import { API_STATUS, HTTP_STATUS, ERROR_MESSAGES } from '@/constants/constants';
import { ApiError } from '@/services/api-error';
import type { PokemonWithDescription } from '@/types/api';

type ListData = {
  type: typeof API_STATUS.SUCCESS;
  data: PokemonWithDescription[];
  totalPages: number;
};

type NotFoundData = {
  type: typeof API_STATUS.NOT_FOUND;
};

type ListResult = ListData | NotFoundData;

export const apiEndpoints = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getList: builder.query<ListResult, { search: string; page: number }>({
      queryFn: async ({ search, page }: { search: string; page: number }) => {
        const result = await getData(page, search);

        if (result.type === API_STATUS.SUCCESS) {
          return { data: result };
        }
        if (result.type === API_STATUS.NOT_FOUND) {
          return { data: { type: API_STATUS.NOT_FOUND } };
        }
        return {
          error: {
            status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
            data: result.message || ERROR_MESSAGES.SERVER,
          },
        };
      },
      providesTags: ['List'],
    }),

    search: builder.query<PokemonWithDescription | null, string>({
      queryFn: async (name: string) => {
        try {
          const pokemon = await getItemFull(name);
          return { data: pokemon };
        } catch (error) {
          if (error instanceof ApiError) {
            if (error.status === HTTP_STATUS.NOT_FOUND) {
              return { data: null };
            }
            if (error.status >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
              return {
                error: {
                  status: error.status,
                  data: ERROR_MESSAGES.SERVER,
                },
              };
            }
            return {
              error: {
                status: error.status,
                data: error.message,
              },
            };
          }
          return {
            error: {
              status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
              data: ERROR_MESSAGES.DEFAULT,
            },
          };
        }
      },
      providesTags: ['Search'],
    }),
  }),
});

export const { useGetListQuery, useSearchQuery } = apiEndpoints;
