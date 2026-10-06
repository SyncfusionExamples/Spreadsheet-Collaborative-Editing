export class SpreadsheetEditorAdapter {
  constructor(spreadsheet, serviceUrl, currentUser) {
    this.spreadsheet = spreadsheet;
    this.serviceUrl = serviceUrl.endsWith('/')
      ? serviceUrl
      : serviceUrl + '/';
    this.currentUser = currentUser;
    this.currentRoomName = '';
  }

  async loadFromServer(fileName, roomName) {
    const response = await fetch(
      this.serviceUrl + 'api/CollaborativeEditing/ImportFile',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fileName,
          roomName
        })
      }
    );

    if (!response.ok) {
      throw new Error('Failed to load the workbook.');
    }

    const data = JSON.parse(await response.text());

    this.currentRoomName = roomName;
    this.spreadsheet.collaborativeEditingModule.updateRoomInfo(
      roomName,
      data.version,
      this.serviceUrl + 'api/CollaborativeEditing/'
    );
    this.spreadsheet.collaborativeEditingModule.setLocalUser(
      this.currentUser
    );
    this.spreadsheet.openFromJson({
      file: data.sfdt
    });
  }

  sendActionToServer(action) {
    if (!action) {
      return;
    }

    this.spreadsheet.collaborativeEditingModule.sendActionToServer(
      action
    );
  }

  applyRemoteAction(action, data) {
    if (!data) {
      return;
    }

    this.spreadsheet.collaborativeEditingModule.applyRemoteAction(
      action,
      data.payload
    );
  }
}
