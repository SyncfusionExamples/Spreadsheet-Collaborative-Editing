# Spreadsheet Collaborative Editing

This repository demonstrates real-time collaborative editing in the Syncfusion® Spreadsheet. Multiple users can edit the same workbook simultaneously, and supported changes are synchronized across all users connected to the same collaboration room.

## Features

- Real-time multi-user Spreadsheet editing
- Synchronization of supported Spreadsheet actions
- Participant presence and selection indicators
- SignalR-based real-time communication
- Redis-backed collaboration state management
- Client samples for Angular, JavaScript, React, TypeScript, and Vue

## Prerequisites

- Node.js and npm
- ASP.NET Core Collaboration Server
- Redis Server or a hosted Redis service
- A valid Syncfusion license key

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

- [Angular](./client/angular)
- [JavaScript](./client/javascript)
- [React](./client/react)
- [TypeScript](./client/typescript)
- [Vue](./client/vue)

Refer to the README file inside each client folder for platform-specific installation, configuration, and run instructions.

## Collaboration Server

The Collaboration Server uses SignalR for real-time communication and Redis to maintain collaboration sessions and synchronize workbook actions.

Configure the Redis connection string in the server settings:

```json
{
  "ConnectionStrings": {
    "Redis": "YOUR_REDIS_CONNECTION_STRING"
  }
}
```

Refer to the README file inside the server folder for setup and run instructions.

## Configure the server URL

In each client sample, replace the Collaboration Server URL placeholder with the URL of the running server:

```text
YOUR_COLLABORATION_SERVER_URL
```

Users who connect to the same server and open a URL containing the same `id` query parameter join the same collaboration room.

## Test collaborative editing

1. Start Redis and the Collaboration Server.
2. Start any client sample.
3. Open the application in a browser.
4. Copy the complete URL containing the `id` query parameter.
5. Open the copied URL in another browser tab or window.
6. Edit the workbook and verify that supported changes are synchronized between both clients.

## Live demo

Explore the [Spreadsheet Collaborative Editing live demo](https://ej2.syncfusion.com/products/react/spreadsheet/collaborative-editing).

## Documentation

- [Collaborative editing overview](https://help.syncfusion.com/document-processing/excel/spreadsheet/react/collaborative-editing/overview)
- [Collaboration Client](https://help.syncfusion.com/document-processing/collaborator/collaboration-client)
- [Collaboration Server](https://help.syncfusion.com/document-processing/collaborator/collaboration-server)

## License

This project is licensed under the terms specified in the repository's license file.
