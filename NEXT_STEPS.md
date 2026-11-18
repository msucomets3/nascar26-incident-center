# Next Steps

## High Priority

- None currently

## Medium Priority

- Review conversation attachment handling
- Continue testing status update notifications
- Continue testing Discord DM notifications
- Verify ticket cleanup after closure

## Low Priority

- Remove unused admin_notes code if no longer needed
- Remove unused check-admin-role route if no longer needed
- Review old video_url column in tickets table

## Future Ideas

- Additional ticket statuses
- Steward activity logging
- Enhanced Discord notifications
- Improved mobile styling

## Known Design Decisions

- No ticket archives
- Closed tickets permanently deleted
- Conversation system replaced admin notes
- Storage optimized for free tiers

## Last Completed

- Admin attachment viewing
- Driver attachment viewing
- Conversation system
- Discord account linking
- Discord nickname support
- Error handling improvements

## Future Investigation

- Learn Supabase Row Level Security (RLS)
- Evaluate whether ticket tables should use RLS
- Do not change current RLS settings until fully understood

## Investigate Later

- Occasionally received repeated "Discord account linked successfully" messages and DMs while testing login/admin navigation.
- Issue could not be reliably reproduced.
- LatestTicketId was not present in Local Storage when checked.
- Monitor for recurrence before making code changes.

## UI Improvements

- Continue consistency pass on app/tickets/page.tsx.
- Continue consistency pass on app/admin/page.tsx.
- Standardize card-based layouts across all major pages.
- Continue reducing unnecessary vertical scrolling on mobile devices.

- Investigate custom dropdown indicator for Ticket Status on iPhone/iOS browsers.
- Dropdown functions correctly, but iPhone browsers do not display a visible dropdown arrow.
- Could cause new stewards to think "Update Status" changes the status instead of the dropdown.

## Future Features

- Add League Announcements section to Incident Center admin portal.
- Allow one-click Discord announcements for:
  - Race Results Published
  - Updated Standings
  - Updated Playoffs
  - Penalty Reports
  - Race Preview Available

Long-Term:
- Evaluate migrating the NASCAR26 Points App into the Incident Center platform.
- Reuse existing Discord bot infrastructure.
- Reuse existing admin authentication.
- Reuse existing Vercel deployment.

## Race Results Automation

Status: LIVE

Production Endpoint:
POST /api/race-results

Test Endpoint:
POST /api/race-results?test=1

Race Control automatically:
- Routes announcements by series
- Pings the correct series role
- Attaches results images
- Posts Claude-generated write-ups

## Race Control Automation

Future Announcements:

- Race Previews
- Results Posts
- Standings Updates
- Playoff Updates
- Penalty Reports

League Racing Chat Channel:
1445436012447662163

Goal:
Expand Race Control from race-results-only posting into a universal league announcement system.

Old:
1572462976311627877

New:
1572637024861683875
