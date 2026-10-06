# React Spreadsheet Collaborative Editing

This example demonstrates real-time collaborative editing in the Syncfusion React Spreadsheet. Multiple users can edit the same workbook simultaneously, and the changes are synchronized through the Collaboration Server.

## Prerequisites

Before running the React client, ensure that the following software and services are available:

- Node.js
- Redis Server
- ASP.NET Core Redis Collaboration Server

The Collaboration Server and Redis Server must be running before starting the React application.

## Installing dependencies

Navigate to the React client folder:

```bash
cd client/react
```

Install the required dependencies:

```bash
npm install
```

The `@syncfusion/ej2-collaborator` package is listed separately because the React Spreadsheet package does not install the collaboration client automatically.

The `@microsoft/signalr` package is required by the collaboration client for SignalR communication with the ASP.NET Core Collaboration Server.

## Configuring the Collaboration Server URL

Open `src/App.tsx` and update the following URL when required:

```ts
const serviceUrl: string =
    ''YOUR_COLLABORATION_SERVER_URL'';
```

The URL must point to the running ASP.NET Core Collaboration Server.

## Running the application

Start the React development server:

```bash
npm run dev
```

Open the URL displayed by Vite. The default URL is:

```text
http://localhost:5173/
```

## Testing collaborative editing

When the application is opened without an `id` query parameter, the React client automatically generates a room name and adds it to the URL.

For example:

```text
http://localhost:5173/?id=room-name
```

Copy the complete URL and open it in another browser window or tab. Clients using the same room ID collaborate on the same workbook.

The sample uses the following participant name:

```ts
const currentUser: string = 'John Adams';
```

## How the sample works

1. The Spreadsheet is initialized with collaborative editing enabled.
2. The `CollaborativeEditingHandler` service is injected into the Spreadsheet.
3. The client obtains or generates a room name from the URL.
4. `SpreadsheetEditorAdapter.loadFromServer` imports the latest workbook and room version from the server.
5. `CollaborationClient` connects to the server using SignalR.
6. The client joins the collaboration room by calling `joinRoomAsync`.
7. Local Spreadsheet actions are sent to the server from the `actionComplete` event.
8. Remote actions received through the collaboration client are applied to the Spreadsheet.

## Theme configuration

The Syncfusion Tailwind 3 theme is imported in `src/App.css`:

```css
@import "@syncfusion/ej2-tailwind3-theme/styles/tailwind3.css";
```

The stylesheet is loaded in `src/App.tsx`:

```ts
import './App.css';
```

Do not remove the `App.css` import. Without the theme stylesheet, the Spreadsheet output will not render correctly.

## Project structure

```text
client/react/
|-- src/
|   |-- App.css
|   |-- App.tsx
|   |-- main.tsx
|   `-- SpreadsheetEditorAdapter.ts
|-- index.html
|-- package.json
|-- README.md
|-- tsconfig.app.json
|-- tsconfig.json
|-- tsconfig.node.json
`-- vite.config.ts
```

## Production build

Create a production build by running:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Troubleshooting

### The collaborator package cannot be resolved

Ensure `@syncfusion/ej2-collaborator` is present in `package.json`, and then run:

```bash
npm install
```

### The SignalR package cannot be resolved

Ensure `@microsoft/signalr` is present in `package.json`, and then run:

```bash
npm install
```

### The Spreadsheet output is not styled correctly

Confirm that `src/App.tsx` contains:

```ts
import './App.css';
```

Also confirm that `src/App.css` contains:

```css
@import "@syncfusion/ej2-tailwind3-theme/styles/tailwind3.css";
```

### Clients do not receive synchronized changes

Verify the following items:

- Redis Server is running.
- The ASP.NET Core Collaboration Server is running.
- The `serviceUrl` value points to the correct server.
- All clients use the same room ID in the URL.
- The browser console does not contain SignalR connection or CORS errors.

## License

This project is licensed under the terms provided in the repository license file.
