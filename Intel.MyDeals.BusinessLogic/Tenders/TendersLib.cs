using System;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.BusinessLogic.DataCollectors;
using Intel.MyDeals.BusinessRules;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;
using Intel.Opaque.Data;

namespace Intel.MyDeals.BusinessLogic
{
    public class TendersLib : ITendersLib
    {
        private readonly IOpDataCollectorLib _dataCollectorLib;
        private readonly IContractsLib _contractsLib;
        private readonly IPricingStrategiesLib _pricingStrategiesLib;

        public TendersLib(IOpDataCollectorLib dataCollectorLib, IContractsLib contractsLib, IPricingStrategiesLib pricingStrategiesLib)
        {
            _dataCollectorLib = dataCollectorLib;
            _contractsLib = contractsLib;
            _pricingStrategiesLib = pricingStrategiesLib;
        }

        public MyDealsData GetTenderMaster(int id, bool inclusive = false)
        {
            List<OpDataElementType> opDataElementTypes = inclusive
                ? new List<OpDataElementType>
                {
                    OpDataElementType.MASTER,
                    OpDataElementType.WIP_DEAL
                }
                : new List<OpDataElementType>
                {
                    OpDataElementType.MASTER
                };

            return OpDataElementType.MASTER.GetByIDs(new List<int> { id }, opDataElementTypes);
        }

        public MyDealsData GetTenderChildren(int id)
        {
            List<OpDataElementType> opDataElementTypes = new List<OpDataElementType>
            {
                OpDataElementType.WIP_DEAL
            };
            return OpDataElementType.MASTER.GetByIDs(new List<int> { id }, opDataElementTypes);
        }

        public OpDataCollectorFlattenedDictList GetMaster(int id)
        {
            MyDealsData myDealsData = GetTenderMaster(id).FillInHolesFromAtrbTemplate();

            OpDataCollectorFlattenedDictList data = new OpDataCollectorFlattenedDictList();

            foreach (OpDataElementType opDataElementType in myDealsData.Keys)
            {
                data[opDataElementType] = myDealsData.ToOpDataCollectorFlattenedDictList(opDataElementType, ObjSetPivotMode.Nested);
            }

            return data;
        }

        public OpDataCollectorFlattenedDictList GetChildren(int id)
        {
            MyDealsData myDealsData = GetTenderChildren(id).FillInHolesFromAtrbTemplate();

            OpDataCollectorFlattenedDictList data = new OpDataCollectorFlattenedDictList();

            foreach (OpDataElementType opDataElementType in myDealsData.Keys)
            {
                data[opDataElementType] = myDealsData.ToOpDataCollectorFlattenedDictList(opDataElementType, ObjSetPivotMode.Nested);
            }

            return data;
        }

        private string BuildWhereClause(SearchParams data, OpDataElementType opDataElementType)
        {
            return "";
            //string rtn = string.Empty;
            //List<string> modifiedSearchList = new List<string>();

            //List<string> searchAtrbs = new List<string>
            //{
            //    AttributeCodes.END_CUSTOMER_RETAIL,
            //    AttributeCodes.QLTR_PROJECT,
            //    AttributeCodes.TRKR_NBR,
            //    AttributeCodes.TITLE,
            //    AttributeCodes.BID_STATUS
            //};

            //// Tender Deals
            //modifiedSearchList.Add($"{opDataElementType}_REBATE_TYPE = 'TENDER'");

            //// Set Start Date
            //modifiedSearchList.Add($"{opDataElementType}_{AttributeCodes.START_DT} <= '{data.StrEnd:MM/dd/yyyy}'");

            //// Set End Date
            //modifiedSearchList.Add($"{opDataElementType}_{AttributeCodes.END_DT} >= '{data.StrStart:MM/dd/yyyy}'");

            //// search string can be a comma delim string... each string needs to be validated against the list of atrbs
            //if (!string.IsNullOrEmpty(data.StrSearch))
            //{
            //    var aSearch = data.StrSearch.Split(',');
            //    foreach (string singleSearchText in aSearch)
            //    {
            //        int dcId;
            //        List<string> conditions = new List<string>();
            //        if (int.TryParse(singleSearchText.Trim(), out dcId))
            //        {
            //            conditions.Add($"{opDataElementType}_OBJ_SID = {singleSearchText.Trim()}");
            //        }
            //        conditions.AddRange(searchAtrbs.Select(atrb => $"{opDataElementType}_{atrb} LIKE '%{singleSearchText.Trim().Replace("*","%")}%'"));
            //        modifiedSearchList.Add("(" + string.Join(" OR ", conditions) + ")");
            //    }
            //}

            //// create the full string
            //rtn += string.Join(" AND ", modifiedSearchList);

            //// grid level filters and passed serverside and need to be converted into a sql where compatible string
            //string strFilters = SearchTools.BuildFilterClause(data.StrFilters, opDataElementType);

            //// If no found filters... return
            //if (string.IsNullOrEmpty(strFilters)) return rtn;

            //// Put the search and filter criteria together
            //if (!string.IsNullOrEmpty(rtn)) rtn += " AND ";
            //rtn += strFilters;
            //return rtn;
        }


