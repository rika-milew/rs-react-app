import { getItemFull } from '@/services/api';
import { ApiError } from '@/services/api-error';
import { API_STATUS, HTTP_STATUS, ERROR_MESSAGES } from '@/constants/constants';
import type { PokemonWithDescription } from '@/types/api';

export type DetailResult =
  | { type: typeof API_STATUS.SUCCESS; data: PokemonWithDescription }
  | { type: typeof API_STATUS.NOT_FOUND }
  | { type: typeof API_STATUS.ERROR; message: string };

export async function getDetailData(id: string): Promise<DetailResult> {
  try {
    const item = await getItemFull(id);
    return { type: API_STATUS.SUCCESS, data: item };
  } catch (error) {
    if (error instanceof ApiError && error.status === HTTP_STATUS.NOT_FOUND) {
      return { type: API_STATUS.NOT_FOUND };
    }

    let message: string = ERROR_MESSAGES.DEFAULT;

    if (error instanceof ApiError) {
      if (error.status >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
        message = ERROR_MESSAGES.SERVER;
      } else if (error.status === HTTP_STATUS.NETWORK_ERROR) {
        message = ERROR_MESSAGES.NETWORK;
      }
    }

    return { type: API_STATUS.ERROR, message };
  }
}
