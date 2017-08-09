angular
    .module('app.core')
    .factory('securityService', securityService);

// Minification safe dependency injection
securityService.$inject = ['$http', 'dataService'];

function securityService($http, dataService) {
    // defining the base url on top, subsequent calls in the service
    // will be action methods under this controller
    var apiBaseUrl = "/api/SecurityAttributes/";

    //var securityAttributes = sessionStorage.getItem('securityAttributes');
    //var securityMasks = sessionStorage.getItem('securityMasks');

    //if (securityAttributes === null) {
    //    dataService.get(apiBaseUrl + 'GetMySecurityMasks').then(function (data) {
    //        if (!!data.data) {
    //            securityAttributes = data.data.SecurityAttributes;
    //            securityMasks = data.data.SecurityMasks;
    //        }
    //    });
    //}
    var securityAttributes = [];
    var securityMasks = [];

    var service = {
        getSecurityData: getSecurityData,
        setSecurityData: setSecurityData,
        chkDealRules: chkDealRules,
        chkAtrbRules: chkAtrbRules
    }

    return service;


    function getSecurityData() {
        return dataService.get(apiBaseUrl + 'GetMySecurityMasks');
    }

    function setSecurityData(attributes, masks) {
        securityAttributes = attributes;
        securityMasks = masks;
    }

    function chkToolRules(action, role) {
        return chkAtrbRules(action, role, null, null, null, null);
    }

    function chkDealRules(action, role, itemType, itemSetType, stage) {
        return chkAtrbRules(action, role, itemType, itemSetType, stage, null);
    }

    function chkAtrbRules(action, role, itemType, itemSetType, stage, attrb) {
        var itemTypeId = 0;

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

        var secActionObj = securityAttributes.filter(function (item) {
            return ((item.ATRB_CD === undefined || item.ATRB_CD === null) ? "" : item.ATRB_CD.trim().toUpperCase()) === ((attrb === undefined || attrb === null) ? "ACTIVE" : attrb.trim().toUpperCase());
        });
        if (secActionObj === undefined || secActionObj === null || secActionObj.length <= 0) return false;

        var localSecurityMasks = securityMasks.filter(function (item) {
            return item.ACTN_NM === action
                && (role === null || item.ROLE_NM === null || item.ROLE_NM.trim().toUpperCase() === role.trim().toUpperCase())
                && (stage === null || item.WFSTG_NM === null || item.WFSTG_NM.trim().toUpperCase() === stage.trim().toUpperCase())
                && (action === null || item.ACTN_NM === null || item.ACTN_NM.trim().toUpperCase() === action.trim().toUpperCase())
                && (itemTypeId === null || item.OBJ_TYPE_SID === null || item.OBJ_TYPE_SID === itemTypeId || item.OBJ_TYPE_SID === itemTypeId)
                && (itemSetType === null || item.OBJ_SET_TYPE_CD === null || item.OBJ_SET_TYPE_CD.trim().toUpperCase() === itemSetType.trim().toUpperCase() || item.OBJ_SET_TYPE_CD.trim().toUpperCase() === itemSetType.replace(/_/g, ' ').trim().toUpperCase());
        });

        if (localSecurityMasks.length === 0) return false;

        for (var f = 0; f < localSecurityMasks.length; f++) {
            var reverseSecurityMask = localSecurityMasks[f].PERMISSION_MASK.split('.').reverse();

            if (reverseSecurityMask.length < secActionObj[0].ATRB_MAGNITUDE) return false;

            var binVal = convertHexToBin(reverseSecurityMask[secActionObj[0].ATRB_MAGNITUDE]);
            var revBinVal = binVal.split('').reverse();

            if (revBinVal.length < secActionObj[0].ATRB_BIT) return false;

            if (revBinVal[secActionObj[0].ATRB_BIT] === '1') return true;
        }
        return false;
    }

    function convertHexToBin(hex) {
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

}