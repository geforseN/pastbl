import { fileURLToPath } from "node:url";

export default {
  "#tests": fileURLToPath(new URL(".", import.meta.url)),
  "#tests-nitro-api-fetch": fileURLToPath(new URL("server/nitro/$apiFetch", import.meta.url)),
};
