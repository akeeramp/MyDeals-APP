using System;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.BusinessLogic.DataCollectors;
using Intel.MyDeals.BusinessRules;
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

        private string BuildWhereClause(string searchText, FilterItem filters)
        {
            string rtn = string.Empty;
            List<string> searchAtrbs = new List<string>
            {
                AttributeCodes.DC_ID,
                AttributeCodes.END_CUSTOMER_RETAIL,
                AttributeCodes.QLTR_PROJECT,
                AttributeCodes.TRKR_NBR,
                AttributeCodes.TITLE
            };

            // search string can be a comma delim string... each string needs to be validated against the list of atrbs
            if (!string.IsNullOrEmpty(searchText))
            {
                var aSearch = searchText.Split(',');
                List<string> modifiedSearchList = new List<string>();

                foreach (string singleSearchText in aSearch)
                {
                    List<string> conditions = new List<string>();
                    conditions.AddRange(searchAtrbs.Select(atrb => $"{atrb} LIKE '%{singleSearchText.Trim().Replace("*","%")}%'"));
                    modifiedSearchList.Add("(" + string.Join(" OR ", conditions) + ")");
                }

                rtn = string.Join(" AND ", modifiedSearchList);
            }

            // grid level filters and passed serverside and need to be converted into a sql where compatible string
            string strFilters = BuildFilterClauseRecur(filters);

            // Put the search and filter criteria together
            if (!string.IsNullOrEmpty(strFilters))
            {
                if (!string.IsNullOrEmpty(rtn)) rtn += " AND ";
                rtn += strFilters;
            }

            return rtn;
        }

        private string BuildFilterClauseRecur(FilterItem filters)
        {
            if (filters == null) return string.Empty;

            // need to handle like and other operators in SQL
            string logic = filters.Logic;
            string oper = filters.Operator;

            if (!string.IsNullOrEmpty(oper))
            {
                switch (oper.ToUpper())
                {
                    case "EQ":
                        oper = "LIKE";
                        filters.Value = $"'%{filters.Value.Replace("*","%")}%'";
                        break;
                    case "NEQ":
                        oper = "NOT LIKE";
                        filters.Value = $"'%{filters.Value.Replace("*", "%")}%'";
                        break;
                    case "GT":
                        oper = ">";
                        break;
                    case "GTE":
                        oper = ">=";
                        break;
                    case "LT":
                        oper = "<";
                        break;
                    case "LTE":
                        oper = "<=";
                        break;
                    case "ISNULL":
                        oper = "IS";
                        filters.Value = "NULL";
                        break;
                    case "ISNOTNULL":
                        oper = "IS NOT";
                        filters.Value = "NULL";
                        break;
                }
            }

            return !string.IsNullOrEmpty(filters.Field) 
                ? $"{filters.Field} {oper} {filters.Value}" 
                : "(" + string.Join($" {logic} ", filters.Filters.Select(BuildFilterClauseRecur).ToList()) + ")";
        }

        public OpDataCollectorFlattenedList GetTenderList(SearchParams data)
        {
            int id = 5041;

            List<int> atrbs = new List<int>
            {
                Attributes.TITLE.ATRB_SID,
                Attributes.OBJ_SET_TYPE_CD.ATRB_SID,
                Attributes.CUST_MBR_SID.ATRB_SID,
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
            };

            string whereClause = BuildWhereClause(data.StrWhere, data.StrFilters);

            MyDealsData myDealsData = OpDataElementType.CNTRCT.GetByIDs(new List<int> { id }, new List<OpDataElementType>
                {
                    OpDataElementType.WIP_DEAL
                }, atrbs);

            foreach (OpDataCollector dc in myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors)
            {
                dc.ApplyRules(MyRulesTrigger.OnTenderListLoad);
            }

            OpDataCollectorFlattenedList rtn = myDealsData
                .ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Nested, false)
                .ToHierarchialList(OpDataElementType.WIP_DEAL);

            CustomerLib custLib = new CustomerLib();
            List<int> mtCustIds = custLib.GetMyCustomersInfo().Select(c => c.CUST_DIV_SID).ToList();

            foreach (OpDataCollectorFlattenedItem item in rtn)
            {
                CustomerDivision cust = custLib.GetCustomerDivisionsByCustNmId(int.Parse(item[AttributeCodes.CUST_MBR_SID].ToString())).FirstOrDefault();
                
                item["Customer"] = cust;
                if (!mtCustIds.Contains(cust.CUST_NM_SID))
                {
                    item["ECAP_PRICE"] = "no access";
                    item["CAP"] = "no access";
                }
            }

            return rtn;
        }

        public OpMsgQueue ActionTenders(string dcIds, string actn)
        {
            OpMsgQueue opMsgQueue = new OpMsgQueue();
            List<int> tenderIds = dcIds.Split(',').Select(d => int.Parse(d.Trim())).ToList();

            // This is massively efficient, but we need to ensure we have the correct 
            // customer Id and contract Id since these span multiple 
            // This will not work in bulk... different contract id and customer #
            //
            // The justification is most users will only update one at a time
            //
            foreach (int id in tenderIds)
            {
                OpDataCollector dcCntrct = OpDataElementType.WIP_DEAL.GetByIDs(
                    new List<int> {id},
                    new List<OpDataElementType> { OpDataElementType.CNTRCT },
                    new List<int> { Attributes.CUST_MBR_SID.ATRB_SID }
                    )[OpDataElementType.CNTRCT].AllDataCollectors.First();

                ContractToken contractToken = new ContractToken
                {
                    ContractId = dcCntrct.DcID,
                    CustId = int.Parse(dcCntrct.GetDataElementValue(AttributeCodes.CUST_MBR_SID)),
                    NeedToCheckForDelete = false
                };

                MyDealsData retMyDealsData = OpDataElementType.WIP_DEAL.UpdateAtrbValue(contractToken, new List<int> { id }, Attributes.BID_STATUS, actn, actn == "Won");

                List<string> actions = MyOpDataCollectorFlattenedItemActions.GetTenderActionList(actn, WorkFlowStages.Active);

                opMsgQueue = retMyDealsData.GetAllMessages();

                opMsgQueue.Messages.Add(new OpMsg
                {
                    MsgType = OpMsg.MessageType.Info,
                    Message = "Action List",
                    ExtraDetails = actions
                });
                //retMyDealsData
            }

            return opMsgQueue;

        }

    }

}