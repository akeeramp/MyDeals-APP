import { countBy, each, uniq, filter, map, where, sortBy, pluck, findWhere, indexOf, findIndex, find, keys, compact, without, isEqual, union, first, reject, includes, isNumber } from 'underscore';
import Handsontable from 'handsontable';

import { StaticMomentService } from "../../shared/moment/moment.service";

import { PTE_Common_Util } from './PTE_Common_util';
import { PTE_Load_Util } from './PTE_Load_util';
import { PTE_Helper_Util } from './PTE_Helper_util';
import { PTEUtil } from './PTE.util';
import { PTE_Config_Util } from './PTE_Config_util';

export class PTE_CellChange_Util {
    constructor(hotTable: Handsontable) {
        PTE_CellChange_Util.hotTable = hotTable;
    }

    private static hotTable: Handsontable;

    private static getNextNewRowId(): number {
        const ROW_IDS: number[] = this.hotTable.getDataAtCol(0);
        const LOWEST_ID = Math.min(...ROW_IDS);

        if (ROW_IDS.length > 0 && LOWEST_ID < 0) {
            return LOWEST_ID - 1;
        } else {    // No new values have been added yet
            return -100;
        }
    }

    /* Prod selector autofill changes functions starts here */
    static returnEmptyRow(): number {
        let PTRCount = this.hotTable.countRows();
        let row = 0;
        for (let i = 0; i < PTRCount; i++) {
            //checking for the row doesnt have a DC_ID
            if (this.hotTable.getDataAtRowProp(i, 'DC_ID') == undefined || this.hotTable.getDataAtRowProp(i, 'DC_ID') == null) {
                row = i;
                break;
            }
        }
        return row;
    }

    static isAlreadyChange(selRow: number): boolean {
        const sel_DC_ID = this.hotTable.getDataAtRowProp(selRow, 'DC_ID');
        let condition = false;
        if (sel_DC_ID) {
            condition = true;
        } else {
            condition = false;
        }
        return condition;
    }

    static addUpdateRowOnchange(hotTable: Handsontable, columns: any[], row: number, cellItem: any, ROW_ID: number, updateRows: Array<any>, curPricingTable: any, contractData: any, numoftier: number, tier?: number, operation?: any) {
        //make the selected row PTR_USER_PRD empty if its not the empty row
        const cols = map(columns, col => { return { prop: col.data } });
        each(cols, (val, key) => {
            let currentString = '';
            if (val.prop == 'PTR_USER_PRD') {
                //update PTR_USER_PRD with entered value
                //this exclussivlt because for  products can be with comma seperate values
                //hotTable.setDataAtRowProp(row, 'PTR_USER_PRD', cellItem.new, 'no-edit');
                currentString = row + ',' + val.prop;
                const obj = currentString.split(',').concat(cellItem.new, 'no-edit');
                updateRows.push(obj);
            } else if (val.prop == 'DC_ID') {
                //update PTR_USER_PRD with random value if we use row index values while adding after dlete can give duplicate index
                //hotTable.setDataAtRowProp(row, val.prop, ROW_ID, 'no-edit');
                const updateDCID: [string, string, number, string] = [row.toString(), val.prop, ROW_ID, 'no-edit'];
                updateRows.push(updateDCID);
            } else if (val.prop == 'TIER_NBR') {
                //update PTR_USER_PRD with random value if we use row index values while adding after dlete can give duplicate index
                currentString = row + ',' + val.prop + ',' + tier + ',' + 'no-edit';
                updateRows.push(currentString.split(','));
            } else if (val.prop == 'STRT_VOL') {
                if (tier == 1) {
                    currentString = row + ',' + val.prop + ',' + 1 + ',' + 'no-edit';
                    updateRows.push(currentString.split(','));
                } else {
                    currentString = row + ',' + val.prop + ',' + 0 + ',' + 'no-edit';
                    updateRows.push(currentString.split(','));
                }
            } else if (val.prop == 'END_VOL') {
                if (tier == numoftier) {
                    currentString = row + ',' + val.prop + ',' + 'Unlimited' + ',' + 'no-edit';
                    updateRows.push(currentString.split(','));
                } else {
                    currentString = row + ',' + val.prop + ',' + 0 + ',' + 'no-edit';
                    updateRows.push(currentString.split(','));
                }
            } else if (val.prop == 'RATE') {
                currentString = row + ',' + val.prop + ',' + 0 + ',' + 'no-edit';
                updateRows.push(currentString.split(','));
            } else if (val.prop == 'STRT_REV') {
                if (tier == 1) {
                    currentString = row + ',' + val.prop + ',' + 0.01 + ',' + 'no-edit';
                    updateRows.push(currentString.split(','));
                } else {
                    currentString = row + ',' + val.prop + ',' + 0 + ',' + 'no-edit';
                    updateRows.push(currentString.split(','));
                }
            } else if (val.prop == 'END_REV') {
                if (tier == numoftier) {
                    currentString = row + ',' + val.prop + ',' + 9999999999.99 + ',' + 'no-edit';
                    updateRows.push(currentString.split(','));
                } else {
                    currentString = row + ',' + val.prop + ',' + 0 + ',' + 'no-edit';
                    updateRows.push(currentString.split(','));
                }
            } else if (val.prop == 'INCENTIVE_RATE') {
                currentString = row + ',' + val.prop + ',' + 0 + ',' + 'no-edit';
                updateRows.push(currentString.split(','));
            } else {
                this.addUpdateRowOnchangeCommon(row, val, updateRows, curPricingTable, contractData, null, operation, cellItem);
            }
        });
    }

    static addUpdateRowOnchangeCommon(row: number, val: any, updateRows: Array<any>, curPricingTable: any, contractData: any, rowData?: any, operation?: any, cellItem?: any) {
        //make the selected row PTR_USER_PRD empty if its not the empty row
        let currentString = '';
        //rowdata scenario is for KIT and except kit rebate we can assign all other values
        if (rowData) {
            //this logic is to add PTR_SYS_PRD in case of produc selector and corrector
            if (val.prop == 'PTR_SYS_PRD' || val.prop == 'PRD_EXCLDS') {
                if (operation && operation.operation && operation.PRD_EXCLDS) {
                    currentString = row + ',' + val.prop;
                    const obj = currentString.split(',').concat(operation.PRD_EXCLDS, 'no-edit');
                    updateRows.push(obj);
                }

                if (operation && operation.operation && operation.PTR_SYS_PRD) {                   
                    currentString = row + ',' + val.prop;
                    const obj = currentString.split(',').concat(operation.PTR_SYS_PRD, 'no-edit');
                    updateRows.push(obj);
                } else {
                    this.hotTable.setDataAtRowProp(row, val.prop, rowData[`${val.prop}`], 'no-edit');                    
                }
            } else {
                //the condition in this logic is to avoid server side issue when sending data as null
                this.hotTable.setDataAtRowProp(row, val.prop, (rowData[`${val.prop}`]==null) ? '' : rowData[`${val.prop}`], 'no-edit');                
            }
        } else {
            if (val.prop == 'PTR_SYS_PRD') {
                if (operation && operation.operation && operation.PTR_SYS_PRD) {
                    currentString = row + ',' + val.prop;
                    let obj = currentString.split(',').concat(operation.PTR_SYS_PRD, 'no-edit');
                    updateRows.push(obj);

                } else {
                    currentString = row + ',' + val.prop + ',' + '' + ',' + 'no-edit';
                    updateRows.push(currentString.split(','));
                }
            } else if (val.prop == 'PRD_EXCLDS') {
                if (operation && operation.operation && operation.PRD_EXCLDS) {
                    currentString = row + ',' + val.prop;
                    let obj = currentString.split(',').concat(operation.PRD_EXCLDS, 'no-edit');
                    updateRows.push(obj);
                } else {
                    currentString = row + ',' + val.prop + ',' + '' + ',' + 'no-edit';
                    updateRows.push(currentString.split(','));
                }
            } else if (val.prop == 'SETTLEMENT_PARTNER') {
                let updateData = [];
                updateData.push(row);
                updateData.push(val.prop);
                //update PTR_USER_PRD with random value if we use row index values while adding after delete can give duplicate index
                if ((curPricingTable[`AR_SETTLEMENT_LVL`] && curPricingTable[`AR_SETTLEMENT_LVL`].toLowerCase() == 'cash')
                    || (contractData.IS_TENDER == "1" && contractData.Customer.DFLT_TNDR_AR_SETL_LVL.toLowerCase() == 'cash')) {
                    updateData.push(contractData.Customer.DFLT_SETTLEMENT_PARTNER);
                } else {
                    updateData.push('');
                }
                updateData.push('no-edit');
                updateRows.push(updateData);
                if ((curPricingTable[`AR_SETTLEMENT_LVL`] && curPricingTable[`AR_SETTLEMENT_LVL`].toLowerCase() != 'cash')){
                let colSPIdx = findWhere(this.hotTable.getCellMetaAtRow(row), { prop: 'SETTLEMENT_PARTNER' }).col;
                    this.hotTable.setCellMeta(row, colSPIdx, 'className', 'readonly-cell');
                    this.hotTable.setCellMeta(row, colSPIdx, 'editor', false);                    
                    this.hotTable.render();
                }

            } else if (val.prop == 'START_DT') {
                //update PTR_USER_PRD with random value if we use row index values while adding after delete can give duplicate index
                currentString = PTE_CellChange_Util.generateUpdateRowString(row, val.prop, StaticMomentService.moment(contractData.START_DT).format("MM/DD/YYYY"), 'no-edit');
                updateRows.push(currentString.split(','));
            } else if (val.prop == 'END_DT') {
                //update PTR_USER_PRD with random value if we use row index values while adding after delete can give duplicate index
                currentString = PTE_CellChange_Util.generateUpdateRowString(row, val.prop, StaticMomentService.moment(contractData.END_DT).format("MM/DD/YYYY"), 'no-edit');
                updateRows.push(currentString.split(','));
            } else if (val.prop == 'RESET_VOLS_ON_PERIOD') {
                if (curPricingTable.OBJ_SET_TYPE_CD && curPricingTable.OBJ_SET_TYPE_CD == 'ECAP' && curPricingTable.PROGRAM_PAYMENT == 'Frontend YCS2') {
                    //making as empty only if program payment is Frontend YCS2
                    currentString = PTE_CellChange_Util.generateUpdateRowString(row, val.prop, '', 'no-edit');
                } else {
                    //update PTR_USER_PRD with random value if we use row index values while adding after delete can give duplicate index
                    currentString = PTE_CellChange_Util.generateUpdateRowString(row, val.prop, 'No', 'no-edit');
                }
                updateRows.push(currentString.split(','));
            } else if (val.prop == 'CUST_ACCNT_DIV') {
                currentString = PTE_CellChange_Util.generateUpdateRowString(row, val.prop, contractData.CUST_ACCNT_DIV, 'no-edit');
                updateRows.push(currentString.split(','));
            } else if (val.prop == 'AR_SETTLEMENT_LVL' && contractData.IS_TENDER == "1") {
                currentString = PTE_CellChange_Util.generateUpdateRowString(row, val.prop, contractData.Customer.DFLT_TNDR_AR_SETL_LVL, 'no-edit');
                updateRows.push(currentString.split(','));
            } else if (val.prop == 'TOTAL_DOLLAR_AMOUNT' && (curPricingTable.OBJ_SET_TYPE_CD == 'PROGRAM' || curPricingTable.OBJ_SET_TYPE_CD == 'LUMP_SUM')) {
                currentString = PTE_CellChange_Util.generateUpdateRowString(row, val.prop, '0.00', 'no-edit');
                updateRows.push(currentString.split(','));
            } else if (val.prop == 'ADJ_ECAP_UNIT' && (curPricingTable.OBJ_SET_TYPE_CD == 'PROGRAM' || curPricingTable.OBJ_SET_TYPE_CD == 'LUMP_SUM')) {
                currentString = PTE_CellChange_Util.generateUpdateRowString(row, val.prop, '0', 'no-edit');
                updateRows.push(currentString.split(','));
            } else if (val.prop == 'MRKT_SEG') {
                let cellVal = curPricingTable[`${val.prop}`] ? curPricingTable[`${val.prop}`] : '';
                //this.hotTable.setDataAtRowProp(row, val.prop, cellVal, 'no-edit');
                currentString = row + ',' + val.prop;
                let obj = currentString.split(',').concat(cellVal, 'no-edit');
                updateRows.push(obj);
            } else if (val.prop == 'GEO_COMBINED') {
                let cellVal = curPricingTable[`${val.prop}`] ? curPricingTable[`${val.prop}`] : '';
                //this.hotTable.setDataAtRowProp(row, val.prop, cellVal, 'no-edit');
                currentString = row + ',' + val.prop;
                let obj = currentString.split(',').concat(cellVal, 'no-edit');
                updateRows.push(obj);
            } else if (val.prop == 'ECAP_PRICE') {
                let ecapPrice = this.hotTable.getDataAtRowProp(row, 'ECAP_PRICE');
                if (ecapPrice == null || ecapPrice == '')
                    // this.hotTable.setDataAtRowProp(row, val.prop, '0.00', 'no-edit');
                    currentString = row + ',' + val.prop + ',' + '0.00' + ',' + 'no-edit';
                updateRows.push(currentString.split(','));
            } else if (val.prop == 'CAP') {
                let cellVal = PTE_CellChange_Util.getValueForCurrentRow(updateRows, operation, row, val.prop, cellItem);
                currentString = PTE_CellChange_Util.generateUpdateRowString(row, val.prop, cellVal, 'no-edit');
                updateRows.push(currentString.split(','));
            } else if (val.prop == 'YCS2') {
                let cellVal = PTE_CellChange_Util.getValueForCurrentRow(updateRows, operation, row, val.prop, cellItem);
                currentString = PTE_CellChange_Util.generateUpdateRowString(row, val.prop, cellVal, 'no-edit');
                updateRows.push(currentString.split(','));
            } 
            else if (val.prop == 'REBATE_OA_MAX_AMT' && curPricingTable.OBJ_SET_TYPE_CD == "FLEX" && curPricingTable.FLEX_ROW_TYPE == "Draining") {
                    let colSPIdx = findWhere(this.hotTable.getCellMetaAtRow(row), { prop: 'REBATE_OA_MAX_AMT' }).col;
                    this.hotTable.setCellMeta(row, colSPIdx, 'className', 'readonly-cell');
                    this.hotTable.setCellMeta(row, colSPIdx, 'editor', false);                    
                    this.hotTable.render();
            }
            else {
                if (val.prop) {
                    //this will be autofill defaults value 
                    let cellVal = curPricingTable[`${val.prop}`] ? curPricingTable[`${val.prop}`] : '';
                    currentString = PTE_CellChange_Util.generateUpdateRowString(row, val.prop, cellVal, 'no-edit');
                    updateRows.push(currentString.split(','));
                }
            }
        }
    }

