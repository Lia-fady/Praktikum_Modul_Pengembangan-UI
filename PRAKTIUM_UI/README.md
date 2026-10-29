# Gatherly

Gatherly is a Vue 3 event discovery and management app. Event data is shared
between the public catalog, event details, organizer dashboard, and event
management page. Events and attendee registrations are persisted in the
browser's LocalStorage.

## Run the project

From this directory, install dependencies and start the Vite development server:

```sh
npm install
npm run dev
```

Open the URL printed by Vite. Organizer tools are available at `/dashboard`
and `/dashboard/events`. Attendees can browse `/browse/events`, access their
ticket wallet at `/your-events`, and open an individual receipt at
`/tickets/:id`.

To build the production bundle:

```sh
npm run build
```

## Try the event lifecycle

1. Visit `/browse/events` to see the friendly empty state.
2. Open `/dashboard/events`, select **Create Event**, and publish an event.
3. Check the public catalog and `/dashboard` for the new event and updated metrics.
4. Open an event and register with valid attendee details. Check the
   confirmation, event badge, and ticket in **Your Events**.
5. Cancel a ticket while its event is upcoming and confirm the available-seat
   count is restored.
6. Complete or delete an event from **Active Events** and confirm the action in
   the modal.
7. Reload the page to verify that events and registrations persist.

Event data is stored under `gatherly-events`; attendee tickets are stored under
`gatherly-registrations`. Clearing both keys in the browser's developer tools
restores the initial empty state. Without authentication or a backend, tickets
belong to this browser rather than a specific user account.
