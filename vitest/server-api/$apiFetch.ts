import { $fetch as $fetch_ } from "ofetch";
import { isCI } from "std-env";

const baseUrl
  = process.env.VITEST_SERVER_API_BASE_URL
  ?? (isCI ? "https://pastbl.vercel.app" : "http://127.0.0.1:3000");

export {
  baseUrl,
};

const baseApiUrl = baseUrl + "/api/v1";

export const $apiFetch = $fetch_.create({
  baseURL: baseApiUrl,
});