    private static getValueForCurrentRow(updateRows: Array<any>, operation, row, key, cellItem) {
        // Since `addUpdateRowOnchangeKIT()` runs before `addUpdateRowOnchangeCommon()`, the variable `PRD_BCKT` in `updateRows` will always be avaliable
        let cellVal = '';

        if (operation && operation.operation && operation.PTR_SYS_PRD) {
            // Only select data for current row
            let currentRow_PRD_BCKT = '';

            for (const key in updateRows) {
                if (updateRows[key][0] == row) {
                    if (updateRows[key][1] == 'PRD_BCKT') {
                        currentRow_PRD_BCKT = updateRows[key][2];
                    }
                }
            }

            if (currentRow_PRD_BCKT.length > 1) {
                cellVal = JSON.parse(operation['PTR_SYS_PRD'])[currentRow_PRD_BCKT][0][key];
            } else {
                cellVal = JSON.parse(operation['PTR_SYS_PRD'])[cellItem.new][0][key];
            }
        }

        return cellVal;
    }

    private static generateUpdateRowString(row, property, cellValue, editConfig): string {
        return (row + ',' + property + ',' + cellValue + ',' + editConfig);
    }

    static getMergeCellsOnEdit(empRow: number, NUM_OF_TIERS: number, pricingTableTemplates: any) {
        let mergCells: any = null;
        //identify distinct DCID, bcz the merge will happen for each DCID and each DCID can have diff  NUM_OF_TIERS
        //get NUM_OF_TIERS acoording this will be the row_span for handson
        mergCells = this.hotTable.getSettings().mergeCells;
        //incase of copy paste if there were already some merge cells clean it fully
        if (pricingTableTemplates.name == "KIT") {
            mergCells = reject(mergCells, { row: empRow });
        }
        each(pricingTableTemplates.columns, (colItem, ind) => {
            //dont merge if rowspan and colspan is 1
            if (!colItem.isDimKey && !colItem.hidden && NUM_OF_TIERS != 1) {
                mergCells.push({ row: empRow, col: ind, rowspan: NUM_OF_TIERS, colspan: 1 });
            }
        });
        // this.hotTable.updateSettings({ mergeCells: mergCells });
        return mergCells;
    }

    static addUpdateRowOnchangeKIT(hotTable: Handsontable, columns: any[], row: number, cellItem: any, ROW_ID: number, updateRows: Array<any>, curPricingTable: any, contractData: any, product: number, rowData?: any, operation?: any) {
        //make the selected row PTR_USER_PRD empty if its not the empty row
        let cols = map(columns, col => { return { prop: col.data } });
        each(cols, (val, key) => {
            let currentString = '';
            if (val.prop == 'PTR_USER_PRD') {
                currentString = row + ',' + val.prop;
                const obj = currentString.split(',').concat(cellItem.new, 'no-edit');
                updateRows.push(obj);
            } else if (val.prop == 'DC_ID') {
                let updateDCID: [string, string, number, string] = [row.toString(), val.prop, ROW_ID, 'no-edit'];
                updateRows.push(updateDCID);
            } else if (val.prop == 'PRD_BCKT') {
                //update PTR_USER_PRD with random value if we use row index values while adding after delete can give duplicate index
                currentString = row + ',' + val.prop + ',' + product + ',' + 'no-edit';
                updateRows.push(currentString.split(','));
            } else if (val.prop == 'QTY' && (rowData==null || rowData==undefined || rowData.PRD_BCKT !== product)) {
                //update PTR_USER_PRD with random value if we use row index values while adding after delete can give duplicate index
                currentString = row + ',' + val.prop + ',' + '1' + ',' + 'no-edit';
                updateRows.push(currentString.split(','));
            } else if ((val.prop == 'ECAP_PRICE' || val.prop == 'DSCNT_PER_LN' || val.prop == 'TEMP_TOTAL_DSCNT_PER_LN')) {
                // update ecap price to 0 if user edits/copy & paste the products in existing rows
                currentString = row + ',' + val.prop + ',' + '0' + ',' + 'no-edit';
                updateRows.push(currentString.split(','));
            } else if ((val.prop == 'ECAP_PRICE_____20_____1' || val.prop == 'TEMP_KIT_REBATE') && rowData == null) {
                currentString = row + ',' + val.prop + ',' + '0' + ',' + 'no-edit';
                updateRows.push(currentString.split(','));
            } else if (val.prop == 'PTR_SYS_INVLD_PRD'){
                currentString = row + ',' + val.prop + ',' + '' + ',' + 'no-edit';
                updateRows.push(currentString.split(','));
            } else {
                this.addUpdateRowOnchangeCommon(row, val, updateRows, curPricingTable, contractData, rowData, operation, cellItem);
            }
        });
    }

    static getMergeCellsOnEditKit(isExist: boolean, empRow: number, prodLen: number, pricingTableTemplates: any, itrObj?: any): any {
        let mergCells: any = null;
        if (!isExist) {
            mergCells = this.hotTable.getSettings().mergeCells;
            each(pricingTableTemplates.columns, (colItem, ind) => {
                //dont merge if rowspan and colspan is 1
                if (!colItem.isDimKey && !colItem.hidden && prodLen != 1) {
                    mergCells.push({ row: empRow, col: ind, rowspan: prodLen, colspan: 1 });
                }
            });

            if (mergCells && mergCells.length > 0) {
                this.hotTable.updateSettings({ mergeCells: mergCells });
            }
        } else {
            //for existing rows its only updting the row span
            mergCells = [];
            each(itrObj, item => {
                each(pricingTableTemplates.columns, (colItem, ind) => {
                    //dont merge if rowspan and colspan is 1
                    if (!colItem.isDimKey && !colItem.hidden && item.leng != 1) {
                        mergCells.push({ row: item.indx, col: ind, rowspan: item.leng, colspan: 1 });
                    }
                });
            });

            if (mergCells && mergCells.length > 0) {
                this.hotTable.updateSettings({ mergeCells: mergCells });
            }
        } 
    }

    static autoFillCellonProdKit(items: Array<any>, curPricingTable: any, contractData: any, pricingTableTemplates: any, columns: any[], operation?: any) {
        
        if (items && items.length == 1) {
            let updateRows = [];
            const selrow = items[0].row;
            items[0].new=  items[0].new.toString().replace(/,(\s+)?$/, '');
            //to identify the uniq records
            let prods = uniq(items[0].new.split(',').filter(function (str) {
                return /\S/.test(str);
            }));
            items[0].new = prods.toString();
            if (!this.isAlreadyChange(selrow)) {
                //identify the empty row and add it there
                let empRow = this.returnEmptyRow();
                const ROW_ID = this.getNextNewRowId();
                this.hotTable.alter('remove_row', selrow, 1, 'no-edit');
                //this line of code is only for KIT incase of success product
                if (operation && operation.operation) {
                    let PTR_col_ind = findIndex(columns, { data: 'PTR_USER_PRD' });
                    this.hotTable.setCellMeta(empRow, PTR_col_ind, 'className', 'success-product');
                }
                //based on the number of products listed we have to iterate the 
                let prodIndex = 0;
                //KIT Deal will not allow more than 10 rows
                let prdlen = prods.length > 10 ? PTE_Config_Util.maxKITproducts : prods.length;
                for (let i = empRow; i < prdlen + empRow; i++) {
                    this.addUpdateRowOnchangeKIT(this.hotTable, columns, i, items[0], ROW_ID, updateRows, curPricingTable, contractData, prods[prodIndex], null, operation);
                    prodIndex++;
                }
                //calling the merge cells option based of number of products
                this.getMergeCellsOnEditKit(false, empRow, prdlen, pricingTableTemplates);
            } else {
                if (items[0].old != items[0].new) {
                    //get the DC_ID of selected row
                    let ROW_ID = this.hotTable.getDataAtRowProp(selrow, 'DC_ID');
                    //the row can be insert or delete to get that we are removing and adding the rows
                    let DataOfRow = filter(PTE_Common_Util.getPTEGenerate(columns, curPricingTable), itm => { return itm.DC_ID == ROW_ID });
                    updateRows=  this.kitexistingItemsUpdate(items, curPricingTable, contractData, pricingTableTemplates, columns, operation);

                    //logic to calculate rebate price on product change in KIT and assign to DataROw so that it will assign in addUpdateRowOnchangeKIT
                    DataOfRow[0]['TEMP_KIT_REBATE'] = this.kitEcapChangeOnProd(items[0], DataOfRow.slice(0, items[0].new.split(',').length));
                    let PTR = PTE_Common_Util.getPTEGenerate(columns, curPricingTable);
                    let DCIDS = pluck(PTR, 'DC_ID');
                    let countOfDCID = countBy(pluck(PTR, 'DC_ID'))
                    let iterObj = [];
                    //calling the merge cells options numb of products ans setting mergcells to null first since we are doing all togather
                    each(uniq(DCIDS), DCID => {
                        if (DCID && DCID != '') {
                            iterObj.push({ DCID: DCID, leng: countOfDCID[`${DCID}`], indx: indexOf(DCIDS, DCID) })
                        }
                    });
                    this.getMergeCellsOnEditKit(true, 1, 1, pricingTableTemplates, iterObj);
                }
            }

            if (updateRows && updateRows.length > 0) {
                //appending everything together batch function will improve the performace
                this.hotTable.batch(() => {
                    this.hotTable.setDataAtRowProp(updateRows, 'no-edit');
                });
            }
        }
        //in case of copy paste or autofill
        else {
            let updateitems = [];
            let iterObj = [];
            //first we need to make sure the changes are existing or newly added appending DC_ID for existing records this will hep with product slector logic
            each(items, (itm) => {
                itm['DC_ID'] = this.hotTable.getDataAtRowProp(itm.row, 'DC_ID');
            })
            //this logic for when we copy paste in existing rows
            let existItems = filter(items, (itm) => { return (itm.DC_ID != null || itm.DC_ID != undefined) });
            each(existItems, (itm, idx) => {
                let updateditems=[];
                if (idx == 0) {
                    updateditems= this.kitexistingItemsUpdate([itm], curPricingTable, contractData, pricingTableTemplates, columns, operation);
                    items = reject(items, { DC_ID: itm.DC_ID });
                }
                else {
                    //here onwrds the index get change so we need to make sure its in the right index
                    let PTR = PTE_Common_Util.getPTEGenerate(columns, curPricingTable);
                    itm.row = findIndex(PTR, { DC_ID: itm.DC_ID })
                    updateditems=  this.kitexistingItemsUpdate([itm], curPricingTable, contractData, pricingTableTemplates, columns, operation);
                    items = reject(items, { DC_ID: itm.DC_ID });
                }
                updateitems= updateitems.concat(updateditems);
            })
            //only modify if we have new data to paste
            if (items && items.length > 0) {
                //identify the empty row and the next empty row will be the consecutive one
                let empRow = this.returnEmptyRow();
                //after checking any existing modification when comes to copy  we need to reassign index of all items
                each(items, (itm, idx) => {
                    itm.row = empRow + idx;
                })
                //for length greater than 1 it will either copy or autofill so first cleaning those records since its prod the length can be predicted so deleting full
                this.hotTable.alter('remove_row', items[0].row, PTE_Config_Util.girdMaxRows, 'no-edit');
                let ROW_ID = this.getNextNewRowId();
                each(items, (cellItem) => {
                    //let ROW_ID = this.rowDCID();
                    cellItem.new= cellItem.new.toString().replace(/,(\s+)?$/, '');
                    //add num of tier rows the logic will be based on autofill value
                    let prods = uniq(cellItem.new.split(',')), prodIndex = 0;
                    //to identify the uniq records
                    cellItem.new = prods.toString();
                    //KIT Deal will not allow more than 10 rows
                    let prdlen = prods.length > 10 ? PTE_Config_Util.maxKITproducts : prods.length;
                    for (let i = empRow; i < prdlen + empRow; i++) {
                        this.addUpdateRowOnchangeKIT(this.hotTable, columns, i, cellItem, ROW_ID, updateitems, curPricingTable, contractData, prods[prodIndex], null, operation);
                        prodIndex++;
                    }
                    iterObj.push({ DCID: ROW_ID, leng: prdlen, indx: empRow })
                    ROW_ID--;
                    empRow = empRow + prdlen;
                });
            }
            let PTR = PTE_Common_Util.getPTEGenerate(columns, curPricingTable);
            let DCIDS = pluck(PTR, 'DC_ID');
            let countOfDCID = countBy(pluck(PTR, 'DC_ID'))
            //calling the merge cells options numb of products ans setting mergcells to null first since we are doing all togather
            each(uniq(DCIDS), DCID => {
                if (DCID && DCID != '') {
                    iterObj.push({ DCID: DCID, leng: countOfDCID[`${DCID}`], indx: indexOf(DCIDS, DCID) })
                }
            });
            this.getMergeCellsOnEditKit(true, 1, 1, pricingTableTemplates, iterObj);
            if (updateitems && updateitems.length > 0) {
                //appending everything together batch function will improve the performace
                this.hotTable.batch(() => {
                    this.hotTable.setDataAtRowProp(updateitems, 'no-edit');
                });                   
            }
        }
    }

