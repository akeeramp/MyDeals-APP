using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using System;
using System.Collections;
using Intel.MyDeals.BusinessLogic.DataCollectors;
using Intel.MyDeals.BusinessRules;
using Intel.Opaque.Data;
using Kendo.Mvc.UI;
using Newtonsoft.Json;

namespace Intel.MyDeals.BusinessLogic
{
    public class SearchLib : ISearchLib
    {
        private readonly ISearchDataLib _searchDataLib;

        /// <summary>
        /// TODO: This parameterless constructor is left as a reminder,
        /// once we fix our unit tests to use Moq remove this constructor, also remove direct reference to "Intel.MyDeals.DataLibrary"
        /// </summary>
        public SearchLib()
        {
            _searchDataLib = new SearchDataLib();
        }

        public SearchLib(ISearchDataLib searchDataLib)
        {
            _searchDataLib = searchDataLib;
        }

        public SearchPacket GetAdvancedSearchResults(string searchCondition, string orderBy, string searchObjTypes,
            int skip, int take)
        {
            //AppLib.GetMyCustomersInfo().Select(c => c.CUST_SID).Distinct().ToList()
            return _searchDataLib.GetAdvancedSearchResults(searchCondition, orderBy, searchObjTypes, skip, take);
        }

        /// <summary>
        /// Get All Search Results for given search text / customers
        /// </summary>
        /// <returns>list of Search results</returns>
        public List<SearchResults> GetSearchResults(string searchText, List<int> custIds)
        {
            return _searchDataLib.GetSearchResults(searchText, custIds).OrderBy(sr => sr.CUSTOMER).ToList();
        }

        public DcPath GotoDcId(OpDataElementType opDataElementType, int dcId)
        {
            // Get DcPath
            DcPath dcPath = opDataElementType.GetDcPath(dcId);

            // Make sure the user has access to the Deal
            if (dcPath.ContractId <= 0) {
                return new DcPath
                {
                    Message = $"Could not find {opDataElementType.ToDesc()} {dcId}."
                };
            }

            MyCustomersInformation cust = new CustomerLib().GetMyCustomersInfo(dcPath.CustMbrSid);
            if (cust == null)
            {
                // No access to the Customer
                return new DcPath
                {
                    Message = $"You do not have access to view {opDataElementType.ToDesc()} {dcId}."
                };
            }

            return dcPath;

        }