        /// <summary>
        /// Get the Tender Deal List
        /// </summary>
        /// <param name="data">SearchParams: Start/End Date, Search Text and Search conditions</param>
        /// <returns></returns>
        public SearchResultPacket GetTenderList(SearchParams data)
        {

            // Build where clause from start/end date and search text
            string whereClause = BuildWhereClause(data, OpDataElementType.WIP_DEAL);

            // Build Order By
            string orderBy = string.IsNullOrEmpty(data.StrSorts) ? "" : $"{OpDataElementType.WIP_DEAL}_{data.StrSorts}";
            // Special case = DC_ID... need to replace
            orderBy = orderBy.Replace(AttributeCodes.DC_ID, "OBJ_SID");
            if (string.IsNullOrEmpty(orderBy)) orderBy = "WIP_DEAL_OBJ_SID desc";

            // Build Search Packet from DB... will return a list of dc_ids and count
            // This will take in consideration the Skip and Take for performance
            SearchPacket res = new SearchLib().GetAdvancedSearchResults(whereClause, orderBy, OpDataElementType.WIP_DEAL.ToString(), data.Skip, data.Take);
            
            // Get return list of dc_ids
            List<int> dcIds = res.SearchResults.OrderBy(s => s.SORT_ORD).Select(s => s.OBJ_SID).ToList();

            // Now get the actual data based on the "slice" of matching data... this is based on the dc_ids list
            MyDealsData myDealsData = OpDataElementType.WIP_DEAL.GetByIDs(dcIds, 
                new List<OpDataElementType>
                {
                    OpDataElementType.WIP_DEAL
                },
                new List<int>
                {
                    Attributes.TITLE.ATRB_SID,
                    Attributes.OBJ_SET_TYPE_CD.ATRB_SID,
                    Attributes.CUST_MBR_SID.ATRB_SID,
                    Attributes.CUST_ACCNT_DIV.ATRB_SID,
                    Attributes.WF_STG_CD.ATRB_SID,
                    Attributes.PS_WF_STG_CD.ATRB_SID,
                    Attributes.TRKR_NBR.ATRB_SID,
                    Attributes.PRODUCT_FILTER.ATRB_SID,
                    Attributes.START_DT.ATRB_SID,
                    Attributes.END_DT.ATRB_SID,
                    Attributes.VOLUME.ATRB_SID,
                    Attributes.REBATE_TYPE.ATRB_SID,
                    Attributes.END_CUSTOMER_RETAIL.ATRB_SID,
                    Attributes.ECAP_PRICE.ATRB_SID,
                    Attributes.CAP.ATRB_SID,
                    Attributes.YCS2_PRC_IRBT.ATRB_SID,
                    Attributes.QLTR_PROJECT.ATRB_SID,
                    Attributes.QLTR_BID_GEO.ATRB_SID,
                    Attributes.GEO_COMBINED.ATRB_SID
                });


            // Get all the products in a collection base on the PRODUCT_FILTER
            // Note: the first hit is a performance dog as the product cache builds for the first time
            List <int> prodIds = myDealsData[OpDataElementType.WIP_DEAL].AllDataElements
                .Where(d => d.AtrbCd == AttributeCodes.PRODUCT_FILTER)
                .Select(d => int.Parse(d.AtrbValue.ToString())).ToList();
            List<ProductEngName> prods = new ProductDataLib().GetEngProducts(prodIds);

            // Apply Tender Rules
            foreach (OpDataCollector dc in myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors)
            {
                dc.ApplyRules(MyRulesTrigger.OnDealListLoad, null, prods);
            }

            // Convert data to Client-Ready format
            OpDataCollectorFlattenedList rtn = myDealsData
                .ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Nested, false)
                .ToHierarchialList(OpDataElementType.WIP_DEAL);

