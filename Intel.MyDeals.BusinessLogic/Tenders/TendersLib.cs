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

        public TendersLib(IOpDataCollectorLib dataCollectorLib)
        {
            _dataCollectorLib = dataCollectorLib;
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
            string rtn = string.Empty;
            List<string> modifiedSearchList = new List<string>();

            List<string> searchAtrbs = new List<string>
            {
                AttributeCodes.END_CUSTOMER_RETAIL,
                AttributeCodes.QLTR_PROJECT,
                AttributeCodes.TRKR_NBR,
                AttributeCodes.TITLE,
                AttributeCodes.BID_STATUS
            };

            // Tender Deals
            modifiedSearchList.Add($"{opDataElementType}_REBATE_TYPE = 'TENDER'");

            // Set Start Date
            modifiedSearchList.Add($"{opDataElementType}_{AttributeCodes.START_DT} <= '{data.StrEnd:MM/dd/yyyy}'");

            // Set End Date
            modifiedSearchList.Add($"{opDataElementType}_{AttributeCodes.END_DT} >= '{data.StrStart:MM/dd/yyyy}'");

            // search string can be a comma delim string... each string needs to be validated against the list of atrbs
            if (!string.IsNullOrEmpty(data.StrSearch))
            {
                var aSearch = data.StrSearch.Split(',');
                foreach (string singleSearchText in aSearch)
                {
                    int dcId;
                    List<string> conditions = new List<string>();
                    if (int.TryParse(singleSearchText.Trim(), out dcId))
                    {
                        conditions.Add($"{opDataElementType}_OBJ_SID = {singleSearchText.Trim()}");
                    }
                    conditions.AddRange(searchAtrbs.Select(atrb => $"{opDataElementType}_{atrb} LIKE '%{singleSearchText.Trim().Replace("*","%")}%'"));
                    modifiedSearchList.Add("(" + string.Join(" OR ", conditions) + ")");
                }
            }

            // create the full string
            rtn += string.Join(" AND ", modifiedSearchList);

            // grid level filters and passed serverside and need to be converted into a sql where compatible string
            string strFilters = SearchTools.BuildFilterClause(data.StrFilters, opDataElementType);

            // If no found filters... return
            if (string.IsNullOrEmpty(strFilters)) return rtn;

            // Put the search and filter criteria together
            if (!string.IsNullOrEmpty(rtn)) rtn += " AND ";
            rtn += strFilters;
            return rtn;
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
            orderBy = orderBy.Replace("DC_ID", "OBJ_SID");
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
                    Attributes.BID_STATUS.ATRB_SID,
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
                dc.ApplyRules(MyRulesTrigger.OnTenderListLoad, null, prods);
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
                if (!mtCustIds.Contains(cust.CUST_NM_SID))
                {
                    item["ECAP_PRICE"] = "no access";
                    item["CAP"] = "no access";
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

        public OpMsgQueue ActionTenders(string dcIds, string actn)
        {
            OpMsgQueue opMsgQueue = new OpMsgQueue();
            List<int> tenderIds = dcIds.Split(',').Select(d => int.Parse(d.Trim())).ToList();

            // This is massively efficient, but we need to ensure we have the correct 
            // customer Id and contract Id since these span multiple contracts
            // This will not work in bulk... different contract id and customer #
            //
            // The justification is most users will only update one at a time
            //
            foreach (int id in tenderIds)
            {
                // YES... we are calling the DB once for Every Tender ID passed
                // YES... this is inefficient... read above
                OpDataCollector dcCntrct = OpDataElementType.WIP_DEAL.GetByIDs(
                    new List<int> {id},
                    new List<OpDataElementType> { OpDataElementType.CNTRCT },
                    new List<int> { Attributes.CUST_MBR_SID.ATRB_SID }
                    )[OpDataElementType.CNTRCT].AllDataCollectors.First();

                // Build Contract Token based on Contract/Customer
                ContractToken contractToken = new ContractToken
                {
                    ContractId = dcCntrct.DcID,
                    CustId = int.Parse(dcCntrct.GetDataElementValue(AttributeCodes.CUST_MBR_SID)),
                    NeedToCheckForDelete = false
                };

                // YES... we are updating the DB once for Every Tender ID passed
                MyDealsData retMyDealsData = OpDataElementType.WIP_DEAL.UpdateAtrbValue(contractToken, new List<int> { id }, Attributes.BID_STATUS, actn, actn == "Won");

                // Get new Tender Action List
                List<string> actions = MyOpDataCollectorFlattenedItemActions.GetTenderActionList(actn, WorkFlowStages.Active);

                // Apply messaging
                opMsgQueue = retMyDealsData.GetAllMessages();
                opMsgQueue.Messages.Add(new OpMsg
                {
                    MsgType = OpMsg.MessageType.Info,
                    Message = "Action List",
                    ExtraDetails = actions
                });
            }

            return opMsgQueue;

        }

    }

}