        private string GetFormattedValue(SearchFilter item)
        {

            string oper = item.Operator;
            object val = item.Value;

            if (oper == "LIKE")
            {
                val = $"%{val.ToString().Replace("*", "%")}%";
            }
            else if (item.Type == "list")
            {
                oper = "IN";
                val = $"({val.ToString().Replace("\"", "'").Replace("[", "").Replace("]", "")})";
            }
            else if (oper == "IN")
            {
                val = $"{val.ToString().Replace("\"", "'").Replace("[", "").Replace("]", "")}";

                List<string> aStr = val.ToString().Split(',').ToList();
                List<float> aNums = new List<float>();
                foreach (var s in aStr)
                {
                    float i;
                    if (float.TryParse(s.Trim(), out i))
                    {
                        aNums.Add(i);
                    }
                }
                val = $"({string.Join(",", aNums)})";
            }
            else if (oper == "=" && item.Type == "string" && val.ToString().IndexOf("*") >= 0)
            {
                oper = "LIKE";
                val = $"%{val.ToString().Replace("*","%")}%";
            }

            val = item.Type == "list" || item.Type == "number" || item.Type == "money" ? val : "\'" + val + "\'";
            val = val.ToString().Replace("\r\n", "");
            return $"{oper} {val}";
        }

        private string GetFormattedField(SearchFilter item, OpDataElementType opDataElementType)
        {
            string field = item.Field;
            Dictionary<string, string> atrbDecoder = new Dictionary<string, string>
            {
                [AttributeCodes.DC_ID] = "OBJ_SID"
            };

            if (atrbDecoder.ContainsKey(field)) field = atrbDecoder[field];

            return $"{opDataElementType}_{field}";
        }

        private string BuildWhereClause(SearchParams data, OpDataElementType opDataElementType, List<string> initSearchList, List<SearchFilter> customSearchOption)
        {
            string rtn = string.Empty;
            List<string> modifiedSearchList = initSearchList ?? new List<string>();

            List<string> searchAtrbs = new List<string>
            {
                AttributeCodes.END_CUSTOMER_RETAIL,
                AttributeCodes.QLTR_PROJECT,
                AttributeCodes.TRKR_NBR,
                AttributeCodes.TITLE,
                AttributeCodes.BID_STATUS
            };

            // Tender Deals
            // modifiedSearchList.Add($"{opDataElementType}_REBATE_TYPE = 'TENDER'");

            // Set Start Date
            modifiedSearchList.Add($"{opDataElementType}_{AttributeCodes.START_DT} <= '{data.StrEnd:MM/dd/yyyy}'");

            // Set End Date
            modifiedSearchList.Add($"{opDataElementType}_{AttributeCodes.END_DT} >= '{data.StrStart:MM/dd/yyyy}'");

            // Customers
            if (data.Customers.Any())
            {
                modifiedSearchList.Add($"{AttributeCodes.CUST_NM} IN ('{string.Join("','", data.Customers)}')");
            }

            // Add Custom Search
            if (customSearchOption.Any() && customSearchOption[0].Field != "")
            {
                modifiedSearchList.AddRange(customSearchOption.Select(item => $"{GetFormattedField(item, opDataElementType)} {GetFormattedValue(item)}"));
            }

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
                    conditions.AddRange(searchAtrbs.Select(atrb => $"{opDataElementType}_{atrb} LIKE '%{singleSearchText.Trim().Replace("*", "%")}%'"));
                    modifiedSearchList.Add("(" + string.Join(" OR ", conditions) + ")");
                }
            }

            // create the full string
            rtn += string.Join(" AND ", modifiedSearchList);

            // grid level filters and passed serverside and need to be converted into a sql where compatible string
            string strFilters = SearchTools.BuildFilterClause(data.StrFilters, opDataElementType);

            // couple special cases here
            rtn = rtn.Replace("WIP_DEAL_Customer/CUST_NM", "CUST_NM");
            rtn = rtn.Replace("WIP_DEAL_CNTRCT_TITLE", "CNTRCT_TITLE");
            rtn = rtn.Replace("WIP_DEAL_PRC_ST_TITLE", "PRC_ST_TITLE");
            rtn = rtn.Replace("WIP_DEAL_CNTRCT_C2A_DATA_C2A_ID", "CNTRCT_C2A_DATA_C2A_ID");

            // If no found filters... return
            if (string.IsNullOrEmpty(strFilters)) return rtn;

            // Put the search and filter criteria together
            if (!string.IsNullOrEmpty(rtn)) rtn += " AND ";
            rtn += strFilters;
            return rtn;
        }

        /// <summary>
        /// Get the Deal List
        /// </summary>
        /// <param name="data">SearchParams: Start/End Date, Search Text and Search conditions</param>
        /// <returns></returns>
        public SearchResultPacket GetDealList(SearchParams data, List<int> atrbs, List<string> initSearchCriteria, UserPreferences customSearchOptionUserPref, MyRulesTrigger? rulesTrigger)
        {
            List<SearchFilter> customSearchOption = customSearchOptionUserPref == null 
                ? new List<SearchFilter>()
                : JsonConvert.DeserializeObject<IEnumerable<SearchFilter>>(customSearchOptionUserPref.PRFR_VAL).ToList();

            // Build where clause from start/end date and search text
            string whereClause = BuildWhereClause(data, OpDataElementType.WIP_DEAL, initSearchCriteria, customSearchOption);

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

            Dictionary<int, AdvancedSearchResults> decoderById = new Dictionary<int, AdvancedSearchResults>();
            foreach (AdvancedSearchResults item in res.SearchResults)
            {
                decoderById[item.OBJ_SID] = item;
            }

            // Now get the actual data based on the "slice" of matching data... this is based on the dc_ids list
            MyDealsData myDealsData = OpDataElementType.WIP_DEAL.GetByIDs(dcIds,
                new List<OpDataElementType>
                {
                    OpDataElementType.WIP_DEAL
                },
                atrbs);


            // Get all the products in a collection base on the PRODUCT_FILTER
            // Note: the first hit is a performance dog as the product cache builds for the first time
            List<int> prodIds = myDealsData[OpDataElementType.WIP_DEAL].AllDataElements
                .Where(d => d.AtrbCd == AttributeCodes.PRODUCT_FILTER && d.AtrbValue.ToString() != "")
                .Select(d => int.Parse(d.AtrbValue.ToString())).ToList();
            List<ProductEngName> prods = new ProductDataLib().GetEngProducts(prodIds);

            // Apply Rules
            if (rulesTrigger != null)
            {
                foreach (OpDataCollector dc in myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors)
                {
                    dc.ApplyRules((MyRulesTrigger) rulesTrigger, null, prods);
                }
            }

            // Convert data to Client-Ready format
            OpDataCollectorFlattenedList rtn = myDealsData
                .ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Nested, false)
                .ToHierarchialList(OpDataElementType.WIP_DEAL);

            // Get a list of My Customers (the ones I have access)
            CustomerLib custLib = new CustomerLib();
            List<int> mtCustIds = custLib.GetMyCustomersInfo().Select(c => c.CUST_SID).ToList();

            int sortCnt = 0;
            Dictionary<int, int> idSort = new Dictionary<int, int>();
            foreach (int dcId in dcIds)
            {
                idSort[dcId] = sortCnt++;
            }

            foreach (OpDataCollectorFlattenedItem item in rtn)
            {
                int dcId = int.Parse(item[AttributeCodes.DC_ID].ToString());
                item["SortOrder"] = idSort[dcId];

                item["CNTRCT_OBJ_SID"] = decoderById[dcId].CNTRCT_OBJ_SID;
                item["CNTRCT_TITLE"] = decoderById[dcId].CNTRCT_TITLE;
                item["CNTRCT_C2A_DATA_C2A_ID"] = decoderById[dcId].CNTRCT_C2A_DATA_C2A_ID;
                item["PRC_ST_OBJ_SID"] = decoderById[dcId].PRC_ST_OBJ_SID;
                item["PRC_ST_TITLE"] = decoderById[dcId].PRC_ST_TITLE;
                item["CHG_DTM"] = DateTime.Parse(decoderById[dcId].WIP_DEAL_CHG_DTM.ToString());
                item["CHG_EMP_WWID"] = decoderById[dcId].WIP_DEAL_CHG_EMP_WWID;
                item["CRE_DTM"] = DateTime.Parse(decoderById[dcId].WIP_DEAL_CRE_DTM.ToString());
                item["CRE_EMP_WWID"] = decoderById[dcId].WIP_DEAL_CRE_EMP_WWID;
                item["CRE_EMP_NAME"] = decoderById[dcId].WIP_DEAL_CRE_EMP_NAME;

                // Need to convert CUST_MBR_SID to Customer Object
                if (item.ContainsKey(AttributeCodes.CUST_MBR_SID))
                {
                    CustomerDivision cust = custLib.GetCustomerDivisionsByCustNmId(int.Parse(item[AttributeCodes.CUST_MBR_SID].ToString())).FirstOrDefault();

                    if (cust == null)
                    {
                        item["Customer"] = new Dictionary<string,object>();
                        item["ECAP_PRICE"] = "no access";
                        item["CAP"] = "no access";
                    }
                    else
                    {
                        item["Customer"] = cust;

                        // If user does not have access... modify the results.  This ONLY works because the grid is READ-ONLY
                        if (!mtCustIds.Contains(cust.CUST_NM_SID))
                        {
                            item["ECAP_PRICE"] = "no access";
                            item["CAP"] = "no access";
                        }

                    }
                }
                else
                {
                    item["Customer"] = new CustomerDivision();
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

        /// <summary>
        /// Get the Non Tender Deal List
        /// </summary>
        /// <param name="data">SearchParams: Start/End Date, Search Text and Search conditions</param>
        /// <returns></returns>
        public SearchResultPacket GetNonTenderDealList(SearchParams data)
        {
            return GetDealList(data, new List<int>
            {
                Attributes.CAP.ATRB_SID,
                Attributes.CUST_ACCNT_DIV.ATRB_SID,
                Attributes.CUST_MBR_SID.ATRB_SID,
                Attributes.DEAL_GRP_NM.ATRB_SID,
                Attributes.ECAP_PRICE.ATRB_SID,
                Attributes.END_CUSTOMER_RETAIL.ATRB_SID,
                Attributes.END_DT.ATRB_SID,
                Attributes.END_VOL.ATRB_SID,
                Attributes.GEO_COMBINED.ATRB_SID,
                Attributes.MRKT_SEG.ATRB_SID,
                Attributes.NOTES.ATRB_SID,
                Attributes.OBJ_SET_TYPE_CD.ATRB_SID,
                Attributes.PAYOUT_BASED_ON.ATRB_SID,
                Attributes.PRODUCT_FILTER.ATRB_SID,
                Attributes.PROGRAM_PAYMENT.ATRB_SID,
                Attributes.PS_WF_STG_CD.ATRB_SID,
                Attributes.RATE.ATRB_SID,
                Attributes.REBATE_TYPE.ATRB_SID,
                Attributes.START_DT.ATRB_SID,
                Attributes.STRT_VOL.ATRB_SID,
                Attributes.TITLE.ATRB_SID,
                Attributes.TOTAL_DOLLAR_AMOUNT.ATRB_SID,
                Attributes.TRKR_NBR.ATRB_SID,
                Attributes.VOLUME.ATRB_SID,
                Attributes.WF_STG_CD.ATRB_SID
            },
            new List<string> (),
            new UserPreferencesLib().GetUserPreference("DealSearch", "SearchOptions", "CustomSearch"),
            MyRulesTrigger.OnDealListLoad);
        }

        /// <summary>
        /// Get the Non Tender Deal List
        /// </summary>
        /// <param name="data">SearchParams: Start/End Date, Search Text and Search conditions</param>
        /// <returns></returns>
        public SearchResultPacket GetTenderDealList(SearchParams data)
        {
            return GetDealList(data, new List<int>
            {
                Attributes.BID_STATUS.ATRB_SID,
                Attributes.CAP.ATRB_SID,
                Attributes.CUST_ACCNT_DIV.ATRB_SID,
                Attributes.CUST_MBR_SID.ATRB_SID,
                Attributes.ECAP_PRICE.ATRB_SID,
                Attributes.END_CUSTOMER_RETAIL.ATRB_SID,
                Attributes.END_DT.ATRB_SID,
                Attributes.GEO_COMBINED.ATRB_SID,
                Attributes.OBJ_SET_TYPE_CD.ATRB_SID,
                Attributes.PRODUCT_FILTER.ATRB_SID,
                Attributes.PS_WF_STG_CD.ATRB_SID,
                Attributes.QLTR_BID_GEO.ATRB_SID,
                Attributes.QLTR_PROJECT.ATRB_SID,
                Attributes.REBATE_TYPE.ATRB_SID,
                Attributes.SERVER_DEAL_TYPE.ATRB_SID,
                Attributes.START_DT.ATRB_SID,
                Attributes.TITLE.ATRB_SID,
                Attributes.TRKR_NBR.ATRB_SID,
                Attributes.VOLUME.ATRB_SID,
                Attributes.WF_STG_CD.ATRB_SID,
                Attributes.YCS2_PRC_IRBT.ATRB_SID
            },
            new List<string> { "WIP_DEAL_REBATE_TYPE = 'TENDER'" },
            null,
            MyRulesTrigger.OnDealListLoad);
        }

        public OpDataCollectorFlattenedList GetGlobalList(SearchParams data, OpDataElementType deType)
        {
            List<int> atrbs = new List<int>
            {
                Attributes.CUST_ACCNT_DIV.ATRB_SID,
                Attributes.CUST_MBR_SID.ATRB_SID,
                Attributes.END_DT.ATRB_SID,
                Attributes.OBJ_SET_TYPE_CD.ATRB_SID,
                Attributes.REBATE_TYPE.ATRB_SID,
                Attributes.START_DT.ATRB_SID,
                Attributes.TITLE.ATRB_SID,
                Attributes.WF_STG_CD.ATRB_SID
            };

            int dcIdNum;
            string whereClause, orderBy, searchIn;

            if (int.TryParse(data.StrSearch, out dcIdNum))
            {
                whereClause = $"{deType}_OBJ_SID = {dcIdNum} OR {deType}_TITLE LIKE '%{data.StrSearch.Replace("'", "''").Replace(" ", "%")}%'";
                orderBy = $"{deType}_OBJ_SID desc";
                searchIn = $"{deType}";
            }
            else
            {
                whereClause = $"{deType}_TITLE LIKE '%{data.StrSearch.Replace("'", "''").Replace(" ", "%")}%'";
                orderBy = $"{deType}_OBJ_SID desc";
                searchIn = $"{deType}";
            }

            SearchPacket res = new SearchLib().GetAdvancedSearchResults(whereClause, orderBy, searchIn, 0, data.Take);

            List<int> dcIds = res.SearchResults.Where(s => s.OBJ_TYPE == deType.ToString()).OrderByDescending(s => s.OBJ_SID).Select(s => s.OBJ_SID).ToList();
            MyDealsData myDealsData = deType.GetByIDs(dcIds, new List<OpDataElementType> { deType }, atrbs);
            return myDealsData.ToOpDataCollectorFlattenedDictList(deType, ObjSetPivotMode.Nested, false);
        }

    }
}
