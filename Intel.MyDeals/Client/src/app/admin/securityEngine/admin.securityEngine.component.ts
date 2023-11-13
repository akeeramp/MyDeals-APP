import { Component } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { GridDataResult, DataStateChangeEvent } from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { SecurityEngineService } from "./admin.securityEngine.service";
import { SelectEvent } from "@progress/kendo-angular-layout";

import { PendingChangesGuard } from "src/app/shared/util/gaurdprotectionDeactivate";
import { sortBy } from 'underscore';
import { Observable } from "rxjs";

@Component({
    selector: "admin-security-engine",
    templateUrl: "Client/src/app/admin/securityEngine/admin.securityEngine.component.html",
    styleUrls: ['Client/src/app/admin/securityEngine/admin.securityEngine.component.css']
})
export class adminsecurityEngineComponent implements PendingChangesGuard{

    constructor(private SecurityEnginesvc: SecurityEngineService, private loggerSvc: logger) { }
    isDirty = false;
    public isGridLoading = false;
    public isShowMainContent = false;
    public currentDisplayAction = [];
    public isDropdownsLoaded = false;
    private isHelpButton: boolean = false;
    public roleTypes: any;
    public dropDownDatasource = [];
    public drilledDowndealtype = [];
    public drilledDownstages = [];
    public drilledDownAction = [];
    public drilledDownActionAtrb = [];
    public drilledDownAtrb = [];
    public selectedIds = [];
    public selectedAtrbAction = [];
    public selectedObjType = [];
    public checkedSelectedObjType = [];
    public attrActionName = ['ATRB_REQUIRED'];
    private isASTab = false;
    private isDSTab = false;
    public attrActionNameDS = ['Deal Security'];
    private gridResult = [];
    private gridData: GridDataResult;
    public GridDataattributes = [];
    public selectedDealactions = [];
    public selectedRoles = [];
    public CheckedselectedRoles = [];
    public selectedStages = [];
    public selectedDealTypes = [];
    public CheckedselectedDealTypes = [];
    public GetSelectedDDlist: any = {};
    public columns = [];
    public secAtrbUtil = [];
    public secAtrbUtil_securityMappings = [];
    public pendingSaveArray = []
    public eventValue: any;
    public isshowdetails = false;
    private state: State = {
        skip: 0,
        take: 25,
        group: [],
        // Initial filter descriptor
        filter: {
            logic: "and",
            filters: [],
        },
    };

    clickHelpButton = function () {
        this.isHelpButton = true
    }

    Close() {
        this.isHelpButton = false;
    }

