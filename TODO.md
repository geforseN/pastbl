- [ ] refactor emoteIntegrations: add TypeScript support
- [ ] update publish-pasta emit
- [ ] manually inspect .output dir

fix:

- [ ] `unknown` in coverage badge
- [ ] nickname color input lags
- [ ] <remove-pastas-list />: bad types, delete is not working, refactor
- [x] tsc warns

feat:

- [ ] support tokens in other languages (SevenTV emote tokens can be written with non latin characters )
- [ ] add autocomplete in pasta-form textarea (suggest emotes tokens)
- [ ] ! add refresh for emotes-integrations (global and persons):
  - [ ] add refresh for persons emotes collections
- [ ] use WebShare API for published pasta
  - https://www.youtube.com/watch?v=lt77LscZcn0
  - https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API
- [ ] add 'is ascii pasta' filter
- [ ] eslint configs order
- add 'package.json'.scripts.test
  - [ ] console must ask which environments to run
  - [ ] console must ask path

  pastas:
    - [ ] delete mode: on pasta click make it red-ish and on accept delete red-ish pastas
      - can add checkboxes on pasta left side
      - can add select all  
  remote-pastas
    - [ ] must set min-width when loading remote pastas, when pastas loaded - width is fine, but a bit different from local pastas
    - [ ] when remote pasta added must update remote pastas list
    - [ ] `Sort pastas` and `Show pastas` is not implemented for remote pastas, but work for local pastas
    - [ ] implement show-tag-context-menu
    - [ ] persist selected tab: local or remote
    

refactor:
- [ ] use element-plus from PR, actions in toasts is not working
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
- [ ] add import alias plugin into vitest.config.ts files

build:
  - [ ] use rspack (fails because of @nuxtjs/i18n virtual modules)
