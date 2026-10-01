# Angular Spreadsheet Collaborative Editing

This example demonstrates real-time collaborative editing in the Syncfusion Angular Spreadsheet. Multiple users can edit the same workbook, and supported actions are synchronized through the Collaboration Server.

## Prerequisites

- Node.js
- Redis Server
- ASP.NET Core Redis Collaboration Server, or access to the configured hosted Collaboration Server

## Install dependencies

```bash
npm install
```

## Configure the Collaboration Server

The Collaboration Server URL is defined in:

```text
src/components/spreadsheet-editor/spreadsheet-editor.component.ts
```

Update `serviceUrl` when a different Collaboration Server endpoint is used.

## Run the application

```bash
npm start
```

Open the URL displayed by Angular, normally:

```text
http://localhost:4200/
```

When the page opens without an `id` query parameter, the client generates a room ID and updates the URL. Open the complete URL in another browser tab or window to join the same collaboration room.

Example:

```text
http://localhost:4200/?id=sample-room
```

## Project structure

```text
src/
|-- app/
|   |-- app.config.ts
|   |-- app.css
|   |-- app.html
|   `-- app.ts
|-- components/
|   `-- spreadsheet-editor/
|       |-- spreadsheet-editor.component.css
|       |-- spreadsheet-editor.component.html
|       |-- spreadsheet-editor.component.ts
|       `-- spreadsheet-editor-adapter.ts
|-- index.html
|-- main.ts
`-- styles.css
```

## How it works

1. The Angular Spreadsheet starts with collaborative editing enabled.
2. The client obtains or generates a room ID from the URL.
3. The adapter imports the latest workbook and room version from the server.
4. `CollaborationClient` connects through SignalR and joins the room.
5. Local Spreadsheet actions are sent from the `actionComplete` event.
6. Remote actions are applied through `SpreadsheetEditorAdapter.applyRemoteAction`.

## Build

```bash
npm run build
```

## Important packages

- `@syncfusion/ej2-angular-spreadsheet`
- `@syncfusion/ej2-collaborator`
- `@microsoft/signalr`
- `@syncfusion/ej2-tailwind3-theme`

## Troubleshooting

If clients do not synchronize, verify that the Collaboration Server is reachable, Redis is running, all clients use the same room ID, and the browser console has no SignalR or CORS errors.

## License

Refer to the license file in the parent repository.
