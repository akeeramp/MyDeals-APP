import { sortBy, uniq } from 'underscore';

export interface gridCol {
    title: string,
    field: string,
    hidden?: boolean,
    width?: string,
    filterable?: any,
    type?: string,
    template?: string
}

export class ProdSel_Util {

    static gridColsSuggestion(isGA): Array<gridCol> {
        return [{
            field: 'USR_INPUT',
            title: 'User Entered',
            width: "150px",
            filterable: { multi: true, search: true }
        }, {
            field: 'HIER_VAL_NM',
            title: 'Product',
            width: "150px",
            filterable: { multi: true, search: true }
        }, {
            field: 'PRD_CAT_NM',
            title: 'Product Vertical',
            width: "80px",
            filterable: { multi: true, search: true }
        }, {
            field: 'FMLY_NM',
            title: 'Family Name',
            width: "80px",
            filterable: { multi: true, search: true }
        }, {
            field: 'PRD_STRT_DTM',
            title: 'Product Effective Date',
            width: "120px"
        }, {
            field: 'CAP',
            title: 'CAP Info',
            width: "185px",
            filterable: { multi: true, search: true },
        }, {
            field: 'YCS2',
            title: 'YCS2',
            filterable: { multi: true, search: true }
        }, {
            field: 'CPU_PROCESSOR_NUMBER',
            title: 'CPU Processor number',
            width: "150px",
            filterable: { multi: true, search: true }
        }, {
            field: 'HAS_L1',
            title: 'Legal Classification',
            width: "150px",
            filterable: { multi: true, search: true },
            hidden: !isGA
        }, {
            field: 'MM_CUST_CUSTOMER',
            title: 'MM Customer Name',
            width: "150px",
            filterable: { multi: true, search: true }
        }, {
            field: 'FMLY_NM_MM',
            title: 'EDW Family Name',
            width: "150px",
            filterable: { multi: true, search: true }
        }, {
            field: 'EPM_NM',
            title: 'EPM Name',
            width: "180px"
        }, {
            field: 'SKU_NM',
            title: 'SKU Name',
            width: "180px",
            filterable: { multi: true, search: true }
        }, {
            field: 'NAND_FAMILY',
            title: 'NAND FAMILY',
            width: "150px",
            filterable: { multi: true, search: true }
        }, {
            field: 'CPU_CACHE',
            title: 'CPU CACHE',
            width: "150px",
            filterable: { multi: true, search: true }
        }, {
            field: 'CPU_PACKAGE',
            title: 'CPU PACKAGE',
            width: "150px",
            filterable: { multi: true, search: true }
        }, {
            field: 'CPU_WATTAGE',
            title: 'CPU WATTAGE',
            width: "150px",
            filterable: { multi: true, search: true }
        }, {
            field: 'CPU_VOLTAGE_SEGMENT',
            title: 'Voltage Segment',
            width: "150px",
            filterable: { multi: true, search: true }
        }, {
            field: 'PRICE_SEGMENT',
            title: 'Price Segment',
            width: "150px",
            filterable: { multi: true, search: true }
        }, {
            field: 'SBS_NM',
            title: 'SBS Name',
            width: "150px",
            filterable: { multi: true, search: true }
        }]
    }
    static gridColProduct(isGA): Array<gridCol> {
        return [
            {
                field: "PCSR_NBR",
                title: "Processor Number",
                template: "<a *ngIf='dataItem.PRD_ATRB_SID == 7006' (click)='gridSelectItem(dataItem)'>#= PCSR_NBR #</a><div *ngIf='dataItem.PRD_ATRB_SID != 7006'>#= PCSR_NBR #</div>",
                width: "150px",
                filterable: { multi: true, search: true }
            },
            {
                field: "DEAL_PRD_NM",
                title: "Deal Product Name",
                template: "<a *ngIf='allowMMSelection(dataItem)' (click)='gridSelectItem(dataItem)'>#= DEAL_PRD_NM #</a><div *ngIf='!allowMMSelection(dataItem)'>#= DEAL_PRD_NM #</div>",
                width: "180px",
                filterable: { multi: true, search: true }
            },
            {
                field: "GDM_FMLY_NM",
                title: "GDM Family Name",
                template: "<div kendo-tooltip k-content='dataItem.GDM_FMLY_NM'>{{dataItem.GDM_FMLY_NM}}</div>",
                width: "150px",
                filterable: { multi: true, search: true }
            },
            {
                field: "MTRL_ID",
                title: "Material Id",
                width: "150px",
                filterable: { multi: true, search: true }
            },
            {
                field: "PRD_STRT_DTM",
                title: "Product Start Date",
                type: "date",
                template: "#= kendo.toString(new Date(PRD_STRT_DTM), 'M/d/yyyy') #",
                width: "150px"
            },
            {
                field: "PRD_END_DTM",
                title: "Product End Date",
                type: "date",
                template: "#= kendo.toString(new Date(PRD_END_DTM), 'M/d/yyyy') #",
                width: "150px"
            },
            {
                field: "CAP",
                title: "CAP Info",
                template: "<op-popover (click)='openCAPBreakOut(dataItem, \"CAP\")' op-options='CAP' op-label='' op-data='getPrductDetails(dataItem, \"CAP\")'>#=gridUtils.uiMoneyDatesControlWrapper(data, 'CAP', 'CAP_START', 'CAP_END')#</op-popover>",
                width: "185px",
                filterable: { multi: true, search: true }
            },
            {
                field: "YCS2",
                title: "YCS2",
                width: "150px",
                template: "<op-popover (click)='openCAPBreakOut(dataItem, \"YCS2\")' op-options='YCS2' op-data='getPrductDetails(dataItem, \"YCS2\")'>#= YCS2 #</op-popover>",
                filterable: { multi: true, search: true }
            },
            {
                field: "CPU_PROCESSOR_NUMBER",
                title: "CPU Processor number",
                width: "150px",
                filterable: { multi: true, search: true }
            },
            {
                field: "HAS_L1",
                title: "Legal Classification",
                width: "150px",
                filterable: { multi: true, search: true },
                template: "<div>{{ dataItem.HAS_L1 != 0 ? 'L1' : (dataItem.HAS_L2 != 0 ? 'L2' : 'Exempt') }}</div>",
                hidden: !isGA
            },
            {
                field: "MM_MEDIA_CD",
                title: "Media Code",
                width: "150px",
                filterable: { multi: true, search: true }
            },
            {
                field: "MM_CUST_CUSTOMER",
                title: "MM Customer Name",
                width: "150px",
                filterable: { multi: true, search: true }
            },
            {
                field: "FMLY_NM_MM",
                title: "EDW Family Name",
                template: "<div kendo-tooltip k-content='dataItem.FMLY_NM_MM'>{{dataItem.FMLY_NM_MM}}</div>",
                width: "150px",
                filterable: { multi: true, search: true }
            },
            {
                field: "EPM_NM",
                title: "EPM Name",
                template: "<div kendo-tooltip k-content='dataItem.EPM_NM'>{{dataItem.EPM_NM}}</div>",
                width: "180px"
            },
            {
                field: "SKU_NM",
                title: "SKU Name",
                template: "<div kendo-tooltip k-content='dataItem.SKU_NM'>{{dataItem.SKU_NM}}</div>",
                width: "180px",
                filterable: { multi: true, search: true }
            },
            {
                field: "NAND_FAMILY",
                title: "NAND FAMILY",
                width: "150px",
                filterable: { multi: true, search: true }
            },
            {
                field: "NAND_Density",
                title: "Nand Density",
                width: "150px",
                filterable: { multi: true, search: true }
            },
            {
                field: "CPU_CACHE",
                title: "CPU CACHE",
                width: "150px",
                filterable: { multi: true, search: true }
            },
            {
                field: "CPU_PACKAGE",
                title: "CPU PACKAGE",
                width: "150px",
                filterable: { multi: true, search: true }
            },
            {
                field: "CPU_WATTAGE",
                title: "CPU WATTAGE",
                width: "150px",
                filterable: { multi: true, search: true }
            },
            {
                field: "CPU_VOLTAGE_SEGMENT",
                title: "Voltage Segment",
                width: "150px",
                filterable: { multi: true, search: true }
            },
            {
                field: "PRICE_SEGMENT",
                title: "Price Segment",
                width: "150px",
                filterable: { multi: true, search: true }
            },
            {
                field: "SBS_NM",
                title: "SBS Name",
                width: "150px",
                filterable: { multi: true, search: true }
            }
        ]
    }
    static sortBySelectionLevelColumn(gridResult: any, selectionLevel: number) {
        let column = "";
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
        return sortBy(gridResult, column);
    }
    static newItem = function () {
        return {
            'text': 'Select',
            'name': 'Select',
            'path': '',
            'drillDownFilter4': '',
            'drillDownFilter5': '',
            'selected': null,
            'parentSelected': null
        }
    }
    static arrayContainsString(array: Array<any>, string: string) {
        let newArr = array.filter(function (el) {
            return el.toString().trim().toUpperCase() === string.toString().trim().toUpperCase();
        });
        return newArr.length > 0;
    }
    static getFormatedGeos = function (geos: any) {
        if (geos == null) { return null; }
        const isBlendedGeo = (geos.indexOf('[') > -1) ? true : false;
        if (isBlendedGeo) {
            geos = geos.replace('[', '');
            geos = geos.replace(']', '');
            geos = geos.replace(' ', '');
        }
        return geos;
    }
    static getVerticalSelection(markLevelName: any, selectedPathParts: Array<any>, productSelectionLevels: Array<any>) {
        const markLevel = selectedPathParts.length == 0 ? 'MRK_LVL1' : 'MRK_LVL2';
        let verticals = productSelectionLevels.filter((x) => {
            return x[markLevel] == markLevelName && x['PRD_CAT_NM'] != null && x['PRD_CAT_NM'] != ""
        });

        verticals = uniq(verticals, 'PRD_CAT_NM_SID');
        if (verticals.length > 0) {
            return verticals;
        }
        else {
            return [{ PRD_MBR_SID: null }];
        }

    }
    static productExists(item: any, id: any, excludeMode: boolean, excludedProducts: Array<any>, addedProducts: Array<any>, enableMultipleSelection: boolean) {
        if (excludeMode) {
            return productExists = excludedProducts.filter(function (x) {
                return x.PRD_MBR_SID == id;
            }).length > 0;
        }

        if (item === undefined || item == null) {
            return productExists = addedProducts.filter(function (x) {
                return x.PRD_MBR_SID == id;
            }).length > 0;
        }
        var productExists = item != null ? item.selected : false;
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

    static getVerticalsUnderMarkLevel(markLevelName: string, selectedPathParts: Array<any>, productSelectionLevels: Array<any>) {
        const markLevel = selectedPathParts.length == 0 ? 'MRK_LVL1' : 'MRK_LVL2';
        let verticals: any = null;
        verticals = productSelectionLevels.filter((x) => {
            return x[markLevel] == markLevelName && x['PRD_CAT_NM'] != null && x['PRD_CAT_NM'] != ""
        });
        verticals = uniq(verticals, 'PRD_CAT_NM');
        verticals = verticals.map((elem) => {
            return elem.PRD_CAT_NM;
        }).join(" | ");
        return verticals;
    }

}