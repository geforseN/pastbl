import { $fetch as $fetch_ } from "ofetch";
import { isCI } from "std-env";

export const baseUrl = isCI
  ? process.env.BASE_URL || "https://pastbl.vercel.app"
  : "http://127.0.0.1:3000";

const baseApiUrl = baseUrl + "/api/v1";

export const $apiFetch = $fetch_.create({
  baseURL: baseApiUrl,
});
