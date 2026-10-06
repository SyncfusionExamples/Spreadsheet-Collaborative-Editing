# Spreadsheet Collaborative Editing

This repository demonstrates real-time collaborative editing in the Syncfusion® Spreadsheet. Multiple users can open the same workbook, edit it simultaneously, view other participants, and receive synchronized changes in real time.

The repository includes client-side samples for Angular, JavaScript, React, TypeScript, and Vue. Each client connects to a Collaboration Server through SignalR and uses Redis to maintain collaboration sessions and synchronize workbook actions.

## Features

- Real-time multi-user Spreadsheet editing
- Synchronization of supported Spreadsheet actions across connected clients
- Participant presence and selection indicators
- Unique collaboration rooms identified through the `id` URL query parameter
- SignalR-based real-time communication
- Redis-backed collaboration state management
- Client examples for Angular, JavaScript, React, TypeScript, and Vue
- Reusable collaboration adapter implementation for each platform

## Prerequisites

Before running the samples, ensure that the following software and services are available.

### Client applications

- Node.js
- npm
- A supported modern web browser

### Collaboration Server

- ASP.NET Core Collaboration Server
- Redis Server or a hosted Redis service
- A valid Syncfusion license key

## Real-time communication

The client applications connect to the Collaboration Server through SignalR. The real-time connection is used to join a collaboration room and receive actions, participant updates, and selection changes from other connected users.

Each client uses the following configuration:

```ts
const client = new CollaborationClient(adapter, {
    serviceUrl,
    connectionType: 'signalr',
    currentUser
});
```

The client and Collaboration Server must use the same transport configuration.

## Redis backing system

Redis is used by the Collaboration Server to store collaboration operations, maintain room state, and coordinate updates between connected users and server instances.

Configure the Redis connection in the Collaboration Server settings:

```json
{
  "ConnectionStrings": {
    "Redis": "YOUR_REDIS_CONNECTION_STRING"
  }
}
```

Replace `YOUR_REDIS_CONNECTION_STRING` with the connection string of the running Redis service.

## How collaborative editing works

### Client side

1. The client obtains the room ID from the `id` query parameter.
2. If the URL does not contain a room ID, the client generates one and updates the browser URL.
3. The client requests the latest synchronized workbook and room version from the Collaboration Server.
4. The Spreadsheet initializes its collaboration room, server version, service endpoint, and local user.
5. The `CollaborationClient` establishes a SignalR connection and joins the room.
6. Supported local Spreadsheet actions are sent to the Collaboration Server from the `actionComplete` event.
7. Remote actions received from other participants are applied to the Spreadsheet through the collaboration adapter.

### Server side

1. The Collaboration Server receives actions from connected clients.
2. Actions are ordered and stored using Redis.
3. The server processes the actions against the current room version.
4. The latest room and workbook state is maintained for subsequent users.
5. Processed actions are broadcast to the other clients in the same collaboration room.
6. Connected clients apply the remote actions and remain synchronized.

## Repository structure