   static kitexistingItemsUpdate(items: Array<any>, curPricingTable: any, contractData: any, pricingTableTemplates: any, columns: any[], operation?: any){
            let updateRows =[];
            const selrow = items[0].row;
            items[0].new=  items[0].new.toString().replace(/,(\s+)?$/, '');
            //to identify the uniq records
            let prods = uniq(items[0].new.split(','));
            items[0].new = prods.toString();
            if (this.isAlreadyChange(selrow)) {
                if (items[0].old != items[0].new) {
                    //get the DC_ID of selected row
                    let ROW_ID = this.hotTable.getDataAtRowProp(selrow, 'DC_ID');
                    //the row can be insert or delete to get that we are removing and adding the rows
                    let DataOfRow = filter(PTE_Common_Util.getPTEGenerate(columns, curPricingTable), itm => { return itm.DC_ID == ROW_ID });
                    this.hotTable.alter('remove_row', selrow, items[0].old.split(',').length, 'no-edit');
                    this.hotTable.alter('insert_row', selrow, items[0].new.split(',').length, 'no-edit');
                    //this line of code is only for KIT incase of success product
                    if (operation && operation.operation) {
                        let PTR_col_ind = findIndex(columns, { data: 'PTR_USER_PRD' });
                        this.hotTable.setCellMeta(selrow, PTR_col_ind, 'className', 'success-product');
                    }
                    //this line of code is only for KIT incase of any change in product
                    else {
                        let PTR_col_ind = findIndex(columns, { data: 'PTR_USER_PRD' });
                        this.hotTable.setCellMeta(selrow, PTR_col_ind, 'className', 'normal-product');
                    }
                    let prodIndex = 0;
                    //KIT Deal will not allow more than 10 rows
                    let prdlen = prods.length > 10 ? PTE_Config_Util.maxKITproducts : prods.length;
                    let rownumber = selrow;
                    let dcids = [];
                    each(prods, () => {
                        let updateDCID: [number, string, number, string];
                        updateDCID = [rownumber, 'DC_ID', ROW_ID, 'no-edit'];
                        dcids.push(updateDCID);
                        rownumber++;
                    })

                    this.hotTable.setDataAtRowProp(dcids, 'no-edit');
                    for (let i = selrow; i < prdlen + selrow; i++) {
                        this.addUpdateRowOnchangeKIT(this.hotTable, columns, i, items[0], ROW_ID, updateRows, curPricingTable, contractData, prods[prodIndex], DataOfRow[prodIndex], operation);
                        prodIndex++;
                    }
                    // In case of editing/copy & paste in  existing rows ecap price will be updated to 0 and net kit price remains same. Calculating and pushing KIT Rebate to update rows -->  KIT-Rebate =  [ecap price(i.e. 0)- net kit price]
                    updateRows.push([selrow,'TEMP_KIT_REBATE',(0-parseFloat(DataOfRow[0]['ECAP_PRICE_____20_____1'])),'no-edit']);
                  }
            }
            return updateRows;
    }

    static autoFillCellonProdVol(items: Array<any>, curPricingTable: any, contractData: any, pricingTableTemplates: any, columns: any[], operation?: any) {
        let updateRows = [];
        //the numbe of tiers has to take from autofill for now taken from PT
        let NUM_OF_TIERS = curPricingTable.NUM_OF_TIERS;
        //The effort for autofill for one change and mulitple changes are little different
        if (items && items.length == 1) {
            let selrow = items[0].row;
            if (items[0].operation && items[0].operation != undefined && items[0].operation.operation == 'prodsel') {
                operation = items[0].operation;
            }
            //check if there is already a merge/change avaialble
            if (!this.isAlreadyChange(selrow)) {
                //identify the empty row and add it there
                let empRow = this.returnEmptyRow();
                const ROW_ID = this.getNextNewRowId();
                //first deleting the row this will help if the empty row and selected row doest match
                this.hotTable.alter('remove_row', selrow, 1, 'no-edit');
                //this line of code is only for KIT incase of success product
                if (operation && operation.operation) {
                    let PTR_col_ind = findIndex(columns, { data: 'PTR_USER_PRD' });
                    this.hotTable.setCellMeta(empRow, PTR_col_ind, 'className', 'success-product');
                }
                //add num of tier rows the logic will be based on autofill value
                let mergCells = [];
                let tier = 1;
                for (let i = empRow; i < parseInt(NUM_OF_TIERS) + empRow; i++) {
                    this.addUpdateRowOnchange(this.hotTable, columns, i, items[0], ROW_ID, updateRows, curPricingTable, contractData, NUM_OF_TIERS, tier, operation);
                    tier++;
                }
                //calling the merge cells option only where tier
                mergCells = this.getMergeCellsOnEdit(empRow, parseInt(curPricingTable.NUM_OF_TIERS), pricingTableTemplates);
                this.hotTable.updateSettings({ mergeCells: mergCells });
            } else {
                //this line of code is only for KIT incase of success product
                if (operation && operation.operation) {
                    let PTR_col_ind = findIndex(columns, { data: 'PTR_USER_PRD' });
                    this.hotTable.setCellMeta(selrow, PTR_col_ind, 'className', 'success-product');
                }

                if (operation && operation.operation && operation.PRD_EXCLDS) {
                    let PTR_EXCLUDE_col_ind = findIndex(columns, { data: 'PRD_EXCLDS' });
                    this.hotTable.setDataAtRowProp(selrow, 'PRD_EXCLDS', operation.PRD_EXCLDS, 'no-edit');
                    this.hotTable.setCellMeta(selrow, PTR_EXCLUDE_col_ind, 'className', 'success-product');
                } else if (operation && operation.operation && operation.PRD_EXCLDS != undefined && operation.PRD_EXCLDS == "") {
                    let PTR_EXCLUDE_col_ind = findIndex(columns, { data: 'PRD_EXCLDS' });
                    this.hotTable.setDataAtRowProp(selrow, 'PRD_EXCLDS', '', 'no-edit');
                    this.hotTable.setCellMeta(selrow, PTR_EXCLUDE_col_ind, 'className', 'normal-product');
                }

                if (operation && operation.operation && operation.PTR_SYS_PRD) {
                    this.hotTable.setDataAtRowProp(selrow, 'PTR_USER_PRD', items[0].new, 'no-edit');
                    this.hotTable.setDataAtRowProp(selrow, 'PTR_SYS_PRD', operation.PTR_SYS_PRD, 'no-edit');
                } else {
                    //this will rever the produc color back to empty
                    if (items[0].old != items[0].new && (operation == undefined || operation == null)) {
                        let PTR_col_ind = findIndex(columns, { data: 'PTR_USER_PRD' });
                        this.hotTable.setCellMeta(selrow, PTR_col_ind, 'className', 'normal-product');

                        //This will make sure to hit translate API
                        this.hotTable.setDataAtRowProp(selrow, 'PTR_SYS_PRD', '', 'no-edit');
                        this.hotTable.setDataAtRowProp(selrow, 'PTR_SYS_INVLD_PRD', '', 'no-edit');
                    }

                }
            }

            if (updateRows && updateRows.length > 0) {
                //appending everything togather batch function will improve the performace
                this.hotTable.batch(() => {
                    this.hotTable.setDataAtRowProp(updateRows, 'no-edit');
                });

            }
        }
        else {
            let updateitems = [];
            //first we need to make sure the changes are existing or newly added appending DC_ID for existing records this will hep with product slector logic
            each(items, (itm) => {
                itm['DC_ID'] = this.hotTable.getDataAtRowProp(itm.row, 'DC_ID');
            });
            //this logic for when we copy paste in existing rows
            let existItems = filter(items, (itm) => { return (itm.DC_ID != null || itm.DC_ID != undefined) });
            if (existItems.length > 0) {
                let PTR=[];
                if (curPricingTable.OBJ_SET_TYPE_CD == "FLEX") {
                   PTR = PTE_Common_Util.getPTEGenerate(columns,curPricingTable);
                }
                each(existItems, (itm) => {
                    //here onwrds the index get change so we need to make sure its in the right index
                    let PTR_col_ind = findIndex(columns, { data: 'PTR_USER_PRD' });
                    let rowtiers = parseInt(this.hotTable.getDataAtRowProp(itm.row, "NUM_OF_TIERS"));
                    if (isNaN(rowtiers)){
                    if (curPricingTable.OBJ_SET_TYPE_CD == "FLEX") {
                        if (itm.DC_ID < 0){
                            // NUM_OF_TIERS is not present in FLEX.
                            rowtiers = PTR.find ( x =>  x.DC_ID == itm.DC_ID ).NUM_OF_TIERS
                        } 
                    }}
                    this.hotTable.setCellMeta(itm.row, PTR_col_ind, 'className', 'normal-product');
                    let currentString = '';
                    for (let i = 0; i < rowtiers; i++) {
                        currentString = itm.row + ',' + 'PTR_USER_PRD';
                        const obj = currentString.split(',').concat(itm.new, 'no-edit');
                        updateitems.push(obj);
                        currentString = itm.row + ',' + 'PTR_SYS_INVLD_PRD';
                        const obj2 = currentString.split(',').concat('', 'no-edit');
                        updateitems.push(obj2);
                    }
                    items = reject(items, { DC_ID: itm.DC_ID });
                })
            }
            if (items && items.length > 0) {
                //for length greater than 1 it will eithr copy or autofill so first cleaning those recorsds
                this.hotTable.alter('remove_row', items[0].row, items.length * parseInt(curPricingTable.NUM_OF_TIERS), 'no-edit');
                //identify the empty row and the next empty row will be the consecutive one
                let empRow = this.returnEmptyRow();
                let ROW_ID = this.getNextNewRowId();
                let mergCells = [];
                each(items, (cellItem) => {
                    //add num of tier rows the logic will be based on autofill value
                    if (items[0].operation && items[0].operation != undefined && cellItem.operation.operation == 'prodsel') {
                        operation = cellItem.operation;
                        let PTR_col_ind = findIndex(columns, { data: 'PTR_USER_PRD' });
                        this.hotTable.setCellMeta(empRow, PTR_col_ind, 'className', 'success-product');
                    }
                    let tier = 1;
                    for (let i = empRow; i < parseInt(curPricingTable.NUM_OF_TIERS) + empRow; i++) {
                        this.addUpdateRowOnchange(this.hotTable, columns, i, cellItem, ROW_ID, updateitems, curPricingTable, contractData, NUM_OF_TIERS, tier, operation);
                        tier++;
                    }
                    ROW_ID--;
                    //calling the merge cells optionfor tier 
                    mergCells = this.getMergeCellsOnEdit(empRow, parseInt(curPricingTable.NUM_OF_TIERS), pricingTableTemplates);
                    //the next empty row will be previus empty row + num of tiers;
                    empRow = empRow + parseInt(curPricingTable.NUM_OF_TIERS);
                });

                this.hotTable.updateSettings({ mergeCells: mergCells });

            }
            if (updateitems && updateitems.length > 0) {
                //appending everything togather batch function will improve the performace
                this.hotTable.batch(() => {
                    this.hotTable.setDataAtRowProp(updateitems, 'no-edit');
                });
            }
        }
    }

