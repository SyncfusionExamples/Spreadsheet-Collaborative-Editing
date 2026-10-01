import { useRef } from 'react';
import {
    CollaborativeEditingHandler,
    Inject,
    SpreadsheetComponent
} from '@syncfusion/ej2-react-spreadsheet';
import { CollaborationClient } from '@syncfusion/ej2-collaborator';
import { SpreadsheetEditorAdapter } from './SpreadsheetEditorAdapter';
import './App.css';

const serviceUrl: string =
    'https://appservice-267100-e9c8cxaab6a2dfeu.centralindia-01.azurewebsites.net/';

const currentUser: string = 'John';

function getRoomName(): string {
    const currentUrl: URL = new URL(window.location.href);

    let roomName: string = (
        currentUrl.searchParams.get('id') || ''
    ).trim();

    if (!roomName) {
        roomName = Math.random()
            .toString(32)
            .slice(2);

        currentUrl.searchParams.set(
            'id',
            roomName
        );

        window.history.replaceState(
            window.history.state,
            '',
            currentUrl.pathname +
            currentUrl.search +
            currentUrl.hash
        );
    }

    return roomName;
}

export default function App() {
    const spreadsheetRef =
        useRef<SpreadsheetComponent>(null);

    const adapterRef =
        useRef<SpreadsheetEditorAdapter | null>(null);

    const clientRef =
        useRef<CollaborationClient | null>(null);

    const initializedRef =
        useRef<boolean>(false);

    const created = async (): Promise<void> => {
        const spreadsheet = spreadsheetRef.current;

        if (!spreadsheet || initializedRef.current) {
            return;
        }

        initializedRef.current = true;

        const roomName: string = getRoomName();

        const adapter = new SpreadsheetEditorAdapter(
            spreadsheet,
            serviceUrl,
            currentUser
        );

        try {
            // Load the latest workbook and room version.
            await adapter.loadFromServer(
                'Sample',
                roomName
            );

            const client = new CollaborationClient(
                adapter,
                {
                    serviceUrl,
                    connectionType: 'signalr',
                    currentUser
                }
            );

            adapterRef.current = adapter;
            clientRef.current = client;

            // Connect to the real-time collaboration room.
            await client.joinRoomAsync(roomName);

            console.log(
                '[Collaborative Editing] Joined room',
                roomName
            );
        } catch (error) {
            initializedRef.current = false;

            console.error(
                '[Collaborative Editing] Failed to join the room.',
                error
            );
        }
    };

    const actionComplete = (args: unknown): void => {
        adapterRef.current?.sendActionToServer(args);
    };

    return (
        <SpreadsheetComponent
            ref={spreadsheetRef}
            height="550px"
            enableCollaborativeEditing={true}
            created={created}
            actionComplete={actionComplete}
        >
            <Inject
                services={[
                    CollaborativeEditingHandler
                ]}
            />
        </SpreadsheetComponent>
    );
}