```text
Spreadsheet-Collaborative-Editing/
|-- client/
|   |-- angular/
|   |-- javascript/
|   |-- react/
|   |-- typescript/
|   `-- vue/
|-- server/
|   `-- aspnet-core/
|-- README.md
`-- license
```

## Client samples

The following client implementations are available:

- [Angular](./client/angular)
- [JavaScript](./client/javascript)
- [React](./client/react)
- [TypeScript](./client/typescript)
- [Vue](./client/vue)

Each client folder contains its own installation instructions and platform-specific source files.

## Configure the Collaboration Server URL

Before starting a client application, replace the placeholder Collaboration Server URL in the client source code:

```ts
const serviceUrl: string = 'YOUR_COLLABORATION_SERVER_URL';
```

For JavaScript:

```js
const serviceUrl = 'YOUR_COLLABORATION_SERVER_URL';
```

Replace `YOUR_COLLABORATION_SERVER_URL` with the URL of the running Collaboration Server. For example:

```text
https://localhost:5001/
```

The adapter automatically appends a trailing slash when the configured URL does not contain one.

## Run the Collaboration Server

Navigate to the ASP.NET Core Collaboration Server folder:

```bash
cd server/aspnet-core
```

Update the Redis connection string and configure the Syncfusion license key as required by the server project.

Restore the server dependencies:

```bash
dotnet restore
```

Run the Collaboration Server:

```bash
dotnet run
```

Use the server URL displayed in the terminal as `YOUR_COLLABORATION_SERVER_URL` in the client applications.

## Run a client application

Choose one client implementation and navigate to its folder.

### Angular

```bash
cd client/angular
npm install
npm start
```

The Angular application normally runs at:

```text
http://localhost:4200/
```

### React

```bash
cd client/react
npm install
npm run dev
```

### Vue

```bash
cd client/vue
npm install
npm run dev
```

### TypeScript

```bash
cd client/typescript
npm install
npm run dev
```

### JavaScript

```bash
cd client/javascript
npm install
npm run dev
```

The Vite-based applications normally run at:

```text
http://localhost:5173/
```

Use the actual URL displayed in the terminal if a different port is selected.

## Test collaborative editing

1. Start Redis.
2. Start the Collaboration Server.
3. Start one of the client applications.
4. Open the client URL in a browser.
5. Confirm that the client adds an `id` query parameter to the URL.
6. Copy the complete URL, including the room ID.
7. Open the copied URL in another browser tab, browser window, or browser profile.
8. Edit a cell in the first client.
9. Confirm that the same change appears in the second client.
10. Make another supported change in the second client and confirm that it appears in the first client.

Example collaboration URL:

```text
http://localhost:5173/?id=sample-room
```

All users who open the same URL and connect to the same Collaboration Server join the same workbook session.

## Client-side packages

The samples use the following collaboration packages:

```text
@syncfusion/ej2-collaborator
@microsoft/signalr
```

The platform-specific Spreadsheet package is also required:

```text
@syncfusion/ej2-angular-spreadsheet
@syncfusion/ej2-react-spreadsheet
@syncfusion/ej2-vue-spreadsheet
@syncfusion/ej2-spreadsheet
```

The exact package list is available in the `package.json` file of each client sample.

## Build the client applications

For React, Vue, TypeScript, and JavaScript:

```bash
npm run build
```

For Angular:

```bash
npm run build
```

The generated production files are written to the platform's configured output directory.

## Troubleshooting

### The collaborator package cannot be resolved

Ensure that `@syncfusion/ej2-collaborator` is listed in the client `package.json`, and then run:

```bash
npm install
```

### The SignalR package cannot be resolved

Ensure that `@microsoft/signalr` is listed in the client `package.json`, and then run:

```bash
npm install
```

### The Spreadsheet is not styled correctly

Confirm that the Syncfusion theme is imported by the client application. The Vite samples use:

```css
@import '@syncfusion/ej2-tailwind3-theme/styles/tailwind3.css';
```

### The workbook does not load

Verify that:

- The Collaboration Server is running.
- The configured `serviceUrl` is correct.
- The `ImportFile` endpoint is reachable.
- The source workbook required by the server is available.
- The browser console does not contain CORS or network errors.

### Changes are not synchronized

Verify that:

- Redis is running and the configured connection string is valid.
- All clients connect to the same Collaboration Server.
- All clients use the same room ID.
- The SignalR connection is established successfully.
- The browser console does not contain connection or action-processing errors.

### The second browser opens a different workbook session

Copy and open the complete URL containing the `id` query parameter. Opening only the base URL generates a new room ID and creates a different collaboration session.

## Documentation

- [Spreadsheet collaborative editing overview](https://help.syncfusion.com/document-processing/excel/spreadsheet/javascript-es5/collaborative-editing/overview)
- [Collaboration Client](https://help.syncfusion.com/document-processing/collaborator/collaboration-client)
- [Collaboration Server](https://help.syncfusion.com/document-processing/collaborator/collaboration-server)
- [ASP.NET Core Redis Collaboration Server](https://help.syncfusion.com/document-processing/excel/spreadsheet/javascript-es5/collaborative-editing/aspnet-core-redis)

Platform-specific integration documentation:

- [Angular integration](https://help.syncfusion.com/document-processing/excel/spreadsheet/angular/collaborative-editing/integration)
- [JavaScript integration](https://help.syncfusion.com/document-processing/excel/spreadsheet/javascript-es5/collaborative-editing/integration)
- [React integration](https://help.syncfusion.com/document-processing/excel/spreadsheet/react/collaborative-editing/integration)
- [TypeScript integration](https://help.syncfusion.com/document-processing/excel/spreadsheet/typescript/collaborative-editing/integration)
- [Vue integration](https://help.syncfusion.com/document-processing/excel/spreadsheet/vue/collaborative-editing/integration)

## License

This project is licensed under the terms specified in the repository's license file.

Syncfusion® controls and services are subject to the applicable Syncfusion license terms. Refer to the Syncfusion licensing documentation before using this example in a production application.
