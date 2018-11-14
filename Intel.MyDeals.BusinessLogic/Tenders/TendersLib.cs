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

        public string BuildWhereClause(SearchParams data, OpDataElementType opDataElementType)
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

        public OpDataCollectorFlattenedDictList BulkTenderUpdate(ContractToken contractToken, ContractTransferPacket tenderData)
        {
            List<int> dealIds = tenderData.WipDeals.Select(w => int.Parse(w["DC_ID"].ToString())).ToList();
            MyDealsData myDealsData = OpDataElementType.WIP_DEAL.GetByIDs(dealIds, new List<OpDataElementType> { OpDataElementType.PRC_TBL }, 
                new List<int> { Attributes.WF_STG_CD.ATRB_SID, Attributes.OBJ_SET_TYPE_CD.ATRB_SID });
            var myDealsDataFlattened = myDealsData.ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted); //myDealsData[OpDataElementType.PRC_ST].AllDataCollectors.to;
            //tenderData.PricingStrategy = myDealsDataFlattened[OpDataElementType.PRC_ST];
            tenderData.PricingTable = myDealsDataFlattened[OpDataElementType.PRC_TBL];

            //the tender dashboard sends some data we dont need and dont want to have accidentally updated so we strip them here.
            List<string> removeAttrs = new List<string>
            {
                AttributeCodes.FSE_APPROVED_BY,
                AttributeCodes.GEO_APPROVED_BY,
                AttributeCodes.DIV_APPROVED_BY,
                AttributeCodes.COMP_MISSING_FLG,
                AttributeCodes.OVERLAP_RESULT,
                AttributeCodes.SYS_COMMENTS,
                //AttributeCodes.CAP_STRT_DT
            };
            foreach (OpDataCollectorFlattenedItem item in tenderData.WipDeals)
            {
                foreach (string remove in removeAttrs)
                {
                    if (item.ContainsKey(remove))
                    {
                        item.Remove(remove);
                    }
                }
            }

            OpDataCollectorFlattenedList flatDictList = _contractsLib.SaveContractAndPricingTable(contractToken, tenderData, forceValidation: true, forcePublish: true).ToHierarchialList(OpDataElementType.WIP_DEAL);
            List<int> updatedIDs = flatDictList.Select(w => int.Parse(w["DC_ID"].ToString())).ToList();

            OpDataCollectorFlattenedDictList ret = _pricingStrategiesLib.FetchTenderData(updatedIDs, OpDataElementType.WIP_DEAL);
            return ret;
        }
        
    }
}