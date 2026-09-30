# TypeScript Spreadsheet Collaborative Editing

This example demonstrates real-time collaborative editing in the Syncfusion Essential JS 2 TypeScript Spreadsheet. Multiple users can edit the same workbook, and supported actions are synchronized through the Collaboration Server.

## Prerequisites

- Node.js
- Redis Server
- ASP.NET Core Redis Collaboration Server, or access to the configured hosted Collaboration Server

## Install dependencies

```bash
npm install
```

## Configure the Collaboration Server

The Collaboration Server URL is defined in `src/index.ts`. Update `serviceUrl` when a different server endpoint is used.

## Run the application

```bash
npm run dev
```

Open the URL displayed by Vite, normally:

```text
http://localhost:5173/
```

When the page opens without an `id` query parameter, the client generates a room ID and updates the URL. Open the complete URL in another browser tab or window to join the same collaboration room.

Example:

```text
http://localhost:5173/?id=sample-room
```

## Project structure

```text
src/
|-- index.ts
|-- spreadsheet-editor-adapter.ts
`-- style.css
```

## How it works

1. `CollaborativeEditingHandler` is injected into the Spreadsheet.
2. The Spreadsheet starts with collaborative editing enabled.
3. The client obtains or generates a room ID from the URL.
4. The adapter imports the latest workbook and room version from the server.
5. `CollaborationClient` connects through SignalR and joins the room.
6. Local Spreadsheet actions are sent from `actionComplete`.
7. Remote actions are applied through `SpreadsheetEditorAdapter.applyRemoteAction`.

## Build

```bash
npm run build
```

## Important packages

- `@syncfusion/ej2-spreadsheet`
- `@syncfusion/ej2-collaborator`
- `@microsoft/signalr`
- `@syncfusion/ej2-tailwind3-theme`

## Troubleshooting

If clients do not synchronize, verify that the Collaboration Server is reachable, Redis is running, all clients use the same room ID, and the browser console has no SignalR or CORS errors.

## License

Refer to the license file in the parent repository.