    magicWandSelect() {
        this.selectedIds = [];
        if (this.selectedObjType.length != 0) {
            if (this.selectedObjType['Alias'] == "CNTRCT") {
                this.selectedIds = this.drilledDownAtrb.filter(x => x.ATRB_COL_NM == 'BACK_DATE_RSN' || x.ATRB_COL_NM == 'COST_TEST_RESULT' || x.ATRB_COL_NM == 'CUST_MBR_SID' || x.ATRB_COL_NM == 'WF_STG_CD' || x.ATRB_COL_NM == 'OBJ_SET_TYPE_CD' || x.ATRB_COL_NM == 'END_DT' || x.ATRB_COL_NM == 'MEETCOMP_TEST_RESULT' || x.ATRB_COL_NM == 'QUOTE_LN_ID' || x.ATRB_COL_NM == 'START_DT');
            } else if (this.selectedObjType['Alias'] == "PRC_ST") {
                this.selectedIds = this.drilledDownAtrb.filter(x => x.ATRB_COL_NM == 'COST_TEST_RESULT' || x.ATRB_COL_NM == 'WF_STG_CD' || x.ATRB_COL_NM == 'OBJ_SET_TYPE_CD' || x.ATRB_COL_NM == 'MEETCOMP_TEST_RESULT' || x.ATRB_COL_NM == 'IS_PRIMED_CUST');
            } else if (this.selectedObjType['Alias'] == "PRC_TBL") {
                this.selectedIds = this.drilledDownAtrb.filter(x => x.ATRB_COL_NM == 'COST_TEST_RESULT' || x.ATRB_COL_NM == 'OBJ_SET_TYPE_CD' || x.ATRB_COL_NM == 'REBATE_TYPE' || x.ATRB_COL_NM == 'MEETCOMP_TEST_RESULT' || x.ATRB_COL_NM == 'MRKT_SEG' || x.ATRB_COL_NM == 'NUM_OF_TIERS' || x.ATRB_COL_NM == 'PAYOUT_BASED_ON' || x.ATRB_COL_NM == 'PERIOD_PROFILE' || x.ATRB_COL_NM == 'FLEX_ROW_TYPE' || x.ATRB_COL_NM == 'IS_PRIMED_CUST' || x.ATRB_COL_NM == 'PROGRAM_PAYMENT');
            } else if (this.selectedObjType['Alias'] == "PRC_TBL_ROW" || this.selectedObjType['Alias'] == "WIP_DEAL" || this.selectedObjType['Alias'] == "DEAL" || this.selectedObjType['Alias'] == "MASTER") {
                this.selectedIds = this.drilledDownAtrb;
            }
        } else {
            this.selectedIds = this.dropDownDatasource['AttributesByObjType']['CNTRCT'].filter(x => x.ATRB_COL_NM == 'BACK_DATE_RSN' || x.ATRB_COL_NM == 'COST_TEST_RESULT' || x.ATRB_COL_NM == 'CUST_MBR_SID' || x.ATRB_COL_NM == 'WF_STG_CD' || x.ATRB_COL_NM == 'OBJ_SET_TYPE_CD' || x.ATRB_COL_NM == 'END_DT' || x.ATRB_COL_NM == 'MEETCOMP_TEST_RESULT' || x.ATRB_COL_NM == 'QUOTE_LN_ID' || x.ATRB_COL_NM == 'START_DT');
        }
    }

    getSecurityDropdownData() {
        this.SecurityEnginesvc.getSecurityDropdownData().subscribe((response: Array<any>) => {
            this.dropDownDatasource = response;
            this.drilledDowndealtype = this.dropDownDatasource['AdminDealTypes'].filter(x => x.Alias == 'ALL_TYPES');
            this.drilledDownstages = this.dropDownDatasource['WorkFlowStages'].filter(x => x.Second == 'InComplete' || x.Second == 'Complete' || x.Second == 'Cancelled' || x.Second == 'Lost');
            this.drilledDownAction = this.dropDownDatasource['SecurityActions'].filter(x => x.subCategory == 'Deal');
            this.drilledDownActionAtrb = this.dropDownDatasource['SecurityActions'].filter(x => x.subCategory == 'Attribute');
            this.drilledDownAtrb = this.dropDownDatasource['AttributesByObjType']['CNTRCT'];
        }, function (error) {
            this.loggerSvc.error("Unable to get dropdown data.", error, error.statusText);
        });
    }

    objtypeChange(value) {
        this.isDirty=true;
        this.isshowdetails = false
        this.selectedIds = [];
        this.selectedStages = [];
        this.selectedDealTypes = [];
        this.drilledDownstages = this.filterObjTypeForStages(value.Alias);
        this.drilledDowndealtype = this.filterObjTypefordealtype(value.Alias);

            // Attribute drilldown by Obj type
            if (this.selectedObjType.length != 0) {
                this.drilledDownAtrb = this.dropDownDatasource['AttributesByObjType'][value.Alias];
            } else {
                this.drilledDownAtrb = this.dropDownDatasource['AttributesByObjType']['CNTRCT'];
            }
        this.drilledDownAtrb = sortBy(this.drilledDownAtrb, 'ATRB_COL_NM');
    }

    objtypeRoleChange(value) {
        this.isDirty=true;
        this.isshowdetails = false
    }

