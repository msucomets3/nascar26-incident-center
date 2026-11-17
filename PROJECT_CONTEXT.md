# NASCAR26 Incident Center

## Purpose

The NASCAR26 Incident Center is a web-based incident reporting and steward review system for AJRabbitGaming leagues.

Drivers can submit incidents, upload evidence, communicate with stewards, receive Discord updates, and track ticket status.

Stewards can review incidents, communicate with drivers, manage ticket status, and close incidents when rulings are complete.

## Technology Stack

### Frontend
- Next.js 15
- React 18
- TypeScript

### Backend
- Next.js API Routes

### Database
- Supabase

### File Storage
- Supabase Storage

Bucket:
incident-videos

### Authentication
- Discord OAuth
- Supabase Authentication

### Hosting
- Vercel

## User Workflow

### Submit Incident

Path:
/

Driver can:
- Sign in with Discord
- Submit incident reports
- Select series
- Enter incident details
- Upload one or more videos
- Receive generated ticket code

After submission:
- Ticket stored in Supabase
- Videos stored in Supabase Storage
- Steward Discord channel notified
- Driver receives DM if linked

### View Existing Tickets

Path:
/tickets

Logged-In Users:
- View all tickets tied to Discord account

Non-Logged-In Users:
- Lookup tickets by Discord Name and Ticket Code

### Driver Conversation

Drivers can:
- Read steward messages
- Send messages
- Upload images
- Upload videos

Conversation refreshes every 5 seconds.

## Steward Workflow

### Admin Portal

Path:
/admin

Protected by:
- Discord login
- Discord role verification

### Review Ticket

Path:
/admin/ticket/[id]

Stewards can:
- Review evidence
- View attachments
- Send messages
- Change status
- Close incident

## Ticket Status Flow

New
→ Under Review
→ Decision Pending
→ Close Ticket
→ Permanently Delete

### Under Review

Driver receives:

🟡 Incident Under Review

### Decision Pending

Driver receives:

🔵 Decision Pending

Conversation becomes locked.

### Close Ticket

Driver receives:

✅ Ruling Issued

Ticket is then permanently removed.

## Ticket Closure Behavior

Close Ticket does:

1. Send Discord DM
2. Delete Storage Files
3. Delete Admin Notes
4. Delete Ticket Messages
5. Delete Ticket Videos
6. Delete Ticket

This is intentional to reduce storage costs and remain within free service limits.

## Database Tables

### tickets

Columns:
- id
- ticket_code
- discord_name
- series
- incident_against
- description
- video_url (legacy)
- status
- created_at
- additional_information
- discord_user_id
- discord_provider_id
- display_name

### ticket_messages

Columns:
- id
- ticket_id
- author_name
- author_type
- message
- attachment_urls
- created_at

### ticket_videos

Columns:
- id
- ticket_id
- video_url
- file_name
- created_at

### admin_notes

Legacy table.

Conversation replaced admin notes.

## Discord Features

### OAuth Login

Used by:
- Drivers
- Stewards

### Nickname Resolution

Order:
1. Server Nickname
2. Global Name
3. Username

### Notifications

Steward Channel:
- New Incident Submitted

Driver DMs:
- Incident Submitted
- Incident Under Review
- Decision Pending
- Ruling Issued
- Discord Linked Successfully

## Environment Variables

Required:

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY

- DISCORD_BOT_TOKEN
- DISCORD_GUILD_ID

- DISCORD_CHANNEL_ID
- DISCORD_PENALTY_CHANNEL_ID

- DISCORD_PENALTY_ADMIN_ROLE_ID

## Design Decisions

- No archive system
- Closed tickets permanently deleted
- Conversation replaced admin notes
- Storage optimized for free tiers

## Recently Completed

- Driver/steward conversation system
- Attachment support
- Discord nickname support
- Discord account linking
- Status notifications
- Admin attachment viewing
- Error handling improvements