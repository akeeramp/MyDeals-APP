import Handsontable from 'handsontable';
import * as _ from 'underscore';

export class SelectEditor extends Handsontable.editors.SelectEditor {
  private select:HTMLSelectElement
  init() {
    super.init();
    this.select.setAttribute('multiple','true');
    console.log('init**********SelectEditor')
  } 
  getValue() {
    console.log('SelectEditor******getValue*****',this.select.getAttribute('value'));
  } 
  setValue(value) {
    console.log('SelectEditor******setValue*****',value);
    let selected = [];
    _.each(this.select.options,(item)=>{
      if(item.selected){
        selected.push(item.text);
      }
    });
   return selected.toString();
  } 
}