    filterObjTypefordealtype(objTypeName) {
        var filteredDeals = [];
        if (this.GetSelectedDDlist[objTypeName] !== undefined && this.GetSelectedDDlist[objTypeName].ATTRBS !== undefined) {
            var dealtype = this.GetSelectedDDlist[objTypeName].ATTRBS;
            for (var key in dealtype) {
                if (dealtype.hasOwnProperty(key)) {
                    if (dealtype.hasOwnProperty(key)) {
                        var value;
                        if (key == "ALL_TYPES") {
                            value = 9
                        }
                        else if (key == "DENSITY") {
                            value = 8
                        }
                        else if (key == "REV_TIER") {
                            value = 7
                        }
                        else if (key == "KIT") {
                            value = 6
                        }
                        else if (key == "VOL_TIER") {
                            value = 5
                        }
                        else if (key == "PROGRAM") {
                            value = 4
                        }
                        else if (key == "ECAP") {
                            value = 3
                        }
                        else if (key == "FLEX") {
                            value = 2
                        } else {
                            value = 0
                        }
                        filteredDeals.push({ "Id": value, "Alias": key });
                    }
                }
            }
        }
        return filteredDeals;
    }

    filterObjTypeForStages(objTypeName) {
        var filteredStages = [];
        if (this.GetSelectedDDlist[objTypeName] !== undefined && this.GetSelectedDDlist[objTypeName].STAGES !== undefined) {
            var stgs = this.GetSelectedDDlist[objTypeName].STAGES;
            for (var key in stgs) {
                if (stgs.hasOwnProperty(key)) {
                    filteredStages.push({ "First": key, "Second": stgs[key][0] });
                }
            }
        }

        if (this.isDSTab == true) {
            filteredStages = [];
            filteredStages.push({ "First": 0, "Second": "All WF Stages" });
        }

        return filteredStages;
    }

    Reset() {
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.pendingSaveArray = [];
        this.getGridData();
    }
    save() {
        var saveArray = [];
        for (var key in this.pendingSaveArray) {
            if (this.pendingSaveArray.hasOwnProperty(key)) {
                var value = this.pendingSaveArray[key];
                saveArray.push(value);
            }
        }
        var mappingList = saveArray.filter(x => x.isModified == true);

        this.SecurityEnginesvc.saveMapping(mappingList).subscribe((response: any) => {
            this.loggerSvc.success("Update successful.");
            for (var key in this.pendingSaveArray) {
                if (this.pendingSaveArray.hasOwnProperty(key)) {
                    var value = this.pendingSaveArray[key];
                    var secKey = value.ATRB_COL_NM + "/" + value.OBJ_TYPE_SID + "/" + value.OBJ_SET_TYPE_CD + "/" + value.ROLE_NM + "/" + value.WFSTG_NM;

                    if (value.isNowChecked) {
                        // Add new values to the security mask
                        this.secAtrbUtil_securityMappings[value.ACTN_NM][secKey] = 1;
                    } else {
                        // Remove old values that were deleted from security mask
                        if (this.secAtrbUtil_securityMappings[value.ACTN_NM][secKey] != null) {
                            delete this.secAtrbUtil_securityMappings[value.ACTN_NM][secKey];// = 0;
                        }
                    }
                }
            }

            // Clear pending array
            this.pendingSaveArray = [];

        }, function (error) {
            this.loggerSvc.error("Unable save Security Engine Mappings.", error, error.statusText);
        });
    }

