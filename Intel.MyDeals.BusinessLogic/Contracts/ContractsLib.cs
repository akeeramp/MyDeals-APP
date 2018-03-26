using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using Intel.MyDeals.BusinessLogic.DataCollectors;
using Intel.MyDeals.BusinessRules;
using Intel.MyDeals.DataLibrary;
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
        private readonly IUiTemplateLib _uiTemplateLib;
        private readonly IDropdownLib _dropdownLib;

        public ContractsLib(IOpDataCollectorLib dataCollectorLib, IUiTemplateLib uiTemplateLib, IDropdownLib dropdownLib)
        {
            _dataCollectorLib = dataCollectorLib;
            _uiTemplateLib = uiTemplateLib;
            _dropdownLib = dropdownLib;
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
            return OpDataElementType.CNTRCT.GetByIDs(new List<int> { id }, opDataElementTypes ?? new List<OpDataElementType> { OpDataElementType.CNTRCT }).FillInHolesFromAtrbTemplate();
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
                Attributes.OBJ_SET_TYPE_CD.ATRB_SID,
                Attributes.WF_STG_CD.ATRB_SID,
                Attributes.PASSED_VALIDATION.ATRB_SID,
                Attributes.COST_TEST_RESULT.ATRB_SID,
                Attributes.MEETCOMP_TEST_RESULT.ATRB_SID
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

        public OpDataCollectorFlattenedList GetExportContract(int id)
        {
            List<OpDataElementType> opDataElementTypes = new List<OpDataElementType>
            {
                OpDataElementType.CNTRCT,
                OpDataElementType.PRC_ST,
                OpDataElementType.PRC_TBL,
                OpDataElementType.PRC_TBL_ROW
            };

            return OpDataElementType.CNTRCT.GetByIDs(new List<int> { id }, opDataElementTypes)
                .ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted)
                .ToHierarchialList(OpDataElementType.CNTRCT);
        }

        /// <summary>
        /// Save a contract header
        /// </summary>
        /// <param name="data"></param>
        /// <param name="savePacket"></param>
        /// <returns>MyDealsData</returns>
        public OpDataCollectorFlattenedDictList SaveContract(OpDataCollectorFlattenedList data, SavePacket savePacket)
        {
            // Save Data Cycle: Point 1
            return _dataCollectorLib.SavePackets(new OpDataCollectorFlattenedDictList
            {
                [OpDataElementType.CNTRCT] = data
            }, savePacket).ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted);
        }

        /// <summary>
        /// Save a contract and all of it's levels
        /// </summary>
        /// <param name="contracts">Contract collection</param>
        /// <param name="pricingStrategies">Pricing Strategy collection</param>
        /// <param name="pricingTables">Pricing Table collection</param>
        /// <param name="pricingTableRows">Pricing table Row collection</param>
        /// <param name="wipDeals">Wip Deals collection</param>
        /// <param name="savePacket"></param>
        /// <returns>MyDealsData</returns>
        public MyDealsData SaveContract(
            OpDataCollectorFlattenedList contracts,
            OpDataCollectorFlattenedList pricingStrategies,
            OpDataCollectorFlattenedList pricingTables,
            OpDataCollectorFlattenedList pricingTableRows,
            OpDataCollectorFlattenedList wipDeals,
            SavePacket savePacket)
        {
            OpLog.Log("contractsLib.SaveContract - Start.");
            Stopwatch stopwatch = new Stopwatch();
            if (EN.GLOBAL.DEBUG >= 1)
            {
                stopwatch.Start();
                Debug.WriteLine("{2:HH:mm:ss:fff}\t{0,10} (ms)\tSaving Contract {1}", stopwatch.Elapsed.TotalMilliseconds, savePacket.MyContractToken.ContractId, DateTime.Now);
            }

            OpDataCollectorFlattenedDictList data = new OpDataCollectorFlattenedDictList();

            List<int> primaryIds = new List<int>();
            List<int> secondaryIds = new List<int>();

            List<OpDataElementType> primaryOpDataElementTypes = new List<OpDataElementType>();
            List<OpDataElementType> secondaryOpDataElementTypes = new List<OpDataElementType>();

            if (contracts != null && contracts.Any())
            {
                data[OpDataElementType.CNTRCT] = contracts;
                primaryOpDataElementTypes.Add(OpDataElementType.CNTRCT);
                primaryIds = contracts.Where(items => items.ContainsKey(AttributeCodes.DC_ID))
                        .Select(items => int.Parse(items[AttributeCodes.DC_ID].ToString())).ToList();
            }
            if (pricingStrategies != null && pricingStrategies.Any())
            {
                data[OpDataElementType.PRC_ST] = pricingStrategies;
                primaryOpDataElementTypes.Add(OpDataElementType.PRC_ST);
            }
            if (pricingTables != null && pricingTables.Any())
            {
                data[OpDataElementType.PRC_TBL] = pricingTables;
                primaryOpDataElementTypes.Add(OpDataElementType.PRC_TBL);
                //secondaryOpDataElementTypes.Add(OpDataElementType.PRC_TBL);
                secondaryIds = pricingTables.Where(items => items.ContainsKey(AttributeCodes.DC_ID))
                        .Select(items => int.Parse(items[AttributeCodes.DC_ID].ToString())).ToList();
            }

            // Don't check for ANY becuase we might have to delete the last item
            if (pricingTableRows != null && (savePacket.MyContractToken.DeleteAllPTR) || pricingTableRows.Any())
            {
                data[OpDataElementType.PRC_TBL_ROW] = pricingTableRows;
                secondaryOpDataElementTypes.Add(OpDataElementType.PRC_TBL_ROW);
            }

            if (wipDeals != null && wipDeals.Any())
            {
                data[OpDataElementType.WIP_DEAL] = wipDeals;
                secondaryOpDataElementTypes.Add(OpDataElementType.WIP_DEAL);
            }

            MyDealsData rtn = _dataCollectorLib.SavePackets(
                data, savePacket,
                primaryIds, primaryOpDataElementTypes, OpDataElementType.CNTRCT,
                secondaryIds, secondaryOpDataElementTypes, OpDataElementType.PRC_TBL);

            if (EN.GLOBAL.DEBUG >= 1)
                Debug.WriteLine("{2:HH:mm:ss:fff}\t{0,10} (ms)\tSaved Contract {1}", stopwatch.Elapsed.TotalMilliseconds, savePacket.MyContractToken.ContractId, DateTime.Now);

            OpLog.Log("contractsLib.SaveContract - Complete.");
            return rtn;
        }

        public OpDataCollectorFlattenedDictList SaveFullContract(OpDataCollectorFlattenedDictList fullContracts, SavePacket savePacket)
        {
            return SaveContract(
                fullContracts.ContainsKey(OpDataElementType.CNTRCT) ? fullContracts[OpDataElementType.CNTRCT] : new OpDataCollectorFlattenedList(),
                fullContracts.ContainsKey(OpDataElementType.PRC_ST) ? fullContracts[OpDataElementType.PRC_ST] : new OpDataCollectorFlattenedList(),
                fullContracts.ContainsKey(OpDataElementType.PRC_TBL) ? fullContracts[OpDataElementType.PRC_TBL] : new OpDataCollectorFlattenedList(),
                fullContracts.ContainsKey(OpDataElementType.PRC_TBL_ROW) ? fullContracts[OpDataElementType.PRC_TBL_ROW] : new OpDataCollectorFlattenedList(),
                fullContracts.ContainsKey(OpDataElementType.WIP_DEAL) ? fullContracts[OpDataElementType.WIP_DEAL] : new OpDataCollectorFlattenedList(),
                savePacket).ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted);
        }

        public OpDataCollectorFlattenedDictList SaveContractAndPricingTable(ContractToken contractToken, ContractTransferPacket contractAndStrategy, bool forceValidation, bool forcePublish)
        {
            OpDataCollectorFlattenedList translatedFlattenedList = new OpDataCollectorFlattenedList();

            // Check to see if a translation from PTR to WIP or WIP to PTR is needed
            bool isPrcTblSource = contractAndStrategy.EventSource == OpDataElementType.PRC_TBL.ToString();
            bool isWipDealSource = contractAndStrategy.EventSource == OpDataElementType.WIP_DEAL.ToString();
            List<int> validationIds = new List<int>();
            bool resetValidationChild = false;

            contractToken.NeedToCheckForDelete = isPrcTblSource;

            // if we are deleting a PTR... only the PTR is being passed.  We don't want to issue deleted for the rest of the PTRs not passed
            //if (contractToken.DelPtr) contractToken.NeedToCheckForDelete = false;

            contractToken.DeleteAllPTR = (contractAndStrategy.PricingTableRow.Count == 0);

            if (forceValidation)
            {
                if (isPrcTblSource)
                {
                    validationIds.AddRange(contractAndStrategy.PricingTableRow.Select(item => int.Parse(item[AttributeCodes.DC_ID].ToString())));
                }
                else if (isWipDealSource)
                {
                    validationIds.AddRange(contractAndStrategy.WipDeals.Select(item => int.Parse(item[AttributeCodes.DC_ID].ToString())));
                }
            }

            if (forcePublish)
            {
                if (isPrcTblSource)
                {
                    translatedFlattenedList = contractAndStrategy.PricingTableRow.TranslateToWip();
                    resetValidationChild = true;
                }
                else if (isWipDealSource)
                {
                    OpDataCollectorFlattenedItem pt = (contractAndStrategy.PricingTable != null && contractAndStrategy.PricingTable.Count > 0) ? contractAndStrategy.PricingTable[0] : new OpDataCollectorFlattenedItem();
                    translatedFlattenedList = contractAndStrategy.WipDeals.TranslateToPrcTbl(pt);
                }
            }

            if (contractAndStrategy.PtrDelIds != null && contractAndStrategy.PtrDelIds.Any()) validationIds.AddRange(contractAndStrategy.PtrDelIds);

            SavePacket savePacket = new SavePacket
            {
                MyContractToken = contractToken,
                ValidateIds = validationIds,
                ForcePublish = forcePublish,
                SourceEvent = contractAndStrategy.EventSource,
                ResetValidationChild = resetValidationChild
            };

            MyDealsData myDealsData = SaveContract(
                contractAndStrategy.Contract,
                contractAndStrategy.PricingStrategy,
                contractAndStrategy.PricingTable,
                isWipDealSource ? translatedFlattenedList : contractAndStrategy.PricingTableRow, //
                isPrcTblSource ? translatedFlattenedList : contractAndStrategy.WipDeals,
                savePacket);
            //.ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Nested);

            OpDataCollectorFlattenedDictList data = new OpDataCollectorFlattenedDictList();

            myDealsData.FillInHolesFromAtrbTemplate();

            foreach (OpDataElementType opDataElementType in myDealsData.Keys)
            {
                data[opDataElementType] = myDealsData.ToOpDataCollectorFlattenedDictList(opDataElementType,
                    opDataElementType == OpDataElementType.PRC_TBL_ROW ? ObjSetPivotMode.UniqueKey : ObjSetPivotMode.Nested);
            }

            return data;
            // == OpDataElementType.PRC_TBL_ROW ? ObjSetPivotMode.UniqueKey : ObjSetPivotMode.Nested
        }

        public OpMsg DeleteContract(ContractToken contractToken)
        {
            OpDataCollectorFlattenedDictList opDcDict = GetContract(contractToken.ContractId, false).ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.UniqueKey);
            OpDataCollectorFlattenedList contracts = opDcDict[OpDataElementType.CNTRCT];
            return contracts.DeleteByIds(OpDataElementType.CNTRCT, contractToken, _dataCollectorLib);
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

            var rtn = new List<Dictionary<string, string>>();

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

        public OpDataCollectorFlattenedDictList GetWipExclusionFromContract(int id)
        {

            MyDealsData myDealsData = OpDataElementType.CNTRCT.GetByIDs(
                new List<int> { id },
                new List<OpDataElementType>
                {
                    OpDataElementType.WIP_DEAL
                },
                new List<int>
                {
                    Attributes.WF_STG_CD.ATRB_SID,
                    Attributes.PS_WF_STG_CD.ATRB_SID,
                    Attributes.DEAL_GRP_EXCLDS.ATRB_SID,
                    Attributes.DEAL_GRP_CMNT.ATRB_SID,
                    Attributes.TITLE.ATRB_SID,
                    Attributes.COST_TEST_RESULT.ATRB_SID,
                    Attributes.MEETCOMP_TEST_RESULT.ATRB_SID,
                    Attributes.OBJ_SET_TYPE_CD.ATRB_SID,
                    Attributes.START_DT.ATRB_SID,
                    Attributes.END_DT.ATRB_SID,
                    Attributes.DEAL_COMB_TYPE.ATRB_SID,
                    Attributes.MAX_RPU.ATRB_SID,
                    Attributes.DEAL_DESC.ATRB_SID,
                    Attributes.CONSUMPTION_REASON.ATRB_SID,
                    Attributes.CONSUMPTION_REASON_CMNT.ATRB_SID
                });

            //// Get all the products in a collection base on the PRODUCT_FILTER
            //// Note: the first hit is a performance dog as the product cache builds for the first time
            //List<int> prodIds = myDealsData[OpDataElementType.WIP_DEAL].AllDataElements
            //    .Where(d => d.AtrbCd == AttributeCodes.PRODUCT_FILTER && d.AtrbValue.ToString() != "")
            //    .Select(d => int.Parse(d.AtrbValue.ToString())).ToList();
            //List<ProductEngName> prods = new ProductDataLib().GetEngProducts(prodIds);

            //foreach (OpDataCollector dc in myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors)
            //{
            //    dc.ApplyRules(MyRulesTrigger.OnDealListLoad, null, prods);
            //}

            OpDataCollectorFlattenedDictList data = myDealsData.ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Nested, false);

            return data;
        }

        public OpDataCollectorFlattenedDictList GetWipFromContract(int id)
        {
            List<OpDataElementType> opDataElementTypes = new List<OpDataElementType>
            {
                OpDataElementType.WIP_DEAL
            };

            List<int> atrbs = new List<int>();

            OpDataCollectorFlattenedDictList data = OpDataElementType.CNTRCT.GetByIDs(new List<int> { id }, opDataElementTypes, atrbs).ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Nested, false);

            CustomerLib custLib = new CustomerLib();
            foreach (OpDataCollectorFlattenedItem item in data[OpDataElementType.WIP_DEAL])
            {
                if (item.ContainsKey(AttributeCodes.CUST_MBR_SID))
                {
                    CustomerDivision cust = custLib.GetCustomerDivisionsByCustNmId(int.Parse(item[AttributeCodes.CUST_MBR_SID].ToString())).FirstOrDefault();
                    item["Customer"] = cust ?? new CustomerDivision();
                }
                else
                {
                    item["Customer"] = new CustomerDivision();
                }
            }

            return data;
        }

        public OpDataCollectorFlattenedDictList UpdateAtrbValue(int custId, int contractId, AtrbSaveItem atrbSaveItem)
        {
            AttributeCollection atrbMstr = DataCollections.GetAttributeData();
            MyDealsAttribute myDealsAttribute = atrbMstr.All.FirstOrDefault(a => a.ATRB_COL_NM == atrbSaveItem.Attribute);

            MyDealsData myDealsData = atrbSaveItem.ObjSetType.UpdateAtrbValue(new ContractToken("ContractToken Created - UpdateAtrbValue")
            {
                CustId = custId,
                ContractId = contractId
            },
            atrbSaveItem.Ids,
            myDealsAttribute,
            atrbSaveItem.Value);

            return myDealsData.ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted, true);
        }
    }
}