# Spreadsheet Collaborative Editing

This repository showcases real-time collaborative editing using the Syncfusion® Spreadsheet Editor, allowing multiple users to edit the same workbook simultaneously. The project demonstrates how to implement collaborative features across multiple frontend frameworks (Angular, React, Vue, and TypeScript) with an ASP.NET Core backend.

## Features

- Real-time collaborative editing of spreadsheets
- Support for multiple frontend frameworks:
  - Angular
  - React
  - Vue
  - TypeScript (Vanilla)
- ASP.NET Core backend with SignalR for real-time communication
- Redis integration for collaboration state management
- Spreadsheet operations synchronization across multiple clients
- Selection highlighting for other users' cursor positions

## Prerequisites

### Backend
- .NET 10.0 SDK
- Redis server (for collaboration state management)
- Syncfusion license key

### Frontend
- Node.js (v18 or later)
- npm or yarn

## Project Structure

```
├── client/
│   ├── angular/          # Angular implementation
│   ├── react/            # React implementation
│   ├── typescript/       # TypeScript/Vanilla implementation
│   └── vue/              # Vue implementation
├── server/
│   └── aspnet-core/      # ASP.NET Core backend with SignalR
└── README.md
```

## Setup

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server/aspnet-core
   ```

2. Configure your Syncfusion license:
   - Add your license key to `SyncfusionLicense.txt` file
   - Or set the `SYNCFUSION_LICENSE_KEY` environment variable

3. Configure Redis connection:
   - Update the Redis connection string in `appsettings.json`:
     ```json
     {
       "ConnectionStrings": {
         "Redis": "your_redis_connection_string"
       }
     }
     ```

4. Run the server:
   ```bash
   dotnet run
   ```
   
   The server will start on `https://localhost:5001` by default.

### Frontend Setup

Choose one of the client implementations:

#### Angular

1. Navigate to the Angular client:
   ```bash
   cd client/angular
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update the service URL in `src/components/spreadsheet-editor/spreadsheet-editor.component.ts`:
   ```typescript
   const serviceUrl: string = 'https://localhost:5001/';
   ```

4. Run the application:
   ```bash
   npm start
   ```
   
   The application will be available at `http://localhost:4200`.

#### React

1. Navigate to the React client:
   ```bash
   cd client/react
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update the service URL in `src/SpreadsheetEditorAdapter.ts`:
   ```typescript
   const serviceUrl: string = 'https://localhost:5001/';
   ```

4. Run the application:
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:5173`.

#### Vue

1. Navigate to the Vue client:
   ```bash
   cd client/vue
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update the service URL in `src/SpreadsheetEditorAdapter.ts`:
   ```typescript
   const serviceUrl: string = 'https://localhost:5001/';
   ```

4. Run the application:
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:5173`.

#### TypeScript (Vanilla)

1. Navigate to the TypeScript client:
   ```bash
   cd client/typescript
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update the service URL in `src/spreadsheet-editor-adapter.ts`:
   ```typescript
   const serviceUrl: string = 'https://localhost:5001/';
   ```

4. Run the application:
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:5173`.

## Usage

1. Start the backend server
2. Start one of the frontend clients
3. Open the application in multiple browser windows or devices
4. Each user will be assigned a unique room ID automatically
5. To collaborate in the same room, share the URL with the room ID parameter
6. All users in the same room will see real-time updates as others edit the spreadsheet

## API Endpoints

The backend provides the following API endpoints:

- `POST /api/CollaborativeEditing/ImportFile` - Import a file for collaborative editing

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project uses Syncfusion Essential JS 2 components, which are licensed under either the Syncfusion Community License Program or the Syncfusion commercial license.

Please refer to the [license](license) file for more information.

To use this product, you must agree to and abide by Syncfusion's license containing all terms and conditions, which can be found at:
https://www.syncfusion.com/content/downloads/syncfusion_license.pdf
