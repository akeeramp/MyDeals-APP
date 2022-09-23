export class Tender_Util {
    static getTenderDetails(response: any, isTenderContract: boolean) {
        if (isTenderContract) {
            for (let p = 0; p < response.length; p++) {
                let item = response[p];
                if (item !== undefined && item.PTR_SYS_PRD === "") {
                    item.dirty = true;
                }
            }
        }
    }

    static tenderTableLoad(contractData: any) {
        return contractData["IS_TENDER"] == "1" ? true : false;
    }
}