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