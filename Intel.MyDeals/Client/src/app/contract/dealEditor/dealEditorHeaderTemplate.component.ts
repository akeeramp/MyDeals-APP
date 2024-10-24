import { Component, Input, ViewEncapsulation, OnChanges } from '@angular/core';
import { each } from 'underscore';

@Component({
    selector: 'deal-editor-header',
    templateUrl: 'Client/src/app/contract/dealEditor/dealEditorHeaderTemplate.component.html',
    styleUrls: ['Client/src/app/contract/dealEditor/dealEditor.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class dealEditorHeaderTemplateComponent implements OnChanges{

    constructor() {}
    @Input() in_Field_Name: string = '';
    @Input() in_Header_Template: string = '';
    @Input() in_Title: string = '';
    @Input() grid_Result;
    @Input() in_Is_Tender_Dashboard: boolean = false;//will recieve true when DE Grid Used in Tender Dashboard Screen
    public is_Deal_Tools_Checked: boolean;
    @Input() pageCount: number;
    @Input() grid_Data: any = '';
    
    selectAllIDs(event) {
        this.is_Deal_Tools_Checked = event.target.checked;
        if (this.grid_Data && this.grid_Data.data && this.grid_Data.data.length > 0) {
            let count = this.pageCount > this.grid_Data.data.length ? this.grid_Data.data.length : this.pageCount;
            for (let i = 0; i < count; i++) {
                if (!(this.grid_Data.data[i] && this.grid_Data.data[i].SALESFORCE_ID && this.grid_Data.data[i].SALESFORCE_ID !== "" && this.grid_Data.data[i].WF_STG_CD === 'Offer'))
                    this.grid_Data.data[i]['isLinked'] = this.is_Deal_Tools_Checked;
            }
        }
        /* selecting all grid result values */
        for (let i = 0; i < this.grid_Result.length; i++) {
            this.grid_Result[i]['isLinked'] = this.is_Deal_Tools_Checked;
        }
    }
    excludeAllItems(event:any){
        each(this.grid_Result,itm=>{itm['isExclSel']=event.target.checked});
    }
    checkAllSelected() {
        let gridData = this.grid_Result.filter(item => {
            return !(item.SALESFORCE_ID !== "" && item.WF_STG_CD === 'Offer')
            
        })
        if (gridData.length == 0) {
            return false;
        }
        for (let i = 0; i < gridData.length; i++) {
            if (gridData[i].isLinked === undefined || gridData[i].isLinked === false)
                return false;
        }
        return true;
    }

    ngOnChanges() {
        this.is_Deal_Tools_Checked = this.checkAllSelected();
    }
}