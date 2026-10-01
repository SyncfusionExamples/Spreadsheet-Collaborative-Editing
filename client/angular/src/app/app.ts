import { Component } from '@angular/core';
import { SpreadsheetEditorComponent } from '../components/spreadsheet-editor/spreadsheet-editor.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [SpreadsheetEditorComponent],
    templateUrl: './app.html',
    styleUrl: './app.css'
})
export class App {}
