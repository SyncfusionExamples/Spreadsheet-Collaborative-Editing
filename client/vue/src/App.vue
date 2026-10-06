<script setup lang="ts">
import { provide, ref } from 'vue';
import {
  SpreadsheetComponent as EjsSpreadsheet
} from '@syncfusion/ej2-vue-spreadsheet';
import {
  CollaborativeEditingHandler,
  type Spreadsheet
} from '@syncfusion/ej2-spreadsheet';
import { CollaborationClient } from '@syncfusion/ej2-collaborator';
import { SpreadsheetEditorAdapter } from './SpreadsheetEditorAdapter';

const serviceUrl: string =
  ''YOUR_COLLABORATION_SERVER_URL'';
const currentUser: string = 'John Adams';

provide('spreadsheet', [CollaborativeEditingHandler]);

const spreadsheetRef = ref<InstanceType<typeof EjsSpreadsheet> | null>(null);
let adapter: SpreadsheetEditorAdapter | null = null;
let client: CollaborationClient | null = null;
let initialized: boolean = false;

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

async function onCreated(): Promise<void> {
  const spreadsheet = spreadsheetRef.value?.ej2Instances as
    | Spreadsheet
    | undefined;

  if (!spreadsheet || initialized) {
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
}

function onActionComplete(args: unknown): void {
  adapter?.sendActionToServer(args);
}
</script>

<template>
  <ejs-spreadsheet
    ref="spreadsheetRef"
    height="550px"
    :enableCollaborativeEditing="true"
    :created="onCreated"
    :actionComplete="onActionComplete"
  />
</template>
