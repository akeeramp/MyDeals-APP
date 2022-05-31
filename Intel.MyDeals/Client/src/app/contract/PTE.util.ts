/* eslint-disable prefer-const */
import * as _ from 'underscore';
import { logger } from '../shared/logger/logger';
import { PRC_TBL_Model_Attributes, PRC_TBL_Model_Column, PRC_TBL_Model_Field } from './pricingTableEditor/handsontable.interface';
import { pricingTableEditorService } from './pricingTableEditor/pricingTableEditor.service';
import Handsontable from 'handsontable';

export class PTEUtil {

    // Handsontable Config Defaults
    private static defaultDateFormat = 'MM/DD/YYYY';
    private static defaultDatePickerConfig = {
        // First day of the week (0: Sunday, 1: Monday, etc)
        firstDay: 1,
        showWeekNumber: true,
        numberOfMonths: 1,
        licenseKey: '8cab5-12f1d-9a900-04238-a4819',
        // disableDayFn(date) {
        //   // Disable Sunday and Saturday
        //   return date.getDay() === 0 || date.getDay() === 6;
        // }
    };

    static pivotData(PTR: any, curPT: any): any {
        if (this.isPivotable(curPT)) {
            let result = [];

            // Identify distinct DCID, bcz the merge will happen for each DCID and each DCID can have diff  NUM_OF_TIERS
            let distDCID = _.uniq(PTR, 'DC_ID');
            _.each(distDCID, (item) => {
                let num_tier = this.numOfPivot(item);
                for (let i = 1; i <= num_tier; i++) {
                    let newValid = {};
                    let obj = JSON.parse(JSON.stringify(item));
                    //setting the dimenstion values
                    obj['STRT_VOL'] = obj[`STRT_VOL_____10___${i}`];
                    obj['TIER_NBR'] = i;
                    obj['RATE'] = obj[`RATE_____10___${i}`];
                    obj['END_VOL'] = obj[`END_VOL_____10___${i}`];

                    // Setting the validMsg for error
                    if (obj._behaviors && obj._behaviors.validMsg) {
                        _.each(obj._behaviors.validMsg, (val, key) => {
                            val = JSON.parse(val);
                            if (_.keys(val)[0] == i.toString()) {
                                newValid[key] = _.values(val)[0];
                            }
                        });
                        obj._behaviors.validMsg = newValid;
                    }
                    result.push(obj);
                }
            });
            return result;
        } else {
            return PTR;
        }
    }

    static isPivotable(curPT: any): boolean {
        return curPT.OBJ_SET_TYPE_CD != 'ECAP' ? true : false;
    }

    static numOfPivot(PTR: any): number {
        return parseInt(PTR.NUM_OF_TIERS);
    }

