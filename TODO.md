- [ ] use consola instead of log utility function
- [ ] add issue to element-plus about notification
  - https://element-plus.org/en-US/component/notification.html#basic-usage
  - https://ui.nuxt.com/components/notification
- [ ] refactor emoteIntegrations: add TypeScript support
- [ ] update publish-pasta emit
- [ ] manually inspect .output dir

fix:

- [ ] make coverage work (update run command, add config param)
- [ ] nickname color input lags
- [ ] teleport not working twice
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
- [ ] chat-pasta-list-hints:
  - [ ] add "Showing pastas with global emotes"
- [ ] eslint configs order

docs:

- [ ] refactor README

refactor:

- [ ] pastas-search by text

?: rename integrations to providers

ci:

- comments-counts
  - [x] should generate links (https://github.com/geforseN/pastbl/blob/{hash}/{path}#L{line})
- [ ] always run autofix and count-comments, other must be approved via pr ui

test:

- hovered-emote-images.e2e.spec
  - test wheel works
    - [ ] no shift + mouse wheel => vertical scroll
    - [ ] shift + mouse wheel => vertical scroll
