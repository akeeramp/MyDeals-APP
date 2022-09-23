import { Input, Component } from "@angular/core";

@Component({
    selector: 'nested-grid-directive',
    templateUrl:'Client/src/app/shared/kendo_controls/kendonestedgrid.component.html' 
})
export class nestedGridComponent  {
    
    @Input() private group: any;
    @Input() private parent: any;
    @Input() private form: any;
    @Input() private operators: any;
    @Input() private leftValues: any;
    private conditions = [
        { name: '=' },
        { name: '<>' },
        { name: 'LIKE' }
    ];
    private rightValues: Array<any> = [{ VALUE: 'Val 1' }, { VALUE: 'Val 2' }]

    addCondition() {
        this.group.rules.push({
            condition: '=',
            criteria: '',
            data: ''
        });
    }

    addGroup() {
        this.group.rules.push({
            group: {
                operator: 'AND',
                rules: []
            }
        });
    }
   
    removeGroup() {
        this.group.isRemove = true;
        if (JSON.stringify(this.parent) != '{}') { this.deleteGroup(this.parent); }
    }

    deleteGroup(group) {
        let parentGroup = Array<any>();
        parentGroup = group.rules;
        
        parentGroup.filter(data => {
            if (Object.hasOwnProperty.call(data,"group") && data["group"]["isRemove"] == true) {
                const index = parentGroup.findIndex(x => x === data);
                //let index = group.rules.indexOf(data);
                group.rules.splice(index, 1);
            }
        })
    }

    removeCondition(index) {
        this.group.rules.splice(index, 1);
    }

 }