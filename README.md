## Todo List App

A streamlined, mobile-first task tracking component built with Next.js and Supabase. Focused on reducing cognitive load through automated urgency tracking and zero-friction entry.

## Preview

![Task List Overview](./public/todo_preview.jpg)

## Why I Made This

I built this component to solve the "task anxiety" caused by over-categorized todo apps. By stripping away folders, tags, and complex metadata, it functions as a "Micro-External Brain". It prioritizes what needs to be done _now_ and provides a gentle visual nudge for upcoming deadlines, allowing for high-speed data entry on mobile devices.

## Features

- **Smart Expiration Logic**: Automatically sets a 7-day default deadline for new tasks to prevent stagnant backlogs.
- **Dynamic Urgency Countdown**: Replaces static date strings with real-time calculations (e.g., "Due Today", "3 Days Remaining") for immediate priority assessment.
- **24-Hour Retention Buffer**: Implements a "Recently Completed" section that persists for 24 hours. This allows for instant "undo" actions before permanent archival, preventing accidental touches on mobile.
- **Optimistic UI Engine**: Toggling task status or adding new entries provides instant visual feedback through local state management before syncing with Supabase for a lag-free experience.
- **Dual-Line Content Display**: Optimized for long task descriptions using CSS line-clamping, ensuring readability without increasing vertical footprint.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS (Industrial Palette: `#E5E0DC` & `#3f4a4e`)
- **Icons**: Lucide React
- **Notifications**: Sonner

## Database Setup

Run the following SQL in your Supabase Editor to initialize the singular `Todo` table:

```sql
CREATE TABLE "Todo" (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  content TEXT NOT NULL,
  due_date DATE,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optimize query performance for active tasks
CREATE INDEX idx_todo_active ON "Todo"(is_completed) WHERE is_completed = FALSE;
```