            // Get a list of My Customers (the ones I have access)
            CustomerLib custLib = new CustomerLib();
            List<int> mtCustIds = custLib.GetMyCustomersInfo().Select(c => c.CUST_DIV_SID).ToList();

            int sortCnt = 0;
            Dictionary<int,int> idSort = new Dictionary<int, int>();
            foreach (int dcId in dcIds)
            {
                idSort[dcId] = sortCnt++;
            }

            foreach (OpDataCollectorFlattenedItem item in rtn)
            {
                item["SortOrder"] = idSort[int.Parse(item[AttributeCodes.DC_ID].ToString())];

                // Need to convert CUST_MBR_SID to Customer Object
                CustomerDivision cust = custLib.GetCustomerDivisionsByCustNmId(int.Parse(item[AttributeCodes.CUST_MBR_SID].ToString())).FirstOrDefault();
                
                item["Customer"] = cust;

                // If user does not have access... modify the results.  This ONLY works because the grid is READ-ONLY
                if (cust != null && !mtCustIds.Contains(cust.CUST_NM_SID))
                {
                    item[AttributeCodes.ECAP_PRICE] = "no access";
                    item[AttributeCodes.CAP] = "no access";
                    item[AttributeCodes.GEO_APPROVED_PRICE] = "no access";
                    item[AttributeCodes.VOLUME] = "no access";
                    item[AttributeCodes.CREDIT_VOLUME] = "no access";
                    item[AttributeCodes.CREDIT_AMT] = "no access";
                    item[AttributeCodes.DEBIT_VOLUME] = "no access";
                    item[AttributeCodes.DEBIT_AMT] = "no access";
                    item[AttributeCodes.YCS2_PRC_IRBT] = "no access";
                    item[AttributeCodes.TRKR_NBR] = "no access";
                    item["TOT_QTY_PAID"] = "no access";
                    item["NET_VOL_PAID"] = "no access";
                    item[AttributeCodes.DEAL_MSP_PRC] = "no access";
                    //item[AttributeCodes.BLLG_DT] = "no access";
                }
            }

            List<OpDataCollectorFlattenedItem> rtnOrdered = rtn.OrderBy(r => r["SortOrder"]).ToList();

            // Return Data and Count
            return new SearchResultPacket
            {
                SearchResults = rtnOrdered,
                SearchCount = res.SearchCount
            };
        }

