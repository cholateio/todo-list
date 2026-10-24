# Todo List

[繁體中文](README.md) | **English**

A single-page task list for people who want to jot down a chore in seconds and see what is due. Drop one component into your Next.js app, and you get a phone-friendly list that counts down to each deadline.

![Task list with three open items, each showing days remaining, and a Recently Completed section below](./public/intro1.png)

- **Fast entry**: a round **+** button opens a form with just a task and a due date, which defaults to 7 days from today.
- **Deadline countdown**: each task shows days left, "due today", or days overdue instead of a raw date.
- **Undo window**: a checked task stays under Recently Completed for 24 hours, where unchecking it brings it back.
- **Stays on your device**: tasks are saved in the browser's `localStorage`. No account, no database, no network requests.

<p>
  <img src="./public/intro2.png" alt="Phone view of the task list" width="24%">
  <img src="./public/intro3.png" alt="Phone view of the Add New Task form with a date picker" width="24%">
</p>

The interface text is Traditional Chinese (for example "剩 6 天"); edit the strings in `TodoApp.jsx` to change it.

## How it works

```
Browser (TodoApp.jsx) ──► localStorage
```

No server code and no other service. Each browser keeps its own list: tasks do not sync between devices, and clearing the site's data deletes them.

## Install

Needs a Next.js app (App Router) with Tailwind CSS.

1. Install the icon library: `npm install lucide-react`
2. Copy `TodoApp.jsx` into your app and render it from a page, for example `app/todo/page.js` with `import TodoApp from './TodoApp'`.

## Privacy & security

Task text and dates never leave the browser: the component makes no network requests and has no analytics. Anyone using the same browser profile can see the list.

## License

[MIT](LICENSE)
