import { BACKEND_PREFIX } from "CONSTANTS";

export const getApiPath = (path: string) => `${BACKEND_PREFIX}${path}`;
