import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { SelectableSettings } from "@progress/kendo-angular-treeview";
import { of } from "rxjs";

@Component({
    selector: 'app-coding-practices-leftNav',
    templateUrl: 'Client/src/app/codingPractices/shared/codingPracticesLeftNav/codingPracticesLeftNav.component.html',
    styleUrls: ['Client/src/app/codingPractices/shared/codingPracticesLeftNav/codingPracticesLeftNav.component.css'],
})
export class LeftNavComponent implements OnChanges {

    @Input() left_nav : any;
    
    @Output() selectedLink: EventEmitter<object> = new EventEmitter<object>();
    @Input() keySelected: any = '0';

    public selectedKeys: any[] = this.keySelected ? [this.keySelected] : ['0'];

    public selection: SelectableSettings = { mode: "multiple" };

    public data: any[];

    public hasChildren = (item: any) => item.items && item.items.length > 0;
    public fetchChildren = (item: any) => of(item.items);

    constructor() { }

    onSelectionChange(selectedItem:any) {
        this.selectedLink.emit(selectedItem.dataItem);
    }

    ngOnChanges(): void {
        this.data = this.left_nav;
        this.selectedKeys = this.keySelected ? [this.keySelected] : ['0'];
    }

}