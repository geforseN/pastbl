support chat pasta actions 
- [X] when click on chat pasta must add own popover
- [ ] fix popover position
- [ ] must send metadata: user.login, user.id
- [X] buttons: `save`, `copy` and `copy with nickname` 
- [ ] button: `save with nickname`  

support get local pastas
- [ ] probably should use browser.storage
- [ ] may be can be solved with iframe (must allow iframe in manifest for pastbl domain)

refactor:
  sendPastaInChat:
    - [ ] add loading state handling, add queue
    - [ ] show error/success message for user 

add pastas sort, filter
- [ ] like in pastbl, reuse this code, see in find-pasta and pastas-list-wrapper

[ ] make sure can work in browser-extension dir, not in pastbl, check package.json

[ ] document in readme how to install extension for chrome and firefox

[ ] update package.json version property 

[ ] support auto (system) mode for twitch page theme 
