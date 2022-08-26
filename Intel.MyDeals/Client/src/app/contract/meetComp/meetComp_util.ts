export class MeetCompContractUtil {

    //Setting DICT for Confrim box
    static msgDescDict = {
        'COMP_SKU_NEW': 'You have entered a new Meet Comp SKU and price. Please make sure to store the Meet Comp SKU and price source in My Deals or in a legal approved repository as required by the MCA guidelines. Also, work with your Division Approver so they can update the necessary documentation.',
        'COMP_SKU_UPD': 'You have overwritten the pre-populated Meet Comp Price. Please make sure to store the Meet Comp price source in My Deals or in a legal approved repository as required by the MCA guidelines.',
        'IA_COMP_BNCH': 'You have overwritten the pre-populated or entered a new IA Bench / Comp Bench.Please make sure to store the IA Bench / Comp Bench source in My Deals or in a legal approved repository as required by the MCA guidelines.Also, work with your Division Approver so they can update the necessary documentation.',
        'SKU_BNCH': 'You have entered or overwritten the Meet Comp and IA Bench / Comp Bench data.Please make sure to store the Meet Comp and IA Bench / Comp Bench source in My Deals or in a legal approved repository as required by the MCA guidelines.Also, work with your Division Approver so they can update the necessary documentation.'
    };

    static isModelValid(data,errorList:Array<any>,canUpdateMeetCompSKUPriceBench:boolean,usrRole:string){
        for (let i = 0; i < data.length; i++) {
            let isError = false;
            const errorObj = {
                'COMP_SKU': false,
                'COMP_PRC': false,
                'COMP_BNCH': false,
                'IA_BNCH': false,
                'COMP_OVRRD_FLG': false,
                'COMP_OVRRD_RSN': false,
                'RW_NM': ""
            };
            //COMP_SKU Checking.....
            const isCompSkuZero = false;
            // per DE36513 removed this check... but left it here in case the request comes back
            //if (!isNaN(Math.abs(data[i].COMP_SKU))) {
            //    isCompSkuZero = true;
            //}
            if (isCompSkuZero && canUpdateMeetCompSKUPriceBench && data[i].MEET_COMP_STS.toLowerCase() != "na") {
                errorObj.COMP_SKU = true;
                errorObj.RW_NM = data[i].RW_NM;
                isError = true;
            }
            if (data[i].COMP_SKU.trim().length == 0 && canUpdateMeetCompSKUPriceBench && (data[i].MEET_COMP_STS.toLowerCase() == "fail" || data[i].MEET_COMP_STS.toLowerCase() == "incomplete" || data[i].MEET_COMP_STS.toLowerCase() == "not run yet")) {
                errorObj.COMP_SKU = true;
                errorObj.RW_NM = data[i].RW_NM;
                isError = true;
            }
            //COMP_PRC checking.....
            if (data[i].COMP_PRC <= 0 && canUpdateMeetCompSKUPriceBench && (data[i].MEET_COMP_STS.toLowerCase() == "fail" || data[i].MEET_COMP_STS.toLowerCase() == "incomplete" || data[i].MEET_COMP_STS.toLowerCase() == "not run yet")) {
                errorObj.COMP_PRC = true;
                errorObj.RW_NM = data[i].RW_NM;
                isError = true;
            }
            //COMP_BNCH checking....
            if (data[i].COMP_BNCH <= 0 && data[i].PRD_CAT_NM.toLowerCase() == "svrws" && (usrRole === "GA") && (data[i].MEET_COMP_STS.toLowerCase() == "fail" || data[i].MEET_COMP_STS.toLowerCase() == "incomplete" || data[i].MEET_COMP_STS.toLowerCase() == "not run yet")) {
                errorObj.COMP_BNCH = true;
                errorObj.RW_NM = data[i].RW_NM;
                isError = true;
            }
            //IA_BNCH checking....
            if (data[i].IA_BNCH <= 0 && data[i].PRD_CAT_NM.toLowerCase() == "svrws" && (usrRole === "GA") && (data[i].MEET_COMP_STS.toLowerCase() == "fail" || data[i].MEET_COMP_STS.toLowerCase() == "incomplete" || data[i].MEET_COMP_STS.toLowerCase() == "not run yet")) {
                errorObj.IA_BNCH = true;
                errorObj.RW_NM = data[i].RW_NM;
                isError = true;
            }
            //COMP_OVRRD_FLG checking....
            if (data[i].COMP_OVRRD_FLG <= 0 && (usrRole == "DA")) {
                errorObj.COMP_OVRRD_FLG = true;
                errorObj.RW_NM = data[i].RW_NM;
                isError = true;
            }
            //COMP_OVRRD_RSN checking....
            if (data[i].COMP_OVRRD_RSN <= 0 && (usrRole == "DA")) {
                errorObj.COMP_OVRRD_RSN = true;
                errorObj.RW_NM = data[i].RW_NM;
                isError = true;
            }
            if (isError){
                errorList.push(errorObj);
            }
        }
        if (errorList.length > 0){
            return false;
        }else{
            return true;
        }
    }

    static getProductLineData(state,gridData,meetCompMasterdata){
        let filterData;
        if (state.filter.filters.length > 0) {
            filterData = gridData.data;
        }
        else {
            filterData = meetCompMasterdata.ToArray();
        }
        //UPDATE Selected Product ROWS
        const selectedData = filterData
            .filter( (x)=> {
                return (x.IS_SELECTED == true);
            })
        return selectedData;
    }

    static getMeetCompPopupMessage(tempUpdatedList,meetCompUnchangedData) {
        let isSKUChanged = false;
        let isPriceChanged = false;
        let isIACompBenchChanged = false;
        for (let i = 0; i < tempUpdatedList.length; i++) {
            const ChangedSKUCount = meetCompUnchangedData
                .Where( (x)=> {
                    return (
                        x.GRP_PRD_SID == tempUpdatedList[i].GRP_PRD_SID &&
                        x.COMP_SKU == tempUpdatedList[i].COMP_SKU
                    )
                }).ToArray();

            const ChangedPRCCount = meetCompUnchangedData
                .Where( (x)=> {
                    return (
                        x.GRP_PRD_SID == tempUpdatedList[i].GRP_PRD_SID &&
                        x.COMP_SKU == tempUpdatedList[i].COMP_SKU &&
                        x.COMP_PRC == tempUpdatedList[i].COMP_PRC
                    )
                }).ToArray();

            const changedIACMPBenchCount =meetCompUnchangedData
                .Where( (x) => {
                    return (
                        x.GRP_PRD_SID == tempUpdatedList[i].GRP_PRD_SID &&
                        x.IA_BNCH == tempUpdatedList[i].IA_BNCH &&
                        x.COMP_BNCH == tempUpdatedList[i].COMP_BNCH
                    )
                }).ToArray();

            if (isSKUChanged == false && ChangedSKUCount.length == 0) {
                isSKUChanged = true;
            }
            if (isPriceChanged == false && ChangedPRCCount.length == 0) {
                isPriceChanged = true;
            }
            if (isIACompBenchChanged == false && changedIACMPBenchCount.length == 0) {
                isIACompBenchChanged = true;
            }
        }
        if ((isSKUChanged || isPriceChanged) && isIACompBenchChanged) {
            return this.msgDescDict['SKU_BNCH'];
        }
        else if (isIACompBenchChanged) {
            return this.msgDescDict['IA_COMP_BNCH'];
        }
        else if (isSKUChanged) {
            return this.msgDescDict['COMP_SKU_NEW'];
        }
        else if (isPriceChanged) {
            return this.msgDescDict['COMP_SKU_UPD'];
        }
        else {
            return null;
        }
    }

    static addErrorClasses(dataItems,errorList){
        if(errorList.length > 0){
            for (let j = 0; j < dataItems.length; j++) {
                const TEMP_RW_NM = dataItems[j]["RW_NM"];
                let indx = -1;
                errorList.some(function (e, i) {
                    if (e.RW_NM == TEMP_RW_NM) {
                        indx = i;
                        return true;
                    }
                });
                if (indx > -1) {
                    dataItems[j]["errObj"] = errorList[indx]
                }
            }
        }
    }
}