    getGridData() {
        this.isShowMainContent = true;
        this.isGridLoading = true;
        this.isshowdetails = true;
        this.pendingSaveArray = [];
        if (this.isASTab == true) {
            this.GridDataattributes = [];

            //Bind Grid Data
            if (this.selectedObjType.length != 0) {
                for (var g = 0; g < this.drilledDownAtrb.length; g++) {
                    this.GridDataattributes.push({ "ATRB_SID": this.drilledDownAtrb[g].ATRB_SID, "ATRB_COL_NM": this.drilledDownAtrb[g].ATRB_COL_NM });
                }
            } else {
                for (var g = 0; g < this.drilledDownAtrb.length; g++) {
                    this.GridDataattributes.push({ "ATRB_SID": this.drilledDownAtrb[g].ATRB_SID, "ATRB_COL_NM": this.drilledDownAtrb[g].ATRB_COL_NM });
                }
            }

            //To filter Attributes Tab data
            if (this.selectedIds.length > 0) {
                this.GridDataattributes = [];
                for (var x = 0; x < this.selectedIds.length; x++) {
                    if (this.selectedObjType.length != 0) {
                        this.GridDataattributes.push({ "ATRB_SID": this.selectedIds[x].ATRB_SID, "ATRB_COL_NM": this.selectedIds[x].ATRB_COL_NM });
                    }
                }
                
            }
            
            //Display Action
            if (this.selectedAtrbAction.length != 0) {
                this.currentDisplayAction = this.selectedAtrbAction['dropdownName'];
            } else {
                this.currentDisplayAction = this.attrActionName;
            }

        } else if (this.isDSTab == true) {

            //Bind Grid Data
            if (this.selectedDealactions.length != 0) {
                this.GridDataattributes = [];
                for (var g = 0; g < this.selectedDealactions.length; g++) {
                    this.GridDataattributes.push({ "ATRB_SID": this.selectedDealactions[g].dropdownID, "ATRB_COL_NM": this.selectedDealactions[g].dropdownName });
                }

            } else {
                this.GridDataattributes = [];
                for (var g = 0; g < this.drilledDownAction.length; g++) {
                    this.GridDataattributes.push({ "ATRB_SID": this.drilledDownAction[g].dropdownID, "ATRB_COL_NM": this.drilledDownAction[g].dropdownName });
                }
            }

            //Display Action
            this.currentDisplayAction = this.attrActionNameDS;
        }
        this.isDirty=false;
        this.generateGrid()

        setTimeout(() => {
        this.isGridLoading = false;
        }, 150);
    }
    generateGrid() {
        let stageColWidth
        if (this.selectedDealTypes.length != 0) {
            stageColWidth = (this.selectedDealTypes.length * 24);
            stageColWidth = (stageColWidth < 95) ? 95 : stageColWidth;
        } else {
            stageColWidth = (this.drilledDowndealtype.length * 24);
            stageColWidth = (stageColWidth < 95) ? 95 : stageColWidth;
        }

        if (this.selectedRoles.length != 0) {
            this.CheckedselectedRoles = this.selectedRoles;
        } else {
            this.CheckedselectedRoles = this.dropDownDatasource['AdminRoleTypes'];
        }

        if (this.selectedDealTypes.length != 0) {
            this.CheckedselectedDealTypes = this.selectedDealTypes
        } else {
            this.CheckedselectedDealTypes = this.drilledDowndealtype
        }

         if (this.selectedObjType.length != 0) {
             this.checkedSelectedObjType = this.selectedObjType;           
        }

        this.columns = [];
        // Push the stages as column (headers) of the grid
        if (this.selectedStages.length != 0) {
            for (var r = 0; r < this.selectedStages.length; r++) {
                var stgID = this.selectedStages[r].First;
                var stgName = this.selectedStages[r].Second;
                this.columns.push({
                    stgId: stgID,
                    title: stgName,
                    encoded: false,
                    width: stageColWidth,
                    template: "",
                });
            }
        } else {
            for (var r = 0; r < this.drilledDownstages.length; r++) {
                var stgID = this.drilledDownstages[r].First;
                var stgName = this.drilledDownstages[r].Second;
                this.columns.push({
                    stgId: stgID,
                    title: stgName,
                    encoded: false,
                    width: stageColWidth,
                    template: "",
                });
            }
        }
        this.gridResult = this.GridDataattributes;
        this.gridData = process(this.GridDataattributes, this.state);
    }

