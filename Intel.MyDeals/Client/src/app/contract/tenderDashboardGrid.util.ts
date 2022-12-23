import { GridUtil } from "./grid.util";
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

        var ar = data["WF_STG_CD"];
        var prntWfStg = data["PS_WF_STG_CD"];
        var salesForceId = data["SALESFORCE_ID"];

        if (ar !== undefined && ar !== null && ar === "no access") {
            return "<div class='noaccess'>no access</div>";
        }

        if (!this.hasVertical(data)) {
            return "<div class='noaccess'>no vertical access</div>";
        }

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
        // if contract is not published
        if (data._contractPublished !== undefined && data._contractPublished === 0) {
            return "<div class='noaccess' style='text-align: center; width: 100%;' title='Deals have not been published from Folio.'>Folio <a href='/Dashboard#/contractmanager/" + data._contractId + "' target='_blank'>" + data._contractId + "</a><div class='non-action-gray' style='color: #aaaaaa;'>(<i>Not Actionable</i>)</div></div>";
        }
        var numActions = 0;
        for (var k in actions) {
            if (actions.hasOwnProperty(k)) {
                if (actions[k] == true) {
                    numActions++;
                }
            }
        }

        //If cancelled, no actions avalable
        if (data.WF_STG_CD == "Cancelled") {
            return "<div class='action_style' is-editable='true' style='text-align: center; width: 100%;'>" + data.WF_STG_CD + "<div class='non-action-gray' style='color: #aaaaaa;' title='This deal is cancelled.'>(<i class='action_style'>Not Actionable</i>)</div></div>";
        }
        if (bidActns.length == 0) {
            if (numActions === 0) {
                //no actions available to this user for this deal
                return "<div class='action_style' is-editable='true' style='text-align: center; width: 100%;'>" + GridUtil.stgFullTitleChar(data) + "<div class='non-action-gray' style='color: #aaaaaa;' title='No Actions available.'>(<i class='action_style'>Not Actionable</i>)</div></div>";
            } else {
                return "<div class='action_style' is-editable='true' style='text-align: center; width: 100%;'>Action</div>";
            }
        } else {
            //Bid Action = Won will have one listed action so no point allowing user to change it
            if (bidActns.length === 1) return "<div class='action_style' is-editable='true' style='text-align: center; width: 100%;'>" + data.WF_STG_CD + "<div class='non-action-gray' style='color: #aaaaaa;' title='This deal is already marked as Won.'>(<i class='action_style'>Not Actionable</i>)</div></div>";
            //all other cases is bid action size 2 or 3, aka Lost/Offer.
            return "<div is-editable='true' style='text-align: center; width: 100%;'>" + data.WF_STG_CD + "</div>"
        }
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