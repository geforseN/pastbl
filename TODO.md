- [ ] add issue to element-plus about notification
  - https://element-plus.org/en-US/component/notification.html#basic-usage
  - https://ui.nuxt.com/components/notification
- [ ] refactor emoteIntegrations: add TypeScript support
- [ ] update publish-pasta emit
- [ ] manually inspect .output dir

fix:

- [ ] `unknown` in coverage badge
- [ ] nickname color input lags
- [ ] <remove-pastas-list />: bad types, delete is not working, refactor
- [x] tsc warns

feat:

- [ ] add autocomplete in pasta-form textarea (suggest emotes tokens)
- [ ] ! add refresh for emotes-integrations (global and persons):
  - [ ] add refresh for persons emotes collections
- [ ] use WebShare API for published pasta
  - https://www.youtube.com/watch?v=lt77LscZcn0
  - https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API
- [x] add chrome & firefox extensions
- [ ] add 'is ascii pasta' filter
- [ ] eslint configs order
- add 'package.json'.scripts.test
  - [ ] console must ask which environments to run
  - [ ] console must ask path

  when remote pasta added must update remote pastas list

refactor:

- [ ] pastas-search by text

?: rename integrations to providers

ci:

- [ ] stop run most of actions on pull request from 'renovate' bot
- [ ] always run autofix and count-comments, other must be approved via pr ui

test:

- hovered-emote-images.e2e.spec
  - test wheel works
    - [ ] no shift + mouse wheel => vertical scroll
    - [ ] shift + mouse wheel => vertical scroll
- [ ] add screenshot testing
- [ ] login with twitch button
- [ ] add import alias plugin into vitest.config.ts files

build:
  - [ ] use rspack (fails because of @nuxtjs/i18n virtual modules)