    drawRoles(value) {
            var div = "<div class='atrbSubTitle'>";
            if (this.CheckedselectedRoles.length != 0) {
                return div + this.CheckedselectedRoles.map(function (role) {
                    return role.dropdownName;
                }).join("</div>" + div) + "</div>";
            } else {
                return div + this.dropDownDatasource['AdminRoleTypes'].map(function (role) {
                    return role.dropdownName;
                }).join("</div>" + div) + "</div>";
            } 
    };

    /*Html of multiple deal boxes for each attribute, dealtype, role, and stage */
    securityEngineDrawDeals(atrbId, atrbCd, stgId, stgName) {
        
            var dummyAttrName = "ACTIVE";
            var buf = "";
            var divStart = "<div style='margin: 1px;'>";
            var divEnd = "<div class='clearboth'></div></div>";

            var clickableHtml = "";
            var mappingKey = "";
            var actionId = "";
            var actnCd = "";
            var newAtrbId;
            var newAtrbCd = "";

            for (var r = 0; r < this.CheckedselectedRoles.length; r++) {
                buf += divStart;
                for (var d = 0; d < this.CheckedselectedDealTypes.length; d++) {
                    if (this.isASTab == true) { // Attribute Security
                        if (this.selectedAtrbAction.length != 0) {
                            actionId = this.selectedAtrbAction['dropdownID'];
                            actnCd = this.selectedAtrbAction['dropdownName'];
                            mappingKey = this.selectedAtrbAction['dropdownName'];
                        } else {
                            actionId = "167";
                            actnCd = "ATRB_REQUIRED";
                            mappingKey = "ATRB_REQUIRED";
                        }
                        newAtrbId = atrbId;
                        newAtrbCd = atrbCd;
                        clickableHtml = "<div class='fl'>";
                    } else { // Deal Security
                        actionId = atrbId;
                        var myActnCd = this.drilledDownAction.filter(x => x.dropdownID == parseInt(atrbId));
                        actnCd = (myActnCd ? myActnCd['dropdownName'] : -1);
                        mappingKey = atrbCd;
                        newAtrbId = 1;
                        newAtrbCd = dummyAttrName;
                        clickableHtml = "<div class='fl'>";
                    }

                    buf += this.drawDealType(mappingKey, newAtrbCd, this.CheckedselectedDealTypes[d].Alias, this.CheckedselectedRoles[r].dropdownName, stgName, clickableHtml);
                }
                buf += divEnd;
            }
            return buf;
        
    }

