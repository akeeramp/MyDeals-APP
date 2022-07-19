
import * as _ from "underscore";

export interface gridCol {
    title:string,
    field:string,
    hidden:boolean,
    width?:string,
    filterable?:any,
    type?:string,
    template?:string
  }

export class ProdSel_Util {

    static gridColsSuggestion:Array<gridCol>=[{
        field:'USR_INPUT',
        title:'User Entered',
        hidden:false
    },{
        field:'HIER_VAL_NM',
        title:'Product',
        hidden:false
    },{
        field:'PRD_CAT_NM',
        title:'Product Vertical',
        hidden:false
    },{
        field:'FMLY_NM',
        title:'Family Name',
        hidden:false
    },{
        field:'PRD_STRT_DTM',
        title:'Product Effective Date',
        hidden:false
    },{
        field:'CAP',
        title:'CAP Info',
        hidden:false
    },{
        field:'YCS2',
        title:'YCS2',
        hidden:false
    },{
        field:'CPU_PROCESSOR_NUMBER',
        title:'CPU Processor number',
        hidden:false
    },{
        field:'HAS_L1',
        title:'Legal Classification',
        hidden:false
    },{
        field:'MM_CUST_CUSTOMER',
        title:'MM Customer Name',
        hidden:false
    },{
        field:'FMLY_NM_MM',
        title:'EDW Family Name',
        hidden:false
    },{
        field:'EPM_NM',
        title:'EPM Name',
        hidden:false
    },{
        field:'SKU_NM',
        title:'SKU Name',
        hidden:false
    },{
        field:'NAND_FAMILY',
        title:'NAND FAMILY',
        hidden:false
    },{
        field:'CPU_CACHE',
        title:'CPU CACHE',
        hidden:false
    },{
        field:'CPU_PACKAGE',
        title:'CPU PACKAGE',
        hidden:false
    },{
        field:'CPU_WATTAGE',
        title:'CPU WATTAGE',
        hidden:false
    },{
        field:'CPU_VOLTAGE_SEGMENT',
        title:'Voltage Segment',
        hidden:false
    },{
        field:'PRICE_SEGMENT',
        title:'Price Segment',
        hidden:false
    },{
        field:'SBS_NM',
        title:'SBS Name',
        hidden:false
    }]
    static gridColProduct:Array<gridCol>=[
        {
            field: "PCSR_NBR",
            title: "Processor Number",
            width: "150px",
            hidden:false,
        },
        {
            field: "DEAL_PRD_NM",
            title: "Deal Product Name",
            template: "<a role='button' ng-if='vm.allowMMSelection(dataItem)' ng-click='vm.gridSelectItem(dataItem)'>#= DEAL_PRD_NM #</a><div ng-if='!vm.allowMMSelection(dataItem)'>#= DEAL_PRD_NM #</div>",
            width: "180px",
            filterable: { multi: true, search: true },
            hidden:false
        },
        {
            field: "GDM_FMLY_NM",
            title: "GDM Family Name",
            template: "<div kendo-tooltip k-content='dataItem.GDM_FMLY_NM'>{{dataItem.GDM_FMLY_NM}}</div>",
            width: "150px",
            filterable: { multi: true, search: true },
            hidden:false
        },
        {
            field: "MTRL_ID",
            title: "Material Id",
            width: "150px",
            filterable: { multi: true, search: true },
            hidden:false
        },
        {
            field: "PRD_STRT_DTM",
            title: "Product Start Date",
            type: "date",
            template: "#= kendo.toString(new Date(PRD_STRT_DTM), 'M/d/yyyy') #",
            width: "150px",
            hidden:false
        },
        {
            field: "PRD_END_DTM",
            title: "Product End Date",
            type: "date",
            template: "#= kendo.toString(new Date(PRD_END_DTM), 'M/d/yyyy') #",
            width: "150px",
            hidden:false
        },
        {
            field: "CAP",
            title: "CAP Info",
            template: "<op-popover ng-click='vm.openCAPBreakOut(dataItem, \"CAP\")' op-options='CAP' op-label='' op-data='vm.getPrductDetails(dataItem, \"CAP\")'>#=gridUtils.uiMoneyDatesControlWrapper(data, 'CAP', 'CAP_START', 'CAP_END')#</op-popover>",
            width: "150px",
            filterable: { multi: true, search: true },
            hidden:false
        },
        {
            field: "YCS2",
            title: "YCS2",
            width: "150px",
            template: "<op-popover ng-click='vm.openCAPBreakOut(dataItem, \"YCS2\")' op-options='YCS2' op-data='vm.getPrductDetails(dataItem, \"YCS2\")'>#= YCS2 #</op-popover>",
            filterable: { multi: true, search: true },
            hidden:false
        },
        {
            field: "CPU_PROCESSOR_NUMBER",
            title: "CPU Processor number",
            width: "150px",
            filterable: { multi: true, search: true },
            hidden:false
        },
        {
            field: "HAS_L1",
            title: "Legal Classification",
            width: "150px",
            filterable: { multi: true, search: true },
            template: "<div>{{ dataItem.HAS_L1 != 0 ? 'L1' : (dataItem.HAS_L2 != 0 ? 'L2' : 'Exempt') }}</div>",
            hidden:false
        },
        {
            field: "MM_MEDIA_CD",
            title: "Media Code",
            width: "150px",
            filterable: { multi: true, search: true },
            hidden:false
        },
        {
            field: "MM_CUST_CUSTOMER",
            title: "MM Customer Name",
            width: "150px",
            filterable: { multi: true, search: true },
            hidden:false
        },
        {
            field: "FMLY_NM_MM",
            title: "EDW Family Name",
            template: "<div kendo-tooltip k-content='dataItem.FMLY_NM_MM'>{{dataItem.FMLY_NM_MM}}</div>",
            width: "150px",
            filterable: { multi: true, search: true },
            hidden:false
        },
        {
            field: "EPM_NM",
            title: "EPM Name",
            template: "<div kendo-tooltip k-content='dataItem.EPM_NM'>{{dataItem.EPM_NM}}</div>",
            width: "180px",
            hidden:false
        },
        {
            field: "SKU_NM",
            title: "SKU Name",
            template: "<div kendo-tooltip k-content='dataItem.SKU_NM'>{{dataItem.SKU_NM}}</div>",
            width: "180px",
            filterable: { multi: true, search: true },
            hidden:false
        },
        {
            field: "NAND_FAMILY",
            title: "NAND FAMILY",
            width: "150px",
            filterable: { multi: true, search: true },
            hidden:false
        },
        {
            field: "NAND_Density",
            title: "Nand Density",
            width: "150px",
            filterable: { multi: true, search: true },
            hidden:false
        },
        {
            field: "CPU_CACHE",
            title: "CPU CACHE",
            width: "150px",
            filterable: { multi: true, search: true },
            hidden:false
        },
        {
            field: "CPU_PACKAGE",
            title: "CPU PACKAGE",
            width: "150px",
            filterable: { multi: true, search: true },
            hidden:false
        },
        {
            field: "CPU_WATTAGE",
            title: "CPU WATTAGE",
            width: "150px",
            filterable: { multi: true, search: true },
            hidden:false
        },
        {
            field: "CPU_VOLTAGE_SEGMENT",
            title: "Voltage Segment",
            width: "150px",
            filterable: { multi: true, search: true },
            hidden:false
        },
        {
            field: "PRICE_SEGMENT",
            title: "Price Segment",
            width: "150px",
            filterable: { multi: true, search: true },
            hidden:false
        },
        {
            field: "SBS_NM",
            title: "SBS Name",
            width: "150px",
            filterable: { multi: true, search: true },
            hidden:false
        },
    ]
    static sortBySelectionLevelColumn(gridResult:any, selectionLevel:number) {
        var column = "";
        switch (selectionLevel) {
            case 7007:
                column = "DEAL_PRD_NM";
                break;
            case 7008:
                column = "MTRL_ID";
                break;
            default:
                column = "PCSR_NBR";
        }
        return _.sortBy(gridResult, column);
    }
    static newItem = function () {
        return {
            'text':'Select',
            'name': 'Select',
            'path': '',
            'drillDownFilter4': '',
            'drillDownFilter5': '',
            'selected':null,
            'parentSelected':null
        }
    }
          // TODO: Move this to util.js
    static arrayContainsString(array:Array<any>, string:string) {
    var newArr = array.filter(function (el) {
        return el.toString().trim().toUpperCase() === string.toString().trim().toUpperCase();
    });
    return newArr.length > 0;
    }
    static getFormatedGeos = function (geos:any) {
        if (geos == null) { return null; }
        var isBlendedGeo = (geos.indexOf('[') > -1) ? true : false;
        if (isBlendedGeo) {
            geos = geos.replace('[', '');
            geos = geos.replace(']', '');
            geos = geos.replace(' ', '');
        }
        return geos;
    }
    static getVerticalSelection(markLevelName:any,selectedPathParts:Array<any>,productSelectionLevels:Array<any>) {
        var markLevel = selectedPathParts.length == 0 ? 'MRK_LVL1' : 'MRK_LVL2';
        var verticals = productSelectionLevels.filter((x)=> {
            return x[markLevel] == markLevelName && x['PRD_CAT_NM'] != null && x['PRD_CAT_NM'] != ""
        });
    
        verticals = _.uniq(verticals, 'PRD_CAT_NM_SID');
        if(verticals.length>0){
          return verticals;
        }
        else{
          return [{PRD_MBR_SID:null}];
        }
       
    }
    static productExists(item:any, id:any,excludeMode:boolean,excludedProducts:Array<any>,addedProducts:Array<any>,enableMultipleSelection:boolean) {
        if (excludeMode) {
            return productExists = excludedProducts.filter(function (x) {
                return x.PRD_MBR_SID == id;
            }).length > 0;
        }
    
        if (item === undefined) {
            return productExists = addedProducts.filter(function (x) {
                return x.PRD_MBR_SID == id;
            }).length > 0;
        }
        var productExists = item!=null? item.selected:false;
        if (item && !item.selected) {
            productExists = addedProducts.filter(function (x) {
                return x.PRD_MBR_SID == id;
            }).length > 0;
        } else if (enableMultipleSelection) {
            productExists = excludedProducts.filter(function (x) {
                return x.PRD_MBR_SID == id;
            }).length == 0;
        }
        return productExists;
    }
    static getVerticalsUnderMarkLevel(markLevelName:string,selectedPathParts:Array<any>,productSelectionLevels:Array<any>) {
        let markLevel = selectedPathParts.length == 0 ? 'MRK_LVL1' : 'MRK_LVL2';
        let verticals:any =null;
        verticals = productSelectionLevels.filter( (x)=> {
            return x[markLevel] == markLevelName && x['PRD_CAT_NM'] != null && x['PRD_CAT_NM'] != ""
        });
        verticals =_.uniq(verticals, 'PRD_CAT_NM');
        verticals = verticals.map((elem) =>{
            return elem.PRD_CAT_NM;
        }).join(" | ");
        return verticals;
      }
   
}