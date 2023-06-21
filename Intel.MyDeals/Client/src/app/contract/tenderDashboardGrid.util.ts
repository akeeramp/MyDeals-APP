import { PTE_Common_Util } from "./PTEUtils/PTE_Common_util";

export class TenderDashboardGridUtil {
    static findOne(haystack, arr) {
        return arr.some(function (v) {
            return haystack.indexOf(v) >= 0;
        });
    }

    static hasVertical = function (dataItem) {
        var psHasUserVerticals = true;
        if ((<any>window).usrRole !== "DA") return true;
        if ((<any>window).usrVerticals.length > 0) {
            var userVerticals = (<any>window).usrVerticals.split(",");
            if (dataItem.VERTICAL_ROLLUP !== undefined) { // Was VERTICAL_ROLLUP
                var dataVerticals = dataItem.VERTICAL_ROLLUP.split(",");
                psHasUserVerticals = this.findOne(dataVerticals, userVerticals);
            }
            else if (dataItem.PRODUCT_CATEGORIES !== undefined) { // Was VERTICAL_ROLLUP
                var dataVerticals = dataItem.PRODUCT_CATEGORIES.split(",");
                psHasUserVerticals = this.findOne(dataVerticals, userVerticals);
            }
            else {
                psHasUserVerticals = false;
            }
        }
        return psHasUserVerticals;
    }

    static getBidActions = function (data) {
        if (data.BID_ACTNS === undefined || data._actionsPS === undefined) return "";

        var prntWfStg = data["PS_WF_STG_CD"];
        var salesForceId = data["SALESFORCE_ID"];
        var bidActns = this.getBidActionsList(data);
        data["orig_WF_STG_CD"] = data.WF_STG_CD;
        data.BID_ACTNS = bidActns;

        //remove the cancelled action as we do not want that in our dropdown so we won't consider it when deciding what to display
        var actions = PTE_Common_Util.deepClone(data._actionsPS);
        if (actions["Cancel"] == true) {
            delete actions["Cancel"];
        }
        if (actions["Hold"] == true) {
            delete actions["Hold"];
        }
        // If it is an IQR deal in Requested, prevent user from pushing it down to Draft
        if (salesForceId !== undefined && salesForceId !== "" && prntWfStg === "Requested") {
            delete actions["Revise"];
            delete data._actionsPS["Revise"];
        }
        var numActions = 0;
        for (var k in actions) {
            if (actions.hasOwnProperty(k)) {
                if (actions[k] == true) {
                    numActions++;
                }
            }
        }
        return {
            'bidActns': bidActns,
            'numActions': numActions
        };
    }

    static getBidActionsList = function (data) {
        var bidActns = [];
        if (data.BID_ACTNS !== undefined) {
            for (var i = 0; i < data.BID_ACTNS.length; i++) {
                if (!(data.BID_ACTNS[i]['BidActnName'] === 'Offer' || data.BID_ACTNS[i]['BidActnName'] === 'Won'
                    || data.BID_ACTNS[i]['BidActnName'] === 'Lost')) {
                    if (data.SALESFORCE_ID === undefined || data.SALESFORCE_ID === "") {
                        bidActns.push({
                            "BidActnName": data.BID_ACTNS[i],
                            "BidActnValue": data.BID_ACTNS[i]
                        });
                    }
                    else // Salesforce Tenders Deal - change flow for WON/LOST, only push on current stage
                    {
                        if (data.BID_ACTNS[i] === data.WF_STG_CD) {
                            bidActns.push({
                                "BidActnName": data.BID_ACTNS[i],
                                "BidActnValue": data.BID_ACTNS[i]
                            });
                        }
                    }
                }
            }
        }
        if (bidActns.length === 0) {
            bidActns = data.BID_ACTNS;
        }
        return bidActns;
    }
}