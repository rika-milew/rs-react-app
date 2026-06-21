import { apiSlice } from './api-slice';
import { getData } from '@/services/data-service';
import { getItemFull } from '@/services/api';
import { API_STATUS } from '@/constants/constants';
import type { PokemonWithDescription } from '@/types/api';
import { getDetailData } from '@/services/detail-service';
import type { DetailResult } from '@/services/detail-service';
import { handleErrorResult, handleSearchError } from '@/utils/error-handlers';

type ListData = {
  status: typeof API_STATUS.SUCCESS;
  data: PokemonWithDescription[];
  totalPages: number;
};

type NotFoundData = {
  status: typeof API_STATUS.NOT_FOUND;
};

type ListResult = ListData | NotFoundData;

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
      providesTags: (result) => {
        if (result?.status === API_STATUS.SUCCESS) {
          return [
            'List',
            ...result.data.map((item) => ({
              type: 'Detail' as const,
              id: String(item.id),
            })),
          ];
        }
        return ['List'];
      },
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
  }),
});

export const { useGetListQuery, useSearchQuery, useGetDetailQuery } =
  apiEndpoints;
