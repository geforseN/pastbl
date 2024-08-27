export type KeyValueSchema = {
  "app:daisyui-theme": AppTheme;
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
};
