import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class SecurityService {

    constructor(private httpClient: HttpClient) { }

    public apiBaseUrl = "/api/SecurityAttributes/";
    public securityAttributes = null;
    public securityMasks = null;
    public sessionComparisonHash = null;

    getSecurityData(): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetMySecurityMasks';
        return this.httpClient.get(apiUrl);
    }

    chkToolRules(action, role) {
        return this.chkAtrbRules(action, role, null, null, null, null);
    }

    chkDealRules(action, role, itemType, itemSetType, stage): boolean {
        return this.chkAtrbRules(action, role, itemType, itemSetType, stage, null);
    }

    // NPSG DISABLE QUOTES CODE (Remove below later)
    getQuoteRestrictions() {
        return "ABC,DT";
    }
    // END NPSG DISABLE QUOTES CODE

    getSecurityDataFromSession(): void {
        this.securityAttributes = sessionStorage.getItem('securityAttributes');
        this.securityMasks = sessionStorage.getItem('securityMasks');
        this.sessionComparisonHash = sessionStorage.getItem('sessionComparisonHash');
        this.securityAttributes = this.securityAttributes == null ? [] : JSON.parse(this.securityAttributes);
        this.securityMasks = this.securityMasks == null ? [] : JSON.parse(this.securityMasks);
        this.sessionComparisonHash = this.securityMasks == null ? [] : JSON.parse(this.sessionComparisonHash);
    }

    convertHexToBin(hex) {
        const base = "0000000000000000";
        const convertBase = (num) => {
            return {
                from: (baseFrom) => {
                    return {
                        to: (baseTo) => {
                            return parseInt(num, baseFrom).toString(baseTo);
                        }
                    };
                }
            };
        };

        const val = convertBase(hex).from(16).to(2);
        return (base + val).slice(-1 * base.length);
    }

    chkAtrbRules(action, role, itemType, itemSetType, stage, attrb): boolean {
        this.getSecurityDataFromSession();
        let itemTypeId = 0;
        if (!!itemType) itemType = itemType.replace(/ /g, '_');
        if (!!itemSetType) itemSetType = itemSetType.replace(/ /g, '_');
        // need a better way of doing this, but for now we will stick it here
        if (itemType === 'ALL_OBJ_TYPE') itemTypeId = 0;
        if (itemType === 'CNTRCT') itemTypeId = 1;
        if (itemType === 'PRC_ST') itemTypeId = 2;
        if (itemType === 'PRC_TBL') itemTypeId = 3;
        if (itemType === 'PRC_TBL_ROW') itemTypeId = 4;
        if (itemType === 'WIP_DEAL') itemTypeId = 5;
        if (itemType === 'DEAL') itemTypeId = 6;
        if (!itemSetType) itemSetType = 'ALL_TYPES';
        if (!stage) stage = 'All WF Stages';
        const secActionObj = this.securityAttributes.filter((item) => {
            return ((item.ATRB_CD === undefined || item.ATRB_CD === null) ? "" : item.ATRB_CD.trim().toUpperCase()) === ((attrb === undefined || attrb === null) ? "ACTIVE" : attrb.trim().toUpperCase());
        });
        if (secActionObj === undefined || secActionObj === null || secActionObj.length <= 0) return false;

        const localSecurityMasks = this.securityMasks.filter((item) => {
            return item.ACTN_NM === action
                && (role === null || item.ROLE_NM === null || item.ROLE_NM.trim().toUpperCase() === role.trim().toUpperCase())
                && (stage === null || item.WFSTG_NM === null || item.WFSTG_NM.trim().toUpperCase() === stage.trim().toUpperCase())
                && (action === null || item.ACTN_NM === null || item.ACTN_NM.trim().toUpperCase() === action.trim().toUpperCase())
                && (itemTypeId === null || item.OBJ_TYPE_SID === null || item.OBJ_TYPE_SID === itemTypeId || item.OBJ_TYPE_SID === itemTypeId)
                && (itemSetType === null || item.OBJ_SET_TYPE_CD === null || item.OBJ_SET_TYPE_CD.trim().toUpperCase() === itemSetType.trim().toUpperCase() || item.OBJ_SET_TYPE_CD.trim().toUpperCase() === itemSetType.replace(/_/g, ' ').trim().toUpperCase());
        });
        if (localSecurityMasks.length === 0) return false;

        for (let f = 0; f < localSecurityMasks.length; f++) {
            const reverseSecurityMask = localSecurityMasks[f].PERMISSION_MASK.split('.').reverse();
            if (reverseSecurityMask.length < secActionObj[0].ATRB_MAGNITUDE) { return false }
            const binVal = this.convertHexToBin(reverseSecurityMask[secActionObj[0].ATRB_MAGNITUDE]);
            const revBinVal = binVal.split('').reverse();
            if (revBinVal.length < secActionObj[0].ATRB_BIT) { return false }
            if (revBinVal[secActionObj[0].ATRB_BIT] === '1') { return true }
        }
        return false;
    }

    loadSecurityData() {
        this.getSecurityDataFromSession();
        this.getSecurityData().subscribe((response) => {
            if (response) {
                this.securityAttributes = response.SecurityAttributes;
                this.securityMasks = response.SecurityMasks;

                sessionStorage.setItem('securityAttributes', JSON.stringify(this.securityAttributes));
                sessionStorage.setItem('securityMasks', JSON.stringify(this.securityMasks));
            }
            return true;
        });
    }
}