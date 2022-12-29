import * as _ from 'underscore';
import Handsontable from 'handsontable';
import { PTE_Common_Util } from './PTE_Common_util';
import { PTE_Load_Util } from './PTE_Load_util';
import { PTE_Helper_Util } from './PTE_Helper_util';
import { PTEUtil } from './PTE.util';
import * as moment from 'moment';
import { PTE_Config_Util } from './PTE_Config_util';

export class PTE_CellChange_Util {
    constructor(hotTable: Handsontable) {
        PTE_CellChange_Util.hotTable = hotTable;
    }
    private static hotTable: Handsontable
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
        let sel_DC_ID = this.hotTable.getDataAtRowProp(selRow, 'DC_ID');
        let condition = false;
        if (sel_DC_ID) {
            condition = true;
        }
        else {
            condition = false;
        }
        return condition;
    }

    static addUpdateRowOnchange(hotTable: Handsontable, columns: any[], row: number, cellItem: any, ROW_ID: number, updateRows: Array<any>, curPricingTable: any, contractData: any, numoftier: number, tier?: number, operation?: any) {
        //make the selected row PTR_USER_PRD empty if its not the empty row
        let cols = _.map(columns, col => { return { prop: col.data } });
        _.each(cols, (val, key) => {
            let currentString = '';
            if (val.prop == 'PTR_USER_PRD') {
                //update PTR_USER_PRD with entered value
                //this exclussivlt because for  products can be with comma seperate values
                hotTable.setDataAtRowProp(row, 'PTR_USER_PRD', cellItem.new, 'no-edit');
            }
            else if (val.prop == 'DC_ID') {
                //update PTR_USER_PRD with random value if we use row index values while adding after dlete can give duplicate index
                hotTable.setDataAtRowProp(row, val.prop, ROW_ID, 'no-edit');
            }
            else if (val.prop == 'TIER_NBR') {
                //update PTR_USER_PRD with random value if we use row index values while adding after dlete can give duplicate index
                currentString = row + ',' + val.prop + ',' + tier + ',' + 'no-edit';
                updateRows.push(currentString.split(','));
            }
            else if (val.prop == 'STRT_VOL') {
                if (tier == 1) {
                    currentString = row + ',' + val.prop + ',' + 1 + ',' + 'no-edit';
                    updateRows.push(currentString.split(','));
                }
                else {
                    currentString = row + ',' + val.prop + ',' + 0 + ',' + 'no-edit';
                    updateRows.push(currentString.split(','));
                }
            }
            else if (val.prop == 'END_VOL') {
                if (tier == numoftier) {
                    currentString = row + ',' + val.prop + ',' + 'Unlimited' + ',' + 'no-edit';
                    updateRows.push(currentString.split(','));
                }
                else {
                    currentString = row + ',' + val.prop + ',' + 0 + ',' + 'no-edit';
                    updateRows.push(currentString.split(','));
                }
            }
            else if (val.prop == 'RATE') {
                currentString = row + ',' + val.prop + ',' + 0 + ',' + 'no-edit';
                updateRows.push(currentString.split(','));
            }
            else if (val.prop == 'STRT_REV') {
                if (tier == 1) {
                    currentString = row + ',' + val.prop + ',' + 0.01 + ',' + 'no-edit';
                    updateRows.push(currentString.split(','));
                }
                else {
                    currentString = row + ',' + val.prop + ',' + 0 + ',' + 'no-edit';
                    updateRows.push(currentString.split(','));
                }
            }
            else if (val.prop == 'END_REV') {
                if (tier == numoftier) {
                    currentString = row + ',' + val.prop + ',' + 9999999999.99 + ',' + 'no-edit';
                    updateRows.push(currentString.split(','));
                }
                else {
                    currentString = row + ',' + val.prop + ',' + 0 + ',' + 'no-edit';
                    updateRows.push(currentString.split(','));
                }
            }
            else if (val.prop == 'INCENTIVE_RATE') {
                currentString = row + ',' + val.prop + ',' + 0 + ',' + 'no-edit';
                updateRows.push(currentString.split(','));
            }
            else {
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
                    this.hotTable.setDataAtRowProp(row, val.prop, operation.PRD_EXCLDS, 'no-edit');
                }
                if (operation && operation.operation && operation.PTR_SYS_PRD) {
                    //this helps to avoid comma seperated issue.
                    this.hotTable.setDataAtRowProp(row, val.prop, operation.PTR_SYS_PRD, 'no-edit');
                }
                else {
                    this.hotTable.setDataAtRowProp(row, val.prop, rowData[`${val.prop}`], 'no-edit');
                }
            }
            else {
                //the condition in this logic is to avoid server side issue when sending data as null
                this.hotTable.setDataAtRowProp(row, val.prop, rowData[`${val.prop}`] == null ? '' : rowData[`${val.prop}`], 'no-edit');
            }
        }
        else {
            if (val.prop == 'PTR_SYS_PRD') {
                if (operation && operation.operation && operation.PTR_SYS_PRD) {
                    this.hotTable.setDataAtRowProp(row, val.prop, operation.PTR_SYS_PRD, 'no-edit');
                }
                else {
                    this.hotTable.setDataAtRowProp(row, val.prop, '', 'no-edit');
                }
            }
            else if (val.prop == 'PRD_EXCLDS') {
                if (operation && operation.operation && operation.PRD_EXCLDS) {
                    this.hotTable.setDataAtRowProp(row, val.prop, operation.PRD_EXCLDS, 'no-edit');
                }
                else {
                    this.hotTable.setDataAtRowProp(row, val.prop, '', 'no-edit');
                }
            }
            else if (val.prop == 'SETTLEMENT_PARTNER') {
                //update PTR_USER_PRD with random value if we use row index values while adding after delete can give duplicate index
                if ((curPricingTable[`AR_SETTLEMENT_LVL`] && curPricingTable[`AR_SETTLEMENT_LVL`].toLowerCase() == 'cash')
                        || (contractData.IS_TENDER == "1" && contractData.Customer.DFLT_TNDR_AR_SETL_LVL.toLowerCase() == 'cash')) {
                    currentString = PTE_CellChange_Util.generateUpdateRowString(row, val.prop, contractData.Customer.DFLT_SETTLEMENT_PARTNER, 'no-edit');
                }
                else {
                    currentString = PTE_CellChange_Util.generateUpdateRowString(row, val.prop, '', 'no-edit');
                }
                updateRows.push(currentString.split(','));
            }
            else if (val.prop == 'START_DT') {
                //update PTR_USER_PRD with random value if we use row index values while adding after delete can give duplicate index
                currentString = PTE_CellChange_Util.generateUpdateRowString(row, val.prop, contractData.START_DT, 'no-edit');
                updateRows.push(currentString.split(','));
            }
            else if (val.prop == 'END_DT') {
                //update PTR_USER_PRD with random value if we use row index values while adding after delete can give duplicate index
                currentString = PTE_CellChange_Util.generateUpdateRowString(row, val.prop, contractData.END_DT, 'no-edit');
                updateRows.push(currentString.split(','));
            }
            else if (val.prop == 'RESET_VOLS_ON_PERIOD') {
                //update PTR_USER_PRD with random value if we use row index values while adding after delete can give duplicate index
                currentString = PTE_CellChange_Util.generateUpdateRowString(row, val.prop, 'No', 'no-edit');
                updateRows.push(currentString.split(','));
            }
            else if (val.prop == 'CUST_ACCNT_DIV') {
                currentString = PTE_CellChange_Util.generateUpdateRowString(row, val.prop, contractData.CUST_ACCNT_DIV, 'no-edit');
                updateRows.push(currentString.split(','));
            }
            else if (val.prop == 'AR_SETTLEMENT_LVL' && contractData.IS_TENDER == "1") {
                currentString = PTE_CellChange_Util.generateUpdateRowString(row, val.prop, contractData.Customer.DFLT_TNDR_AR_SETL_LVL, 'no-edit');
                updateRows.push(currentString.split(','));
            }
            else if (val.prop == 'TOTAL_DOLLAR_AMOUNT' && curPricingTable.OBJ_SET_TYPE_CD == 'PROGRAM') {
                currentString = PTE_CellChange_Util.generateUpdateRowString(row, val.prop, '0.00', 'no-edit');
                updateRows.push(currentString.split(','));
            }
            else if (val.prop == 'ADJ_ECAP_UNIT' && curPricingTable.OBJ_SET_TYPE_CD == 'PROGRAM') {
                currentString = PTE_CellChange_Util.generateUpdateRowString(row, val.prop, '0', 'no-edit');
                updateRows.push(currentString.split(','));
            }
            else if (val.prop == 'MRKT_SEG') {
                let cellVal = curPricingTable[`${val.prop}`] ? curPricingTable[`${val.prop}`] : '';
                this.hotTable.setDataAtRowProp(row, val.prop, cellVal, 'no-edit');
            }
            else if (val.prop == 'GEO_COMBINED') {
                let cellVal = curPricingTable[`${val.prop}`] ? curPricingTable[`${val.prop}`] : '';
                this.hotTable.setDataAtRowProp(row, val.prop, cellVal, 'no-edit');
            }
            else if (val.prop == 'ECAP_PRICE') {
                let ecapPrice = this.hotTable.getDataAtRowProp(row, 'ECAP_PRICE');
                if (ecapPrice == null || ecapPrice == "")
                    this.hotTable.setDataAtRowProp(row, val.prop, '0.00', 'no-edit');
            }
            else if (val.prop == 'CAP') {
                let cellVal = PTE_CellChange_Util.getValueForCurrentRow(updateRows, operation, row, val.prop, cellItem);
                currentString = PTE_CellChange_Util.generateUpdateRowString(row, val.prop, cellVal, 'no-edit');
                updateRows.push(currentString.split(','));
            }
            else if (val.prop == 'YCS2') {
                let cellVal = PTE_CellChange_Util.getValueForCurrentRow(updateRows, operation, row, val.prop, cellItem);
                currentString = PTE_CellChange_Util.generateUpdateRowString(row, val.prop, cellVal, 'no-edit');
                updateRows.push(currentString.split(','));
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

    static getMergeCellsOnEdit(empRow: number, NUM_OF_TIERS: number, pricingTableTemplates: any): void {
        let mergCells: any = null;
        //identify distinct DCID, bcz the merge will happen for each DCID and each DCID can have diff  NUM_OF_TIERS
        //get NUM_OF_TIERS acoording this will be the row_span for handson
        mergCells = this.hotTable.getSettings().mergeCells;
        _.each(pricingTableTemplates.columns, (colItem, ind) => {
            //dont merge if rowspan and colspan is 1
            if (!colItem.isDimKey && !colItem.hidden && NUM_OF_TIERS != 1) {
                mergCells.push({ row: empRow, col: ind, rowspan: NUM_OF_TIERS, colspan: 1 });
            }
        })
        this.hotTable.updateSettings({ mergeCells: mergCells });

    }
    static addUpdateRowOnchangeKIT(hotTable: Handsontable, columns: any[], row: number, cellItem: any, ROW_ID: number, updateRows: Array<any>, curPricingTable: any, contractData: any, product: number, rowData?: any, operation?: any) {
        //make the selected row PTR_USER_PRD empty if its not the empty row
        let cols = _.map(columns, col => { return { prop: col.data } });
        _.each(cols, (val, key) => {
            let currentString = '';
            if (val.prop == 'PTR_USER_PRD') {
                hotTable.setDataAtRowProp(row, 'PTR_USER_PRD', cellItem.new, 'no-edit');
            }
            else if (val.prop == 'DC_ID') {
                hotTable.setDataAtRowProp(row, val.prop, ROW_ID, 'no-edit');
            }
            else if (val.prop == 'PRD_BCKT') {
                //update PTR_USER_PRD with random value if we use row index values while adding after dlete can give duplicate index
                currentString = row + ',' + val.prop + ',' + product + ',' + 'no-edit';
                updateRows.push(currentString.split(','));
            }
            else if (val.prop == 'QTY' && rowData == null) {
                //update PTR_USER_PRD with random value if we use row index values while adding after dlete can give duplicate index
                currentString = row + ',' + val.prop + ',' + '1' + ',' + 'no-edit';
                updateRows.push(currentString.split(','));
            }
            else if ((val.prop == 'ECAP_PRICE' || val.prop == 'ECAP_PRICE_____20_____1' || val.prop == 'TEMP_KIT_REBATE' || val.prop == 'DSCNT_PER_LN' || val.prop == 'TEMP_TOTAL_DSCNT_PER_LN') && rowData == null) {
                currentString = row + ',' + val.prop + ',' + '0' + ',' + 'no-edit';
                updateRows.push(currentString.split(','));
            }
            else {
                this.addUpdateRowOnchangeCommon(row, val, updateRows, curPricingTable, contractData, rowData, operation, cellItem);
            }
        });


    }
    static getMergeCellsOnEditKit(isExist: boolean, empRow: number, prodLen: number, pricingTableTemplates: any, itrObj?: any): any {
        let mergCells: any = null;
        if (!isExist) {
            mergCells = this.hotTable.getSettings().mergeCells;
            _.each(pricingTableTemplates.columns, (colItem, ind) => {
                //dont merge if rowspan and colspan is 1
                if (!colItem.isDimKey && !colItem.hidden && prodLen != 1) {
                    mergCells.push({ row: empRow, col: ind, rowspan: prodLen, colspan: 1 });
                }
            });
            if (mergCells && mergCells.length > 0) {
                this.hotTable.updateSettings({ mergeCells: mergCells });
            }
        }
        else {
            //for existing rows its only updting the row span
            mergCells = [];
            _.each(itrObj, item => {
                _.each(pricingTableTemplates.columns, (colItem, ind) => {
                    //dont merge if rowspan and colspan is 1
                    if (!colItem.isDimKey && !colItem.hidden && item.leng != 1) {
                        mergCells.push({ row: item.indx, col: ind, rowspan: item.leng, colspan: 1 });
                    }
                });
            })
            if (mergCells && mergCells.length > 0) {
                this.hotTable.updateSettings({ mergeCells: mergCells });
            }
        }
    }
    static autoFillCellonProdKit(items: Array<any>, curPricingTable: any, contractData: any, pricingTableTemplates: any, columns: any[], operation?: any) {
        let updateRows = [];
        if (items && items.length == 1) {
            const selrow = items[0].row;
            //to identify the uniq records
            let prods =_.uniq(items[0].new.split(','));
            items[0].new=prods.toString();
            if (!this.isAlreadyChange(selrow)) {
                //identify the empty row and add it there
                let empRow = this.returnEmptyRow();
                let ROW_ID = this.rowDCID();
                this.hotTable.alter('remove_row', selrow, 1, 'no-edit');
                //this line of code is only for KIT incase of success product
                if (operation && operation.operation) {
                    let PTR_col_ind = _.findIndex(columns, { data: 'PTR_USER_PRD' });
                    this.hotTable.setCellMeta(empRow, PTR_col_ind, 'className', 'success-product');
                }
                //based on the number of products listed we have to iterate the 
                let prodIndex = 0;
                //KIT Deal will not allow more than 10 rows
                let prdlen=prods.length>10?PTE_Config_Util.maxKITproducts:prods.length;
                for (let i = empRow; i < prdlen + empRow; i++) {
                    this.addUpdateRowOnchangeKIT(this.hotTable, columns, i, items[0], ROW_ID, updateRows, curPricingTable, contractData, prods[prodIndex], null, operation);
                    prodIndex++;
                }
                //calling the merge cells option based of number of products
                this.getMergeCellsOnEditKit(false, empRow, prdlen, pricingTableTemplates);
            }
            else {
                if (items[0].old != items[0].new) {
                    //get the DC_ID of selected row
                    let ROW_ID = this.hotTable.getDataAtRowProp(selrow, 'DC_ID');
                    //the row can be insert or delete to get that we are removing and adding the rows
                    let DataOfRow = _.filter(PTE_Common_Util.getPTEGenerate(columns, curPricingTable), itm => { return itm.DC_ID == ROW_ID });
                    //logic to calculate rebate price on product change in KIT and assign to DataROw so that it will assign in addUpdateRowOnchangeKIT
                    DataOfRow[0]['TEMP_KIT_REBATE'] = this.kitEcapChangeOnProd(items[0], DataOfRow.slice(0, items[0].new.split(',').length));
                    this.hotTable.alter('remove_row', selrow, items[0].old.split(',').length, 'no-edit');
                    this.hotTable.alter('insert_row', selrow, items[0].new.split(',').length, 'no-edit');
                    //this line of code is only for KIT incase of success product
                    if (operation && operation.operation) {
                        let PTR_col_ind = _.findIndex(columns, { data: 'PTR_USER_PRD' });
                        this.hotTable.setCellMeta(selrow, PTR_col_ind, 'className', 'success-product');
                    }
                    //this line of code is only for KIT incase of any change in product
                    else {
                        let PTR_col_ind = _.findIndex(columns, { data: 'PTR_USER_PRD' });
                        this.hotTable.setCellMeta(selrow, PTR_col_ind, 'className', 'normal-product');
                    }
                    let prodIndex = 0;
                    //KIT Deal will not allow more than 10 rows
                    let prdlen=prods.length>10?PTE_Config_Util.maxKITproducts:prods.length;
                    for (let i = selrow; i < prdlen + selrow; i++) {
                        this.addUpdateRowOnchangeKIT(this.hotTable, columns, i, items[0], ROW_ID, updateRows, curPricingTable, contractData, prods[prodIndex], DataOfRow[prodIndex], operation);
                        prodIndex++;
                    }
                    let PTR = PTE_Common_Util.getPTEGenerate(columns, curPricingTable);
                    let DCIDS = _.pluck(PTR, 'DC_ID');
                    let countOfDCID = _.countBy(_.pluck(PTR, 'DC_ID'))
                    let iterObj = [];
                    //calling the merge cells options numb of products ans setting mergcells to null first since we are doing all togather
                    _.each(_.uniq(DCIDS), DCID => {
                        iterObj.push({ DCID: DCID, leng: countOfDCID[`${DCID}`], indx: _.indexOf(DCIDS, DCID) })
                    });
                    this.getMergeCellsOnEditKit(true, 1, 1, pricingTableTemplates, iterObj);
                }
            }
        }
        //in case of copy paste or autofill
        else {
            //for length greater than 1 it will either copy or autofill so first cleaning those records since its prod the length can be predicted so deleting full
            this.hotTable.alter('remove_row', items[0].row, PTE_Config_Util.girdMaxRows, 'no-edit');
            //identify the empty row and the next empty row will be the consecutive one
            let empRow = this.returnEmptyRow();
            _.each(items, (cellItem) => {
                let ROW_ID = this.rowDCID();//_.random(250); // will be replace with some other logic
                //add num of tier rows the logic will be based on autofill value
                let prods = _.uniq(cellItem.new.split(',')), prodIndex = 0;
                 //to identify the uniq records
                cellItem.new=prods.toString();
                //KIT Deal will not allow more than 10 rows
                let prdlen=prods.length>10?PTE_Config_Util.maxKITproducts:prods.length;
                for (let i = empRow; i < prdlen + empRow; i++) {
                    this.addUpdateRowOnchangeKIT(this.hotTable, columns, i, cellItem, ROW_ID, updateRows, curPricingTable, contractData, prods[prodIndex], null, operation);
                    prodIndex++;
                }
                //calling the merge cells optionfor tier 
                this.getMergeCellsOnEdit(empRow,prdlen,pricingTableTemplates);
                //the next empty row will be previus empty row + num of tiers;
                empRow = empRow + prdlen;
            });
        }
        if (updateRows && updateRows.length > 0) {
            //appending everything together batch function will improve the performace
            this.hotTable.batch(() => {
                this.hotTable.setDataAtRowProp(updateRows, 'no-edit');
            });
        }
    }
    static autoFillCellonProdVol(items: Array<any>, curPricingTable: any, contractData: any, pricingTableTemplates: any, columns: any[], operation?: any) {
        let updateRows = [];
        //the numbe of tiers has to take from autofill for now taken from PT
        let NUM_OF_TIERS = curPricingTable.NUM_OF_TIERS;
        //The effort for autofill for one change and mulitple changes are little different
        if (items && items.length == 1) {
            let selrow = items[0].row;
            //check if there is already a merge/change avaialble
            if (!this.isAlreadyChange(selrow)) {
                //identify the empty row and add it there
                let empRow = this.returnEmptyRow();
                let ROW_ID = this.rowDCID(); // will be replace with some other logic
                //first deleting the row this will help if the empty row and selected row doest match
                this.hotTable.alter('remove_row', selrow, 1, 'no-edit');
                //this line of code is only for KIT incase of success product
                if (operation && operation.operation) {
                    let PTR_col_ind = _.findIndex(columns, { data: 'PTR_USER_PRD' });
                    this.hotTable.setCellMeta(empRow, PTR_col_ind, 'className', 'success-product');
                }
                //add num of tier rows the logic will be based on autofill value
                let tier = 1;
                for (let i = empRow; i < parseInt(NUM_OF_TIERS) + empRow; i++) {
                    this.addUpdateRowOnchange(this.hotTable, columns, i, items[0], ROW_ID, updateRows, curPricingTable, contractData, NUM_OF_TIERS, tier, operation);
                    tier++;
                }
                //calling the merge cells option only where tier
                this.getMergeCellsOnEdit(empRow, parseInt(curPricingTable.NUM_OF_TIERS), pricingTableTemplates);
            }
            else {
                //this line of code is only for KIT incase of success product
                if (operation && operation.operation) {
                    let PTR_col_ind = _.findIndex(columns, { data: 'PTR_USER_PRD' });
                    this.hotTable.setCellMeta(selrow, PTR_col_ind, 'className', 'success-product');
                }
                if (operation && operation.operation && operation.PRD_EXCLDS) {
                    let PTR_EXCLUDE_col_ind = _.findIndex(columns, { data: 'PRD_EXCLDS' });
                    this.hotTable.setDataAtRowProp(selrow, 'PRD_EXCLDS', operation.PRD_EXCLDS, 'no-edit');
                    this.hotTable.setCellMeta(selrow, PTR_EXCLUDE_col_ind, 'className', 'success-product');
                }
                else if (operation && operation.operation && operation.PRD_EXCLDS != undefined && operation.PRD_EXCLDS == "") {
                    let PTR_EXCLUDE_col_ind = _.findIndex(columns, { data: 'PRD_EXCLDS' });
                    this.hotTable.setDataAtRowProp(selrow, 'PRD_EXCLDS', '', 'no-edit');
                    this.hotTable.setCellMeta(selrow, PTR_EXCLUDE_col_ind, 'className', 'normal-product');
                }
                if (operation && operation.operation && operation.PTR_SYS_PRD) {
                    this.hotTable.setDataAtRowProp(selrow, 'PTR_USER_PRD', items[0].new, 'no-edit');
                    this.hotTable.setDataAtRowProp(selrow, 'PTR_SYS_PRD', operation.PTR_SYS_PRD, 'no-edit');
                }
                else {
                    //this will rever the produc color back to empty
                    if (items[0].old != items[0].new && (operation == undefined || operation == null)) {
                        let PTR_col_ind = _.findIndex(columns, { data: 'PTR_USER_PRD' });
                        this.hotTable.setCellMeta(selrow, PTR_col_ind, 'className', 'normal-product');

                        //This will make sure to hit translate API
                        this.hotTable.setDataAtRowProp(selrow, 'PTR_SYS_PRD', '', 'no-edit');
                        this.hotTable.setDataAtRowProp(selrow, 'PTR_SYS_INVLD_PRD', '', 'no-edit');
                    }
                    
                }
            }
        }
        else {
            //for length greater than 1 it will eithr copy or autofill so first cleaning those recorsds
            this.hotTable.alter('remove_row', items[0].row, items.length * parseInt(curPricingTable.NUM_OF_TIERS), 'no-edit');
            //identify the empty row and the next empty row will be the consecutive one
            let empRow = this.returnEmptyRow();
            _.each(items, (cellItem) => {
                let ROW_ID = this.rowDCID(); // will be replace with some other logic
                //add num of tier rows the logic will be based on autofill value
                let tier = 1;
                for (let i = empRow; i < parseInt(curPricingTable.NUM_OF_TIERS) + empRow; i++) {
                    this.addUpdateRowOnchange(this.hotTable, columns, i, cellItem, ROW_ID, updateRows, curPricingTable, contractData, NUM_OF_TIERS, tier, operation);
                    tier++;
                }
                //calling the merge cells optionfor tier 
                this.getMergeCellsOnEdit(empRow, parseInt(curPricingTable.NUM_OF_TIERS), pricingTableTemplates);
                //the next empty row will be previus empty row + num of tiers;
                empRow = empRow + parseInt(curPricingTable.NUM_OF_TIERS);
            });
        }
        if (updateRows && updateRows.length > 0) {
            //appending everything togather batch function will improve the performace
            this.hotTable.batch(() => {
                this.hotTable.setDataAtRowProp(updateRows, 'no-edit');
            });
           
        }

    }
    static autoFillCellOnProd(items: Array<any>, curPricingTable: any, contractData: any, pricingTableTemplates: any, columns: any[], operation?: any) {
        try {
            let OBJ_SET_TYPE_CD = curPricingTable.OBJ_SET_TYPE_CD;
            if (OBJ_SET_TYPE_CD && OBJ_SET_TYPE_CD == 'KIT') {
                this.autoFillCellonProdKit(items, curPricingTable, contractData, pricingTableTemplates, columns, operation);
            }
            else if (OBJ_SET_TYPE_CD && (OBJ_SET_TYPE_CD == 'VOL_TIER' || OBJ_SET_TYPE_CD == 'FLEX' || OBJ_SET_TYPE_CD == 'REV_TIER')) {
                this.autoFillCellonProdVol(items, curPricingTable, contractData, pricingTableTemplates, columns, operation);
            }
            else if (OBJ_SET_TYPE_CD == 'DENSITY') {
                this.autoFillCellonProdDensity(items, curPricingTable, contractData, pricingTableTemplates, columns, operation);
            }
            else {                
                let updateRows = [];
                //the numbe of tiers has to take from autofill for now taken from PT
                let NUM_OF_TIERS = curPricingTable.NUM_OF_TIERS;
                //The effort for autofill for one change and mulitple changes are little different
                if (items && items.length == 1) {
                    let selrow = items[0].row;
                    //check if there is already a merge/change avaialble
                    if (!this.isAlreadyChange(selrow)) {
                        //identify the empty row and add it there
                        let empRow = this.returnEmptyRow();
                        let ROW_ID = this.rowDCID();// will be replace with some other logic
                        //first deleting the row this will help if the empty row and selected row doest match
                        this.hotTable.alter('remove_row', selrow, 1, 'no-edit');
                        //this line of code is to mak sure we modify the product background color to sucess
                        if (operation && operation.operation) {
                            let PTR_col_ind = _.findIndex(columns, { data: 'PTR_USER_PRD' });
                            this.hotTable.setCellMeta(empRow, PTR_col_ind, 'className', 'success-product');
                        }
                        this.addUpdateRowOnchange(this.hotTable, columns, empRow, items[0], ROW_ID, updateRows, curPricingTable, contractData, 0, 1, operation);
                    }
                    else {
                        //this line of code is to mak sure we modify the product background color to sucess
                        if (operation && operation.operation) {
                            let PTR_col_ind = _.findIndex(columns, { data: 'PTR_USER_PRD' });
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
                        }
                        else {
                            //this will rever the produc color back to empty
                            if (items[0].old != items[0].new && (operation == undefined || operation == null)) {
                                let PTR_col_ind = _.findIndex(columns, { data: 'PTR_USER_PRD' });
                                this.hotTable.setCellMeta(selrow, PTR_col_ind, 'className', 'normal-product');

                                //This will make sure to hit translate API
                                this.hotTable.setDataAtRowProp(selrow, 'PTR_SYS_PRD', '', 'no-edit');
                                this.hotTable.setDataAtRowProp(selrow, 'PTR_SYS_INVLD_PRD', '', 'no-edit');
                            }
                            if (operation && operation.operation && operation.PRD_EXCLDS != undefined && operation.PRD_EXCLDS == "") {
                                let PTR_EXCLUDE_col_ind = _.findIndex(columns, { data: 'PRD_EXCLDS' });
                                this.hotTable.setDataAtRowProp(selrow, 'PRD_EXCLDS', '', 'no-edit');
                                this.hotTable.setCellMeta(selrow, PTR_EXCLUDE_col_ind, 'className', 'normal-product');
                            }
                        }
                    }
                }
                else {
                    //for length greater than 1 it will eithr copy or autofill so first cleaning those recorsds
                    if (curPricingTable.OBJ_SET_TYPE_CD && curPricingTable.OBJ_SET_TYPE_CD == 'VOL_TIER') {
                        this.hotTable.alter('remove_row', items[0].row, items.length * parseInt(curPricingTable.NUM_OF_TIERS), 'no-edit');
                    }
                    else {
                        this.hotTable.alter('remove_row', items[0].row, items.length, 'no-edit');
                    }

                    //identify the empty row and the next empty row will be the consecutive one
                    let empRow = this.returnEmptyRow();
                    _.each(items, (cellItem) => {
                        let ROW_ID = this.rowDCID();//_.random(250); // will be replace with some other logic
                        this.addUpdateRowOnchange(this.hotTable, columns, empRow, cellItem, ROW_ID, updateRows, curPricingTable, contractData, 0, 1, operation);
                        empRow++;
                    });
                }
                if (updateRows && updateRows.length > 0) {
                    //appending everything togather batch function will improve the performace
                    this.hotTable.batch(() => {
                        this.hotTable.setDataAtRowProp(updateRows, 'no-edit');
                    });
                }
            }
        }
        catch (ex) {
            console.error(ex);
        }
    }

    static addUpdateRowOnchangeDensity(hotTable: Handsontable, row: number, cellItem: any, ROW_ID: number, updateRows: Array<any>, curPricingTable: any, contractData: any, numoftier: number, tier?: number, operation?: any) {
        //make the selected row PTR_USER_PRD empty if its not the empty row
        _.each(hotTable.getCellMetaAtRow(0), (val, key) => {
            let currentString = '';
            if (val.prop == 'PTR_USER_PRD') {
                //update PTR_USER_PRD with entered value
                //this exclussivlt because for  products can be with comma seperate values
                hotTable.setDataAtRowProp(row, 'PTR_USER_PRD', cellItem.new, 'no-edit');
            }
            else if (val.prop == 'DC_ID') {
                //update PTR_USER_PRD with random value if we use row index values while adding after dlete can give duplicate index
                hotTable.setDataAtRowProp(row, val.prop, ROW_ID, 'no-edit');
            }
            else if (val.prop == 'TIER_NBR') {
                //update PTR_USER_PRD with random value if we use row index values while adding after dlete can give duplicate index
                currentString = row + ',' + val.prop + ',' + tier + ',' + 'no-edit';
                updateRows.push(currentString.split(','));
            }
            else if (val.prop == 'STRT_PB') {
                if (tier == 1) {
                    currentString = row + ',' + val.prop + ',' + 0.001 + ',' + 'no-edit';
                    updateRows.push(currentString.split(','));
                }
                else {
                    currentString = row + ',' + val.prop + ',' + 0 + ',' + 'no-edit';
                    updateRows.push(currentString.split(','));
                }
            }
            else if (val.prop == 'END_PB') {
                if (tier == numoftier) {
                    currentString = row + ',' + val.prop + ',' + 'Unlimited' + ',' + 'no-edit';
                    updateRows.push(currentString.split(','));
                }
                else {
                    currentString = row + ',' + val.prop + ',' + 0 + ',' + 'no-edit';
                    updateRows.push(currentString.split(','));
                }
            }
            else if (val.prop == 'DENSITY_RATE') {
                currentString = row + ',' + val.prop + ',' + 0 + ',' + 'no-edit';
                updateRows.push(currentString.split(','));
            }
            else {
                if (val.prop != 'DENSITY_BAND') {
                    this.addUpdateRowOnchangeCommon(row, val, updateRows, curPricingTable, contractData, null, operation, cellItem);
                }
            }
        });
    }

    static getMergeCellsOnEditDensity(empRow: number, NUM_OF_TIERS: number, pivotDensity: number, numOfRows: number, pricingTableTemplates: any): void {
        let mergCells: any = null;
        let startOffset = empRow;
        mergCells = this.hotTable.getSettings().mergeCells;
        _.each(pricingTableTemplates.columns, (colItem, ind) => {
            if (colItem.field == 'TIER_NBR' || colItem.field == 'STRT_PB' || colItem.field == 'END_PB') {
                for (let i = 1; i <= NUM_OF_TIERS; i++) {
                    mergCells.push({ row: startOffset, col: ind, rowspan: pivotDensity, colspan: 1 });
                    startOffset = startOffset + pivotDensity;
                }
                startOffset = empRow;
            }
            //dont merge if rowspan and colspan is 1
            else if (!colItem.isDimKey && !colItem.hidden && numOfRows != 1) {
                mergCells.push({ row: empRow, col: ind, rowspan: numOfRows, colspan: 1 });
            }
        });
        this.hotTable.updateSettings({ mergeCells: mergCells });
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
            if (!this.isAlreadyChange(selrow)) {
                //identify the empty row and add it there
                let empRow = this.returnEmptyRow();
                let ROW_ID = this.rowDCID();//_.random(250); // will be replace with some other logic
                //first deleting the row this will help if the empty row and selected row doest match
                this.hotTable.alter('remove_row', selrow, 1, 'no-edit');
                //add num of tier rows the logic will be based on autofill value
                let tier = 1;
                for (let i = empRow; i < numOfRows + empRow; i++) {
                    for (let j = 0; j < pivotDensity; j++) {
                        this.addUpdateRowOnchangeDensity(this.hotTable, i, items[0], ROW_ID, updateRows, curPricingTable, contractData, NUM_OF_TIERS, tier, operation);
                        i++
                    }
                    i = i - 1;
                    tier++;
                }
                this.getMergeCellsOnEditDensity(empRow, NUM_OF_TIERS, pivotDensity, numOfRows, pricingTableTemplates);
            }
            else {
                if (operation && operation.operation) {
                    let PTR_col_ind = _.findIndex(columns, { data: 'PTR_USER_PRD' });
                    this.hotTable.setCellMeta(selrow, PTR_col_ind, 'className', 'success-product');
                }                
                if (operation && operation.operation && operation.PTR_SYS_PRD) {
                    this.hotTable.setDataAtRowProp(selrow, 'PTR_USER_PRD', items[0].new, 'no-edit');
                    this.hotTable.setDataAtRowProp(selrow, 'PTR_SYS_PRD', operation.PTR_SYS_PRD, 'no-edit');
                }
                if (operation && operation.operation && operation.PRD_EXCLDS) {
                    this.hotTable.setDataAtRowProp(selrow, 'PTR_USER_PRD', items[0].new, 'no-edit');
                    this.hotTable.setDataAtRowProp(selrow, 'PRD_EXCLDS', operation.PRD_EXCLDS, 'no-edit');
                }
                else {
                    //this will rever the produc color back to empty
                    if (items[0].old != items[0].new && (operation == undefined || operation == null)) {
                        let PTR_col_ind = _.findIndex(columns, { data: 'PTR_USER_PRD' });
                        this.hotTable.setCellMeta(selrow, PTR_col_ind, 'className', 'normal-product');

                        //This will make sure to hit translate API
                        this.hotTable.setDataAtRowProp(selrow, 'PTR_SYS_PRD', '', 'no-edit');
                        this.hotTable.setDataAtRowProp(selrow, 'PTR_SYS_INVLD_PRD', '', 'no-edit');
                    }
                    if (operation && operation.operation && operation.PRD_EXCLDS != undefined && operation.PRD_EXCLDS == "") {
                        let PTR_EXCLUDE_col_ind = _.findIndex(columns, { data: 'PRD_EXCLDS' });
                        this.hotTable.setDataAtRowProp(selrow, 'PRD_EXCLDS', '', 'no-edit');
                        this.hotTable.setCellMeta(selrow, PTR_EXCLUDE_col_ind, 'className', 'normal-product');
                    }
                }

            }
        }
        else {
            //for length greater than 1 it will eithr copy or autofill so first cleaning those recorsds
            this.hotTable.alter('remove_row', items[0].row, items.length * numOfRows, 'no-edit');
            //identify the empty row and the next empty row will be the consecutive one
            let empRow = this.returnEmptyRow();
            _.each(items, (cellItem) => {
                let ROW_ID = this.rowDCID();//_.random(250); // will be replace with some other logic
                //add num of tier rows the logic will be based on autofill value
                let tier = 1;
                for (let i = empRow; i < numOfRows + empRow; i++) {
                    for (let j = 0; j < pivotDensity; j++) {
                        this.addUpdateRowOnchangeDensity(this.hotTable, i, items[0], ROW_ID, updateRows, curPricingTable, contractData, NUM_OF_TIERS, tier, operation);
                        i++
                    }
                    i = i - 1;
                    tier++;
                }
                //calling the merge cells optionfor tier 
                this.getMergeCellsOnEditDensity(empRow, NUM_OF_TIERS, pivotDensity, numOfRows, pricingTableTemplates);
                //the next empty row will be previus empty row + num of tiers;
                empRow = empRow + numOfRows;
            });
        }
        if (updateRows && updateRows.length > 0) {
             //appending everything togather batch function will improve the performace
             this.hotTable.batch(() => {
                this.hotTable.setDataAtRowProp(updateRows, 'no-edit');
            });
        }
    }

    /* Prod selector autofill changes functions ends here */
    
    static kitEcapChangeOnProd(item: any, PTR: any[]): number {
        let DCID = this.hotTable.getDataAtRowProp(item.row, 'DC_ID');
        let numOfTiers = _.where(PTR, { DC_ID: DCID }).length;
        let firstTierRowInd = _.findIndex(PTR, x => { return x.DC_ID == DCID })
        let val = PTE_Load_Util.calculateKitRebate(PTR, firstTierRowInd, numOfTiers, false)
        return val
    }
    static kitEcapPriceChange(items: Array<any>, columns: any[], curPricingTable: any) {
        try {
            let OBJ_SET_TYPE_CD = curPricingTable.OBJ_SET_TYPE_CD;
            if (OBJ_SET_TYPE_CD && OBJ_SET_TYPE_CD == 'KIT') {
                let PTR = PTE_Common_Util.getPTEGenerate(columns, curPricingTable);
                _.each(items, item => {
                    let DCID = this.hotTable.getDataAtRowProp(item.row, 'DC_ID');
                    let numOfTiers = _.where(PTR, { DC_ID: DCID }).length;
                    let firstTierRowInd = _.findIndex(PTR, x => { return x.DC_ID == DCID })
                    let val = PTE_Load_Util.calculateKitRebate(PTR, firstTierRowInd, numOfTiers, false)
                    this.hotTable.setDataAtRowProp(firstTierRowInd, 'TEMP_KIT_REBATE', val, 'no-edit');
                });
            }
        }
        catch (ex) {
            console.error(ex);
        }
    }
    static kitDSCNTChange(items: Array<any>, columns: any[], curPricingTable: any) {
        try {
            let OBJ_SET_TYPE_CD = curPricingTable.OBJ_SET_TYPE_CD;
            if (OBJ_SET_TYPE_CD && OBJ_SET_TYPE_CD == 'KIT') {
                _.each(items, item => {
                    let val = PTE_Load_Util.calculateTotalDsctPerLine(this.hotTable.getDataAtRowProp(item.row, 'DSCNT_PER_LN'), this.hotTable.getDataAtRowProp(item.row, 'QTY'))
                    this.hotTable.setDataAtRowProp(item.row, 'TEMP_TOTAL_DSCNT_PER_LN', val, 'no-edit');
                    if (item.prop && item.prop == 'QTY') {
                        this.kitEcapPriceChange([item], columns, curPricingTable);
                    }
                })
            }
        }
        catch (ex) {
            console.error(ex);
        }

    }
    static kitNameExists(items: any[], columns: any[], curPricingTable: any):any {
        try {
            let OBJ_SET_TYPE_CD = curPricingTable.OBJ_SET_TYPE_CD;
            if (OBJ_SET_TYPE_CD && OBJ_SET_TYPE_CD == 'KIT') {
                //add HAS_TRACKER column and _behaviors to check existing row are editable or not
                let columnList = PTE_Common_Util.deepClone(columns);
                columnList.push({ data: 'HAS_TRACKER' });
                columnList.push({ data: '_behaviors' });
              //check for the same KIT name exists
                let PTR = PTE_Common_Util.getPTEGenerate(columnList, curPricingTable);
              let uniqnames=_.uniq(_.pluck(items,'new'));
              let PTR_exist=[];
              //iterate throght the PTR and get consolidate result for all duplicate
              _.each(uniqnames,uniqnm=>{
                if(uniqnm && uniqnm !=''){
                    let curPTR=[];
                    _.each(PTR,(cr,row)=>{
                        if(cr['DEAL_GRP_NM'].toUpperCase()==uniqnm.toUpperCase()){
                         cr['row']=row;
                         curPTR.push(cr);
                       }
                     });
                    //If there is already same name the length will atleast 2
                    if (curPTR.length > 1) {
                        //existing Row editable or not
                        let existingRow = curPTR.filter(x => x.DC_ID > 0);
                        let isNotEditable = curPTR.filter(x => (x.HAS_TRACKER && x.HAS_TRACKER == '1') ||
                            (x._behaviors && x._behaviors.isReadOnly && x._behaviors.isReadOnly["PTR_USER_PRD"])).length > 0 ? true : false;
                        if (isNotEditable)
                            PTR_exist.push({ PTR: curPTR, name: uniqnm, issueType: 'notEditable' })
                        else {
                            //identify the uniq product count of the duplicate KIT
                            let unqcount = _.uniq(_.compact(_.pluck(curPTR, 'PTR_USER_PRD').toString().split(','))).length
                            if (unqcount && unqcount > PTE_Config_Util.maxKITproducts) {
                                PTR_exist.push({ PTR: curPTR, name: uniqnm, issueType: 'dupMoreLeng' })
                            }
                            else {
                                PTR_exist.push({ PTR: curPTR, name: uniqnm, issueType: 'dup' })
                            }
                        }
                    }
                  }
                });
             
              if(PTR_exist && PTR_exist.length>0){
                return PTR_exist;
              }
              else{
                return [];
              }
            }
        }
        catch (ex) {
            console.error(ex);
        }
    }
    static mergeKitDeal(items: any, columns: any[], curPricingTable: any,contractData:any,pricingTableTemplates:any){
        //first delete all the rows except the min one
        let PTR=PTE_Common_Util.getPTEGenerate(columns,curPricingTable);
        PTR=_.map(PTR,(x)=>{ return {DEAL_GRP_NM:x['DEAL_GRP_NM'].toUpperCase()}});
        let firstInd=_.findIndex(PTR,{DEAL_GRP_NM:items.name.toUpperCase()});
        let prods='';
        _.each(items.PTR,PTR=>{
            prods=prods+PTR['PTR_USER_PRD']+',';
        });
         //modify the first cell with all uniq products
        let uniqprod=_.uniq(prods.substring(0, prods.length - 1).split(','));
        //making sure not more than max KIT prod is available.
        uniqprod=uniqprod.length>PTE_Config_Util.maxKITproducts?uniqprod.slice(0,PTE_Config_Util.maxKITproducts):uniqprod;
        let Row=[{ row: firstInd, prop:'PTR_USER_PRD' , old: this.hotTable.getDataAtRowProp(firstInd,'PTR_USER_PRD'), new: uniqprod.toString()}];
        PTE_CellChange_Util.autoFillCellonProdKit(Row,curPricingTable,contractData,pricingTableTemplates,columns);
        // compare the rows and see any products are repeating and only add repeating product to first one.
    }
    static closeKitDialog(items: any, columns: any[], curPricingTable: any,){
        let PTR=PTE_Common_Util.getPTEGenerate(columns,curPricingTable);
        PTR=_.map(PTR,(x)=>{ return {DEAL_GRP_NM:x['DEAL_GRP_NM'].toUpperCase()}});
        let firstInd=_.findIndex(PTR,{DEAL_GRP_NM:items.name.toUpperCase()});
        _.each(PTR,(cr,ind)=>{
            //this will make sure we are not clearing first row
            if(firstInd !=ind && cr['DEAL_GRP_NM'].toUpperCase()==items.name.toUpperCase()){
                this.hotTable.setDataAtRowProp(ind,'DEAL_GRP_NM','','no-edit');
            }
        });
    }
    static RateChgfn(items: Array<any>, columns: any[], curPricingTable: any) {
        _.each(items, item => {
            if ((item.prop) && (item.prop == 'DENSITY_RATE' || item.prop == 'ECAP_PRICE' || item.prop == 'INCENTIVE_RATE' || item.prop == 'TOTAL_DOLLAR_AMOUNT' || item.prop == 'RATE' || item.prop == 'ADJ_ECAP_UNIT' || item.prop == 'MAX_PAYOUT' || item.prop == 'FRCST_VOL')) {
                let val = this.hotTable.getDataAtRowProp(item.row, item.prop);
                if (parseFloat(val) >= 0 || parseFloat(val) < 0) {
                    this.hotTable.setDataAtRowProp(item.row, item.prop, parseFloat(val), 'no-edit');
                } else {
                    if (item.prop == 'FRCST_VOL') {
                        this.hotTable.setDataAtRowProp(item.row, item.prop, '', 'no-edit');
                    } else {
                        this.hotTable.setDataAtRowProp(item.row, item.prop, '0.00', 'no-edit');
                    }
                }
            }
        });
    }

    static pgChgfn(items: Array<any>, columns: any[], curPricingTable: any) {
        let OBJ_SET_TYPE_CD = curPricingTable.OBJ_SET_TYPE_CD;
        if (OBJ_SET_TYPE_CD && OBJ_SET_TYPE_CD == 'ECAP') {
            _.each(items, item => {
                if (item.prop && item.prop == 'PROGRAM_PAYMENT') {
                    this.checkfn(items, curPricingTable,columns); return;
                }
            });
        }
    }

    static checkfn(items: Array<any>, curPricingTable: any,columns:any[]) {
        if (items.length > 0) {
            let val = this.hotTable.getDataAtRowProp(items[0].row, 'PROGRAM_PAYMENT');
            if (val != undefined && val != null && val != '' && val.toLowerCase() !== 'backend') {
                if(_.findWhere(columns,{data:'PERIOD_PROFILE'}) !=undefined && _.findWhere(columns,{data:'PERIOD_PROFILE'}) !=null){
                    this.hotTable.setDataAtRowProp(items[0].row, 'PERIOD_PROFILE', '', 'no-edit');
                }
                if(_.findWhere(columns,{data:'RESET_VOLS_ON_PERIOD'}) !=undefined && _.findWhere(columns,{data:'RESET_VOLS_ON_PERIOD'}) !=null){
                    this.hotTable.setDataAtRowProp(items[0].row, 'RESET_VOLS_ON_PERIOD', '', 'no-edit');
                }
                if(_.findWhere(columns,{data:'AR_SETTLEMENT_LVL'}) !=undefined && _.findWhere(columns,{data:'AR_SETTLEMENT_LVL'}) !=null){
                    this.hotTable.setDataAtRowProp(items[0].row, 'AR_SETTLEMENT_LVL', '', 'no-edit');
                }
                if(_.findWhere(columns,{data:'SETTLEMENT_PARTNER'}) !=undefined && _.findWhere(columns,{data:'SETTLEMENT_PARTNER'}) !=null){
                    this.hotTable.setDataAtRowProp(items[0].row, 'SETTLEMENT_PARTNER', '', 'no-edit');
                }
            } else {
                if (this.hotTable.getDataAtRowProp(items[0].row, 'PERIOD_PROFILE') == '' && curPricingTable["PERIOD_PROFILE"] != ''){
                    if(_.findWhere(columns,{data:'PERIOD_PROFILE'}) !=undefined && _.findWhere(columns,{data:'PERIOD_PROFILE'})!=null){
                        this.hotTable.setDataAtRowProp(items[0].row, 'PERIOD_PROFILE', curPricingTable["PERIOD_PROFILE"].toString(), 'no-edit');
                    }
                }
                if (this.hotTable.getDataAtRowProp(items[0].row, 'RESET_VOLS_ON_PERIOD') == ''){
                    if(_.findWhere(columns,{data:'RESET_VOLS_ON_PERIOD'}) !=undefined && _.findWhere(columns,{data:'RESET_VOLS_ON_PERIOD'}) !=null){
                        this.hotTable.setDataAtRowProp(items[0].row, 'RESET_VOLS_ON_PERIOD', 'No', 'no-edit');
                    }
                }
                if (this.hotTable.getDataAtRowProp(items[0].row, 'AR_SETTLEMENT_LVL') == '' && curPricingTable["AR_SETTLEMENT_LVL"] != undefined){
                    if(_.findWhere(columns,{data:'AR_SETTLEMENT_LVL'}) !=undefined && _.findWhere(columns,{data:'AR_SETTLEMENT_LVL'}) !=null){
                        this.hotTable.setDataAtRowProp(items[0].row, 'AR_SETTLEMENT_LVL', curPricingTable["AR_SETTLEMENT_LVL"], 'no-edit');
                    }
                }
            }
        }
    }


    static tierChange(items: Array<any>, columns: any[], curPricingTable: any) {
        let OBJ_SET_TYPE_CD = curPricingTable.OBJ_SET_TYPE_CD;
        let PTR = PTE_Common_Util.getPTEGenerate(columns, curPricingTable);
        if (OBJ_SET_TYPE_CD && OBJ_SET_TYPE_CD == 'DENSITY') {
            _.each(items, item => {
                if (item.prop && item.prop == 'END_PB') {
                    let val = this.hotTable.getDataAtRowProp(item.row, 'END_PB');
                    let DCID = this.hotTable.getDataAtRowProp(item.row, 'DC_ID');
                    let Tier = this.hotTable.getDataAtRowProp(item.row, 'TIER_NBR');
                    let noofDensity = DCID < 0 ? curPricingTable.NUM_OF_DENSITY : this.hotTable.getDataAtRowProp(item.row, 'NUM_OF_DENSITY');
                    let startPBInd = item.row + parseInt(noofDensity);
                    let numOfTiers = (_.where(PTR, { DC_ID: DCID }).length) / noofDensity;
                    if (Tier < numOfTiers) {
                        if (val > 0 || val === 0) {
                            this.hotTable.setDataAtRowProp(item.row, 'END_PB', val, 'no-edit');
                            this.hotTable.setDataAtRowProp(startPBInd, 'STRT_PB', val + 0.001, 'no-edit');

                        } else if (val < 0) {
                            this.hotTable.setDataAtRowProp(item.row, 'END_PB', val, 'no-edit');
                            this.hotTable.setDataAtRowProp(startPBInd, 'STRT_PB', (-val) + 0.001, 'no-edit');
                        }
                        else {
                            this.hotTable.setDataAtRowProp(item.row, 'END_PB', '', 'no-edit');
                            this.hotTable.setDataAtRowProp(startPBInd, 'STRT_PB', 0.001, 'no-edit');
                        }
                    } else if (Tier == numOfTiers) {
                        if (val >= 0 || val < 0 || val.toLowerCase() == 'unlimited') {
                            this.hotTable.setDataAtRowProp(item.row, 'END_PB', val, 'no-edit');
                        } else {
                            this.hotTable.setDataAtRowProp(item.row, 'END_PB', 0, 'no-edit');
                        }
                    }
                }
                else if (item.prop && item.prop == 'STRT_PB') {
                    let val = this.hotTable.getDataAtRowProp(item.row, 'STRT_PB');
                    if (val >= 0 || val < 0) {
                        this.hotTable.setDataAtRowProp(item.row, 'STRT_PB', val, 'no-edit');
                    }
                    else
                        this.hotTable.setDataAtRowProp(item.row, 'STRT_PB', '', 'no-edit');
                }
            });
        } else if (OBJ_SET_TYPE_CD && OBJ_SET_TYPE_CD == 'REV_TIER') {
            _.each(items, item => {
                if (item.prop && item.prop == 'END_REV') {
                    let val = this.hotTable.getDataAtRowProp(item.row, 'END_REV');
                    let DCID = this.hotTable.getDataAtRowProp(item.row, 'DC_ID');
                    let Tier = this.hotTable.getDataAtRowProp(item.row, 'TIER_NBR');
                    let numOfTiers = _.where(PTR, { DC_ID: DCID }).length;
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
                }
                else if (item.prop && item.prop == 'STRT_REV') {
                    let val = this.hotTable.getDataAtRowProp(item.row, 'STRT_REV');
                    if (val >= 0 || val < 0) {
                        this.hotTable.setDataAtRowProp(item.row, 'STRT_REV', val, 'no-edit');
                    }
                    else
                        this.hotTable.setDataAtRowProp(item.row, 'STRT_REV', 0, 'no-edit');
                }
            });
        } else if (OBJ_SET_TYPE_CD && OBJ_SET_TYPE_CD == 'FLEX' || OBJ_SET_TYPE_CD && OBJ_SET_TYPE_CD == 'VOL_TIER') {
            _.each(items, item => {
                if (item.prop && item.prop == 'END_VOL') {
                    let val = this.hotTable.getDataAtRowProp(item.row, 'END_VOL');
                    let DCID = this.hotTable.getDataAtRowProp(item.row, 'DC_ID');
                    let Tier = this.hotTable.getDataAtRowProp(item.row, 'TIER_NBR');
                    let numOfTiers = _.where(PTR, { DC_ID: DCID }).length;
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
                        }
                        else {
                            this.hotTable.setDataAtRowProp(item.row, 'END_VOL', 0, 'no-edit');
                        }
                    } else if (Tier == numOfTiers) {
                        if (val >= 0 || val < 0 || val.toLowerCase() == 'unlimited') {
                            this.hotTable.setDataAtRowProp(item.row, 'END_VOL', val, 'no-edit');
                        } else {
                            this.hotTable.setDataAtRowProp(item.row, 'END_VOL', 0, 'no-edit');
                        }
                    }
                }
                else if (item.prop && item.prop == 'STRT_VOL') {
                    let val = Math.trunc(this.hotTable.getDataAtRowProp(item.row, 'STRT_VOL'));
                    if (val >= 0 || val < 0) {
                        this.hotTable.setDataAtRowProp(item.row, 'STRT_VOL', val, 'no-edit');
                    }
                    else
                        this.hotTable.setDataAtRowProp(item.row, 'STRT_VOL', 0, 'no-edit');
                }
            });
        }
    }
    
    static perProfDefault(items: Array<any>, contractData: any,curPricingTable:any) {
        _.each(items, (item) => {
            if ((item.new && item.new == '') || item.new==null){
                this.hotTable.setDataAtRowProp(item.row, item.prop,curPricingTable[`${item.prop}`] , 'no-edit');
            }
        })
    }
    /* AR settlement change where functions starts here */
    static autoFillARSet(items: Array<any>, contractData: any,curPricingTable:any) {
        try {
            _.each(items, (item) => {
                let colSPIdx = _.findWhere(this.hotTable.getCellMetaAtRow(item.row), { prop: 'SETTLEMENT_PARTNER' }).col;
                if ((item.new && item.new == '') || item.new==null){
                    if(curPricingTable && curPricingTable[`${item.prop}`] && curPricingTable[`${item.prop}`].toLowerCase()=='cash'){
                        this.hotTable.setDataAtRowProp(item.row, 'SETTLEMENT_PARTNER', contractData.Customer.DFLT_SETTLEMENT_PARTNER, 'no-edit');
                        //check object present 
                        this.hotTable.setCellMeta(item.row, colSPIdx, 'editor', 'dropdown');
                        this.hotTable.setCellMeta(item.row, colSPIdx, 'className', '');
                        this.hotTable.render();
                    }
                    else{
                        this.hotTable.setDataAtRowProp(item.row, 'SETTLEMENT_PARTNER', '', 'no-edit');
                        this.hotTable.setCellMeta(item.row, colSPIdx, 'editor', false);
                        this.hotTable.setCellMeta(item.row, colSPIdx, 'className', 'readonly-cell');
                        this.hotTable.render();
                    }
                    this.hotTable.setDataAtRowProp(item.row, item.prop,curPricingTable[`${item.prop}`] , 'no-edit');
                }
                else{
                    //Modiying the logic from from full table update to cell update for better performance
                    if (item.new && item.new != '' && item.new.toLowerCase() != 'cash') {
                        this.hotTable.setDataAtRowProp(item.row, 'SETTLEMENT_PARTNER', '', 'no-edit');
                        this.hotTable.setCellMeta(item.row, colSPIdx, 'editor', false);
                        this.hotTable.setCellMeta(item.row, colSPIdx, 'className', 'readonly-cell');
                        this.hotTable.render();
                    }
                    else {
                        this.hotTable.setDataAtRowProp(item.row, 'SETTLEMENT_PARTNER', contractData.Customer.DFLT_SETTLEMENT_PARTNER, 'no-edit');
                        //check object present 
                        this.hotTable.setCellMeta(item.row, colSPIdx, 'editor', 'dropdown');
                        this.hotTable.setCellMeta(item.row, colSPIdx, 'className', '');
                        this.hotTable.render();
                    }
                }
             
            });
        }
        catch (ex) {
            console.error(ex);
        }

    }
    /* AR settlement change ends here */
    static dateChange(items: Array<any>, colName: string, contractData) {
        _.each(items, (item) => {
            if (item.new == undefined || item.new == null || item.new == '' || !moment(item.new, "MM/DD/YYYY", true).isValid() || moment(item.new).toString() === "Invalid date" || moment(item.new).format("MM/DD/YYYY") === "12/30/1899") {
                if (colName == 'OEM_PLTFRM_LNCH_DT' || colName == 'OEM_PLTFRM_EOL_DT') {
                    this.hotTable.setDataAtRowProp(item.row, colName, '', 'no-edit');
                } else {
                    this.hotTable.setDataAtRowProp(item.row, colName, moment(contractData[colName]).format("MM/DD/YYYY"), 'no-edit');
                }
            }
        });
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
                }
                else {
                    //this means after empty row nothing to be added
                    break;
                }
            }
            //the sort by resulting is coming is the ascending order so negative will be first
            let rowId = _.first(_.sortBy(distDCIDs));
            //the result can have both existing and empty result so considering both
            if (rowId < 0) {
                return rowId - 1;
            }
            else {
                return ROWID;
            }

        }
        else {
            return ROWID;
        }
    }
    static getPTRObjOnProdCorr(selProd: any, selProds: any[], idx: number, trncOldVal: any) {
        let oldVal: any = "";
        if (trncOldVal == "") {
            oldVal = this.hotTable.getDataAtRowProp(selProds[idx].indx, 'PTR_USER_PRD').toString();
        }
        else {
            oldVal = trncOldVal;
        }
        let userProds = oldVal.split(',');
        let newVal = [];
        //Update the user entered prod text with product transition data
        if (userProds.length > 0) {
            _.each(userProds, prod => {
                let prodObjs = _.pluck(selProd.items, 'prodObj')
                let userInputVal = _.where(prodObjs, { USR_INPUT: prod });
                if (userInputVal.length > 0) {
                    newVal.push(userInputVal[0]["DERIVED_USR_INPUT"]);
                }
                else {
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
        }
        else {
            PTR_SYS_PRD = this.hotTable.getDataAtRowProp(deletedProd[0].indx, 'PTR_SYS_PRD');
            rowIndex = deletedProd[0].indx;
        }
        //incase of any valid products already bind, append the prod corr
        if (typeof PTR_SYS_PRD == 'string' && PTR_SYS_PRD != '') {
            PTR_SYS_PRD = JSON.parse(PTR_SYS_PRD);
        }
        else {
            PTR_SYS_PRD = {};
        }
        let res;
        if(selProd)
            res = products.ProdctTransformResults[selProd.DCID];
        else
            res = products.ProdctTransformResults[deletedProd[0].DC_ID];
        let exclude = _.sortBy(res.E);
        let Include = _.sortBy(res.I);
        if (deletedProd) {
            _.each(deletedProd, (deletedItm) => {
                if (deletedItm.exclude) {
                    let eindex = _.indexOf(exclude, deletedItm.deletedUserInput)
                    if (eindex != -1) {
                        exclude = _.without(exclude, deletedItm.deletedUserInput)
                        //removing from PTR_SYS_PRD as well if it has any deleted product values
                        if (PTR_SYS_PRD && PTR_SYS_PRD[deletedItm.deletedUserInput] && PTR_SYS_PRD[deletedItm.deletedUserInput].length == 1 && PTR_SYS_PRD[deletedItm.deletedUserInput][0].EXCLUDE)
                            delete PTR_SYS_PRD[deletedItm.deletedUserInput]
                    }
                }
                else {
                    let eindex = _.indexOf(Include, deletedItm.deletedUserInput)
                    if (eindex != -1) {
                        Include = _.without(Include, deletedItm.deletedUserInput)
                        //removing from PTR_SYS_PRD as well if it has any deleted Product values
                        if (PTR_SYS_PRD && PTR_SYS_PRD[deletedItm.deletedUserInput] && PTR_SYS_PRD[deletedItm.deletedUserInput].length == 1 && !PTR_SYS_PRD[deletedItm.deletedUserInput][0].EXCLUDE)
                            delete PTR_SYS_PRD[deletedItm.deletedUserInput]
                    }
                }
            })
        }
        if (selProd) {
            _.each(selProd.items, selPrdItm => {
                if (selPrdItm.prodObj.EXCLUDE) {
                    let eindex = _.indexOf(exclude, selPrdItm.prodObj.USR_INPUT)
                    if (eindex != -1) {
                        exclude = _.without(exclude, selPrdItm.prodObj.USR_INPUT)
                        //removing from PTR_SYS_PRD as well if it has any values
                        if (PTR_SYS_PRD && PTR_SYS_PRD[selPrdItm.prodObj.USR_INPUT] && PTR_SYS_PRD[selPrdItm.prodObj.USR_INPUT].length == 1 && PTR_SYS_PRD[selPrdItm.prodObj.USR_INPUT][0].EXCLUDE)
                            delete PTR_SYS_PRD[selPrdItm.prodObj.USR_INPUT]
                    }
                    exclude.push(selPrdItm.prodObj.DERIVED_USR_INPUT);
                }
                else {
                    let iIndex = _.indexOf(Include, selPrdItm.prodObj.USR_INPUT)
                    if (iIndex != -1) {
                        Include = _.without(Include, selPrdItm.prodObj.USR_INPUT)
                        //removing from PTR_SYS_PRD as well if it has any values
                        if (PTR_SYS_PRD && PTR_SYS_PRD[selPrdItm.prodObj.USR_INPUT] && PTR_SYS_PRD[selPrdItm.prodObj.USR_INPUT].length == 1 && !PTR_SYS_PRD[selPrdItm.prodObj.USR_INPUT][0].EXCLUDE)
                            delete PTR_SYS_PRD[selPrdItm.prodObj.USR_INPUT]
                    }
                    Include.push(selPrdItm.prodObj.DERIVED_USR_INPUT);
                }
                PTR_SYS_PRD[`${selPrdItm.prod}`] = [selPrdItm.prodObj];
            })
        }
        rowProdCorrectordat.push([{ row: rowIndex, prop: 'PTR_USER_PRD', old: this.hotTable.getDataAtRowProp(selProd.indx, 'PTR_USER_PRD'), new: Include.toString() }]);
        rowProdCorrectordat.push({ operation: 'prodcorr', PTR_SYS_PRD: JSON.stringify(PTR_SYS_PRD), PRD_EXCLDS: exclude.toString() });
        return rowProdCorrectordat;
    }

    static validateDensityBand(rowIndex, columns, curPricingTable, operation, translateResult, prdSrc, DensityMissingProd) {
        let response: any;
        let ValidProducts: any;
        let PTR: any;
        if (operation != '') {
            response = JSON.parse(operation.PTR_SYS_PRD);
            ValidProducts = PTE_Helper_Util.splitProductForDensity(response);
        }
        else {
            ValidProducts = translateResult.ValidProducts;
        }
        if ((response && _.keys(response).length > 0) || (ValidProducts && _.keys(ValidProducts).length > 0)) {
            let selrow = rowIndex;
            let NUM_OF_TIERS = parseInt(curPricingTable.NUM_OF_TIERS);
            let pivotDensity = parseInt(curPricingTable.NUM_OF_DENSITY);
            let numOfRows = NUM_OF_TIERS * pivotDensity;
            //match the schema based on product translator/selector, in case of split product it can have multiple products
            PTR = PTE_Common_Util.getPTEGenerate(columns, curPricingTable);
            _.each(ValidProducts, (item) => {
                let prod = PTEUtil.getValidDenProducts(item, prdSrc);
                let selProds = _.filter(PTR, (itm) => {
                    let ptrPRD = itm["PTR_USER_PRD"] ? itm["PTR_USER_PRD"].toUpperCase().split(',') : [];
                    // logic to check matching product since the product can come in any order and case to update code with those changes
                    if (ptrPRD.length > 0 && _.isEqual(_.sortBy(ptrPRD), _.sortBy(prod.map(v => v.toUpperCase())))) {
                        return itm;
                    }
                });
                if (selProds && selProds.length > 0) {
                    let distinctDC_IDs = _.uniq(_.pluck(selProds, 'DC_ID'));
                    _.each(distinctDC_IDs, dcid => {
                        let selProd = _.findWhere(selProds, { DC_ID: dcid });
                        if (DensityMissingProd[dcid] != undefined) {
                            delete DensityMissingProd[dcid];
                        }
                        let Nand_Den = [];
                        _.each(item, (prdDet) => {
                            // Handle single product with multiple density_band
                            let densities = prdDet[0].NAND_TRUE_DENSITY ? prdDet[0].NAND_TRUE_DENSITY.split(",").map(function (el) { return el.trim(); }) : [];
                            if (densities.length == 0 && !prdDet[0].EXCLUDE) {
                                densities.push("null");
                            }
                            densities.sort();
                            if (densities.length > 0 || densities.length == 0) {
                                //underscore union creates a single array without duplicates.
                                Nand_Den = _.union(Nand_Den, densities);
                            }
                        });
                        if (Nand_Den.indexOf("null") > -1) {
                            DensityMissingProd[(selProd.DC_ID).toString()] = ({ DCID: selProd.DC_ID, selDen: selProd.NUM_OF_DENSITY, actDen: Nand_Den.length, cond: 'nullDensity' });
                            return;
                        }
                        if (selProd && pivotDensity != Nand_Den.length) {
                            DensityMissingProd[(selProd.DC_ID).toString()] = ({ DCID: selProd.DC_ID, selDen: selProd.NUM_OF_DENSITY, actDen: Nand_Den.length, cond: 'insufficientDensity' });
                        }
                        else {                            
                            let tierNumber = selProd.NUM_OF_TIERS / selProd.NUM_OF_DENSITY;
                            for (var tier = 1; tier <= tierNumber; tier++) {
                                let prodInd = 0;
                                let ind = 0;
                                _.filter(PTR, (item) => {
                                    // this condition is added in case of product corrector, only the selected Prod added to first row rest all will have user selected product
                                    var firstObj = _.find(PTR, (itm) => { return itm.DC_ID == selProd.DC_ID });
                                    if (item.DC_ID == selProd.DC_ID) {
                                        item.PTR_USER_PRD = firstObj.PTR_USER_PRD
                                    }

                                    let ptrPRD = item.PTR_USER_PRD ? item.PTR_USER_PRD.toUpperCase().split(',') : [];
                                    if (_.isEqual(_.sortBy(ptrPRD), _.sortBy(prod.map(v => v.toUpperCase()))) && item.TIER_NBR == tier && item.DC_ID == selProd.DC_ID) {
                                        this.hotTable.setDataAtRowProp(ind, 'DENSITY_BAND', Nand_Den[prodInd], 'no-edit');
                                        item.DENSITY_BAND = Nand_Den[prodInd];
                                        prodInd++;
                                    }
                                    ind++;
                                    return item;
                                });
                            }
                        }
                    })

                }
            })
            if (DensityMissingProd != undefined) {
                _.each(PTR, (itm, indx) => {
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
    static defaultVolVal(items: Array<any>, columns: any[], curPricingTable: any){
        if(items[0].new=='' || items[0].new==null ){
            this.hotTable.setDataAtRowProp(items[0].row, 'STRT_VOL', 0, 'no-edit');
        }
    }
}