    static autoFillCellOnProd(items: Array<any>, curPricingTable: any, contractData: any, pricingTableTemplates: any, columns: any[], operation?: any) {
        //when pasting multiple products from excel in 1 cell it should be comma deliminated
        items.forEach((item) => { if (item.new.includes('\n')) item.new = item.new.split('\n').join(','); })
        try {
            //making as empty only if program payment is Frontend YCS2
            if (curPricingTable.OBJ_SET_TYPE_CD && curPricingTable.OBJ_SET_TYPE_CD == 'ECAP' && curPricingTable.PROGRAM_PAYMENT == 'Frontend YCS2') {
                curPricingTable.PERIOD_PROFILE = '';
                curPricingTable.RESET_VOLS_ON_PERIOD = '';
                curPricingTable.AR_SETTLEMENT_LVL = '';
            }
            let OBJ_SET_TYPE_CD = curPricingTable.OBJ_SET_TYPE_CD;
            if (OBJ_SET_TYPE_CD && OBJ_SET_TYPE_CD == 'KIT') {
                this.autoFillCellonProdKit(items, curPricingTable, contractData, pricingTableTemplates, columns, operation);
            } else if (OBJ_SET_TYPE_CD && (OBJ_SET_TYPE_CD == 'VOL_TIER' || OBJ_SET_TYPE_CD == 'FLEX' || OBJ_SET_TYPE_CD == 'REV_TIER')) {
                this.autoFillCellonProdVol(items, curPricingTable, contractData, pricingTableTemplates, columns, operation);
            } else if (OBJ_SET_TYPE_CD == 'DENSITY') {
                this.autoFillCellonProdDensity(items, curPricingTable, contractData, pricingTableTemplates, columns, operation);
            } else {
                this.autofillCellOnProdECAPPgm(items, curPricingTable, contractData, pricingTableTemplates, columns, operation);
            }
            return null;
        } catch (ex) {
            console.error(ex);
            return ex;
        }
    }

    static autofillCellOnProdECAPPgm(items: Array<any>, curPricingTable: any, contractData: any, pricingTableTemplates: any, columns: any[], operation?: any) {
        let updateRows = [];
        //The effort for autofill for one change and mulitple changes are little different
        if (items && items.length == 1) {
            const selrow = items[0].row;
            if (items[0].operation && items[0].operation != undefined && items[0].operation.operation == 'prodsel') {
                operation = items[0].operation;
            }
            //check if there is already a merge/change avaialble
            if (!this.isAlreadyChange(selrow)) {
                //identify the empty row and add it there
                let empRow = this.returnEmptyRow();
                const ROW_ID = this.getNextNewRowId();
                //first deleting the row this will help if the empty row and selected row doest match
                this.hotTable.alter('remove_row', selrow, 1, 'no-edit');
                //this line of code is to mak sure we modify the product background color to sucess
                if (operation && operation.operation) {
                    let PTR_col_ind = findIndex(columns, { data: 'PTR_USER_PRD' });
                    this.hotTable.setCellMeta(empRow, PTR_col_ind, 'className', 'success-product');
                }
                this.addUpdateRowOnchange(this.hotTable, columns, empRow, items[0], ROW_ID, updateRows, curPricingTable, contractData, 0, 1, operation);
            } else {
                //this line of code is to mak sure we modify the product background color to sucess
                if (operation && operation.operation) {
                    let PTR_col_ind = findIndex(columns, { data: 'PTR_USER_PRD' });
                    this.hotTable.setCellMeta(selrow, PTR_col_ind, 'className', 'success-product');
                }

                //identify if the changes are coming from prod selector or corrector
                if (operation && operation.operation && operation.PTR_SYS_PRD) {
                    this.hotTable.setDataAtRowProp(selrow, 'PTR_USER_PRD', items[0].new, 'no-edit');
                    this.hotTable.setDataAtRowProp(selrow, 'PTR_SYS_PRD', operation.PTR_SYS_PRD, 'no-edit');
                }

                if (operation && operation.operation && operation.PRD_EXCLDS) {
                    this.hotTable.setDataAtRowProp(selrow, 'PTR_USER_PRD', items[0].new, 'no-edit');
                    this.hotTable.setDataAtRowProp(selrow, 'PRD_EXCLDS', operation.PRD_EXCLDS, 'no-edit');
                } else {
                    //this will rever the produc color back to empty
                    if (items[0].old != items[0].new && (operation == undefined || operation == null)) {
                        let PTR_col_ind = findIndex(columns, { data: 'PTR_USER_PRD' });
                        this.hotTable.setCellMeta(selrow, PTR_col_ind, 'className', 'normal-product');

                        //This will make sure to hit translate API
                        this.hotTable.setDataAtRowProp(selrow, 'PTR_SYS_PRD', '', 'no-edit');
                        this.hotTable.setDataAtRowProp(selrow, 'PTR_SYS_INVLD_PRD', '', 'no-edit');
                    }

                    if (operation && operation.operation && operation.PRD_EXCLDS != undefined && operation.PRD_EXCLDS == "") {
                        let PTR_EXCLUDE_col_ind = findIndex(columns, { data: 'PRD_EXCLDS' });
                        if (PTR_EXCLUDE_col_ind != -1) {
                            this.hotTable.setDataAtRowProp(selrow, 'PRD_EXCLDS', '', 'no-edit');
                            this.hotTable.setCellMeta(selrow, PTR_EXCLUDE_col_ind, 'className', 'normal-product');
                        }
                    }
                }
            }

            if (updateRows && updateRows.length > 0) {
                //appending everything togather batch function will improve the performace
                this.hotTable.batch(() => {
                    this.hotTable.setDataAtRowProp(updateRows, 'no-edit');
                });
            }
        }
        else {
            //first we need to make sure the changes are existing or newly added appending DC_ID for existing records this will hep with product slector logic
            each(items, (itm) => {
                itm['DC_ID'] = this.hotTable.getDataAtRowProp(itm.row, 'DC_ID');
            });
            //first we need to make sure the changes are existing or newly added.
            let existItems = filter(items, (itm) => { return (itm.DC_ID != null || itm.DC_ID != undefined) });
            each(existItems, (itm) => {
                this.autofillCellOnProdECAPPgm([itm], curPricingTable, contractData, pricingTableTemplates, columns, operation);
                items = reject(items, { DC_ID: itm.DC_ID });
            })
           
            //only modify if we have new data to paste
            if (items && items.length > 0) {
                //clearing the records if they copied somewhere else no in the immediate empty row
                this.hotTable.alter('remove_row', items[0].row, items.length, 'no-edit');
                //For rows which are not exists identify the empty row and the next empty row will be the consecutive one
                let empRow = this.returnEmptyRow();
                let ROW_ID = this.getNextNewRowId();
                let updateItems = [];
                each(items, (cellItem: any) => {
                    if (items[0].operation && items[0].operation != undefined && cellItem.operation.operation == 'prodsel') {
                        operation = cellItem.operation;
                        let PTR_col_ind = findIndex(columns, { data: 'PTR_USER_PRD' });
                        this.hotTable.setCellMeta(empRow, PTR_col_ind, 'className', 'success-product');
                    }
                    this.addUpdateRowOnchange(this.hotTable, columns, empRow, cellItem, ROW_ID, updateItems, curPricingTable, contractData, 0, 1, operation);
                    empRow++;
                    ROW_ID--;
                });

                if (updateItems && updateItems.length > 0) {
                    //appending everything togather batch function will improve the performace
                    this.hotTable.batch(() => {
                        this.hotTable.setDataAtRowProp(updateItems, 'no-edit');
                    });

                }
            }
        }
    }

    static addUpdateRowOnchangeDensity(hotTable: Handsontable, row: number, cellItem: any, ROW_ID: number, updateRows: Array<any>, curPricingTable: any, contractData: any, numoftier: number, tier?: number, operation?: any) {
        //make the selected row PTR_USER_PRD empty if its not the empty row
        each(hotTable.getCellMetaAtRow(0), (val, key) => {
            let currentString = '';
            if (val.prop == 'PTR_USER_PRD') {
                //update PTR_USER_PRD with entered value
                //this exclussivlt because for  products can be with comma seperate values
                hotTable.setDataAtRowProp(row, 'PTR_USER_PRD', cellItem.new, 'no-edit');                
            } else if (val.prop == 'DC_ID') {
                //update PTR_USER_PRD with random value if we use row index values while adding after dlete can give duplicate index
                let updateDCID: [string, string, number, string] = [row.toString(), val.prop, ROW_ID, 'no-edit'];
                updateRows.push(updateDCID);
            } else if (val.prop == 'TIER_NBR') {
                //update PTR_USER_PRD with random value if we use row index values while adding after dlete can give duplicate index
                currentString = row + ',' + val.prop + ',' + tier + ',' + 'no-edit';
                updateRows.push(currentString.split(','));
            } else if (val.prop == 'DENSITY_RATE') {
                currentString = row + ',' + val.prop + ',' + 0 + ',' + 'no-edit';
                updateRows.push(currentString.split(','));
            } else {
                if (val.prop != 'DENSITY_BAND') {
                    this.addUpdateRowOnchangeCommon(row, val, updateRows, curPricingTable, contractData, null, operation, cellItem);
                }
            }
        });
    }

    static getMergeCellsOnEditDensity(empRow: number, NUM_OF_TIERS: number, pivotDensity: number, numOfRows: number, pricingTableTemplates: any) {
        let mergCells: any = null;
        let startOffset = empRow;
        mergCells = this.hotTable.getSettings().mergeCells;
        each(pricingTableTemplates.columns, (colItem, ind) => {
            if (colItem.field == 'TIER_NBR') {
                for (let i = 1; i <= NUM_OF_TIERS; i++) {
                    mergCells.push({ row: startOffset, col: ind, rowspan: pivotDensity, colspan: 1 });
                    startOffset = startOffset + pivotDensity;
                }
                startOffset = empRow;
            } else if (!colItem.isDimKey && !colItem.hidden && numOfRows != 1) { //dont merge if rowspan and colspan is 1
                mergCells.push({ row: empRow, col: ind, rowspan: numOfRows, colspan: 1 });
            }
        });
        return mergCells;
    }

