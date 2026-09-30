import {
  CollaborativeEditingHandler,
  Spreadsheet
} from '@syncfusion/ej2-spreadsheet';
import { CollaborationClient } from '@syncfusion/ej2-collaborator';
import { SpreadsheetEditorAdapter } from './spreadsheet-editor-adapter';
import './style.css';

const serviceUrl: string =
  'https://appservice-267100-e9c8cxaab6a2dfeu.centralindia-01.azurewebsites.net/';
const currentUser: string = 'John';

Spreadsheet.Inject(CollaborativeEditingHandler);

function getRoomName(): string {
  const currentUrl: URL = new URL(window.location.href);
  let roomName: string = (
    currentUrl.searchParams.get('id') || ''
  ).trim();

  if (!roomName) {
    roomName = Math.random().toString(32).slice(2);
    currentUrl.searchParams.set('id', roomName);
    window.history.replaceState(
      window.history.state,
      '',
      currentUrl.pathname + currentUrl.search + currentUrl.hash
    );
  }

  return roomName;
}

let adapter: SpreadsheetEditorAdapter | null = null;
let client: CollaborationClient | null = null;
let initialized: boolean = false;

const spreadsheet: Spreadsheet = new Spreadsheet({
  height: '550px',
  enableCollaborativeEditing: true,
  created: async (): Promise<void> => {
    if (initialized) {
      return;
    }

    initialized = true;
    const roomName: string = getRoomName();
    const spreadsheetAdapter = new SpreadsheetEditorAdapter(
      spreadsheet,
      serviceUrl,
      currentUser
    );

    try {
      await spreadsheetAdapter.loadFromServer('Sample', roomName);

      const collaborationClient = new CollaborationClient(
        spreadsheetAdapter,
        {
          serviceUrl,
          connectionType: 'signalr',
          currentUser
        }
      );

      adapter = spreadsheetAdapter;
      client = collaborationClient;
      await collaborationClient.joinRoomAsync(roomName);

      console.log(
        '[Collaborative Editing] Joined room',
        roomName
      );
    } catch (error) {
      initialized = false;
      console.error(
        '[Collaborative Editing] Failed to join the room.',
        error
      );
    }
  },
  actionComplete: (args: unknown): void => {
    adapter?.sendActionToServer(args);
  }
});

spreadsheet.appendTo('#spreadsheet');

void client;
