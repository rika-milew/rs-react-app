import { apiSlice } from './api-slice';
import { getData } from '@/services/data-service';
import { getItemFull, getItemsById } from '@/services/api';
import { API_STATUS, HTTP_STATUS, ERROR_MESSAGES } from '@/constants/constants';
import { ApiError } from '@/services/api-error';
import type { PokemonWithDescription } from '@/types/api';
import { getDetailData } from '@/services/detail-service';
import type { DetailResult } from '@/services/detail-service';

type ListData = {
  status: typeof API_STATUS.SUCCESS;
  data: PokemonWithDescription[];
  totalPages: number;
};

type NotFoundData = {
  status: typeof API_STATUS.NOT_FOUND;
};

type ListResult = ListData | NotFoundData;

type SearchResult =
  | { data: null }
  | { error: { status: number; data: string } };

type ErrorResult = { error: { status: number; data: string } };

export const apiEndpoints = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getList: builder.query<ListResult, { search: string; page: number }>({
      queryFn: async ({ search, page }: { search: string; page: number }) => {
        const result = await getData(page, search);

        if (result.status === API_STATUS.SUCCESS) {
          return { data: result };
        }
        if (result.status === API_STATUS.NOT_FOUND) {
          return { data: { status: API_STATUS.NOT_FOUND } };
        }
        return handleErrorResult(result);
      },
      providesTags: ['List'],
    }),
    search: builder.query<PokemonWithDescription | null, string>({
      queryFn: async (name: string) => {
        try {
          const pokemon = await getItemFull(name);
          return { data: pokemon };
        } catch (error) {
          return handleSearchError(error);
        }
      },
      providesTags: ['Search'],
    }),
    getDetail: builder.query<DetailResult, string>({
      queryFn: async (id: string) => {
        const result = await getDetailData(id);

        if (result.status === API_STATUS.SUCCESS) {
          return { data: result };
        }
        if (result.status === API_STATUS.NOT_FOUND) {
          return { data: { status: API_STATUS.NOT_FOUND } };
        }
        return handleErrorResult(result);
      },
      providesTags: (_result, _error, id) => [{ type: 'Detail', id }],
    }),
    download: builder.mutation<PokemonWithDescription[], string[]>({
      queryFn: async (ids: string[]) => {
        try {
          const result = await getItemsById(ids);
          return { data: result };
        } catch (error) {
          return handleQueryError(error);
        }
      },
    }),
  }),
});

const handleErrorResult = (result: {
  status: string;
  message?: string;
}): ErrorResult => {
  const errorMessage =
    result.status === API_STATUS.ERROR && result.message
      ? result.message
      : ERROR_MESSAGES.SERVER;

  return {
    error: {
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      data: errorMessage,
    },
  };
};

const handleQueryError = (error: unknown): ErrorResult => {
  if (error instanceof ApiError) {
    return { error: { status: error.status, data: error.message } };
  }
  return {
    error: {
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      data: ERROR_MESSAGES.DEFAULT,
    },
  };
};

const handleSearchError = (error: unknown): SearchResult => {
  if (error instanceof ApiError) {
    if (error.status === HTTP_STATUS.NOT_FOUND) {
      return { data: null };
    }
    if (error.status >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
      return { error: { status: error.status, data: ERROR_MESSAGES.SERVER } };
    }
    return { error: { status: error.status, data: error.message } };
  }
  return {
    error: {
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      data: ERROR_MESSAGES.DEFAULT,
    },
  };
};

export const {
  useGetListQuery,
  useSearchQuery,
  useGetDetailQuery,
  useDownloadMutation,
} = apiEndpoints;