    static autoFillCellonProdDensity(items: Array<any>, curPricingTable: any, contractData: any, pricingTableTemplates: any, columns: any[], operation?: any) {
        let updateRows = [];
        //the numbe of tiers has to take from autofill for now taken from PT
        let NUM_OF_TIERS = parseInt(curPricingTable.NUM_OF_TIERS);
        let pivotDensity = parseInt(curPricingTable.NUM_OF_DENSITY);
        let numOfRows = NUM_OF_TIERS * pivotDensity;
        //The effort for autofill for one change and mulitple changes are little different
        if (items && items.length == 1) {
            let selrow = items[0].row;
            if (items[0].operation && items[0].operation != undefined && items[0].operation.operation == 'prodsel') {
                operation = items[0].operation;
            }
            if (!this.isAlreadyChange(selrow)) {
                //identify the empty row and add it there
                let empRow = this.returnEmptyRow();
                const ROW_ID = this.getNextNewRowId();
                //first deleting the row this will help if the empty row and selected row doest match
                this.hotTable.alter('remove_row', selrow, 1, 'no-edit');
                //add num of tier rows the logic will be based on autofill value
                let tier = 1;
                let mergCells = [];
                for (let i = empRow; i < numOfRows + empRow; i++) {
                    for (let j = 0; j < pivotDensity; j++) {
                        this.addUpdateRowOnchangeDensity(this.hotTable, i, items[0], ROW_ID, updateRows, curPricingTable, contractData, NUM_OF_TIERS, tier, operation);
                        i++
                    }
                    i = i - 1;
                    tier++;
                }
                mergCells = this.getMergeCellsOnEditDensity(empRow, NUM_OF_TIERS, pivotDensity, numOfRows, pricingTableTemplates);
                this.hotTable.updateSettings({ mergeCells: mergCells });
            } else {
                if (operation && operation.operation) {
                    let PTR_col_ind = findIndex(columns, { data: 'PTR_USER_PRD' });
                    this.hotTable.setCellMeta(selrow, PTR_col_ind, 'className', 'success-product');
                }

                if (operation && operation.operation && operation.PTR_SYS_PRD) {
                    this.hotTable.setDataAtRowProp(selrow, 'PTR_USER_PRD', items[0].new, 'no-edit');
                    this.hotTable.setDataAtRowProp(selrow, 'PTR_SYS_PRD', operation.PTR_SYS_PRD, 'no-edit');
                }

                if (operation && operation.operation && operation.PRD_EXCLDS) {
                    this.hotTable.setDataAtRowProp(selrow, 'PTR_USER_PRD', items[0].new, 'no-edit');
                    this.hotTable.setDataAtRowProp(selrow, 'PRD_EXCLDS', operation.PRD_EXCLDS, 'no-edit');
                } else {
                    //this will rever the produc color back to empty
                    if (items[0].old != items[0].new && (operation == undefined || operation == null)) {
                        let PTR_col_ind = findIndex(columns, { data: 'PTR_USER_PRD' });
                        this.hotTable.setCellMeta(selrow, PTR_col_ind, 'className', 'normal-product');

                        //This will make sure to hit translate API
                        this.hotTable.setDataAtRowProp(selrow, 'PTR_SYS_PRD', '', 'no-edit');
                        this.hotTable.setDataAtRowProp(selrow, 'PTR_SYS_INVLD_PRD', '', 'no-edit');
                    }

                    if (operation && operation.operation && operation.PRD_EXCLDS != undefined && operation.PRD_EXCLDS == "") {
                        let PTR_EXCLUDE_col_ind = findIndex(columns, { data: 'PRD_EXCLDS' });
                        this.hotTable.setDataAtRowProp(selrow, 'PRD_EXCLDS', '', 'no-edit');
                        this.hotTable.setCellMeta(selrow, PTR_EXCLUDE_col_ind, 'className', 'normal-product');
                    }
                }
            }

            if (updateRows && updateRows.length > 0) {
                //appending everything togather batch function will improve the performace
                this.hotTable.batch(() => {
                    this.hotTable.setDataAtRowProp(updateRows, 'no-edit');
                });
            }
        } else {   
            let updateitems = [];
            //first we need to make sure the changes are existing or newly added appending DC_ID for existing records this will hep with product slector logic
            each(items,(itm)=>{
                itm['DC_ID']=this.hotTable.getDataAtRowProp(itm.row,'DC_ID');
            });
            //this logic for when we copy paste in existing rows
            let existItems=filter(items,(itm)=>{return (itm.DC_ID !=null || itm.DC_ID !=undefined) });
            if(existItems.length>0){
                each(existItems, (itm) => {
                    //here onwrds the index get change so we need to make sure its in the right index
                    let PTR_col_ind = findIndex(columns, { data: 'PTR_USER_PRD' });
                    let rowtiers = 1;
                    //  Density for saved rows getting num_of_tiers = tiers * density, for non saved rows num_of_tiers = tiers
                    if (itm.DC_ID > 0) {
                        rowtiers = parseInt(this.hotTable.getDataAtRowProp(itm.row, "NUM_OF_TIERS"));
                    } else {
                        let DenNUM_OF_TIERS = parseInt(this.hotTable.getDataAtRowProp(itm.row, "NUM_OF_TIERS"));
                        if (isNaN(DenNUM_OF_TIERS)) {
                            DenNUM_OF_TIERS = curPricingTable.NUM_OF_TIERS;
                        }
                        let DenpivotDensity = parseInt(this.hotTable.getDataAtRowProp(itm.row, "NUM_OF_DENSITY"));
                        if (isNaN(DenpivotDensity)) {
                            DenpivotDensity = curPricingTable.NUM_OF_DENSITY;
                        }
                        rowtiers = DenNUM_OF_TIERS * DenpivotDensity;
                    }
                    this.hotTable.setCellMeta(itm.row, PTR_col_ind, 'className', 'normal-product');
                    let currentString = '';
                    for (let i = 0; i < rowtiers; i++) {
                        currentString = (itm.row+i) + ',' + 'PTR_USER_PRD';
                        const obj = currentString.split(',').concat(itm.new, 'no-edit');
                        updateitems.push(obj);
                        currentString = (itm.row+i) + ',' + 'PTR_SYS_INVLD_PRD';
                        const obj2 = currentString.split(',').concat('', 'no-edit');
                        updateitems.push(obj2);
                    }
                    items = reject(items, { DC_ID: itm.DC_ID });
                })
           }

           if(items.length > 0){           
            //for length greater than 1 it will eithr copy or autofill so first cleaning those recorsds
            this.hotTable.alter('remove_row', items[0].row, items.length * numOfRows, 'no-edit');
            //identify the empty row and the next empty row will be the consecutive one
            let empRow = this.returnEmptyRow();
            let ROW_ID = this.getNextNewRowId();
            let mergCells = [];
            each(items, (cellItem) => {
                // let ROW_ID = this.rowDCID();
                //add num of tier rows the logic will be based on autofill value
                if (items[0].operation && items[0].operation != undefined && cellItem.operation.operation == 'prodsel') {
                    operation = cellItem.operation;
                    let PTR_col_ind = findIndex(columns, { data: 'PTR_USER_PRD' });
                    this.hotTable.setCellMeta(empRow, PTR_col_ind, 'className', 'success-product');
                }
                let tier = 1;
                for (let i = empRow; i < numOfRows + empRow; i++) {
                    for (let j = 0; j < pivotDensity; j++) {
                        this.addUpdateRowOnchangeDensity(this.hotTable, i, cellItem, ROW_ID, updateitems, curPricingTable, contractData, NUM_OF_TIERS, tier, operation);
                        i++
                    }
                    i = i - 1;
                    tier++;
                }
                ROW_ID--;
                //calling the merge cells optionfor tier 
                mergCells = this.getMergeCellsOnEditDensity(empRow, NUM_OF_TIERS, pivotDensity, numOfRows, pricingTableTemplates);
                //the next empty row will be previus empty row + num of tiers;
                empRow = empRow + numOfRows;
            });
            this.hotTable.updateSettings({ mergeCells: mergCells });
            }

            if (updateitems && updateitems.length > 0) {
                //appending everything togather batch function will improve the performace
                this.hotTable.batch(() => {
                    this.hotTable.setDataAtRowProp(updateitems, 'no-edit');
                });
            }
        }
    }
    /* Prod selector autofill changes functions ends here */

    static kitEcapChangeOnProd(item: any, PTR: any[]): number {
        let DCID = this.hotTable.getDataAtRowProp(item.row, 'DC_ID');
        let numOfTiers = where(PTR, { DC_ID: DCID }).length;
        let firstTierRowInd = findIndex(PTR, x => { return x.DC_ID == DCID })
        let val = PTE_Load_Util.calculateKitRebate(PTR, firstTierRowInd, numOfTiers, false)
        return val
    }
    static kitEcapPriceChange(items: Array<any>, columns: any[], curPricingTable: any) {
        try {
            let OBJ_SET_TYPE_CD = curPricingTable.OBJ_SET_TYPE_CD;
            if (OBJ_SET_TYPE_CD && OBJ_SET_TYPE_CD == 'KIT') {
                const PTR = PTE_Common_Util.getPTEGenerate(columns, curPricingTable);
                each(items, item => {
                    const DCID = this.hotTable.getDataAtRowProp(item.row, 'DC_ID');
                    const numOfTiers = where(PTR, { DC_ID: DCID }).length;
                    const firstTierRowInd = findIndex(PTR, x => { return x.DC_ID == DCID })
                    const val = PTE_Load_Util.calculateKitRebate(PTR, firstTierRowInd, numOfTiers, false)
                    this.hotTable.setDataAtRowProp(firstTierRowInd, 'TEMP_KIT_REBATE', val, 'no-edit');
                });
            }
        } catch (ex) {
            console.error(ex);
        }
    }
    static kitDSCNTChange(items: Array<any>, columns: any[], curPricingTable: any) {
        try {
            const OBJ_SET_TYPE_CD = curPricingTable.OBJ_SET_TYPE_CD;
            if (OBJ_SET_TYPE_CD && OBJ_SET_TYPE_CD == 'KIT') {
                each(items, item => {
                    if (item.prop && item.prop == 'DSCNT_PER_LN' && isNaN(item.new) && !isNumber((item.new))){
                        this.hotTable.setDataAtRowProp(item.row, item.prop, '0.00', 'no-edit');
                    }
                    const val = PTE_Load_Util.calculateTotalDsctPerLine(this.hotTable.getDataAtRowProp(item.row, 'DSCNT_PER_LN'), this.hotTable.getDataAtRowProp(item.row, 'QTY'))
                    this.hotTable.setDataAtRowProp(item.row, 'TEMP_TOTAL_DSCNT_PER_LN', val, 'no-edit');
                    if (item.prop && item.prop == 'QTY') {
                        this.hotTable.setDataAtRowProp(item.row, 'QTY', Math.round(item.new), 'no-edit');
                        this.kitEcapPriceChange([item], columns, curPricingTable);
                    }
                })
            }
        } catch (ex) {
            console.error(ex);
        }

    }
    static kitNameExists(items: any[], columns: any[], curPricingTable: any): any {
        try {
            const OBJ_SET_TYPE_CD = curPricingTable.OBJ_SET_TYPE_CD;
            if (OBJ_SET_TYPE_CD && OBJ_SET_TYPE_CD == 'KIT') {
                //add HAS_TRACKER column and _behaviors to check existing row are editable or not
                let columnList = PTE_Common_Util.deepClone(columns);
                columnList.push({ data: 'HAS_TRACKER' });
                columnList.push({ data: '_behaviors' });
                //check for the same KIT name exists
                const PTR = PTE_Common_Util.getPTEGenerate(columnList, curPricingTable);
                const uniqnames = uniq(pluck(items, 'new'));
                let PTR_exist = [];
                //iterate throght the PTR and get consolidate result for all duplicate
                each(uniqnames, uniqnm => {
                    if (uniqnm && uniqnm != '') {
                        let curPTR = [];
                        each(PTR, (cr, row) => {
                            if (cr['DEAL_GRP_NM'].toUpperCase() == uniqnm.toUpperCase()) {
                                if (curPTR.length > 0) {
                                    if (curPTR.find(x => x.DC_ID != cr['DC_ID'])) {
                                        cr['row'] = row;
                                        curPTR.push(cr);
                                    }
                                } else {
                                    cr['row'] = row;
                                    curPTR.push(cr);
                                }
                            }
                        });
                        //If there is already same name the length will atleast 2
                        if (curPTR.length > 1) {
                            //existing Row editable or not
                            const isNotEditable = curPTR.filter(x => (x.HAS_TRACKER && x.HAS_TRACKER == '1') ||
                                (x._behaviors && x._behaviors.isReadOnly && x._behaviors.isReadOnly["PTR_USER_PRD"])).length > 0 ? true : false;
                            if (isNotEditable)
                                PTR_exist.push({ PTR: curPTR, name: uniqnm, issueType: 'notEditable' })
                            else {
                                //identify the uniq product count of the duplicate KIT
                                const unqcount = uniq(compact(pluck(curPTR, 'PTR_USER_PRD').toString().split(','))).length
                                if (unqcount && unqcount > PTE_Config_Util.maxKITproducts) {
                                    PTR_exist.push({ PTR: curPTR, name: uniqnm, issueType: 'dupMoreLeng' })
                                } else {
                                    PTR_exist.push({ PTR: curPTR, name: uniqnm, issueType: 'dup' })
                                }
                            }
                        }
                    }
                });

                if (PTR_exist && PTR_exist.length > 0) {
                    return PTR_exist;
                } else {
                    return [];
                }
            }
        } catch (ex) {
            console.error(ex);
        }
    }

    static mergeKitDeal(items: any, columns: any[], curPricingTable: any, contractData: any, pricingTableTemplates: any) {
        //first delete all the rows except the min one
        let PTR = PTE_Common_Util.getPTEGenerate(columns, curPricingTable);
        PTR = map(PTR, (x) => { return { DEAL_GRP_NM: x['DEAL_GRP_NM'].toUpperCase() } });
        let firstInd = findIndex(PTR, { DEAL_GRP_NM: items.name.toUpperCase() });
        let prods = '';
        each(items.PTR, PTR => {
            prods = prods + PTR['PTR_USER_PRD'] + ',';
        });
        //modify the first cell with all uniq products
        let uniqprod = uniq(prods.substring(0, prods.length - 1).split(','));
        //making sure not more than max KIT prod is available.
        uniqprod = uniqprod.length > PTE_Config_Util.maxKITproducts ? uniqprod.slice(0, PTE_Config_Util.maxKITproducts) : uniqprod;
        let Row = [{ row: firstInd, prop: 'PTR_USER_PRD', old: this.hotTable.getDataAtRowProp(firstInd, 'PTR_USER_PRD'), new: uniqprod.toString() }];
        PTE_CellChange_Util.autoFillCellonProdKit(Row, curPricingTable, contractData, pricingTableTemplates, columns);
        // compare the rows and see any products are repeating and only add repeating product to first one.
    }

