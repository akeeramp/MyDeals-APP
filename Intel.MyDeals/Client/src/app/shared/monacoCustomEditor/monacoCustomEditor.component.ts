import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { editor } from 'monaco-editor/esm/vs/editor/editor.api';

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
  
    codeEditorInstance!: editor.IStandaloneDiffEditor;
    leftModel: editor.ITextModel;
    rightModel: editor.ITextModel;

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
        this.codeEditorInstance = editor.createDiffEditor(this._editorContainer.nativeElement, this.defaultOptions);
        this.leftModel = editor.createModel(this.leftModelCode, this.defaultLanguage);
        this.rightModel = editor.createModel(this.rightModelCode, this.defaultLanguage);
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