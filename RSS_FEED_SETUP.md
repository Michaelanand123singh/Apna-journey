# RSS Feed System Documentation

## Overview

The RSS Feed System automatically fetches news articles from configured RSS feeds every 15 minutes and creates news articles in the system. All RSS-sourced articles are created with `pending` status and require admin approval before being published.

## Features

- ✅ Automatic RSS feed fetching every 15 minutes
- ✅ Admin panel for managing RSS feeds (add, edit, delete)
- ✅ Support for multiple categories and languages
- ✅ Duplicate detection (prevents creating duplicate articles)
- ✅ Error tracking and statistics
- ✅ Manual feed testing
- ✅ Background worker process

## Components

### 1. RSS Feed Model (`src/lib/models/RssFeed.model.ts`)
- Stores RSS feed configuration
- Tracks fetch statistics (success count, error count, last fetch time)
- Supports categories and languages

### 2. Admin API Routes (`src/app/api/admin/rss-feeds/`)
- `GET /api/admin/rss-feeds` - List all RSS feeds
- `POST /api/admin/rss-feeds` - Create new RSS feed
- `PUT /api/admin/rss-feeds` - Update RSS feed
- `GET /api/admin/rss-feeds/[id]` - Get single RSS feed
- `DELETE /api/admin/rss-feeds/[id]` - Delete RSS feed
- `POST /api/admin/rss-feeds/[id]/test` - Test RSS feed manually

### 3. RSS Parser Service (`src/lib/services/rssParser.ts`)
- Parses RSS feeds using `rss-parser`
- Extracts images, content, and metadata
- Creates news articles with proper formatting
- Handles errors gracefully

### 4. Background Worker (`scripts/rss-worker.ts`)
- Runs continuously as a background process
- Fetches all active RSS feeds every 15 minutes
- Logs progress and errors
- Handles graceful shutdown

### 5. Admin UI (`src/app/admin/rss-feeds/page.tsx`)
- List all RSS feeds with statistics
- Add, edit, and delete feeds
- Test feeds manually
- Filter by status and search

## Setup Instructions

### 1. Install Dependencies

Dependencies are already installed:
- `rss-parser` - For parsing RSS feeds
- `node-cron` - For scheduling tasks
- `@types/node-cron` - TypeScript types

### 2. Start the Background Worker

The RSS worker needs to run continuously in the background. You have several options:

#### Option A: Using npm script (Development)
```bash
npm run worker:rss
```

#### Option B: Using PM2 (Production - Recommended)
```bash
# Install PM2 globally
npm install -g pm2

# Start the worker
pm2 start npm --name "rss-worker" -- run worker:rss

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
```

#### Option C: Using systemd (Linux)
Create a service file `/etc/systemd/system/rss-worker.service`:
```ini
[Unit]
Description=RSS Feed Worker
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/apna-journey
ExecStart=/usr/bin/npm run worker:rss
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Then enable and start:
```bash
sudo systemctl enable rss-worker
sudo systemctl start rss-worker
```

#### Option D: Using Docker
Add to your `docker-compose.yml`:
```yaml
services:
  rss-worker:
    build: .
    command: npm run worker:rss
    environment:
      - MONGODB_URI=${MONGODB_URI}
      - NODE_ENV=production
    restart: unless-stopped
```

### 3. Environment Variables

Ensure these are set in your `.env.local`:
```env
MONGODB_URI=your_mongodb_connection_string
RSS_WORKER_RUN_ON_STARTUP=true  # Optional: Run fetch on worker startup
```

### 4. Access Admin Panel

1. Log in to the admin panel
2. Navigate to "RSS Feeds" in the sidebar
3. Click "Add RSS Feed" to add your first feed

## Usage Guide

### Adding an RSS Feed

1. Go to Admin Panel → RSS Feeds
2. Click "Add RSS Feed"
3. Fill in the form:
   - **Feed Name**: A descriptive name for the feed
   - **RSS Feed URL**: The full URL to the RSS feed (e.g., `https://example.com/feed.xml`)
   - **Category**: Select the news category
   - **Language**: Choose English or Hindi
   - **Active**: Check to enable automatic fetching