    static closeKitDialog(items: any, columns: any[], curPricingTable: any, lastEditedKitName: any) {
        let PTR = PTE_Common_Util.getPTEGenerate(columns, curPricingTable);
        PTR = map(PTR, (x) => {
            return { DEAL_GRP_NM: x['DEAL_GRP_NM'].toUpperCase() }
        });
        let firstInd = findIndex(PTR, { DEAL_GRP_NM: items.name.toUpperCase() });
        each(PTR, (cr, ind) => {
            //this will make sure we are not clearing first row
            if (lastEditedKitName[0].row == ind && cr['DEAL_GRP_NM'].toUpperCase() == items.name.toUpperCase()) {
                this.hotTable.setDataAtRowProp(ind, 'DEAL_GRP_NM', '', 'no-edit');
            }
        });
    }

    static RateChgfn(items: Array<any>, columns: any[], curPricingTable: any) {
        each(items, item => {
            const VOLUME_COLUMNS = ['FRCST_VOL', 'VOLUME'];
            const RATE_CHG_ITEMS = ['DENSITY_RATE', 'ECAP_PRICE', 'VOLUME', 'INCENTIVE_RATE', 'TOTAL_DOLLAR_AMOUNT', 'RATE', 'ADJ_ECAP_UNIT', 'MAX_PAYOUT', 'FRCST_VOL'];
            if ((item.prop) && includes(RATE_CHG_ITEMS, item.prop)) {
                let val = this.hotTable.getDataAtRowProp(item.row, item.prop);
                if (val == null || val == '') {
                    if (includes(VOLUME_COLUMNS, item.prop)) {
                        val = '';
                    } else {
                        val = 0.00;
                    }
                }
                val = parseFloat(val.toString().replace(/[$,]/g, ""));
                if (!isNaN(val) && isNumber(val)) {
                    if (includes(VOLUME_COLUMNS, item.prop)) {
                        this.hotTable.setDataAtRowProp(item.row, item.prop, Math.round(val), 'no-edit');
                    } else {
                        this.hotTable.setDataAtRowProp(item.row, item.prop, val, 'no-edit');
                    }
                } else {
                    if (includes(VOLUME_COLUMNS, item.prop)) {
                        this.hotTable.setDataAtRowProp(item.row, item.prop, '', 'no-edit');
                    } else {
                        this.hotTable.setDataAtRowProp(item.row, item.prop, '0.00', 'no-edit');
                    }
                }
            }
            if(item.prop=='ECAP_PRICE' || item.prop=='RATE'){
                let val = this.hotTable.getDataAtRowProp(item.row, item.prop);
                const col = findIndex(columns, { data: item.prop});
                // 9999999999 is range value as per DB
                if (!isNaN(val) && isNumber(val) && val > 9999999999 ) {
                    this.hotTable.setCellMetaObject(item.row, col, { 'className': 'error-product', comment: { value: 'Not a valid number (too large).' } });
                    this.hotTable.render();
                }else{
                    this.hotTable.setCellMetaObject(item.row, col, { 'className': '', comment: { value: '' } });
                    this.hotTable.render();
                }
            }
        });
    }

    static pgChgfn(items: Array<any>, columns: any[], curPricingTable: any, contractData?, cellEditor?, ptDefaults?) {
        let OBJ_SET_TYPE_CD = curPricingTable.OBJ_SET_TYPE_CD;
        if (OBJ_SET_TYPE_CD && OBJ_SET_TYPE_CD == 'ECAP') {
            each(items, item => {
                if (item.prop) {
                    const val = item.new;
                    this.checkfn(item, curPricingTable, columns, val, contractData, cellEditor, ptDefaults); return;
                }
            });
        }
    }

    static delReadOnlyBehaviours(field, items) {
        // For Deleting the readonly behaviour which is added while save & validate
        if (this.hotTable.getDataAtRowProp(items.row, '_behaviors') != undefined && this.hotTable.getDataAtRowProp(items.row, '_behaviors') != null) {
            let behaviors = this.hotTable.getDataAtRowProp(items.row, '_behaviors');
            delete behaviors.isReadOnly[field];
        }
    }

    static checkfn(item: any, curPricingTable: any, columns: any[], value?, contractData?, cellEditor?, ptDefaults?) {
        if (item != null) {
            const val = value ? value : this.hotTable.getDataAtRowProp(item.row, 'PROGRAM_PAYMENT');
            if (val != undefined && val != null && val !== ''  && val.toLowerCase() !== 'backend') {
                if (findWhere(columns, { data: 'PERIOD_PROFILE' }) != undefined && findWhere(columns, { data: 'PERIOD_PROFILE' }) != null) {
                    this.hotTable.setDataAtRowProp(item.row, 'PERIOD_PROFILE', '', 'no-edit');
                }
                if (findWhere(columns, { data: 'RESET_VOLS_ON_PERIOD' }) != undefined && findWhere(columns, { data: 'RESET_VOLS_ON_PERIOD' }) != null) {
                    this.hotTable.setDataAtRowProp(item.row, 'RESET_VOLS_ON_PERIOD', '', 'no-edit');
                }
                if (findWhere(columns, { data: 'AR_SETTLEMENT_LVL' }) != undefined && findWhere(columns, { data: 'AR_SETTLEMENT_LVL' }) != null) {
                    this.hotTable.setDataAtRowProp(item.row, 'AR_SETTLEMENT_LVL', '', 'no-edit');
                }
                if (findWhere(columns, { data: 'SETTLEMENT_PARTNER' }) != undefined && findWhere(columns, { data: 'SETTLEMENT_PARTNER' }) != null) {
                    this.hotTable.setDataAtRowProp(item.row, 'SETTLEMENT_PARTNER', '', 'no-edit');
                }
            } else {
                if (this.hotTable.getDataAtRowProp(item.row, 'PERIOD_PROFILE') == '' && curPricingTable["PERIOD_PROFILE"] != undefined) {
                    if (findWhere(columns, { data: 'PERIOD_PROFILE' }) != undefined && findWhere(columns, { data: 'PERIOD_PROFILE' }) != null) {
                        this.delReadOnlyBehaviours("PERIOD_PROFILE", item);
                        let prdPfvalue = curPricingTable["PERIOD_PROFILE"] ? curPricingTable["PERIOD_PROFILE"] : ptDefaults["_defaultAtrbs"]["PERIOD_PROFILE"].value
                        this.hotTable.setDataAtRowProp(item.row, 'PERIOD_PROFILE', prdPfvalue.toString(), 'no-edit');
                    }
                }
                if (this.hotTable.getDataAtRowProp(item.row, 'RESET_VOLS_ON_PERIOD') == '') {
                    if (findWhere(columns, { data: 'RESET_VOLS_ON_PERIOD' }) != undefined && findWhere(columns, { data: 'RESET_VOLS_ON_PERIOD' }) != null) {
                        this.delReadOnlyBehaviours("RESET_VOLS_ON_PERIOD", item);
                        this.hotTable.setDataAtRowProp(item.row, 'RESET_VOLS_ON_PERIOD', 'No', 'no-edit');
                    }
                }
                if (this.hotTable.getDataAtRowProp(item.row, 'AR_SETTLEMENT_LVL') == '' && curPricingTable["AR_SETTLEMENT_LVL"] != undefined) {
                    if (findWhere(columns, { data: 'AR_SETTLEMENT_LVL' }) != undefined && findWhere(columns, { data: 'AR_SETTLEMENT_LVL' }) != null) {
                        this.delReadOnlyBehaviours("AR_SETTLEMENT_LVL", item);
                        let arSVal = curPricingTable["AR_SETTLEMENT_LVL"] ? curPricingTable["AR_SETTLEMENT_LVL"] : ptDefaults["_defaultAtrbs"]["AR_SETTLEMENT_LVL"].value
                        this.hotTable.setDataAtRowProp(item.row, 'AR_SETTLEMENT_LVL', arSVal.toString(), 'no-edit');
                        if (curPricingTable && arSVal && (arSVal.toLowerCase() == 'cash' && item.prop == 'AR_SETTLEMENT_LVL')) {
                            let colSPIdx = findWhere(this.hotTable.getCellMetaAtRow(item.row), { prop: 'SETTLEMENT_PARTNER' }).col;
                            this.autoFillOnCash(item, contractData, colSPIdx, cellEditor);
                        }
                    }
                }
                if (item.prop == 'REBATE_TYPE' && item.new != 'NRE ACCRUAL' && item.new != 'CO-ENGINEERING ACCRUAL' && this.hotTable.getDataAtRowProp(item.row, 'PERIOD_PROFILE') == '') {
                    if (ptDefaults["_defaultAtrbs"] != undefined && (curPricingTable.OBJ_SET_TYPE_CD != 'PROGRAM' && curPricingTable.OBJ_SET_TYPE_CD != 'LUMP_SUM')) {
                        this.delReadOnlyBehaviours("PERIOD_PROFILE", item);
                        let prdPfvalue = curPricingTable["PERIOD_PROFILE"] ? curPricingTable["PERIOD_PROFILE"] : ptDefaults["_defaultAtrbs"]["PERIOD_PROFILE"].value
                        this.hotTable.setDataAtRowProp(item.row, 'PERIOD_PROFILE', prdPfvalue.toString(), 'no-edit');
                    }
                }
            }
            if(item.prop =='PROGRAM_PAYMENT'  || item.prop == 'REBATE_TYPE'){
                const propvalue= this.hotTable.getDataAtRowProp(item.row, item.prop);
                if(propvalue==null){
                 const invalidname = 'This field is required';
                 let colSPIdx = findWhere(this.hotTable.getCellMetaAtRow(item.row), { prop: item.prop }).col;
                 this.hotTable.setCellMetaObject(item.row, colSPIdx, { 'className': 'error-product error-border', comment: { value: invalidname } });
                 this.hotTable.render();
                }
                else
                {
                 let colSPIdx = findWhere(this.hotTable.getCellMetaAtRow(item.row), { prop: item.prop }).col;
                 this.hotTable.setCellMetaObject(item.row, colSPIdx, { 'className': '', comment: { value: '' } });
                 this.hotTable.render();
                }
             }
        }
        this.hotTable.render()
    }

    static tierChange(items: Array<any>, columns: any[], curPricingTable: any) {
        const OBJ_SET_TYPE_CD = curPricingTable.OBJ_SET_TYPE_CD;
        const PTR = PTE_Common_Util.getPTEGenerate(columns, curPricingTable);

        if (OBJ_SET_TYPE_CD && OBJ_SET_TYPE_CD == 'REV_TIER') {
            each(items, item => {
                if (item.prop && item.prop == 'END_REV') {
                    let val = this.hotTable.getDataAtRowProp(item.row, 'END_REV');
                    if ((val==null) || (val=='')) {
                        val = 0;
                    }
                    val = parseFloat(val.toString().replace(/[$,]/g, ''));
                    const DCID = this.hotTable.getDataAtRowProp(item.row, 'DC_ID');
                    const Tier = this.hotTable.getDataAtRowProp(item.row, 'TIER_NBR');
                    const numOfTiers = where(PTR, { DC_ID: DCID }).length;
                    if (Tier < numOfTiers) {
                        if (val > 0 || val === 0) {
                            this.hotTable.setDataAtRowProp(item.row, 'END_REV', val, 'no-edit');
                            this.hotTable.setDataAtRowProp(item.row + 1, 'STRT_REV', val + 0.01, 'no-edit');

                        } else if (val < 0) {
                            this.hotTable.setDataAtRowProp(item.row, 'END_REV', val, 'no-edit');
                            this.hotTable.setDataAtRowProp(item.row + 1, 'STRT_REV', (-val) + 0.01, 'no-edit');
                        }
                        else {
                            this.hotTable.setDataAtRowProp(item.row, 'END_REV', 0, 'no-edit');
                        }
                    } else if (Tier == numOfTiers) {
                        if (val >= 0 || val < 0) {
                            this.hotTable.setDataAtRowProp(item.row, 'END_REV', val, 'no-edit');
                        } else {
                            this.hotTable.setDataAtRowProp(item.row, 'END_REV', 0, 'no-edit');
                        }
                    }
                } else if (item.prop && item.prop == 'STRT_REV') {
                    let val = this.hotTable.getDataAtRowProp(item.row, 'STRT_REV');
                    if (val == null || val == '') {
                        val = 0;
                    }

                    val = parseFloat(val.toString().replace(/[$,]/g, ''));

                    if ((!isNaN(val)) && -(val >= 0 || val < 0)) {
                        this.hotTable.setDataAtRowProp(item.row, 'STRT_REV', val, 'no-edit');
                    } else {
                        this.hotTable.setDataAtRowProp(item.row, 'STRT_REV', 0, 'no-edit');
                    }
                }
            });
        } else if (OBJ_SET_TYPE_CD && (OBJ_SET_TYPE_CD == 'FLEX' || OBJ_SET_TYPE_CD == 'VOL_TIER')) {
            each(items, item => {
                if (item.prop && item.prop == 'END_VOL') {
                    let val = this.hotTable.getDataAtRowProp(item.row, 'END_VOL');
                    const DCID = this.hotTable.getDataAtRowProp(item.row, 'DC_ID');
                    const Tier = this.hotTable.getDataAtRowProp(item.row, 'TIER_NBR');
                    const numOfTiers = where(PTR, { DC_ID: DCID }).length;
                    if (val > 0) {
                        val = Math.trunc(this.hotTable.getDataAtRowProp(item.row, 'END_VOL'));
                    }
                    if (Tier < numOfTiers) {
                        if (val > 0 || val === 0) {
                            this.hotTable.setDataAtRowProp(item.row, 'END_VOL', val, 'no-edit');
                            this.hotTable.setDataAtRowProp(item.row + 1, 'STRT_VOL', val + 1, 'no-edit');
                        } else if (val < 0) {
                            this.hotTable.setDataAtRowProp(item.row, 'END_VOL', val, 'no-edit');
                            this.hotTable.setDataAtRowProp(item.row + 1, 'STRT_VOL', (-val) + 1, 'no-edit');
                        } else {
                            this.hotTable.setDataAtRowProp(item.row, 'END_VOL', 0, 'no-edit');
                        }
                    } else if (Tier == numOfTiers) {
                        if (val >= 0 || val < 0 || val.toLowerCase() == 'unlimited') {
                            this.hotTable.setDataAtRowProp(item.row, 'END_VOL', val, 'no-edit');
                        } else {
                            this.hotTable.setDataAtRowProp(item.row, 'END_VOL', 0, 'no-edit');
                        }
                    }
                } else if (item.prop && item.prop == 'STRT_VOL') {
                    const val = Math.trunc(this.hotTable.getDataAtRowProp(item.row, 'STRT_VOL'));
                    if (val >= 0 || val < 0) {
                        this.hotTable.setDataAtRowProp(item.row, 'STRT_VOL', val, 'no-edit');
                    } else {
                        this.hotTable.setDataAtRowProp(item.row, 'STRT_VOL', 0, 'no-edit');
                    }
                }
            });
        }
    }