    /*Html of individual deal boxes */
    drawDealType(mappingKey, atrbCd, dealType, role, stgName, clickableHtml) {
        var extraClasses = [];
        var innerIcon = "";
        var isClickable = false;
        var objtypeselectid;
        var objtypeselectname;
        if (this.checkedSelectedObjType.length != 0) {
            objtypeselectid = this.checkedSelectedObjType['Id'];
            objtypeselectname = this.checkedSelectedObjType['Alias'];
        } else {
            objtypeselectid = 1;
            objtypeselectname = 'CNTRCT';
        }

        var actionCollection = this.secAtrbUtil_securityMappings[mappingKey];
        var title = "Deal Type: " + dealType + "\nRole: " + role + "\nStage: " + stgName + "\n";

        var atrbKey = atrbCd + "/" + objtypeselectid + "/" + dealType + "/" + role + "/" + stgName;

        if (this.isDSTab == true) {
            atrbKey = "ACTIVE/0/ALL_TYPES/" + role + "/All WF Stages";
        }

        // Deal Read Only
        if (mappingKey === "ATRB_READ_ONLY" && (this.secAtrbUtil_securityMappings["C_EDIT_CONTRACT"] === undefined || this.secAtrbUtil_securityMappings["C_EDIT_CONTRACT"][atrbKey.replace(atrbCd, "ACTIVE")] === undefined)) {
            isClickable = true;
            title += "Deal is Read Only\n";
        }

        if (this.isASTab == true && atrbCd !== "ACTIVE" && this.GetSelectedDDlist[objtypeselectname]["ATTRBS"][dealType] !== undefined && !this.GetSelectedDDlist[objtypeselectname]["ATTRBS"][dealType].includes(atrbCd)) {
            extraClasses.push("atrbbasecolorNotInDealType");
        }
        else if (actionCollection !== undefined) {
            if (actionCollection[atrbKey] !== undefined) { // Normal MetaData
                isClickable = true;
            }
            else {
                isClickable = true;
                extraClasses.push("atrbbasedisabled");
            }
        }
        // atrbbasedisabled
        else {
            isClickable = true;
            extraClasses.push("atrbbasedisabled");
        }

        // Create element
        var el = "<div class='fl'>";
        el += ((isClickable) ? clickableHtml : "");
        //we used dealtype to change BOX color, css already added for the particular dealtype.
        el += "<div class='atrbbasecolor" + dealType /*.replace(/ /g, "")*/ + " atrbContainer " + extraClasses.join(" ") + " " + ((isClickable) ? "clickable" : "") + "' ";
        el += "title='" + title + "'>";
        el += innerIcon;
        el += "</div>";
        el += ((isClickable) ? "</div>" : "");
        el += "</div>";

        return el;
    };

    /* When user clicks on an interactable box, then call this function to add the deal information to the array of pending-save security attributes */
    clickBox(event, attrId, attrCd, stgId, stgCd) {
        var atrbactid;
        var atrbactname;
        var roleid;
        var rolename;
        var dealid;
        var dealnamename;
        if (this.isASTab == true) {
            if (this.selectedAtrbAction.length != 0) {
                atrbactid = this.selectedAtrbAction['dropdownID'];
                atrbactname = this.selectedAtrbAction['dropdownName'];
            } else {
                atrbactid = 167;
                atrbactname = "ATRB_REQUIRED";
            }
        }else{
            atrbactid = attrId;
            var myActnCd = this.drilledDownAction.filter(x => x.dropdownID == parseInt(attrId));
            atrbactname = (myActnCd ? myActnCd['dropdownName'] : -1);
            attrId = 1;
            attrCd = "ACTIVE";
        }

        if (event?.target != null) {
            var isCurrChecked = !event.target.classList.contains("atrbbasedisabled"); 
            var objtypeselectid;
            var objtypeselectname;
            if (this.selectedObjType.length != 0) {
                objtypeselectid = this.selectedObjType['Id'];
                objtypeselectname = this.selectedObjType['Alias'];
            } else {
                objtypeselectid = 1;
                objtypeselectname = 'CNTRCT';
            }

            //Roles Bind
            if (this.selectedRoles.length != 0) {
                var stgs = this.selectedRoles;
                for (var key in stgs) {
                    if (stgs.hasOwnProperty(key)) {
                        if (event.target.title.includes(stgs[key]['dropdownName'])) {
                            roleid = stgs[key]['dropdownID'];
                            rolename = stgs[key]['dropdownName'];
                        }
                    }
                }

            } else {
                var stgs = this.dropDownDatasource['AdminRoleTypes'];
                for (var key in stgs) {
                    if (stgs.hasOwnProperty(key)) {
                        if (event.target.title.includes(stgs[key]['dropdownName'])) {
                            roleid = stgs[key]['dropdownID'];
                            rolename = stgs[key]['dropdownName'];
                        }
                    }
                }
            }
            
            //Deal Bind
            if (this.selectedDealTypes.length != 0) {
                var stgsdeal = this.selectedDealTypes;
                for (var key in stgsdeal) {
                    if (stgsdeal.hasOwnProperty(key)) {
                        if (event.target.title.includes(stgsdeal[key]['Alias'])) {
                            dealid = stgsdeal[key]['Id'];
                            dealnamename = stgsdeal[key]['Alias'];
                        }
                    }
                }

            } else {
                var stgsdeal = this.drilledDowndealtype;
                for (var key in stgsdeal) {
                    if (stgsdeal.hasOwnProperty(key)) {
                        if (event.target.title.includes(stgsdeal[key]['Alias'])) {
                            dealid = stgsdeal[key]['Id'];
                            dealnamename = stgsdeal[key]['Alias'];
                        }
                    }
                }
            }

            // Note that the only the SIDS are saved, but the CDs are used to update the UI's grid data
            var objToSave = {
                ACTN_NM: atrbactname,
                SECUR_ACTN_SID: atrbactid,
                ATRB_COL_NM: attrCd,
                ATRB_SID: attrId,
                OBJ_TYPE: objtypeselectname,
                OBJ_TYPE_SID: objtypeselectid,
                OBJ_SET_TYPE_CD: dealnamename,
                OBJ_SET_TYPE_SID: dealid,
                ROLE_NM: rolename,
                ROLE_TYPE_SID: roleid,
                WFSTG_NM: stgCd,
                WFSTG_MBR_SID: stgId,
                isNowChecked: false,
    			originallyChecked: false,
                isModified: false
            };
            if (this.isDSTab === true) {
                objToSave.OBJ_TYPE = "All WF Stages";
                objToSave.OBJ_TYPE_SID = 0;
            }
            if (!event.target.classList.contains("atrbContainer")) {
                return;
            }
            // Note Intially class is already added in that current class list. If we check the Box, class is getting remove from the lis.
            event.target.classList.add("attrbChanged");
            // Change checkBox css 
            if (isCurrChecked) {  //It was checked orignally, so we're unchecking the box.
                // Change Box color to unchecked
                event.target.classList.add("atrbbasedisabled");
            } else {  
                // Change Box color to checked
                event.target.classList.remove("atrbbasedisabled");
            }
            var index = JSON.stringify(objToSave);
            objToSave.isNowChecked = !isCurrChecked;
            if (this.pendingSaveArray[index] != null) {
                objToSave.originallyChecked = this.pendingSaveArray[index].originallyChecked;
                objToSave.isModified = (objToSave.originallyChecked != objToSave.isNowChecked);
            } else {
                objToSave.originallyChecked = !objToSave.isNowChecked;
                objToSave.isModified = true;
            }
            // Update Array
            this.pendingSaveArray[index] = objToSave;

        }

    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
    }