4. Click "Add Feed"

### Testing an RSS Feed

1. Find the feed in the list
2. Click the refresh icon (🔄) to test the feed manually
3. The system will parse the feed and show how many articles were created

### Editing an RSS Feed

1. Click the edit icon (✏️) next to the feed
2. Modify the fields as needed
3. Click "Update Feed"

### Deleting an RSS Feed

1. Click the delete icon (🗑️) next to the feed
2. Confirm the deletion

### Monitoring Feed Status

The admin panel shows:
- **Status**: Active/Inactive/Error
- **Fetch Count**: Total number of times the feed was fetched
- **Success Count**: Number of successful fetches
- **Error Count**: Number of failed fetches
- **Last Fetched**: Timestamp of last fetch attempt
- **Last Error**: Error message if last fetch failed

## How It Works

1. **Worker Process**: The background worker runs continuously
2. **Scheduled Fetch**: Every 15 minutes, the worker:
   - Finds all active RSS feeds
   - Parses each feed URL
   - Extracts articles from the feed
   - Checks for duplicates (by URL/link)
   - Creates news articles with `pending` status
   - Updates feed statistics
3. **Article Creation**: RSS articles are created with:
   - Title from feed item
   - Content extracted from feed
   - Featured image from media tags or content
   - Category and language from feed settings
   - Status set to `pending` (requires admin approval)
   - Author set to system admin
4. **Admin Approval**: Admins can review and approve RSS articles in the Content Approval section

## Troubleshooting

### Worker Not Running

1. Check if the process is running:
   ```bash
   # For PM2
   pm2 list
   
   # For systemd
   sudo systemctl status rss-worker
   ```

2. Check logs:
   ```bash
   # For PM2
   pm2 logs rss-worker
   
   # For systemd
   sudo journalctl -u rss-worker -f
   ```

### Feeds Not Fetching

1. Check if feeds are marked as "Active"
2. Check feed URLs are valid and accessible
3. Review error messages in the admin panel
4. Check worker logs for detailed error messages

### No Articles Created

1. Verify RSS feed URL is correct and accessible
2. Check if articles already exist (duplicate detection)
3. Ensure feed has valid items
4. Check worker logs for parsing errors

### Articles Created but Not Visible

- RSS articles are created with `pending` status
- Go to Content Approval section to approve them
- Or edit articles individually to change status

## Best Practices

1. **Feed Selection**: Choose reliable RSS feeds with consistent formatting
2. **Categories**: Assign appropriate categories for better organization
3. **Monitoring**: Regularly check feed status and error counts
4. **Testing**: Test feeds manually before enabling automatic fetching
5. **Approval**: Review RSS articles before publishing to ensure quality
6. **Backup**: Keep backups of important feed configurations

## Configuration

### Change Fetch Interval

Edit `scripts/rss-worker.ts`:
```typescript
const INTERVAL_MINUTES = 15  // Change this value
const CRON_SCHEDULE = `*/${INTERVAL_MINUTES} * * * *`
```

### Disable Startup Fetch

Set in `.env.local`:
```env
RSS_WORKER_RUN_ON_STARTUP=false
```

### Change Timezone

Edit `scripts/rss-worker.ts`:
```typescript
const task = cron.schedule(CRON_SCHEDULE, () => {
  fetchRssFeeds()
}, {
  timezone: 'Asia/Kolkata'  // Change to your timezone
})
```

## Security Considerations

1. RSS feeds are only accessible to authenticated admins
2. Feed URLs are validated before saving
3. RSS articles require admin approval before publishing
4. System admin account is created automatically for RSS articles
5. Worker process should run with appropriate permissions

## Support

For issues or questions:
1. Check the error logs in the admin panel
2. Review worker process logs
3. Verify RSS feed URLs are accessible
4. Ensure MongoDB connection is working
5. Check network connectivity for external RSS feeds

