[ ] fix positioning for pastbl-app ("~/entrypoints/twitch.content.ts")

support `savePasta` action 
- [ ] when click on chat pasta must add own popover
- [ ] must send metadata: user.login, user.id
- [ ] buttons: `save` and `save with login in text` 

support get local pastas
- [ ] probably should use browser.storage
- [ ] may be can be solved with iframe (must allow iframe in manifest for pastbl domen)

support setting rounded button in left bottom corner
- [ ] save settings in browser.storage
- [ ] add color-picker for pastbl-rounded-button

support load other pastas, not first 15 
- [ ] must save `cursor` somewhere

support `sendPasta` ("~/utils/active-pasta-actions.ts")
- [ ] maybe can implemented only with twitch api

[ ] support pasta tags in <pastbl-pasta />

add pastas sort, filter
- [ ] like in pastbl, reuse this code, see in find-pasta and pastas-list-wrapper

[ ] make sure can work in browser-extension dir, not in pastbl, check package.json

[ ] refactor popup entrypoint, should render settings

[ ] document in readme how to install extension for chrome and firefox

[ ] update package.json version property 

[ ] support auto (system) mode for twitch page theme 
