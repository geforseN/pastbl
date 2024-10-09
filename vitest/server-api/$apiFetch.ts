import { $fetch as $fetch_ } from "ofetch";

export const baseUrl = "http://127.0.0.1:3000";

const baseApiUrl = baseUrl + "/api/v1";

export const $apiFetch = $fetch_.create({
  baseURL: baseApiUrl,
});
