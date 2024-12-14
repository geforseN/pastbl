import type { MyTimeString } from "../../../app/utils/my-time-string";
import type { EmoteSource } from "../../emote-integrations/layers/emote-sources/utils/external";
import type { PastaShowStrategy } from "../../pastas/layers/chat-pasta/composables/usePastasShow";
import type { PastaSortStrategy } from "../../pastas/layers/chat-pasta/composables/usePastasSort";
import type { SelectedLogin } from "../../emote-integrations/layers/persons-emotes-collections/utils/get-person-login";
import type { PastasWorkMode } from "../../pastas/layers/pastas-work-mode/composables/usePastasWorkMode";
import type { AppTheme } from "../../../app/composables/useThemes";

export type KeyValueSchema = {
  "app:daisyui-theme": AppTheme;
  "app:selected-tab-key": PastasWorkMode;
  "nickname:value": string;
  "nickname:color": string;
  "pasta:oncopy": "none" | "alert" | "sound" | "alert&sound";
  "badges:count": number;
  "active-user-collection:login": SelectedLogin;
  "pasta-form-input:text": string;
  "pasta-form-input:tags": string[];
  "pasta-form-input:tag": string;
  "pasta-form:is-open": boolean;
  "remote-pasta-form-input:is-public": boolean;
  "pastas:work-mode": PastasWorkMode;
  "pasta-list:sort-strategy": PastaSortStrategy;
  "pasta-list:show-strategy": PastaShowStrategy;
  "global-emotes-integrations:checked-sources": EmoteSource[];
  "fetch-person-emotes-collection:must-select-onload": boolean;
  "emotes-integrations:refresh-interval": MyTimeString;
};
