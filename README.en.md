# Todo List

[繁體中文](README.md) | **English**

A single-page task list for people who want to jot down a chore in seconds and see what is due. Drop one component into your Next.js app, and you get a phone-friendly list that counts down to each deadline.

![Task list with three open items, each showing days remaining, and a Recently Completed section below](./public/intro1.png)

- **Fast entry**: a round **+** button opens a form with just a task and a due date, which defaults to 7 days from today.
- **Deadline countdown**: each task shows days left, "due today", or days overdue instead of a raw date.
- **Undo window**: a checked task stays under Recently Completed for 24 hours, where unchecking it brings it back.
- **No lag**: checking a task updates the screen first and saves to Supabase in the background; a failed save reloads the list.

<p>
  <img src="./public/intro2.png" alt="Phone view of the task list" width="24%">
  <img src="./public/intro3.png" alt="Phone view of the Add New Task form with a date picker" width="24%">
</p>

The interface text is Traditional Chinese (for example "剩 6 天"); edit the strings in `TodoApp.jsx` to change it.

## How it works

```
Browser (TodoApp.jsx) ──► Supabase client ──► "Todo" table in your Supabase project
```

No server code and no other service: the component talks to your Supabase project directly.

## Install

Needs a Next.js app (App Router) with Tailwind CSS, and a Supabase project.

1. Install the dependencies: `npm install @supabase/supabase-js sonner lucide-react`
2. Copy `TodoApp.jsx` into your app and render it from a page, for example `app/todo/page.js` with `import TodoApp from './TodoApp'`.
3. Create `lib/supabase.js` exporting a `supabase` client, since the component imports `@/lib/supabase`. Put your project URL and anon key in `.env.local`.
4. Add sonner's `<Toaster />` to your root layout so error and success messages show.
5. In Supabase, open **SQL Editor** and run:

```sql
CREATE TABLE "Todo" (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  content TEXT NOT NULL,
  due_date DATE,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Speeds up the query for open tasks
CREATE INDEX idx_todo_active ON "Todo"(is_completed) WHERE is_completed = FALSE;
```

6. Under **Authentication → Policies**, add policies for the `Todo` table that fit who may read and write. The component uses the public anon key and has no login.

## Privacy & security

Task text and dates go from the browser to your own Supabase project and nowhere else. The component has no analytics. Because it uses the public anon key, anyone who can reach that key can do whatever your table policies allow, so set policies before deploying publicly.

## License

[MIT](LICENSE)
