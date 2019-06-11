using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using System;
using System.Text;
using Intel.MyDeals.BusinessLogic.DataCollectors;
using Intel.MyDeals.BusinessRules;
using Intel.Opaque.Data;
using Newtonsoft.Json;

namespace Intel.MyDeals.BusinessLogic
{
    public class SearchLib : ISearchLib
    {
        private readonly ISearchDataLib _searchDataLib;
        private readonly ITendersLib _tendersLib;
        private readonly IPricingStrategiesLib _pricingStrategiesLib;

        /// <summary>
        /// TODO: This parameterless constructor is left as a reminder,
        /// once we fix our unit tests to use Moq remove this constructor, also remove direct reference to "Intel.MyDeals.DataLibrary"
        /// </summary>
        public SearchLib()
        {
            _searchDataLib = new SearchDataLib();
        }

        public SearchLib(ISearchDataLib searchDataLib, ITendersLib tendersLib, IPricingStrategiesLib pricingStrategiesLib)
        {
            _searchDataLib = searchDataLib;
            _tendersLib = tendersLib;
            _pricingStrategiesLib = pricingStrategiesLib;
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

        private string GetFormattedValue(SearchFilter item, OpDataElementType opDataElementType)
        {
            string field = GetFormattedField(item, opDataElementType);

            string oper = item.Operator;
            object val = item.Value;

            if (oper == "LIKE")
            {
                if (val.ToString().IndexOf("[") >= 0)
                {
                    StringBuilder sb = new StringBuilder(val.ToString());

                    string myString = sb
                        .Replace("\r\n", "")
                        .Replace("*", "%")
                        .Replace("{", "")
                        .Replace("}", "")
                        .Replace("[  ", "")
                        .Replace("[ ", "")
                        .Replace("[", "")
                        .Replace("]", "")
                        .Replace("% ", "%")
                        .Replace("\"", "")
                        .Replace(", ", ",")
                        .Replace(", ", ",")
                        .ToString();

                    List<string> aRtn = myString.Split(',').Select(s => $"{field} {oper} '%{s}%'").ToList();

                    return $"({string.Join(" OR ", aRtn)})";
                }
                else
                {
                    val = $"%{val.ToString().Replace("*", "%")}%";
                }
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

            return $"{field} {oper} {val}";
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

        private string BuildWhereClause(SearchParams data, OpDataElementType opDataElementType, List<string> initSearchList, List<SearchFilter> customSearchOption, bool userDefStart, bool userDefEnd, bool userDefContract, bool userDefDeal)
        {
            string rtn = string.Empty;
            List<string> modifiedSearchList = initSearchList ?? new List<string>();

            List<string> searchAtrbs = new List<string>
            {
                AttributeCodes.END_CUSTOMER_RETAIL,
                AttributeCodes.QLTR_PROJECT,
                AttributeCodes.TRKR_NBR,
                AttributeCodes.TITLE,
                AttributeCodes.WF_STG_CD
            };

            // Tender Deals
            // modifiedSearchList.Add($"{opDataElementType}_REBATE_TYPE = 'TENDER'");

            // Set Start Date
            if (!userDefStart && !userDefContract && !userDefDeal) modifiedSearchList.Add($"{opDataElementType}_{AttributeCodes.START_DT} <= '{data.StrEnd:MM/dd/yyyy}'");

            // Set End Date
            if (!userDefEnd && !userDefContract && !userDefDeal) modifiedSearchList.Add($"{opDataElementType}_{AttributeCodes.END_DT} >= '{data.StrStart:MM/dd/yyyy}'");

            // Customers
            if (data.Customers.Any() && !userDefContract && !userDefDeal)
            {
                modifiedSearchList.Add($"{AttributeCodes.CUST_NM} IN ('{string.Join("','", data.Customers).Replace("&per;",".")}')");
            }

            // Add Custom Search
            if (customSearchOption.Any() && customSearchOption[0].Field != "")
            {
                modifiedSearchList.AddRange(customSearchOption.Select(item => $"{GetFormattedValue(item, opDataElementType)}"));
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

            for (int f = 0; f < modifiedSearchList.Count; f++)
            {
                if (f == 0 && initSearchList.Any()) continue;
                if (modifiedSearchList[f].IndexOf("WIP_DEAL_WF_STG_CD") >= 0)
                {
                    modifiedSearchList[f] = $"(({modifiedSearchList[f]}) OR (WIP_DEAL_WF_STG_CD = 'Draft' AND {modifiedSearchList[f].Replace("WIP_DEAL_WF_STG_CD", "WIP_DEAL_PS_WF_STG_CD")}))";
                }
            }

            // create the full string
            rtn += string.Join(" AND ", modifiedSearchList);

            // grid level filters and passed serverside and need to be converted into a sql where compatible string
            string strFilters = SearchTools.BuildFilterClause(data.StrFilters, opDataElementType);

            // couple special cases here
            rtn = rtn.Replace("WIP_DEAL_Customer/CUST_NM", AttributeCodes.CUST_NM);
            rtn = rtn.Replace("WIP_DEAL_Customer.CUST_NM", AttributeCodes.CUST_NM);
            rtn = rtn.Replace("WIP_DEAL_CNTRCT_TITLE", "CNTRCT_TITLE");
            rtn = rtn.Replace("WIP_DEAL_CNTRCT_OBJ_SID", "CNTRCT_OBJ_SID");
            rtn = rtn.Replace("WIP_DEAL_PRC_ST_TITLE", "PRC_ST_TITLE");
            rtn = rtn.Replace("WIP_DEAL_PRC_ST_OBJ_SID", "PRC_ST_OBJ_SID");
            rtn = rtn.Replace("WIP_DEAL_CNTRCT_C2A_DATA_C2A_ID", "CNTRCT_C2A_DATA_C2A_ID");

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
            string whereClause = _tendersLib.BuildWhereClause(data, OpDataElementType.WIP_DEAL);

            // Build Order By
            string orderBy = string.IsNullOrEmpty(data.StrSorts) ? "" : $"{OpDataElementType.WIP_DEAL}_{data.StrSorts}";
            // Special case = DC_ID... need to replace
            orderBy = orderBy.Replace(AttributeCodes.DC_ID, "OBJ_SID");
            if (string.IsNullOrEmpty(orderBy)) orderBy = "WIP_DEAL_OBJ_SID desc";

            // Build Search Packet from DB... will return a list of dc_ids and count
            // This will take in consideration the Skip and Take for performance
            SearchPacket res = GetAdvancedSearchResults(whereClause, orderBy, OpDataElementType.WIP_DEAL.ToString(), data.Skip, data.Take);

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
            List<int> prodIds = myDealsData[OpDataElementType.WIP_DEAL].AllDataElements
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
            Dictionary<int, int> idSort = new Dictionary<int, int>();
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

        /// <summary>
        /// Get the Deal List
        /// </summary>
        /// <param name="data">SearchParams: Start/End Date, Search Text and Search conditions</param>
        /// <returns></returns>
        public SearchResultPacket GetDealList(SearchParams data, List<int> atrbs, List<string> initSearchCriteria, UserPreferences customSearchOptionUserPref, bool useCustSecurity, MyRulesTrigger? rulesTrigger, bool fromTenderDashboard = false)
        {
            List<SearchFilter> customSearchOption = customSearchOptionUserPref == null
                ? new List<SearchFilter>()
                : JsonConvert.DeserializeObject<IEnumerable<SearchFilter>>(customSearchOptionUserPref.PRFR_VAL).ToList();

            // Check is user entered a date range
            bool userDefStart = customSearchOptionUserPref?.PRFR_VAL != null && customSearchOptionUserPref.PRFR_VAL.IndexOf(AttributeCodes.START_DT) >= 0;
            bool userDefEnd = customSearchOptionUserPref?.PRFR_VAL != null && customSearchOptionUserPref.PRFR_VAL.IndexOf(AttributeCodes.END_DT) >= 0;
            bool userDefCntrct = customSearchOptionUserPref?.PRFR_VAL != null && customSearchOptionUserPref.PRFR_VAL.IndexOf("CNTRCT_OBJ_SID") >= 0;
            bool userDefDeal = customSearchOptionUserPref?.PRFR_VAL != null && customSearchOptionUserPref.PRFR_VAL.IndexOf("DEAL_OBJ_SID") >= 0;


            // Build where clause from start/end date and search text
            string whereClause = BuildWhereClause(data, OpDataElementType.WIP_DEAL, initSearchCriteria, customSearchOption, userDefStart, userDefEnd, userDefCntrct, userDefDeal);

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

            Dictionary<int, AdvancedSearchResults> decoderById = new Dictionary<int, AdvancedSearchResults>();
            foreach (AdvancedSearchResults item in res.SearchResults)
            {
                decoderById[item.OBJ_SID] = item;
            }

            MyDealsData myDealsData;
            OpDataCollectorFlattenedList rtn;

            // Now get the actual data based on the "slice" of matching data... this is based on the dc_ids list
            myDealsData = OpDataElementType.WIP_DEAL.GetByIDs(dcIds,
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
            Dictionary<int, List<ProductEngName>> prodMap = new Dictionary<int, List<ProductEngName>>();

            // Apply Rules
            if (rulesTrigger != null)
            {
                foreach (OpDataCollector dc in myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors)
                {
                    dc.ApplyRules((MyRulesTrigger)rulesTrigger, null, prods);
                    prodMap[dc.DcID] = dc.GetDataElements(AttributeCodes.PRODUCT_FILTER).Select(d => (ProductEngName)d.PrevAtrbValue).ToList();
                }
            }


            OpDataCollectorFlattenedDictList flatDictList = myDealsData.ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Nested, fromTenderDashboard);
            // Convert data to Client-Ready format
            rtn = flatDictList.ToHierarchialList(OpDataElementType.WIP_DEAL);

            if (fromTenderDashboard)
            {
                //we follow this logic path if we make the request from the tender dashboard. TODO: FetchTenderData duplicates some of the work done in the lines above.  Can we optimize?
                rtn = _pricingStrategiesLib.FetchTenderData(dcIds, OpDataElementType.WIP_DEAL).ToHierarchialList(OpDataElementType.WIP_DEAL);
            }

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
                item["CHG_EMP_NAME"] = decoderById[dcId].WIP_DEAL_CHG_EMP_NAME;
                item["CRE_DTM"] = DateTime.Parse(decoderById[dcId].WIP_DEAL_CRE_DTM.ToString());
                item["CRE_EMP_WWID"] = decoderById[dcId].WIP_DEAL_CRE_EMP_WWID;
                item["CRE_EMP_NAME"] = decoderById[dcId].WIP_DEAL_CRE_EMP_NAME;
                item["DIV_APPROVED_BY"] = decoderById[dcId].WIP_DEAL_DIV_APPROVED_BY;
                item["GEO_APPROVED_BY"] = decoderById[dcId].WIP_DEAL_GEO_APPROVED_BY;
                item["products"] = prodMap.ContainsKey(dcId) ? prodMap[dcId]: new List<ProductEngName>();

                // Need to convert CUST_MBR_SID to Customer Object
                if (item.ContainsKey(AttributeCodes.CUST_MBR_SID))
                {
                    CustomerDivision cust = custLib.GetCustomerDivisionsByCustNmId(int.Parse(item[AttributeCodes.CUST_MBR_SID].ToString())).FirstOrDefault();

                    if (cust == null)
                    {
                        item["Customer"] = new Dictionary<string,object>();
                        item[AttributeCodes.ECAP_PRICE] = "no access";
                        item[AttributeCodes.CAP] = "no access";
                        item[AttributeCodes.WF_STG_CD] = "no access";
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
                    else
                    {
                        item["Customer"] = cust;

                        // If user does not have access... modify the results.  This ONLY works because the grid is READ-ONLY
                        if (!mtCustIds.Contains(cust.CUST_NM_SID))
                        {
                            item[AttributeCodes.ECAP_PRICE] = "no access";
                            item[AttributeCodes.CAP] = "no access";
                            item[AttributeCodes.WF_STG_CD] = "no access";
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
                Attributes.BLLG_DT.ATRB_SID,
                Attributes.CAP.ATRB_SID,
                Attributes.CREDIT_AMT.ATRB_SID,
                Attributes.CREDIT_VOLUME.ATRB_SID,
                Attributes.CUST_ACCNT_DIV.ATRB_SID,
                Attributes.CUST_MBR_SID.ATRB_SID,
                Attributes.DEAL_GRP_NM.ATRB_SID,
                Attributes.DEAL_DESC.ATRB_SID,
                Attributes.DEBIT_AMT.ATRB_SID,
                Attributes.DEBIT_VOLUME.ATRB_SID,
                Attributes.DIV_APPROVED_BY.ATRB_SID,
                Attributes.ECAP_PRICE.ATRB_SID,
                Attributes.END_CUSTOMER_RETAIL.ATRB_SID,
                Attributes.END_DT.ATRB_SID,
                Attributes.END_VOL.ATRB_SID,
                Attributes.OEM_PLTFRM_LNCH_DT.ATRB_SID,
                Attributes.OEM_PLTFRM_EOL_DT.ATRB_SID,
                Attributes.FSE_APPROVED_BY.ATRB_SID,
                Attributes.GEO_APPROVED_BY.ATRB_SID,
                Attributes.GEO_COMBINED.ATRB_SID,
                Attributes.MRKT_SEG.ATRB_SID,
                Attributes.NOTES.ATRB_SID,
                Attributes.OBJ_SET_TYPE_CD.ATRB_SID,
                Attributes.PAYOUT_BASED_ON.ATRB_SID,
                Attributes.PRODUCT_CATEGORIES.ATRB_SID,
                Attributes.PRODUCT_FILTER.ATRB_SID,
                Attributes.PROGRAM_PAYMENT.ATRB_SID,
                Attributes.PS_WF_STG_CD.ATRB_SID,
                Attributes.RATE.ATRB_SID,
                Attributes.REBATE_TYPE.ATRB_SID,
                Attributes.SERVER_DEAL_TYPE.ATRB_SID,
                Attributes.START_DT.ATRB_SID,
                Attributes.STRT_VOL.ATRB_SID,
                Attributes.TITLE.ATRB_SID,
                Attributes.TOTAL_DOLLAR_AMOUNT.ATRB_SID,
                Attributes.TRKR_NBR.ATRB_SID,
                Attributes.VOLUME.ATRB_SID,
                Attributes.WF_STG_CD.ATRB_SID
            },
            new List<string> { SearchTools.BuildCustSecurityWhere() },
            new UserPreferencesLib().GetUserPreference("DealSearch", "SearchRules", "CustomSearch"),
            true,
            MyRulesTrigger.OnDealListLoad,
            false);
        }

        /// <summary>
        /// Get the Non Tender Deal List
        /// </summary>
        /// <param name="data">SearchParams: Start/End Date, Search Text and Search conditions</param>
        /// <returns></returns>
        public SearchResultPacket GetTenderDealList(SearchParams data, bool activeOnly)
        {
            string actvstr = activeOnly ? " AND WIP_DEAL_WF_STG_CD IN ('" + WorkFlowStages.Won + "', '" + WorkFlowStages.Lost + "', '" + WorkFlowStages.Offer + "')" : "";
            return GetDealList(data, new List<int>
            {
                Attributes.BLLG_DT.ATRB_SID,
                Attributes.CAP.ATRB_SID,
                Attributes.CREDIT_AMT.ATRB_SID,
                Attributes.CREDIT_VOLUME.ATRB_SID,
                Attributes.CUST_ACCNT_DIV.ATRB_SID,
                Attributes.CUST_MBR_SID.ATRB_SID,
                Attributes.DEAL_DESC.ATRB_SID,
                Attributes.DEBIT_AMT.ATRB_SID,
                Attributes.DEBIT_VOLUME.ATRB_SID,
                Attributes.ECAP_PRICE.ATRB_SID,
                Attributes.END_CUSTOMER_RETAIL.ATRB_SID,
                Attributes.END_DT.ATRB_SID,
                Attributes.GEO_COMBINED.ATRB_SID,
                Attributes.OBJ_SET_TYPE_CD.ATRB_SID,
                Attributes.PRODUCT_CATEGORIES.ATRB_SID,
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
            new List<string> { "WIP_DEAL_REBATE_TYPE = 'TENDER' AND WIP_DEAL_OBJ_SET_TYPE_CD != 'PROGRAM'" + actvstr },
            null,
            false,
            MyRulesTrigger.OnDealListLoad,
            false);
        }

        /// <summary>
        /// Get the Non Tender Deal List
        /// </summary>
        /// <param name="data">SearchParams: Start/End Date, Search Text and Search conditions</param>
        /// <returns></returns>
        public SearchResultPacket GetTenderDashboardList(SearchParams data)
        {
            SearchResultPacket ret= GetDealList(data,
                new List<int>(),
                new List<string> { SearchTools.BuildCustSecurityWhere() + "AND WIP_DEAL_REBATE_TYPE = 'TENDER' AND WIP_DEAL_OBJ_SET_TYPE_CD != 'PROGRAM' AND CNTRCT_TENDER_PUBLISHED = 1" },    //AND TENDER_PUBLISHED = '1'
                new UserPreferencesLib().GetUserPreference("TenderDealSearch", "TenderSearchRules", "CustomSearch"),
                true,
                MyRulesTrigger.OnDealListLoad,
                true);
            
            return ret;
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
                whereClause = $"{SearchTools.BuildCustSecurityWhere()} AND ({deType}_OBJ_SID = {dcIdNum} OR {deType}_TITLE LIKE '%{data.StrSearch.Replace("'", "''").Replace(" ", "%")}%')";
                orderBy = $"{deType}_OBJ_SID desc";
                searchIn = $"{deType}";
            }
            else
            {
                whereClause = $"{SearchTools.BuildCustSecurityWhere()} AND {deType}_TITLE LIKE '%{data.StrSearch.Replace("'", "''").Replace(" ", "%")}%'";
                orderBy = $"{deType}_OBJ_SID desc";
                searchIn = $"{deType}";
            }

            SearchPacket res = new SearchLib().GetAdvancedSearchResults(whereClause, orderBy, searchIn, 0, data.Take);

            List<int> dcIds = res.SearchResults.Where(s => s.OBJ_TYPE == deType.ToString()).OrderByDescending(s => s.OBJ_SID).Select(s => s.OBJ_SID).ToList();
            MyDealsData myDealsData = deType.GetByIDs(dcIds, new List<OpDataElementType> { deType }, atrbs);

            CustomerLib custLib = new CustomerLib();
            List<int> mtCustIds = custLib.GetMyCustomersInfo().Select(c => c.CUST_SID).ToList();
            //CUST_ACCNT_DIV

            var updatedRet = myDealsData.ToOpDataCollectorFlattenedDictList(deType, ObjSetPivotMode.Nested, false);

            foreach (OpDataCollectorFlattenedItem item in updatedRet)
            {
                int dcId = int.Parse(item[AttributeCodes.DC_ID].ToString());

                if (item.ContainsKey(AttributeCodes.CUST_MBR_SID) && !item.ContainsKey(AttributeCodes.CUST_ACCNT_DIV))
                {
                    CustomerDivision cust = custLib.GetCustomerDivisionsByCustNmId(int.Parse(item[AttributeCodes.CUST_MBR_SID].ToString())).FirstOrDefault();

                    if (cust != null)
                    {
                        item[AttributeCodes.CUST_ACCNT_DIV] = cust.CUST_NM;
                    }
                }
            }
      
            return updatedRet;
        }

    }
}
