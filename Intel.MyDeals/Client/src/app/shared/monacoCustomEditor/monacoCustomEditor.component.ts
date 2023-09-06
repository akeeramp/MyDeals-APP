import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as monaco from 'monaco-editor';

@Component({
    selector: 'monaco-editor',
    template: `
    <div
      style="height:100%"
      #editorContainer
    ></div>
  `,
})
export class MonacoEditorComponent implements OnInit {
    @ViewChild('editorContainer', { static: true }) _editorContainer!: ElementRef;
  
    codeEditorInstance!: monaco.editor.IStandaloneDiffEditor;
    leftModel: monaco.editor.ITextModel;
    rightModel: monaco.editor.ITextModel;

    @Input() leftModelCode: string = '';
    @Input() rightModelCode: string = '';
    @Input() isSideBySide: boolean = true;

    private defaultLanguage = 'plaintext';

    private defaultOptions = {
        theme: 'vs',
        automaticLayout: true,
        colorDecorators: true,
        selectionHighlight: true,
        occurrencesHighlight: true,
        renderSideBySide: true,
    };

    constructor() { }

    private toggleSideBySide() {
        this.codeEditorInstance.updateOptions({ renderSideBySide: this.isSideBySide })
    }

    private updateEditorModels() {
        this.codeEditorInstance = monaco.editor.createDiffEditor(this._editorContainer.nativeElement, this.defaultOptions);
        this.leftModel = monaco.editor.createModel(this.leftModelCode, this.defaultLanguage);
        this.rightModel = monaco.editor.createModel(this.rightModelCode, this.defaultLanguage);
        this.codeEditorInstance.setModel({ original: this.leftModel, modified: this.rightModel });
    }

    ngOnChanges() {
        if (this.codeEditorInstance != undefined) {
            this.codeEditorInstance.dispose();
            this.updateEditorModels();
            this.toggleSideBySide();
        }
    }

    ngOnInit() {
        this.updateEditorModels();
    }

}