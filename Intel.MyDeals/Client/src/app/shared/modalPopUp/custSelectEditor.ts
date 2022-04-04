import Handsontable from 'handsontable-pro'
const {addClass} = Handsontable.dom

export class custSelectEditor extends Handsontable.editors.TextEditor {
    public TEXTAREA:any;
    public TEXTAREA_PARENT:any;
    public textareaStyle:any
    public textareaParentStyle:any
    public instance:any;
    public selectOptions:any;
    constructor(props){
        super(props);
    }
    createElements(){
        super.createElements();
        console.log('createElements*********************');
        this.TEXTAREA = document.createElement('select');
        addClass(this.TEXTAREA, 'handsontableInput');
        this.TEXTAREA.setAttribute('multiple', true);
        this.TEXTAREA_PARENT.appendChild(this.TEXTAREA);
    }
      prepare(row, col, prop, td, originalValue, cellProperties) {
          super.prepare();
       this.selectOptions=cellProperties.selectOptions
        console.log('prepare*********************');
      }
      getValue() {
        console.log('getValue*********************');
      }
      setValue() {
        console.log('setValue*********************');
      }
      open() {
        super.refreshDimensions();
        this.textareaParentStyle.display = 'block';
        for (let i=0;i<this.selectOptions;i++){
            const option=document.createElement('select');
            option.setAttribute("value",this.selectOptions[i]);
            this.TEXTAREA.appendChild(option);
        }
        console.log('open*********************');
       }
       focus() {
        console.log('focue*********************');
       }
       close() {
        console.log('close*********************');
       }

}