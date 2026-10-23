# Gatherly

Gatherly is a Vue 3 event discovery and management app. Event data is shared
between the public catalog, event details, organizer dashboard, and event
management page, and is persisted in the browser's LocalStorage.

## Run the project

From this directory, install dependencies and start the Vite development server:

```sh
npm install
npm run dev
```

Open the URL printed by Vite. Organizer tools are available at `/dashboard`
and `/dashboard/events`.

To build the production bundle:

```sh
npm run build
```

## Try the event lifecycle

1. Visit `/browse/events` to see the friendly empty state.
2. Open `/dashboard/events`, select **Create Event**, and publish an event.
3. Check the public catalog and `/dashboard` for the new event and updated metrics.
4. Complete or delete an event from **Active Events** and confirm the action in
   the modal.
5. Reload the page to verify that remaining events persist in LocalStorage.

Event data is stored under the `gatherly-events` LocalStorage key. Remove that
key in the browser's developer tools to restore the initial empty state.
