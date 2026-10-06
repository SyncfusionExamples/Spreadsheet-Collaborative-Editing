import { Component, ViewChild } from '@angular/core';
import {
    CollaborativeEditingHandlerService,
    SpreadsheetComponent,
    SpreadsheetModule
} from '@syncfusion/ej2-angular-spreadsheet';
import { CollaborationClient } from '@syncfusion/ej2-collaborator';
import { SpreadsheetEditorAdapter } from './spreadsheet-editor-adapter';

const serviceUrl: string =
    ''YOUR_COLLABORATION_SERVER_URL'';
const currentUser: string = 'John Adams';

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

@Component({
    selector: 'app-spreadsheet-editor',
    standalone: true,
    imports: [SpreadsheetModule],
    providers: [CollaborativeEditingHandlerService],
    templateUrl: './spreadsheet-editor.component.html',
    styleUrl: './spreadsheet-editor.component.css'
})
export class SpreadsheetEditorComponent {
    @ViewChild('spreadsheet')
    public spreadsheetObj!: SpreadsheetComponent;

    private adapter: SpreadsheetEditorAdapter | null = null;
    private client: CollaborationClient | null = null;
    private initialized: boolean = false;

    public async created(): Promise<void> {
        if (!this.spreadsheetObj || this.initialized) {
            return;
        }

        this.initialized = true;
        const roomName: string = getRoomName();
        const adapter = new SpreadsheetEditorAdapter(
            this.spreadsheetObj,
            serviceUrl,
            currentUser
        );

        try {
            await adapter.loadFromServer('Sample', roomName);

            const client = new CollaborationClient(adapter, {
                serviceUrl,
                connectionType: 'signalr',
                currentUser
            });

            this.adapter = adapter;
            this.client = client;
            await client.joinRoomAsync(roomName);

            console.log(
                '[Collaborative Editing] Joined room',
                roomName
            );
        } catch (error) {
            this.initialized = false;
            console.error(
                '[Collaborative Editing] Failed to join the room.',
                error
            );
        }
    }

    public actionComplete(args: unknown): void {
        this.adapter?.sendActionToServer(args);
    }
}
