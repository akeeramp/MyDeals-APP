
export class PTE_Common_Util {
    static getFullNameOfProduct (item, prodName) {
        if (item.PRD_ATRB_SID > 7005) return prodName;
        return (item.PRD_CAT_NM + " " + (item.BRND_NM === 'NA' ? "" : item.BRND_NM) + " " + (item.FMLY_NM === 'NA' ? "" : item.FMLY_NM)).trim();
    }

    static mapTieredWarnings (dataItem, dataToTieTo, atrbName, atrbToSetErrorTo, tierNumber) {
        if (!!dataItem._behaviors && !!dataItem._behaviors.validMsg && !jQuery.isEmptyObject(dataItem._behaviors.validMsg)) {
            if (dataItem._behaviors.validMsg[atrbName] != null) {
                try {
                    var jsonTierMsg = JSON.parse(dataItem._behaviors.validMsg[atrbName]);

                    if (dataItem.OBJ_SET_TYPE_CD === "KIT") {
                        if (jsonTierMsg["-1"] != null && jsonTierMsg["-1"] != undefined) {
                            dataToTieTo._behaviors.validMsg["ECAP_PRICE_____20_____1"] = jsonTierMsg["-1"];
                            dataToTieTo._behaviors.isError["ECAP_PRICE_____20_____1"] = true;
                        }
                    }

                    if (jsonTierMsg[tierNumber] != null && jsonTierMsg[tierNumber] != undefined) {
                        dataToTieTo._behaviors.validMsg[atrbToSetErrorTo] = jsonTierMsg[tierNumber];
                        dataToTieTo._behaviors.isError[atrbToSetErrorTo] = true;
                    } else {
                        delete dataToTieTo._behaviors.validMsg[atrbToSetErrorTo];
                        delete dataToTieTo._behaviors.isError[atrbToSetErrorTo];
                    }
                } catch (e) {

                }
            }
        }
    }
}