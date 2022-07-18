export class DE_Common_Util {
    static clearBadegCnt(groups): void {
        for (var g = 0; g < groups.length; g++) {
            groups[g].numErrors = 0;
        }
    }
    static increaseBadgeCnt(key, groups, templates): void {
        if (templates[key] === undefined) return;
        for (var i = 0; i < templates[key].Groups.length; i++) {
            for (var g = 0; g < groups.length; g++) {
                if (groups[g].name === templates[key].Groups[i] || groups[g].name === "All") {
                    groups[g].numErrors++;
                }
            }
        }
    }
    static checkSoftWarnings(gridResult, dealType): number {
        var numSoftWarn = 0;
        for (var w = 0; w < gridResult.length; w++) {
            if (!!gridResult[w]["CAP"] && dealType == "ECAP") {
                if (gridResult[w]["CAP"]["20___0"] === "No CAP") {
                    numSoftWarn++;
                }
                var cap = parseFloat(gridResult[w]["CAP"]["20___0"]);
                var ecap = parseFloat(gridResult[w]["ECAP_PRICE"]["20___0"]);
                if (ecap > cap) {
                    numSoftWarn++;
                }
            }
            gridResult[w]._behaviors.isReadOnly["TOTAL_CR_DB_PERC"] = true;
        }
        return numSoftWarn;
    }
    static showBool = function (val) {
        return val === "1" ? "Yes" : " ";
    }
}