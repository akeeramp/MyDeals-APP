import { Component, EventEmitter, Input, Output } from "@angular/core";
import { distinct } from "@progress/kendo-data-query";
import * as _ from "underscore";

@Component({
    selector: "pct-query-builder-angular",
    templateUrl: "Client/src/app/admin/iCostProducts/directive/pct.queryBuilder.directive.html",
    styleUrls: ['Client/src/app/admin/iCostProducts/admin.iCostProducts.component.css']
})


export class pctQueryBuilderComponent {

    constructor() { }

    @Input() private group: any;
    @Input() private parent: any;
    @Input() private form: any;
    @Input() private operators: Array<any>;
    @Input() private leftValues: Array<any>;

    @Output() public saveEnable = new EventEmitter<any>();

    private conditions: Array<any> = [{ name: '=' }, { name: '<>' }, { name: 'LIKE' }];
    private attrValueList: Array<any> = [];
    private origAttrValueList: Array<any> = [];
    private attrList: Array<any> = [];
    private origAttrList: Array<any> = [];

    addCondition() {
        this.attrList = _.sortBy(distinct(this.leftValues, "ATRB_COL_NM"),"DISPLAYNAME");
        this.group.rules.push({
            condition: '=',
            criteria: '',
            data: ''
        });
        this.saveEnable.emit({ "flag": false, "isSaveEnabled": false });
    }

    addGroup() {
        this.group.rules.push({
            group: {
                operator: 'AND',
                rules: []
            }
        });
        this.saveEnable.emit({ "isSaveEnabled": true });
    }

    removeGroup() {
        this.group.isRemove = true;
        if (JSON.stringify(this.parent) != '{}') { this.deleteGroup(this.parent); }
        this.saveEnable.emit({ "isSaveEnabled": true });
    }

    deleteGroup(group) {
        group.rules.filter(data => {
            if (Object.prototype.hasOwnProperty.call(data, 'group') && data["group"]["isRemove"] == true) {
                const index = group.rules.findIndex(x => x === data);
                group.rules.splice(index, 1);
            }
            else if (Object.prototype.hasOwnProperty.call(data, 'group') && data.group.rules.length != 0) {
                this.deleteGroup(data.group);
            }
        })
    }

    removeCondition(index) {
        this.group.rules.splice(index, 1);
        this.saveEnable.emit({ "isSaveEnabled": true });
    }

    resetRightValues(rule) {
        /*On expanding dropdown, resetting attrValueList based on attribute selected on left hand side. 
         * It ensures each dropdown has value associated to it's left attribute value */
        this.getRightValues(rule);
    }

    getRightValues = function (rule) {

        this.attrValueList = this.leftValues.filter(obj => {
            if (obj.ATRB_COL_NM == rule.criteria) {
                return obj.VALUE;
            }
        });

        this.origAttrValueList = this.attrValueList = _.sortBy(this.attrValueList,"VALUE");
        
    }

    enableSaveHandler(event) {
        this.saveEnable.emit(event)
    }

    enableSave(ruleData) {
        if (ruleData) {
            this.saveEnable.emit({ "isSaveEnabled": true });
        }
        else {
            this.saveEnable.emit({ "flag": false, "isSaveEnabled": false });
        }
    }

    handleFilter(value, type) {
        if (type == "attrList") {
            this.attrList = this.origAttrList.filter(
                item => (item['DISPLAYNAME'].toLowerCase()).includes(value.toLowerCase())
            )
        }
        else if (type == "attrValueList") {
            this.attrValueList = this.origAttrValueList.filter(
                item => (item['VALUE'].toLowerCase()).includes(value.toLowerCase())
            )
        }
    }

    attrListChange(rule) {
        rule.data = '';
    }

    ngAfterViewChecked() {
        this.attrValueList = (this.attrValueList).slice(0, 20)
    }

    ngOnInit() {
        if (this.group) {
            this.origAttrList = this.attrList = distinct(this.leftValues, "ATRB_COL_NM");
            const ruleCriteria = this.group.rules.map(item => { if (item.criteria) return item.criteria }).filter(item => item != undefined)

            this.origAttrValueList = this.attrValueList = this.leftValues.filter((obj: { ATRB_COL_NM: any; VALUE: any; }) => {
                if (ruleCriteria.some(el => el === obj.ATRB_COL_NM)) {
                    return obj.VALUE;
                }
            });
        }
    }

}