        public OpMsgQueue ActionTenderApprovals(ContractToken contractToken, List<TenderActionItem> data, string actn)
        {
            //modify contract token with necessary PS/Contract information
            //TODO: for now we assume only one data item - need to update this to work in bulk somehow...
            contractToken.CustId = data[0].CUST_MBR_SID;
            contractToken.ContractId = data[0].CNTRCT_OBJ_SID;
            contractToken.CustAccpt = "Accepted";   //TODO: for now I am assuming tender deals do not need customer acceptance - need to double check with Rabi/Meera

            //create actnPs (a list of WfActnItem) which contains pricing strategy IDs and the current wf_stg_cds keyed against the actn (like "Approve")
            Dictionary<string, List<WfActnItem>> actnPs = new Dictionary<string, List<WfActnItem>>();

            List<OpDataElementType> includeTypes = new List<OpDataElementType>();
            List<int> ids = new List<int>();

            ids.Add(data[0].DC_ID); //TODO: for now we assume only one data item - need to update this to work in bulk somehow...
            //includeTypes.Add(OpDataElementType.CNTRCT);
            includeTypes.Add(OpDataElementType.PRC_ST);
            //includeTypes.Add(OpDataElementType.WIP_DEAL);

            MyDealsData upperContract = OpDataElementType.WIP_DEAL.GetByIDs(ids, includeTypes);

            //TODO: need to modify for bulk data updates
            List<WfActnItem> wfActnList = new List<WfActnItem>();
            WfActnItem item = new WfActnItem();
            item.DC_ID = upperContract[OpDataElementType.PRC_ST].AllDataCollectors.FirstOrDefault().DcID;   //TODO: for now we assume only one data item - need to update this to work in bulk somehow...
            item.WF_STG_CD = data[0].WF_STG_CD;     //TODO: for now we assume only one data item - need to update this to work in bulk somehow...
            wfActnList.Add(item);

            actnPs[actn] = wfActnList;

            return _pricingStrategiesLib.ActionPricingStrategies(contractToken, actnPs);
        }

        public OpMsgQueue ActionTenders(ContractToken contractToken, List<TenderActionItem> data, string actn)
        {
            OpMsgQueue opMsgQueue = new OpMsgQueue();

            Dictionary<int, List<TenderActionItem>> contractDecoder = new Dictionary<int, List<TenderActionItem>>();
            foreach (TenderActionItem item in data)
            {
                if (!contractDecoder.ContainsKey(item.CNTRCT_OBJ_SID)) contractDecoder[item.CNTRCT_OBJ_SID] = new List<TenderActionItem>();
                contractDecoder[item.CNTRCT_OBJ_SID].Add(item);
            }

            foreach (List<TenderActionItem> item in contractDecoder.Values)
            {
                // Get new Tender Action List
                List<string> actions = MyOpDataCollectorFlattenedItemActions.GetTenderActionList(actn);

                //if the actn does not match anything in the tender action list, this means we are setting an approval action from the tender dashboard
                if (actions.Count() == 0)
                {
                    //Code flows through here when the "actn" is not Offer, Won, or Lost - we expect it to be an approval action such as Approve/Revise
                    opMsgQueue = ActionTenderApprovals(contractToken, data, actn);
                }
                else
                {
                    //Standard code flow for applying a bid action (Offer, Won, Lost) to a tender deal
                    contractToken.CustId = item.Select(t => t.CUST_MBR_SID).FirstOrDefault();
                    contractToken.ContractId = item.Select(t => t.CNTRCT_OBJ_SID).FirstOrDefault();
                    MyDealsData retMyDealsData = OpDataElementType.WIP_DEAL.UpdateAtrbValue(contractToken, item.Select(t => t.DC_ID).ToList(), Attributes.WF_STG_CD, actn, actn == WorkFlowStages.Won);



                    List<OpDataElement> trkrs = retMyDealsData[OpDataElementType.WIP_DEAL].AllDataElements.Where(t => t.AtrbCd == AttributeCodes.TRKR_NBR).ToList();

                    Dictionary<int, List<string>> dictTrkrs = new Dictionary<int, List<string>>();
                    foreach (OpDataElement de in trkrs)
                    {
                        if (!dictTrkrs.ContainsKey(de.DcID)) dictTrkrs[de.DcID] = new List<string>();
                        dictTrkrs[de.DcID].Add(de.AtrbValue.ToString());
                    }

                    // Apply messaging
                    opMsgQueue.Messages.Add(new OpMsg
                    {
                        MsgType = OpMsg.MessageType.Info,
                        Message = "Action List",
                        ExtraDetails = actn == WorkFlowStages.Won ? (object)dictTrkrs : actions
                    });
                }
            }

            return opMsgQueue;
        }

        public OpDataCollectorFlattenedDictList BulkTenderUpdate(ContractToken contractToken, ContractTransferPacket tenderData)
        {
            return _contractsLib.SaveContractAndPricingTable(contractToken, tenderData, forceValidation: true, forcePublish: true);
        }

    }

}