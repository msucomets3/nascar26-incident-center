# Development Log

## November 2026

### Conversation System
- Replaced Admin Notes system with Conversation system.
- Drivers and stewards can communicate directly.
- Conversation refreshes every 5 seconds.

### Attachments
- Drivers can upload images and videos in conversations.
- Stewards can view conversation attachments.
- Ticket evidence supports multiple uploaded videos.

### Discord Integration
- Added Discord nickname lookup.
- Added Discord account linking after ticket submission.
- Added Discord DM notifications.

### Status Workflow
- New
- Under Review
- Decision Pending
- Close Ticket

### Close Ticket Behavior
- Sends ruling DM.
- Deletes uploaded files from storage.
- Deletes messages.
- Deletes ticket records.
- No archives by design.

### Error Handling
Added error handling for:
- loadMessages()
- sendMessage()
- updateStatus()
- closeTicket()

### Discord Notifications
- Removed excessive spacing in steward notifications.
- Added direct ticket review link to Discord incident notifications.