    static perProfDefault(items: Array<any>, curPricingTable: any) {
        each(items, (item) => {
            if ((item.new && (item.new=='')) || (item.new==null)) {
                this.hotTable.setDataAtRowProp(item.row, item.prop, curPricingTable[`${item.prop}`], 'no-edit');
            }
        });
    }
    /* AR settlement change where functions starts here */
    static autoFillARSet(items: Array<any>, contractData: any, curPricingTable: any, cellEditor) {
        try {
            each(items, (item) => {
                const colSPIdx = findWhere(this.hotTable.getCellMetaAtRow(item.row), { prop: 'SETTLEMENT_PARTNER' }).col;
                if ((item.new && (item.new=='')) || (item.new==null)) {
                    if (curPricingTable && curPricingTable[`${item.prop}`] && curPricingTable[`${item.prop}`].toLowerCase() == 'cash') {
                        this.autoFillOnCash(item, contractData, colSPIdx, cellEditor);
                    } else {
                        this.hotTable.setDataAtRowProp(item.row, 'SETTLEMENT_PARTNER', '', 'no-edit');
                        this.hotTable.setCellMeta(item.row, colSPIdx, 'editor', false);
                        this.hotTable.setCellMeta(item.row, colSPIdx, 'className', 'readonly-cell');
                        this.hotTable.render();
                    }
                    this.hotTable.setDataAtRowProp(item.row, item.prop, curPricingTable[`${item.prop}`], 'no-edit');
                } else {
                    //Modiying the logic from from full table update to cell update for better performance
                    if (item.new && item.new != '' && item.new.toLowerCase() === 'cash') {
                        this.autoFillOnCash(item, contractData, colSPIdx, cellEditor);
                    } else {
                        this.hotTable.setDataAtRowProp(item.row, 'SETTLEMENT_PARTNER', '', 'no-edit');
                        this.hotTable.setCellMeta(item.row, colSPIdx, 'editor', false);
                        this.hotTable.setCellMeta(item.row, colSPIdx, 'className', 'readonly-cell');
                        this.hotTable.render();
                    }
                }
            });
        } catch (ex) {
            console.error(ex);
        }
    }

    static autoFillOnCash(item, contractData, colSPIdx, cellEditor) {
        this.delReadOnlyBehaviours("SETTLEMENT_PARTNER", item);
        this.hotTable.setDataAtRowProp(item.row, 'SETTLEMENT_PARTNER', contractData.Customer.DFLT_SETTLEMENT_PARTNER, 'no-edit');
        //check object present 
        this.hotTable.setCellMeta(item.row, colSPIdx, 'editor', cellEditor);
        this.hotTable.setCellMeta(item.row, colSPIdx, 'className', '');
        this.hotTable.render();
    }

    /* AR settlement change ends here */
    static dateChange(items: Array<any>, colName: string, contractData) {
        each(items, (item) => {
            if ((item.new==undefined) || (item.new==null) || (item.new=='') || !(StaticMomentService.moment(item.new, "MM/DD/YYYY", true).isValid() || StaticMomentService.moment(item.new, "M/D/YYYY", true).isValid()) || StaticMomentService.moment(item.new).toString() === "Invalid date" || StaticMomentService.moment(item.new).format("MM/DD/YYYY") === "12/30/1899") {
                if (colName == 'OEM_PLTFRM_LNCH_DT' || colName == 'OEM_PLTFRM_EOL_DT') {
                    this.hotTable.setDataAtRowProp(item.row, colName, '', 'no-edit');
                } else {
                    this.hotTable.setDataAtRowProp(item.row, colName, StaticMomentService.moment(contractData[colName]).format("MM/DD/YYYY"), 'no-edit');
                }
            }
        });
    }

    static forcastevaluechange(items: Array<any>, columns: Array<any>){
        each(items, (item) => {
            if (item.new != null) {
                item.new = parseFloat(item.new.toString().replace(/[$,]/g, ""));
                if (item.new > 999999999) {
                    this.hotTable.setDataAtRowProp(item.row, item.prop, '999999999', 'no-edit');
                }
            }
        })
    }

    static excludeProdChanges(items: Array<any>, columns: Array<any>) {
        //when pasting multiple products from excel in 1 cell it should be comma deliminated
        items.forEach((item) => {
            if (item.new != null) {
                if (item.new.includes('\n')) {
                    item.new = item.new.split('\n').join(',');
                }
            }
        })

        let updateRows = [];
        const PTR_Exccol_ind = findIndex(columns, { data: 'PRD_EXCLDS' });
        const PTR_Inccol_ind = findIndex(columns, { data: 'PTR_USER_PRD' });
        each(items, (item) => {
            const selrow = item.row;
            let currentString = '';
            if (this.hotTable.getDataAtRowProp(selrow,'PTR_USER_PRD')) {
                currentString = selrow + ',' + 'PRD_EXCLDS';
                const obj = currentString.split(',').concat(item.new, 'no-edit');
                updateRows.push(obj);
                currentString = selrow + ',' + 'PTR_SYS_INVLD_PRD';
                const invalidProdObj=  currentString.split(',').concat('', 'no-edit');
                updateRows.push(invalidProdObj);
                this.hotTable.setCellMeta(selrow, PTR_Exccol_ind, 'className', 'normal-product');
                this.hotTable.setCellMeta(selrow, PTR_Inccol_ind, 'className', 'normal-product');
            }   
        })
        if (updateRows && updateRows.length > 0) {
            this.hotTable.batch(() => {
                this.hotTable.setDataAtRowProp(updateRows, 'no-edit');
            });
        }
    }

    static rowDCID(): number {
        let ROWID = -100;
        let PTRCount = this.hotTable.countRows();
        if (PTRCount > 0) {
            let distDCIDs = [];
            for (let i = 0; i < PTRCount; i++) {
                if (!this.hotTable.isEmptyRow(i)) {
                    //the PTR must generate based on the columns we have there are certain hidden columns which can also has some values
                    distDCIDs.push(this.hotTable.getDataAtRowProp(i, 'DC_ID'));
                } else {
                    //this means after empty row nothing to be added
                    break;
                }
            }
            //the sort by resulting is coming is the ascending order so negative will be first
            let rowId = first(sortBy(distDCIDs));
            //the result can have both existing and empty result so considering both
            if (rowId < 0) {
                return rowId - 1;
            } else {
                return ROWID;
            }
        } else {
            return ROWID;
        }
    }
    static getPTRObjOnProdCorr(selProd: any, selProds: any[], idx: number, trncOldVal: any) {
        let oldVal: any = "";
        if (trncOldVal == "") {
            oldVal = this.hotTable.getDataAtRowProp(selProds[idx].indx, 'PTR_USER_PRD').toString();
        } else {
            oldVal = trncOldVal;
        }
        let userProds = oldVal.split(',');
        let newVal = [];
        //Update the user entered prod text with product transition data
        if (userProds.length > 0) {
            each(userProds, prod => {
                let prodObjs = pluck(selProd.items, 'prodObj')
                let userInputVal = where(prodObjs, { USR_INPUT: prod });
                if (userInputVal.length > 0) {
                    newVal.push(userInputVal[0]["DERIVED_USR_INPUT"]);
                } else {
                    newVal.push(prod)
                }
            })
        }
        if (newVal.length == 0) {
            newVal[0] = oldVal
        }
        let PTR = [{ row: selProds[idx].indx, prop: 'PTR_USER_PRD', old: oldVal, new: newVal.toString() }];
        return PTR;
    }

    static updatePrdColumns(rowIndex: number, columnName: string, value: any) {
        this.hotTable.setDataAtRowProp(rowIndex, columnName, value, 'no-edit');
    }

    static getOperationProdCorr(selProd: any, deletedProd: any, products: any) {
        let rowProdCorrectordat = [];
        let PTR_SYS_PRD;
        let rowIndex;
        if (selProd) {
            PTR_SYS_PRD = this.hotTable.getDataAtRowProp(selProd.indx, 'PTR_SYS_PRD');
            rowIndex = selProd.indx;
        } else {
            PTR_SYS_PRD = this.hotTable.getDataAtRowProp(deletedProd[0].indx, 'PTR_SYS_PRD');
            rowIndex = deletedProd[0].indx;
        }
        //incase of any valid products already bind, append the prod corr
        if (typeof PTR_SYS_PRD == 'string' && PTR_SYS_PRD != '') {
            PTR_SYS_PRD = JSON.parse(PTR_SYS_PRD);
        } else {
            PTR_SYS_PRD = {};
        }
        let res;
        if (selProd)
            res = products.ProdctTransformResults[selProd.DCID];
        else
            res = products.ProdctTransformResults[deletedProd[0].DC_ID];
        let exclude = sortBy(res.E);
        let Include = sortBy(res.I);
        if (deletedProd) {
            each(deletedProd, (deletedItm) => {
                if (deletedItm.exclude) {
                    let eindex = indexOf(exclude, deletedItm.deletedUserInput)
                    if (eindex != -1) {
                        exclude = without(exclude, deletedItm.deletedUserInput)
                        //removing from PTR_SYS_PRD as well if it has any deleted product values
                        if (PTR_SYS_PRD && PTR_SYS_PRD[deletedItm.deletedUserInput] && PTR_SYS_PRD[deletedItm.deletedUserInput].length == 1 && PTR_SYS_PRD[deletedItm.deletedUserInput][0].EXCLUDE)
                            delete PTR_SYS_PRD[deletedItm.deletedUserInput]
                    }
                } else {
                    let eindex = indexOf(Include, deletedItm.deletedUserInput)
                    if (eindex != -1) {
                        Include = without(Include, deletedItm.deletedUserInput)
                        //removing from PTR_SYS_PRD as well if it has any deleted Product values
                        if (PTR_SYS_PRD && PTR_SYS_PRD[deletedItm.deletedUserInput] && PTR_SYS_PRD[deletedItm.deletedUserInput].length == 1 && !PTR_SYS_PRD[deletedItm.deletedUserInput][0].EXCLUDE)
                            delete PTR_SYS_PRD[deletedItm.deletedUserInput]
                    }
                }
            })
        }
        if (selProd) {
            each(selProd.items, selPrdItm => {
                if (selPrdItm.prodObj.EXCLUDE) {
                    let eindex = indexOf(exclude, selPrdItm.prodObj.USR_INPUT)
                    if (eindex != -1) {
                        exclude = without(exclude, selPrdItm.prodObj.USR_INPUT)
                        //removing from PTR_SYS_PRD as well if it has any values
                        if (PTR_SYS_PRD && PTR_SYS_PRD[selPrdItm.prodObj.USR_INPUT] && PTR_SYS_PRD[selPrdItm.prodObj.USR_INPUT].length == 1 && PTR_SYS_PRD[selPrdItm.prodObj.USR_INPUT][0].EXCLUDE)
                            delete PTR_SYS_PRD[selPrdItm.prodObj.USR_INPUT]
                    }
                    exclude.push(selPrdItm.prodObj.DERIVED_USR_INPUT);
                } else {
                    let iIndex = indexOf(Include, selPrdItm.prodObj.USR_INPUT)
                    if (iIndex != -1) {
                        Include = without(Include, selPrdItm.prodObj.USR_INPUT)
                        //removing from PTR_SYS_PRD as well if it has any values
                        if (PTR_SYS_PRD && PTR_SYS_PRD[selPrdItm.prodObj.USR_INPUT] && PTR_SYS_PRD[selPrdItm.prodObj.USR_INPUT].length == 1 && !PTR_SYS_PRD[selPrdItm.prodObj.USR_INPUT][0].EXCLUDE)
                            delete PTR_SYS_PRD[selPrdItm.prodObj.USR_INPUT]
                    }
                    Include.push(selPrdItm.prodObj.DERIVED_USR_INPUT);
                }
                PTR_SYS_PRD[`${selPrdItm.prod}`] = [selPrdItm.prodObj];
            })
        }
        rowProdCorrectordat.push([{ row: rowIndex, prop: 'PTR_USER_PRD', old: this.hotTable.getDataAtRowProp(rowIndex, 'PTR_USER_PRD'), new: Include.toString() }]);
        rowProdCorrectordat.push({ operation: 'prodcorr', PTR_SYS_PRD: JSON.stringify(PTR_SYS_PRD), PRD_EXCLDS: exclude.toString() });
        return rowProdCorrectordat;
    }

