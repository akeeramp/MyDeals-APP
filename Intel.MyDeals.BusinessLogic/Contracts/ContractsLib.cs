using System;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.BusinessLogic.DataCollectors;
using Intel.MyDeals.DataLibrary.OpDataCollectors;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;
using Intel.Opaque.Data;

namespace Intel.MyDeals.BusinessLogic
{
    public class ContractsLib : IContractsLib
    {
        private readonly IOpDataCollectorLib _dataCollectorLib;

        public ContractsLib(IOpDataCollectorLib dataCollectorLib)
        {
            _dataCollectorLib = dataCollectorLib;
        }

        /// <summary>
        /// Get a Contract by ID
        /// </summary>
        /// <param name="id">Id of the contract</param>
        /// <param name="inclusive">true will get all components of the contract while false will only get the header</param>
        /// <returns>MyDealsData</returns>
        public MyDealsData GetContract(int id, bool inclusive = false)
        {
            List<OpDataElementType> opDataElementTypes = inclusive
                ? new List<OpDataElementType>
                    {
                        OpDataElementType.CNTRCT,
                        OpDataElementType.PRC_ST,
                        OpDataElementType.PRC_TBL,
                        OpDataElementType.PRC_TBL_ROW,
                        OpDataElementType.WIP_DEAL
                    }
                : new List<OpDataElementType>
                    {
                        OpDataElementType.CNTRCT
                    };

            return GetContract(id, opDataElementTypes);
        }

        /// <summary>
        /// Get Contract By Id and return the levels specified by opDataElementTypes
        /// </summary>
        /// <param name="id">Id of the contract</param>
        /// <param name="opDataElementTypes">List of OpDataElements to return</param>
        /// <returns>MyDealsData</returns>
        public MyDealsData GetContract(int id, List<OpDataElementType> opDataElementTypes = null)
        {
            return OpDataElementType.CNTRCT.GetByIDs(new List<int> { id }, opDataElementTypes ?? new List<OpDataElementType> { OpDataElementType.CNTRCT });
        }
        public MyDealsData GetContract(int id, List<OpDataElementType> opDataElementTypes, IEnumerable<int> atrbs)
        {
            return OpDataElementType.CNTRCT.GetByIDs(new List<int> { id }, opDataElementTypes ?? new List<OpDataElementType> { OpDataElementType.CNTRCT }, atrbs);
        }

        public OpDataCollectorFlattenedList GetUpperContract(int id)
        {
            return GetContract(id, new List<OpDataElementType>
                {
                    OpDataElementType.CNTRCT,
                    OpDataElementType.PRC_ST,
                    OpDataElementType.PRC_TBL
                })
                .ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted)
                .ToHierarchialList(OpDataElementType.CNTRCT);
        }

