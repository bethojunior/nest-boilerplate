import { BusinessException } from "src/exceptions/business.exception";

export function istanceError(error: any) {
  throw error instanceof Error ? error : new Error(String(error));
}

export function istanceBusinessException(error: any) {
  throw error instanceof Error ? error : new BusinessException(error?.message || "Internal Server Error",
    error?.status || 500,
    error?.statusCode || 500,
    error?.trackId || null);
}
