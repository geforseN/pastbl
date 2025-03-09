import { $fetch as $fetch_ } from "ofetch";
import { isCI } from "std-env";

export const baseUrl
  = process.env.VITEST_SERVER_API_BASE_URL
    ?? (isCI ? "https://pastbl.vercel.app" : "http://localhost:3000");

const baseApiUrl = baseUrl + "/api/v1";

export const $apiFetch = $fetch_.create({
  baseURL: baseApiUrl,
});