        public OpDataCollectorFlattenedList GetContractStatus(int id)
        {
            List<int> atrbs = new List<int>
            {
                Attributes.TITLE.ATRB_SID,
                Attributes.PTR_USER_PRD.ATRB_SID,
                Attributes.OBJ_SET_TYPE_CD.ATRB_SID
            };

            return GetContract(id, new List<OpDataElementType>
                {
                    OpDataElementType.CNTRCT,
                    OpDataElementType.PRC_ST,
                    OpDataElementType.PRC_TBL,
                    OpDataElementType.PRC_TBL_ROW,
                    OpDataElementType.WIP_DEAL
                }, atrbs)
                .ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted, false)
                .ToHierarchialList(OpDataElementType.CNTRCT);
        }
        
        public OpDataCollectorFlattenedDictList GetFullContract(int id)
        {
            return GetContract(id, true).ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted);
        }


        /// <summary>
        /// Save a contract header
        /// </summary>
        /// <param name="data"></param>
        /// <param name="custId">Must pass the customer id to prevent blocking</param>
        /// <param name="validateIds"></param>
        /// <param name="forcePublish"></param>
        /// <param name="sourceEvent"></param>
        /// <returns>MyDealsData</returns>
        public OpDataCollectorFlattenedDictList SaveContract(OpDataCollectorFlattenedList data, int custId, List<int> validateIds, bool forcePublish, string sourceEvent)
        {
            // Save Data Cycle: Point 1
            return _dataCollectorLib.SavePackets(new OpDataCollectorFlattenedDictList
            {
                [OpDataElementType.CNTRCT] = data
            }, custId, validateIds, forcePublish, sourceEvent).ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted);
        }

        /// <summary>
        /// Save a contract and all of it's levels
        /// </summary>
        /// <param name="contracts">Contract collection</param>
        /// <param name="pricingStrategies">Pricing Strategy collection</param>
        /// <param name="pricingTables">Pricing Table collection</param>
        /// <param name="pricingTableRows">Pricing table Row collection</param>
        /// <param name="wipDeals">Wip Deals collection</param>
        /// <param name="custId">Must pass the customer id to prevent blocking</param>
        /// <param name="validateIds"></param>
        /// <param name="forcePublish"></param>
        /// <param name="sourceEvent"></param>
        /// <returns>MyDealsData</returns>
        public MyDealsData SaveContract(
            OpDataCollectorFlattenedList contracts,
            OpDataCollectorFlattenedList pricingStrategies,
            OpDataCollectorFlattenedList pricingTables,
            OpDataCollectorFlattenedList pricingTableRows,
            OpDataCollectorFlattenedList wipDeals,
            int custId,
            List<int> validateIds,
            bool forcePublish,
            string sourceEvent)
        {
            OpDataCollectorFlattenedDictList data = new OpDataCollectorFlattenedDictList();

            if (contracts != null && contracts.Any()) data[OpDataElementType.CNTRCT] = contracts;
            if (pricingStrategies != null && pricingStrategies.Any()) data[OpDataElementType.PRC_ST] = pricingStrategies;
            if (pricingTables != null && pricingTables.Any()) data[OpDataElementType.PRC_TBL] = pricingTables;
            if (pricingTableRows != null && pricingTableRows.Any()) data[OpDataElementType.PRC_TBL_ROW] = pricingTableRows;
            if (wipDeals != null && wipDeals.Any()) data[OpDataElementType.WIP_DEAL] = wipDeals;

            return _dataCollectorLib.SavePackets(data, custId, validateIds, forcePublish, sourceEvent);
        }

        public OpDataCollectorFlattenedDictList SaveFullContract(int custId, OpDataCollectorFlattenedDictList fullContracts, List<int> validateIds, bool forcePublish, string sourceEvent)
        {
            return SaveContract(
                fullContracts.ContainsKey(OpDataElementType.CNTRCT) ? fullContracts[OpDataElementType.CNTRCT] : new OpDataCollectorFlattenedList(),
                fullContracts.ContainsKey(OpDataElementType.PRC_ST) ? fullContracts[OpDataElementType.PRC_ST] : new OpDataCollectorFlattenedList(),
                fullContracts.ContainsKey(OpDataElementType.PRC_TBL) ? fullContracts[OpDataElementType.PRC_TBL] : new OpDataCollectorFlattenedList(),
                fullContracts.ContainsKey(OpDataElementType.PRC_TBL_ROW) ? fullContracts[OpDataElementType.PRC_TBL_ROW] : new OpDataCollectorFlattenedList(),
                fullContracts.ContainsKey(OpDataElementType.WIP_DEAL) ? fullContracts[OpDataElementType.WIP_DEAL] : new OpDataCollectorFlattenedList(),
                custId, validateIds, forcePublish, sourceEvent).ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted);
        }

        public OpDataCollectorFlattenedDictList SaveContractAndPricingTable(int custId, ContractTransferPacket contractAndStrategy, bool forceValidation, bool forcePublish)
        {
            OpDataCollectorFlattenedList translatedFlattenedList = new OpDataCollectorFlattenedList();

            // Check to see if a translation from PTR to WIP or WIP to PTR is needed
            bool isPrcTblSource = contractAndStrategy.EventSource == OpDataElementType.PRC_TBL.ToString();
            bool isWipDealSource = contractAndStrategy.EventSource == OpDataElementType.WIP_DEAL.ToString();
            List<int> validationIds = new List<int>();

            if (forcePublish)
            {
                if (isPrcTblSource)
                {
                    validationIds.AddRange(contractAndStrategy.PricingTableRow.Select(item => int.Parse(item["DC_PARENT_ID"].ToString())));
                }
                else if (isWipDealSource)
                {
                    validationIds.AddRange(contractAndStrategy.WipDeals.Select(item => int.Parse(item["DC_PARENT_ID"].ToString())));
                }
            }

            if (forcePublish)
            {
                if (isPrcTblSource)
                {
                    translatedFlattenedList = contractAndStrategy.PricingTableRow.TranslateToWip();
                }
                else if (isWipDealSource)
                {
                    translatedFlattenedList = contractAndStrategy.WipDeals.TranslateToPrcTbl();
                }
            }

            return SaveContract(
                contractAndStrategy.Contract,
                contractAndStrategy.PricingStrategy,
                contractAndStrategy.PricingTable,
                isWipDealSource ? translatedFlattenedList : contractAndStrategy.PricingTableRow,
                isPrcTblSource ? translatedFlattenedList : contractAndStrategy.WipDeals,
                custId,
                validationIds,
                forcePublish,
                contractAndStrategy.EventSource).ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted);
        }

        public OpMsg DeleteContract(int id)
        {
            // TODO replace with Delete call
            return new OpMsg();
        }

        public bool IsDuplicateContractTitle(int dcId, string title)
        {
            return new OpDataCollectorValidationDataLib().IsDuplicateTitle(OpDataElementType.CNTRCT, dcId, 0, title);
        }


        public dynamic GetContractsStatus(DashboardFilter dashboardFilter)
        {
            Random r = new Random();

            List<string> status = new List<string> { "Incomplete", "Complete", "Archived" };
            List<string> notes = new List<string>
            {
                "",
                "Just trying to get ahead",
                "It will pass... come on baby... pass PCT",
                "Pending Cost Test",
                "Please review"
            };

            string customer = new CustomerLib().GetMyCustomersInfo().Where(c => dashboardFilter.CustomerIds.Contains(c.CUST_DIV_SID)).Select(c => c.CUST_NM).FirstOrDefault();

            List<string> title = new List<string>
            {
                "Retail Q4 ECAP Standalone",
                "Yearly Server",
                "Quarterly Events Tender"
            };
            List<string> approver = new List<string> { "Trang Van", "Tom Pope", "Tom Hanks", "Tim Burton" };
            List<string> custaccept = new List<string> { "Yes", "No", "Pending" };
            
            var rtn = new List<Dictionary<string,string>>();

            for (var i = 0; i < 200; i++)
            {
                var s = status[r.Next(status.Count)];
                rtn.Add(new Dictionary<string, string>
                {
                    ["Id"] = (i + 88).ToString(),
                    ["Status"] = s,
                    ["Notes"] = notes[r.Next(notes.Count)],
                    ["Customer"] = customer,
                    ["Title"] = title[r.Next(title.Count)],
                    ["StartDate"] = dashboardFilter.StartDate.ToString("d"),
                    ["EndDate"] = dashboardFilter.EndDate.ToString("d"),
                    ["Approver"] = approver[r.Next(approver.Count)],
                    ["CustAccept"] = custaccept[r.Next(custaccept.Count)],
                    ["Perc"] = s == "Complete" ? "100" : r.Next(0, 100).ToString()
                });
            }

            return rtn;
        }

        public OpDataCollectorFlattenedDictList GetWipFromContract(int id)
        {
            List<OpDataElementType> opDataElementTypes = new List<OpDataElementType>
            {
                OpDataElementType.WIP_DEAL
            };

            List<int> atrbs = new List<int>
            {
                Attributes.BACK_DATE_RSN.ATRB_SID,
                Attributes.BACK_DATE_RSN_TXT.ATRB_SID,
                Attributes.CAP.ATRB_SID,
                Attributes.CAP_END_DT.ATRB_SID,
                Attributes.CAP_STRT_DT.ATRB_SID,
                Attributes.COMPETITIVE_PRICE.ATRB_SID,
                Attributes.COMP_BENCH.ATRB_SID,
                Attributes.COMP_SKU.ATRB_SID,
                Attributes.COMP_SKU_OTHR.ATRB_SID,
                Attributes.COMP_TARGET_SYSTEM_PRICE.ATRB_SID,
                Attributes.CONSUMPTION_REASON.ATRB_SID,
                Attributes.CONSUMPTION_REASON_CMNT.ATRB_SID,
                Attributes.COST_TEST_FAIL_OVERRIDE.ATRB_SID,
                Attributes.COST_TEST_FAIL_OVERRIDE_REASON.ATRB_SID,
                Attributes.COST_TEST_RESULT.ATRB_SID,
                Attributes.COST_TYPE_USED.ATRB_SID,
                Attributes.DEAL_COMB_TYPE.ATRB_SID,
                Attributes.ECAP_FLR.ATRB_SID,
                Attributes.ECAP_PRICE.ATRB_SID,
                Attributes.ECAP_TYPE.ATRB_SID,
                Attributes.END_DT.ATRB_SID,
                Attributes.GEO_COMBINED.ATRB_SID,
                Attributes.IA_BENCH.ATRB_SID,
                Attributes.MEETCOMP_TEST_FAIL_OVERRIDE.ATRB_SID,
                Attributes.MEETCOMP_TEST_FAIL_OVERRIDE_REASON.ATRB_SID,
                Attributes.MEETCOMP_TEST_RESULT.ATRB_SID,
                Attributes.MEET_COMP_PRICE_QSTN.ATRB_SID,
                Attributes.MRKT_SEG.ATRB_SID,
                Attributes.OBJ_SET_TYPE_CD.ATRB_SID,
                Attributes.PASSED_VALIDATION.ATRB_SID,
                Attributes.PAYOUT_BASED_ON.ATRB_SID,
                Attributes.PRD_COST.ATRB_SID,
                Attributes.PRODUCT_FILTER.ATRB_SID,
                Attributes.PROGRAM_PAYMENT.ATRB_SID,
                Attributes.PTR_USER_PRD.ATRB_SID,
                Attributes.RETAIL_CYCLE.ATRB_SID,
                Attributes.RETAIL_PULL.ATRB_SID,
                Attributes.RETAIL_PULL_USR_DEF.ATRB_SID,
                Attributes.RETAIL_PULL_USR_DEF_CMNT.ATRB_SID,
                Attributes.START_DT.ATRB_SID,
                Attributes.TERMS.ATRB_SID,
                Attributes.TITLE.ATRB_SID,
                Attributes.TRGT_RGN.ATRB_SID,
                Attributes.VOLUME.ATRB_SID,
                Attributes.WF_STG_CD.ATRB_SID,
                Attributes.YCS2_END_DT.ATRB_SID,
                Attributes.YCS2_OVERLAP_OVERRIDE.ATRB_SID,
                Attributes.YCS2_PRC_IRBT.ATRB_SID,
                Attributes.YCS2_START_DT.ATRB_SID,
            };

            return OpDataElementType.CNTRCT.GetByIDs(new List<int> { id }, opDataElementTypes, atrbs).ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted, true);
        }

    }
}
