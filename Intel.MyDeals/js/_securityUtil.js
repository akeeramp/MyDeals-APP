function secUtil() { }

secUtil.data = null;

secUtil.LoadByActions = function (actions) {
    op.ajaxGetWait("/api/SecurityMasks/" + actions, function(data) {
        secUtil.data = data;
    }, function(result) {
        util.error(null, JSON.parse(result.responseText).Error);
    });
}

secUtil.ChkAtrbRules = function (action, attrb, role, stage, itemType) {
    if (secUtil.data === null || secUtil.data === undefined) return false;

    if (itemType !== null && itemType !== undefined) itemType = itemType.replace(/ /g, '_');

    var secActionObj = secUtil.data.SecurityActions.filter(function (item) {
        return ((item.AtrbCode === undefined || item.AtrbCode === null) ? "" : item.AtrbCode.trim().toUpperCase()) === ((attrb === undefined || attrb === null) ? "" : attrb.trim().toUpperCase());
    });
    if (secActionObj === undefined || secActionObj === null || secActionObj.length <= 0) return false;

    var securityMasks = secUtil.data.SecurityMasks.filter(function (item) {
        return item.ActionCode === action
            && (role === null || item.RoleTypeCd === null || item.RoleTypeCd.trim().toUpperCase() === role.trim().toUpperCase())
            && (stage === null || item.WFStageCd === null || item.WFStageCd.trim().toUpperCase() === stage.trim().toUpperCase())
            && (action === null || item.ActionCode === null || item.ActionCode.trim().toUpperCase() === action.trim().toUpperCase())
            && (itemType === null || item.ItemTypeCd === null || item.ItemTypeCd.trim().toUpperCase() === itemType.trim().toUpperCase() || item.ItemTypeCd.trim().toUpperCase() === itemType.replace(/_/g, ' ').trim().toUpperCase());
    });

    if (securityMasks.length === 0) return false;

    for (var f = 0; f < securityMasks.length; f++) {
        var reverseSecurityMask = securityMasks[f].PermissionMask.split('.').reverse();

        if (reverseSecurityMask.length < secActionObj[0].AtrbMag) return false;

        var binVal = secUtil.ConvertHexToBin(reverseSecurityMask[secActionObj[0].AtrbMag]);
        var revBinVal = binVal.split('').reverse();

        if (revBinVal.length < secActionObj[0].AtrbBit) return false;

        if (revBinVal[secActionObj[0].AtrbBit] === '1') return true;
    }
    return false;
}

secUtil.ChkAtrbRulesBase = function (permissionMask, secActionObj) {
    var allowedActions = [];

    var reverseSecurityMask = permissionMask.split('.').reverse();

    for (var a = 0; a < secActionObj.length; a++) {
        if (reverseSecurityMask.length < secActionObj[a].AtrbMag) return allowedActions;

        var binVal = secUtil.ConvertHexToBin(reverseSecurityMask[secActionObj[a].AtrbMag]);
        var revBinVal = binVal.split('').reverse();

        if (revBinVal.length < secActionObj[a].AtrbBit) return allowedActions;

        if (revBinVal[secActionObj[a].AtrbBit] === '1') allowedActions.push(secActionObj[a].AtrbCode);
    }

    return allowedActions;
}

secUtil.ConvertHexToBin = function (hex) {
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

secUtil.ConvertBinStringToHex = function (binString) {
    var s2 = '', c;
    for (var i = 0, l = binString.length; i < l; ++i) {
        c = binString.charCodeAt(i);
        s2 += (c >> 4).toString(16);
        s2 += (c & 0xF).toString(16);
    }
    return s2;
}