    static validateDensityBand(rowIndex, columns, curPricingTable, operation, translateResult, prdSrc, DensityMissingProd) {
        let response: any;
        let ValidProducts: any;
        let PTR = PTE_Common_Util.getPTEGenerate(columns, curPricingTable);
        if (operation != '') {
            response = JSON.parse(operation.PTR_SYS_PRD);
            ValidProducts = PTE_Helper_Util.splitProductForDensity(response);
        }
        else {
            ValidProducts = translateResult.ValidProducts;
        }
        if ((response && keys(response).length > 0) || (ValidProducts && keys(ValidProducts).length > 0)) {
            let selrow = rowIndex;
            let NUM_OF_TIERS = parseInt(curPricingTable.NUM_OF_TIERS);
            let pivotDensity = parseInt(curPricingTable.NUM_OF_DENSITY);
            let numOfRows = NUM_OF_TIERS * pivotDensity;
            //match the schema based on product translator/selector, in case of split product it can have multiple products
            each(ValidProducts, (item) => {
                let prod = PTEUtil.getValidDenProducts(item, prdSrc);
                let selProds = filter(PTR, (itm) => {
                    let ptrPRD = itm["PTR_USER_PRD"] ? itm["PTR_USER_PRD"].toUpperCase().split(',') : [];
                    // logic to check matching product since the product can come in any order and case to update code with those changes
                    if (ptrPRD.length > 0 && isEqual(sortBy(ptrPRD), sortBy(prod.map(v => v.toUpperCase())))) {
                        return itm;
                    }
                });
                if (selProds && selProds.length > 0) {
                    let distinctDC_IDs = uniq(pluck(selProds, 'DC_ID'));
                    each(distinctDC_IDs, dcid => {
                        let selProd = findWhere(selProds, { DC_ID: dcid });
                        if (DensityMissingProd[dcid] != undefined) {
                            delete DensityMissingProd[dcid];
                        }
                        let Nand_Den = [];
                        each(item, (prdDet) => {
                            // Handle single product with multiple density_band
                            let densities = prdDet[0].NAND_TRUE_DENSITY ? prdDet[0].NAND_TRUE_DENSITY.split(",").map(function (el) { return el.trim(); }) : [];
                            if (densities.length == 0 && !prdDet[0].EXCLUDE) {
                                densities.push("null");
                            }
                            densities.sort();
                            if (densities.length > 0 || densities.length == 0) {
                                //underscore union creates a single array without duplicates.
                                Nand_Den = union(Nand_Den, densities);
                            }
                        });
                        if (Nand_Den.indexOf("null") > -1) {
                            DensityMissingProd[(selProd.DC_ID).toString()] = ({ DCID: selProd.DC_ID, selDen: selProd.NUM_OF_DENSITY, actDen: Nand_Den.length, cond: 'nullDensity' });
                            return;
                        }
                        if (selProd && pivotDensity != Nand_Den.length) {
                            DensityMissingProd[(selProd.DC_ID).toString()] = ({ DCID: selProd.DC_ID, selDen: selProd.NUM_OF_DENSITY, actDen: Nand_Den.length, cond: 'insufficientDensity' });
                        } else {
                            let tierNumber = selProd.NUM_OF_TIERS / selProd.NUM_OF_DENSITY;
                            for (let tier = 1; tier <= tierNumber; tier++) {
                                let prodInd = 0;
                                let ind = 0;
                                filter(PTR, (item) => {
                                    // this condition is added in case of product corrector, only the selected Prod added to first row rest all will have user selected product
                                    let firstObj = find(PTR, (itm) => { return itm.DC_ID == selProd.DC_ID });
                                    if (item.DC_ID == selProd.DC_ID) {
                                        item.PTR_USER_PRD = firstObj.PTR_USER_PRD
                                    }

                                    let ptrPRD = item.PTR_USER_PRD ? item.PTR_USER_PRD.toUpperCase().split(',') : [];
                                    if (isEqual(sortBy(ptrPRD), sortBy(prod.map(v => v.toUpperCase()))) && item.TIER_NBR == tier && item.DC_ID == selProd.DC_ID) {
                                        this.hotTable.setDataAtRowProp(ind, 'DENSITY_BAND', Nand_Den[prodInd], 'no-edit');
                                        item.DENSITY_BAND = Nand_Den[prodInd];
                                        prodInd++;
                                    }
                                    ind++;
                                    return item;
                                });
                            }
                        }
                    });
                }
            })
            if (DensityMissingProd != undefined) {
                each(PTR, (itm, indx) => {
                    if (DensityMissingProd[itm.DC_ID] != undefined && DensityMissingProd[itm.DC_ID].cond) {
                        PTE_Common_Util.setBehaviors(itm);
                        itm._dirty = true;
                        if (DensityMissingProd[itm.DC_ID].cond.includes('nullDensity')) {
                            itm._behaviors.isError['DENSITY_BAND'] = true;
                            itm._behaviors.validMsg['DENSITY_BAND'] = "One or more of the products do not have density band value associated with it";
                        }
                        else if (DensityMissingProd[itm.DC_ID].cond == 'insufficientDensity') {
                            itm._behaviors.isError['DENSITY_BAND'] = true;
                            itm._behaviors.validMsg['DENSITY_BAND'] = "The no. of densities selected for the product was " + DensityMissingProd[itm.DC_ID].selDen + "but the actual no. of densities for the product is" + DensityMissingProd[itm.DC_ID].actDen;
                        }
                    }
                });
            }
        }
        return { finalPTR: PTR, validMisProds: DensityMissingProd };
    }

    static defaultVolVal(items: Array<any>, columns: any[], curPricingTable: any) {
        if (items[0].new == '' || items[0].new == null) {
            this.hotTable.setDataAtRowProp(items[0].row, 'STRT_VOL', 0, 'no-edit');
        }
    }
    
    static checkinputvalueisvalid(changes, columns,dropdownResponses){
            each(changes, obj => {
                if (obj.prop == 'QLTR_BID_GEO' || obj.prop == 'MRKT_SEG') {
                    let isvalid = true;
                    let list = obj.new && obj.new != null ? obj.new.split(',') : '';
                    const col = findIndex(columns, { data: obj.prop });
                    if(list=="" && obj.prop != 'QLTR_BID_GEO'){
                        isvalid = false;
                    }
                    each(list, name => {
                        name = name.replace(/[\[\]']+/g, '');
                        let isvalidtype = null;
                       
                        if (obj.prop == 'QLTR_BID_GEO') {
                            isvalidtype = dropdownResponses.QLTR_BID_GEO.find(x => x.dropdownName == name);
                        } else if (obj.prop == 'MRKT_SEG') {
                            //here we are checking for market segment and embeded list in market segment
                            isvalidtype = dropdownResponses.MRKT_SEG.find(x => x.DROP_DOWN == name)==undefined?dropdownResponses.MRKT_SEG.find(x => x.items  != null).items.find(y => y.DROP_DOWN == name):
                            dropdownResponses.MRKT_SEG.find(x => x.DROP_DOWN == name);
                        }
                        if (isvalidtype == undefined) {
                            isvalid = false;
                            this.hotTable.setCellMetaObject(obj.row, col, { 'className': 'error-border', comment: { value: 'This field is required' } });
                            this.hotTable.setDataAtRowProp(obj.row, obj.prop, '', 'no-edit');
                            this.hotTable.render();
                            return;
                        }
                    })
                    if(list=="" && obj.prop == 'MRKT_SEG'){
                        this.hotTable.setCellMetaObject(obj.row, col, { 'className': 'error-border', comment: { value: 'This field is required' } });
                        this.hotTable.setDataAtRowProp(obj.row, obj.prop, '', 'no-edit');
                        this.hotTable.render();
                    }
                    if (isvalid) {
                            this.hotTable.setCellMetaObject(obj.row, col, { 'className': '', comment: { value: '' } });
                            this.hotTable.render();
                    }
                }
                if (obj.prop == 'PAYOUT_BASED_ON' || obj.prop == 'PROD_INCLDS') {
                    const col = findIndex(columns, { data: obj.prop });
                    let isvalid = null;
                     
                    if (obj.prop == 'PAYOUT_BASED_ON') {
                        isvalid = dropdownResponses.PAYOUT_BASED_ON.find(x => x.DROP_DOWN == obj.new);
                    }
                    else if (obj.prop == 'PROD_INCLDS') {
                        isvalid = dropdownResponses.PROD_INCLDS.find(x => x.DROP_DOWN == obj.new);
                    }
                    if (isvalid == undefined) {
                        this.hotTable.setCellMetaObject(obj.row, col, { 'className': 'error-border', comment: { value: 'This field is required' } });
                        this.hotTable.setDataAtRowProp(obj.row, obj.prop, '', 'no-edit');
                        this.hotTable.render();
                    } else {
                        this.hotTable.setCellMetaObject(obj.row, col, { 'className': '', comment: { value: '' } });
                        this.hotTable.render();
                    }
                }
            })
        
    }

    static geoInputValidationCheck(changes, columns,dropdownResponses){
        let isvalidGeo = true
        each(changes, (item) => {
            let geolist = item.new && item.new != null ? item.new.split(',') : '';
            const col = findIndex(columns, { data: item.prop });
            each(geolist, geoname => {
                geoname = geoname.replace(/[\[\]']+/g, '');
                const geoprest = dropdownResponses.GEO_COMBINED.find(x => x.dropdownName == geoname);
                if (geoprest == undefined) {
                    isvalidGeo = false;
                    const invalidname = geoname + ' is not valid Geo'
                    this.hotTable.setCellMetaObject(item.row, col, { 'className': 'error-product', comment: { value: invalidname } });
                    this.hotTable.render();
                }
            });

            if (geolist == '') {
                isvalidGeo = false;
                const invalidname = 'This field is required';
                this.hotTable.setCellMetaObject(item.row, col, { 'className': 'error-product error-border', comment: { value: invalidname } });
                this.hotTable.render();
            }

            if (!isvalidGeo) {
                this.hotTable.setDataAtRowProp(item.row, item.prop, '', 'no-edit');
            } else {
                if (geolist != '') {
                    this.hotTable.setCellMetaObject(item.row, col, { 'className': '', comment: { value: '' } });
                    this.hotTable.render();
                }
            }
        })
    }


    static setPTRSYStoEmpty(changes: Array<any>) {
        if (changes && changes.length > 0) {
            let PTRPRDModify = [];
            each(PTE_Config_Util.flushSysPrdFields, (item) => {
                const modifiedDetails = where(changes, { prop: item });
                if (modifiedDetails && modifiedDetails.length > 0) {
                    each(modifiedDetails, (modItem) => {
                        let cString = modItem.row + ',' + 'PTR_SYS_PRD' + ',' + '' + ',' + 'no-edit';
                        PTRPRDModify.push(cString.split(','));
                    });
                }
            });
            if (PTRPRDModify && PTRPRDModify.length > 0) {
                this.hotTable.batch(() => {
                    this.hotTable.setDataAtRowProp(PTRPRDModify, 'no-edit');
                });
            }
        }
    }
}