    static generateHandsontableColumn(pteService: pricingTableEditorService,
                                      loggerService: logger,
                                      dropdownResponses: any[],
                                      templateColumnFields: PRC_TBL_Model_Field[],
                                      templateColumnAttributes: PRC_TBL_Model_Attributes[],
                                      item: PRC_TBL_Model_Column,
                                      index: number): Handsontable.ColumnSettings {
        let currentColumnConfig: Handsontable.ColumnSettings = {
            data: item.field,
            width: item.width
        }

        /* Type & Format */
        if (!_.isUndefined(templateColumnFields[item.field].type)) {
            const itemField = templateColumnFields[item.field].type;

            if (itemField === 'number') {
                currentColumnConfig.type = 'numeric';

                // Formatting
                const cellFormat: string = templateColumnFields[item.field].format;
                if (cellFormat.toLowerCase().includes('0:d')) { // Decimalized
                    currentColumnConfig.numericFormat = {
                        pattern: '0,0.00',
                        culture: 'en-US'
                    }
                } else if (cellFormat.toLowerCase().includes('0:c')) { // Currency
                    currentColumnConfig.numericFormat = {
                        pattern: '$0,0.00',
                        culture: 'en-US'
                    }
                }
            } else if (itemField === 'percent') {
                currentColumnConfig.type = 'numeric';

                // Formatting
                currentColumnConfig.numericFormat = {
                    pattern: '0,0.00%',
                    culture: 'en-US'
                }
            } else if (item.field === 'END_VOL') {
                currentColumnConfig.type = 'numeric';

                currentColumnConfig.numericFormat = {
                    pattern: '0,0',
                    culture: 'en-US'
                }
            } else if (itemField === 'date') {
                currentColumnConfig.type = 'date';
                currentColumnConfig.dateFormat = this.defaultDateFormat;
                currentColumnConfig.datePickerConfig = this.defaultDatePickerConfig;
            } else {
                currentColumnConfig.type = 'text';
            }

            if (!_.isUndefined(templateColumnAttributes[item.field])) {
                //if (templateColumnAttributes[item.field].type === 'DROPDOWN' ) { // Dropdown
                    currentColumnConfig.type = 'dropdown';

                    if (item.lookupUrl) {
                        currentColumnConfig.source=_.pluck(dropdownResponses[`${item.field}`],`${item.lookupValue}`);
                        //this.handleDropdownLookup(pteService, loggerService, dropdownResponses, item.lookupUrl, item.lookupText, item.lookupValue, item.field);
                        //currentColumnConfig.source = dropdownResponses[item.field];  // WIP: Handsontable renderer should display key (lookupText) and save value (lookupValue) to spreadsheet data
                    }

                    // WIP: Add Custom Renderer for source to display keys in dropdown
                //} 
                //else if (templateColumnAttributes[item.field].type === 'MULTISELECT') { // Multi-Select
                //     // WIP
                //     // currentColumnConfig.type = 
                //     currentColumnConfig.type = 'dropdown';
                //     if (item.lookupUrl) {
                //         currentColumnConfig.source=_.pluck(dropdownResponses[`${item.field}`],`${item.lookupValue}`);
                //         //this.handleDropdownLookup(pteService, loggerService, dropdownResponses, item.lookupUrl, item.lookupText, item.lookupValue, item.field);
                //         //currentColumnConfig.source = dropdownResponses[item.field]; // WIP: Handsontable renderer should display key (lookupText) and save value (lookupValue) to spreadsheet data
                //     }

                //     // WIP: Add Custom Renderer for source to display keys in Multi-select

                // }
                // TEMP
                console.log(`PTE.utils.ts`);
                console.log(dropdownResponses);
            }
        }

        /* Is Required & Nullable */
        if (item.isRequired || !templateColumnFields[item.field].nullable) {
            currentColumnConfig.allowEmpty = false;

            if (item.isRequired) {
                item.title += ' *'; // Add `*` to header
            }
        }

        /* Sorting */
        if (item.sortable) {
            currentColumnConfig.columnSorting = {
                indicator: true,
                headerAction: true,
                // WIP: Comparsion Function
            }
        }

        // /* Disabled */
        // if (this.hotTable.isEmptyRow(row)) {
        //     currentColumnConfig.readOnly = true
        // }

        return currentColumnConfig;
    }

    // private static readDropdownEndpoint(pteService: pricingTableEditorService, loggerService: logger, lookupURL: string, lookupText: string, lookupValue: string) {
    //     pteService.readDropdownEndpoint(lookupURL).subscribe((response: any[]) => {
    //         let lookupMap = [];

    //         response.forEach(element => {   // { lookupText: lookupValue, ... }
    //             lookupMap[element[lookupText]] = element[lookupValue];
    //         });

    //         console.log(`lookupMap`);
    //         console.log(lookupMap);

    //         return lookupMap;
    //     }, (error) => {
    //         loggerService.error('PTEUtil::readDropdownEndpoint::readDropdownEndpoint:: service', error);
    //     });
    // }

    // private static handleDropdownLookup(pteService: pricingTableEditorService, loggerService: logger, dropdownResponses: any[], lookupUrl: string, lookupText, lookupValue, itemField) {
    //     if (!dropdownResponses[itemField] || _.isEmpty(dropdownResponses[itemField])) {
    //         dropdownResponses[itemField] = this.readDropdownEndpoint(pteService, loggerService, lookupUrl, lookupText, lookupValue);
    //     }
    //     console.log(`dropdownResponses`);
    //     console.log(dropdownResponses);
    // }

}