import type {
  ICollaborationActionData,
  ICollaborationProvider
} from '@syncfusion/ej2-collaborator';
import type { Spreadsheet } from '@syncfusion/ej2-spreadsheet';

interface ImportFileResponse {
  sfdt: string;
  version: number;
}

export class SpreadsheetEditorAdapter implements ICollaborationProvider {
  public currentRoomName: string = '';

  public constructor(
    private spreadsheet: Spreadsheet,
    private serviceUrl: string,
    private currentUser: string
  ) {
    this.serviceUrl = serviceUrl.endsWith('/')
      ? serviceUrl
      : serviceUrl + '/';
  }

  public async loadFromServer(
    fileName: string,
    roomName: string
  ): Promise<void> {
    const response: Response = await fetch(
      this.serviceUrl + 'api/CollaborativeEditing/ImportFile',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fileName, roomName })
      }
    );

    if (!response.ok) {
      throw new Error('Failed to load the workbook.');
    }

    const data: ImportFileResponse = JSON.parse(
      await response.text()
    );

    this.currentRoomName = roomName;
    this.spreadsheet.collaborativeEditingModule.updateRoomInfo(
      roomName,
      data.version,
      this.serviceUrl + 'api/CollaborativeEditing/'
    );
    this.spreadsheet.collaborativeEditingModule.setLocalUser(
      this.currentUser
    );
    this.spreadsheet.openFromJson({ file: data.sfdt });
  }

  public sendActionToServer(action: unknown): void {
    if (!action) {
      return;
    }

    this.spreadsheet.collaborativeEditingModule.sendActionToServer(
      action
    );
  }

  public applyRemoteAction(
    action: string,
    data: ICollaborationActionData
  ): void {
    if (!data) {
      return;
    }

    this.spreadsheet.collaborativeEditingModule.applyRemoteAction(
      action,
      data.payload
    );
  }
}
