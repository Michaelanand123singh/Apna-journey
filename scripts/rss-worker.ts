#!/usr/bin/env tsx

/**
 * RSS Feed Worker
 * 
 * This script runs as a background process and fetches news from RSS feeds
 * every 15 minutes. It should be run continuously using a process manager
 * like PM2, systemd, or as a Docker container.
 * 
 * Usage:
 *   npm run worker:rss
 *   or
 *   tsx scripts/rss-worker.ts
 */

import cron from 'node-cron'
import { parseAllActiveFeeds } from '../src/lib/services/rssParser'

// Load environment variables
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const INTERVAL_MINUTES = 15
const CRON_SCHEDULE = `*/${INTERVAL_MINUTES} * * * *` // Every 15 minutes

let isRunning = false

async function fetchRssFeeds() {
  // Prevent concurrent executions
  if (isRunning) {
    console.log('⏸️  RSS worker is already running, skipping this execution')
    return
  }

  isRunning = true
  const startTime = Date.now()

  try {
    console.log(`\n🔄 [${new Date().toISOString()}] Starting RSS feed fetch...`)
    
    const results = await parseAllActiveFeeds()

    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    
    console.log(`✅ RSS feed fetch completed in ${duration}s`)
    console.log(`   📊 Total feeds: ${results.totalFeeds}`)
    console.log(`   ✅ Processed: ${results.processedFeeds}`)
    console.log(`   📰 Articles created: ${results.totalCreated}`)
    console.log(`   ⏭️  Articles skipped: ${results.totalSkipped}`)
    
    if (results.errors.length > 0) {
      console.log(`   ⚠️  Errors: ${results.errors.length}`)
      results.errors.forEach(error => {
        console.log(`      - ${error}`)
      })
    }

  } catch (error: unknown) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    console.error(`❌ RSS feed fetch failed after ${duration}s:`, errorMessage)
    if (errorStack) {
      console.error(errorStack)
    }
  } finally {
    isRunning = false
  }
}

// Run immediately on startup (optional)
const RUN_ON_STARTUP = process.env.RSS_WORKER_RUN_ON_STARTUP !== 'false'

if (RUN_ON_STARTUP) {
  console.log('🚀 RSS Worker starting...')
  console.log(`⏰ Schedule: Every ${INTERVAL_MINUTES} minutes`)
  console.log(`📅 Cron: ${CRON_SCHEDULE}`)
  console.log('🔄 Running initial fetch...')
  
  fetchRssFeeds().catch(error => {
    console.error('❌ Initial RSS fetch failed:', error)
  })
} else {
  console.log('🚀 RSS Worker starting...')
  console.log(`⏰ Schedule: Every ${INTERVAL_MINUTES} minutes`)
  console.log(`📅 Cron: ${CRON_SCHEDULE}`)
  console.log('⏳ Waiting for scheduled time...')
}

// Schedule the cron job
const task = cron.schedule(CRON_SCHEDULE, () => {
  fetchRssFeeds()
}, {
  timezone: 'Asia/Kolkata' // Adjust to your timezone
})

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...')
  task.stop()
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...')
  task.stop()
  process.exit(0)
})

// Keep the process alive
console.log('✅ RSS Worker is running. Press Ctrl+C to stop.')

