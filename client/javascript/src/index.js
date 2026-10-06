import {
  CollaborativeEditingHandler,
  Spreadsheet
} from '@syncfusion/ej2-spreadsheet';
import { CollaborationClient } from '@syncfusion/ej2-collaborator';
import { SpreadsheetEditorAdapter } from './spreadsheet-editor-adapter';
import './style.css';

const serviceUrl =
  ''YOUR_COLLABORATION_SERVER_URL'';
const currentUser = 'John Adams';

Spreadsheet.Inject(CollaborativeEditingHandler);

function getRoomName() {
  const currentUrl = new URL(window.location.href);
  let roomName = (
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

let adapter = null;
let collaborationClient = null;
let initialized = false;

const spreadsheet = new Spreadsheet({
  height: '550px',
  enableCollaborativeEditing: true,
  created: async () => {
    if (initialized) {
      return;
    }

    initialized = true;
    const roomName = getRoomName();
    const spreadsheetAdapter = new SpreadsheetEditorAdapter(
      spreadsheet,
      serviceUrl,
      currentUser
    );

    try {
      await spreadsheetAdapter.loadFromServer(
        'Sample',
        roomName
      );

      const client = new CollaborationClient(
        spreadsheetAdapter,
        {
          serviceUrl,
          connectionType: 'signalr',
          currentUser
        }
      );

      adapter = spreadsheetAdapter;
      collaborationClient = client;
      await client.joinRoomAsync(roomName);

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
  actionComplete: (args) => {
    adapter?.sendActionToServer(args);
  }
});

spreadsheet.appendTo('#spreadsheet');

void collaborationClient;