    async onTabSelect(e: SelectEvent) {
        try {
            e.preventDefault();
            if (e.title == "Attribute Security") {
                this.isDSTab = false; this.isASTab = true;
            }
            else {
                this.isDSTab = true; this.isASTab = false;
            }
        }
        catch (ex) {
            this.loggerSvc.error('Something went wrong', 'Error');
            console.error('PTComponent::Tabselect::', ex);
        }

    }

    processMaskData(data) {
        // Security Mask 
        for (var i = 0; i < data.SecurityMasks.length; i++) {
            var mData = data.SecurityMasks[i];
            // Does security mask have a things that are not just "0"?
            if (mData.PERMISSION_MASK.replace(/0/g, "").replace(/\./g, "") !== "") {

                // Determine accesses from mask's hex values
                if (this.secAtrbUtil[mData.PERMISSION_MASK] === undefined) {
                    this.secAtrbUtil[mData.PERMISSION_MASK] = this.ChkAtrbRulesBase(mData.PERMISSION_MASK, data.SecurityAttributes);
                }

                // Select current filters / all filter data
                var curAction = mData.ACTN_NM;
                var curDealType = (mData.OBJ_SET_TYPE_CD === null || mData.OBJ_SET_TYPE_CD === "null" || mData.OBJ_SET_TYPE_CD === "") ? this.drilledDowndealtype.map(function (x) { return x.Alias; }) : [mData.OBJ_SET_TYPE_CD];
                var curStage = (mData.WFSTG_NM === null || mData.WFSTG_NM === "null" || mData.WFSTG_NM === "") ? this.drilledDownstages.map(function (x) { return x.Stage; }) : [mData.WFSTG_NM];
                var curRole = (mData.ROLE_NM === null || mData.ROLE_NM === "null" || mData.ROLE_NM === "") ? this.dropDownDatasource['AdminRoleTypes'].map(function (x) { return x.dropdownName; }) : [mData.ROLE_NM];
                // TODO: Change objType id to name if we ever get that from the db
                var curObjType = (mData.OBJ_TYPE_SID === null || mData.OBJ_TYPE_SID === "null" || mData.OBJ_TYPE_SID === "") ? this.dropDownDatasource['ObjTypes'].map(function (x) { return x.Id; }) : [mData.OBJ_TYPE_SID];

                // If not already in the mappings list, then create it
                if (this.secAtrbUtil_securityMappings[curAction] === undefined) this.secAtrbUtil_securityMappings[curAction] = {};

                // Update/create the mapping with the current role, deal type, and stage ... for every role, deal type, and stage
                for (var o = 0; o < curObjType.length; o++) {
                    for (var d = 0; d < curDealType.length; d++) {
                        for (var r = 0; r < curRole.length; r++) {
                            for (var s = 0; s < curStage.length; s++) {
                                for (var v = 0; v < this.secAtrbUtil[mData.PERMISSION_MASK].length; v++) {
                                    // Create security mapping, which we will use to color-in or not color-in blocks
                                    var secKey = this.secAtrbUtil[mData.PERMISSION_MASK][v] + "/" + curObjType[o] + "/" + curDealType[d] + "/" + curRole[r] + "/" + curStage[s];
                                    this.secAtrbUtil_securityMappings[curAction][secKey] = 1;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    ChkAtrbRulesBase(permissionMask, secActionObj) {
        var allowedActions = [];
        var reverseSecurityMask = permissionMask.split('.').reverse();

        for (var a = 0; a < secActionObj.length; a++) {
            if (reverseSecurityMask.length < secActionObj[a].ATRB_MAGNITUDE) return allowedActions;

            var binVal = this.ConvertHexToBin(reverseSecurityMask[secActionObj[a].ATRB_MAGNITUDE]);
            var revBinVal = binVal.split('').reverse();

            if (revBinVal.length < secActionObj[a].ATRB_BIT) return allowedActions;

            if (revBinVal[secActionObj[a].ATRB_BIT] === '1') allowedActions.push(secActionObj[a].ATRB_CD);
        }
        return allowedActions;
    }

    ConvertHexToBin(hex) {
        var base = "0000000000000000";
        var convertBase = function (num) {
            return {
                from: function (baseFrom) {
                    return {
                        to: function (baseTo) {
                            return parseInt(num, baseFrom).toString(baseTo);
                        }
                    };
                }
            };
        };
        var val = convertBase(hex).from(16).to(2);
        return (base + val).slice(-1 * base.length);
    }
    
    canDeactivate(): Observable<boolean> | boolean {
        return !this.isDirty;
    }

    ngOnInit() {
        if (!(<any>window).isDeveloper) {
            document.location.href = "/Dashboard#/portal";
        }
        this.isASTab = true;
        this.getSecurityDropdownData();

        this.SecurityEnginesvc.getObjAtrbs().subscribe((response: Array<any>) => {
            this.GetSelectedDDlist = [];
            this.GetSelectedDDlist = response;
        }, function (error) {
            this.loggerSvc.error("Unable to get Deal Type Attributes.", error, error.statusText);
        });

        this.SecurityEnginesvc.getMasks().subscribe((response: Array<any>) => {
            this.processMaskData(response);
        }, function (error) {
            this.loggerSvc.error("Unable to get Security Masks.", error, error.statusText);
        });

        setTimeout(() => {
            this.isDropdownsLoaded = true;
        }, 200);
    }
}