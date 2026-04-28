# Chat Features Completion - TODO

## Backend Tasks
- [x] Add `getUnreadCount` controller in `message.controller.js`
- [x] Add `GET /unread/count` route in `message.routes.js`
- [x] Add `getAllFarmers` controller in `farmer.controller.js`
- [x] Add `GET /list` route in `farmer.routes.js`
- [ ] Add JWT socket auth middleware in `server.js`

## Frontend Tasks
- [ ] Fix `traderAPI` duplication in `services.js`
- [ ] Add `farmerListAPI` in `services.js`
- [ ] Add `getUnreadCount` to `messageAPI` in `services.js`
- [ ] Add unread message badge in `Sidebar.jsx`
- [ ] Add unread message badge in `Navbar.jsx`
- [ ] Add "New Chat" button in `Messages.jsx`
- [ ] Handle `?userId=` URL param in `Messages.jsx`
- [ ] Fix new-user conversation list updates in `Messages.jsx`
- [ ] Create generic `UserSelectModal.jsx` component
- [ ] Update `CropDetail.jsx` "Message farmer" link with `?userId=` param

## Testing & Follow-up
- [ ] Test real-time messaging between farmer and trader
- [ ] Verify unread badges update correctly
- [ ] Test starting conversation from CropDetail

