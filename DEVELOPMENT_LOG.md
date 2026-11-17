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

### UI Consistency Pass

- Standardized page title sizing across Home, Tickets, Admin Dashboard, and Admin Ticket pages.
- Standardized subtitle spacing across major pages.
- Reorganized Admin Ticket page into clearly defined sections:
  - TICKET DETAILS
  - TICKET STATUS
  - INCIDENT EVIDENCE
  - CONVERSATION
- Converted Admin Ticket sections to use homepage-style card layouts.
- Improved mobile spacing and reduced unnecessary vertical whitespace.
- Moved away from layout spacing created with <br /> tags in favor of intentional spacing.
- Fixed conversation message composer overflow by using border-box sizing.
- Restricted incident evidence video display size for improved desktop and mobile usability.