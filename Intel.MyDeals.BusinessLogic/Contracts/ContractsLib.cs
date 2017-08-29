using System;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.BusinessLogic.DataCollectors;
using Intel.MyDeals.DataLibrary.OpDataCollectors;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;
using Intel.Opaque.Data;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Text.RegularExpressions;

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
                Attributes.PASSED_VALIDATION.ATRB_SID
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
        /// <param name="validateIds"></param>
        /// <param name="forcePublish"></param>
        /// <param name="sourceEvent"></param>
        /// <returns>MyDealsData</returns>
        public OpDataCollectorFlattenedDictList SaveContract(OpDataCollectorFlattenedList data, ContractToken contractToken, List<int> validateIds, bool forcePublish, string sourceEvent)
        {
            // Save Data Cycle: Point 1
            return _dataCollectorLib.SavePackets(new OpDataCollectorFlattenedDictList
            {
                [OpDataElementType.CNTRCT] = data
            }, contractToken, validateIds, forcePublish, sourceEvent).ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted);
        }

        /// <summary>
        /// Save a contract and all of it's levels
        /// </summary>
        /// <param name="contracts">Contract collection</param>
        /// <param name="pricingStrategies">Pricing Strategy collection</param>
        /// <param name="pricingTables">Pricing Table collection</param>
        /// <param name="pricingTableRows">Pricing table Row collection</param>
        /// <param name="wipDeals">Wip Deals collection</param>
        /// <param name="contractToken"></param>
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
            ContractToken contractToken,
            List<int> validateIds,
            bool forcePublish,
            string sourceEvent)
        {
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
                secondaryOpDataElementTypes.Add(OpDataElementType.PRC_TBL);
                secondaryIds = pricingTables.Where(items => items.ContainsKey(AttributeCodes.DC_ID))
                        .Select(items => int.Parse(items[AttributeCodes.DC_ID].ToString())).ToList();
            }

            // Don't check for ANY becuase we might have to delete the last item
            if (pricingTableRows != null && (contractToken.DelPtr || pricingTableRows.Any()))
            {
                data[OpDataElementType.PRC_TBL_ROW] = pricingTableRows;
                secondaryOpDataElementTypes.Add(OpDataElementType.PRC_TBL_ROW);
            }

            if (wipDeals != null && wipDeals.Any())
            {
                data[OpDataElementType.WIP_DEAL] = wipDeals;
                secondaryOpDataElementTypes.Add(OpDataElementType.WIP_DEAL);
            }

            return _dataCollectorLib.SavePackets(
                data, contractToken, validateIds, forcePublish, sourceEvent,
                primaryIds, primaryOpDataElementTypes, OpDataElementType.CNTRCT,
                secondaryIds, secondaryOpDataElementTypes, OpDataElementType.PRC_TBL);
        }

        public OpDataCollectorFlattenedDictList SaveFullContract(ContractToken contractToken, OpDataCollectorFlattenedDictList fullContracts, List<int> validateIds, bool forcePublish, string sourceEvent)
        {
            return SaveContract(
                fullContracts.ContainsKey(OpDataElementType.CNTRCT) ? fullContracts[OpDataElementType.CNTRCT] : new OpDataCollectorFlattenedList(),
                fullContracts.ContainsKey(OpDataElementType.PRC_ST) ? fullContracts[OpDataElementType.PRC_ST] : new OpDataCollectorFlattenedList(),
                fullContracts.ContainsKey(OpDataElementType.PRC_TBL) ? fullContracts[OpDataElementType.PRC_TBL] : new OpDataCollectorFlattenedList(),
                fullContracts.ContainsKey(OpDataElementType.PRC_TBL_ROW) ? fullContracts[OpDataElementType.PRC_TBL_ROW] : new OpDataCollectorFlattenedList(),
                fullContracts.ContainsKey(OpDataElementType.WIP_DEAL) ? fullContracts[OpDataElementType.WIP_DEAL] : new OpDataCollectorFlattenedList(),
                contractToken, validateIds, forcePublish, sourceEvent).ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted);
        }

        public OpDataCollectorFlattenedDictList SaveContractAndPricingTable(ContractToken contractToken, ContractTransferPacket contractAndStrategy, bool forceValidation, bool forcePublish)
        {
            OpDataCollectorFlattenedList translatedFlattenedList = new OpDataCollectorFlattenedList();

            // Check to see if a translation from PTR to WIP or WIP to PTR is needed
            bool isPrcTblSource = contractAndStrategy.EventSource == OpDataElementType.PRC_TBL.ToString();
            bool isWipDealSource = contractAndStrategy.EventSource == OpDataElementType.WIP_DEAL.ToString();
            List<int> validationIds = new List<int>();

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
                }
                else if (isWipDealSource)
                {
                    translatedFlattenedList = contractAndStrategy.WipDeals.TranslateToPrcTbl();
                }
            }

            MyDealsData myDealsData = SaveContract(
                contractAndStrategy.Contract,
                contractAndStrategy.PricingStrategy,
                contractAndStrategy.PricingTable,
                isWipDealSource ? translatedFlattenedList : contractAndStrategy.PricingTableRow, //
                isPrcTblSource ? translatedFlattenedList : contractAndStrategy.WipDeals,
                contractToken,
                validationIds,
                forcePublish,
                contractAndStrategy.EventSource);
            //.ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Nested);

            OpDataCollectorFlattenedDictList data = new OpDataCollectorFlattenedDictList();

            foreach (OpDataElementType opDataElementType in myDealsData.Keys)
            {
                data[opDataElementType] = myDealsData.ToOpDataCollectorFlattenedDictList(opDataElementType,
                    opDataElementType == OpDataElementType.PRC_TBL_ROW ? ObjSetPivotMode.UniqueKey : ObjSetPivotMode.Nested);
            }

            return data;
            // == OpDataElementType.PRC_TBL_ROW ? ObjSetPivotMode.UniqueKey : ObjSetPivotMode.Nested
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

        public OpDataCollectorFlattenedDictList GetWipFromContract(int id)
        {
            List<OpDataElementType> opDataElementTypes = new List<OpDataElementType>
            {
                OpDataElementType.WIP_DEAL
            };

            List<int> atrbs = new List<int>
            {
                Attributes.BACK_DATE_RSN.ATRB_SID,
                Attributes.CAP.ATRB_SID,
                Attributes.CAP_END_DT.ATRB_SID,
                Attributes.CAP_STRT_DT.ATRB_SID,
                //Attributes.COMPETITIVE_PRICE.ATRB_SID,
                //Attributes.COMP_BENCH.ATRB_SID,
                //Attributes.COMP_SKU.ATRB_SID,
                //Attributes.COMP_SKU_OTHR.ATRB_SID,
                //Attributes.COMP_TARGET_SYSTEM_PRICE.ATRB_SID,
                //Attributes.CONSUMPTION_REASON.ATRB_SID,
                //Attributes.CONSUMPTION_REASON_CMNT.ATRB_SID,
                Attributes.COST_TEST_FAIL_OVERRIDE.ATRB_SID,
                Attributes.COST_TEST_FAIL_OVERRIDE_REASON.ATRB_SID,
                Attributes.COST_TEST_RESULT.ATRB_SID,
                Attributes.COST_TYPE_USED.ATRB_SID,
                Attributes.DEAL_COMB_TYPE.ATRB_SID,
                Attributes.ECAP_FLR.ATRB_SID,
                Attributes.ECAP_PRICE.ATRB_SID,
                Attributes.REBATE_TYPE.ATRB_SID,
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
                //Attributes.PRD_COST.ATRB_SID,
                Attributes.PRODUCT_FILTER.ATRB_SID,
                Attributes.PROGRAM_PAYMENT.ATRB_SID,
                Attributes.PTR_USER_PRD.ATRB_SID,
                Attributes.RETAIL_CYCLE.ATRB_SID,
                //Attributes.RETAIL_PULL.ATRB_SID,
                //Attributes.RETAIL_PULL_USR_DEF.ATRB_SID,
                //Attributes.RETAIL_PULL_USR_DEF_CMNT.ATRB_SID,
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

        /// <summary>
        /// Validates Pricing Table Rows by OBJ_SET_TYPE
        /// </summary>
        /// <param name="contractAndPricingTable">A ContractTransferPacket containing the related Contract, PricingTable, and its rows</param>
        /// <returns>PtrValidationContainer - consisting of </returns>
        public PtrValidationContainer ValidatePricingTableRows(ContractTransferPacket contractAndPricingTable)
        {
            if (contractAndPricingTable.PricingTable.Count <= 0 || contractAndPricingTable.PricingTableRow.Count <= 0)
            {
                PtrValidationContainer myContainer = new PtrValidationContainer
                {
                    ColumnErrors = new Dictionary<int, Dictionary<string, List<string>>>
                    {
                        [0] = new Dictionary<string, List<string>>()
                    }
                };
                if (!myContainer.ColumnErrors[0].ContainsKey("general")) myContainer.ColumnErrors[0]["general"] = new List<string>();

                myContainer.ColumnErrors[0]["general"].Add("No Pricing Table or Rows were found to check validations against.");

                return myContainer;
            }

            // TODO: this assumes we only get one contract which might not always true in the future? -- look at DC_PARENT_ID and DC_ID to get associated Pt, contracts, and ptrs
            var opDataCollectorFlattenedItem = contractAndPricingTable.PricingTable.FirstOrDefault();
            if (opDataCollectorFlattenedItem != null && (string)opDataCollectorFlattenedItem["OBJ_SET_TYPE_CD"] == ObjSetTypeCodes.ECAP.ToString())
            {
                return ValidateEcapPricingTableRows(contractAndPricingTable);
            }
            else
            {
                return null;
            }
        }

        public PtrValidationContainer AddErrorToPtrValidationContainer(PtrValidationContainer myContainer, int rowIndex, string myKey, string errMsg)
        {
            if (myContainer.ColumnErrors[rowIndex].ContainsKey(myKey))
            {
                myContainer.ColumnErrors[rowIndex][myKey].Add(errMsg);
            }
            else
            {
                myContainer.ColumnErrors[rowIndex][myKey] = new List<string>() { errMsg };
            }
            return myContainer;
        }

        private PtrValidationContainer ValidateEcapPricingTableRows(ContractTransferPacket contractAndPricingTable)
        {
            //DropdownLib _dropdownLib = new DropdownLib();

            PtrValidationContainer myContainer = new PtrValidationContainer();
            UiTemplates uiTemplate = _uiTemplateLib.GetUiTemplates();

            List<BasicDropdown> VALID_MRKT_SEG = _dropdownLib.GetDropdowns(AttributeCodes.MRKT_SEG).ToList();
            List<BasicDropdown> VALID_MRKT_NON_CORP = _dropdownLib.GetDropdowns(AttributeCodes.MRKT_SEG_NON_CORP).ToList();
            List<BasicDropdown> VALID_MRKT_EMB_SUBSEG = _dropdownLib.GetDropdowns(AttributeCodes.MRKT_SUB_SEGMENT).ToList();

            // Hard coded values :C
            string worldWide = "Worldwide";
            string colName_ecapPrice = "ECAP_PRICE";
            string colName_geo = "GEO_COMBINED";
            string colName_startDate = "START_DT";
            string colName_contract_startDate = "START_DT";
            string colName_contract_endDate = "END_DT";
            string colName_userPrd = "PTR_USER_PRD";
            string colName_mrktSeg = "MRKT_SEG";

            // TODO: remove the below json-converter rows in favor of hooking up to   _productsLib.TranslateProducts when that's finished

            #region JSON String - TODO: rmeove when no longer needed

            string jsonString = @"{
	'ProdctTransformResults': {
        '1': ['e3200'],
        '2': ['t7100']
	},
    'DuplicateProducts': {},
    'ValidProducts': {
        '1': [
            {
                'BRND_NM': 'ICP',
                'CPU_CACHE': '',
                'CPU_PACKAGE': 'LGA775',
                'cpu_processor_number': '',
                'CPU_VOLTAGE_SEGMENT': '',
                'CPU_WATTAGE': '',
                'DEAL_PRD_NM': '',
                'DEAL_PRD_TYPE': 'CPU',
                'EFF_FR_DTM': '2010-04-09T00:00:00',
                'EPM_NM': 'Boxed Intel® Celeron® Processor E3200 (1M Cache, 2.40 GHz, 800 MHz FSB) LGA775, Boxed Intel® Celeron® Processor E3200 (1M Cache, 2.40 GHz, 800 MHz FSB) LGA775, for China, Intel® Celeron® Processor E3200 (1M Cache, 2.40 GHz, 800 MHz FSB) LGA775, Tray',
                'FMLY_NM': 'Wolfdale1M',
                'fmly_nm_MM': '',
                'GDM_BRND_NM': '',
                'GDM_FMLY_NM': '',
                'HIER_NM_HASH': 'CPU/DT/ICP/Wolfdale1M/E3200/',
                'HIER_VAL_NM': 'E3200',
                'KIT_NM': '',
                'MTRL_ID': '',
                'NAND_Density': '',
                'NAND_FAMILY': '',
                'PCSR_NBR': 'E3200',
                'PRD_atrb_SID': 7006,
                'PRD_CAT_NM': 'DT',
                'PRD_END_DTM': '2017-03-28T00:00:00',
                'PRD_MBR_SID': 583,
                'PRD_STRT_DTM': '2010-04-09T00:00:00',
                'PRICE_SEGMENT': '',
                'SBS_NM': 'CPU, SHASTA',
                'SKU_MARKET_SEGMENT': 'Value',
                'SKU_NM': '',
                'USR_INPUT': 'e3200',

				'GEO_MBR_SID' : '1,4',
				'CUST_MBR_SID' : '2503',
				'CAP' : '8.00',
				'CAP_START_DATE' : '2013-10-27 00:00:00.000',
				'CAP_END_DATE' : '9999-12-31 00:00:00.000',
				'CAP_PRC_COND' : 'YMS2',
				'Flag_pick' : 'Y',
				'YCS2' : '6.7',
				'YCS2_Start_Date' : '2013-04-19 00:00:00.000',
				'YCS2_End_Date' : '9999-12-31 00:00:00.000',

				'DEAL_START_DATE' : '2016-01-01',
				'DEAL_END_DATE' : '2017-12-12'
            }
        ],
        '2': [
            {
                'BRND_NM': 'C2D',
                'CPU_CACHE': '',
                'CPU_PACKAGE': 'uFCPGA6',
                'cpu_processor_number': '',
                'CPU_VOLTAGE_SEGMENT': '',
                'CPU_WATTAGE': '',
                'DEAL_PRD_NM': '',
                'DEAL_PRD_TYPE': 'CPU',
                'EFF_FR_DTM': '0001-01-01T00:00:00',
                'EPM_NM': 'Boxed Intel® Core™2 Duo Processor T7100 (2M Cache, 1.80 GHz, 800 MHz FSB) uFCPGA Pb-Free SLI, Socket P',
                'FMLY_NM': 'Merom-DC-SR',
                'fmly_nm_MM': '',
                'GDM_BRND_NM': '',
                'GDM_FMLY_NM': '',
                'HIER_NM_HASH': 'CPU/Mb/C2D/Merom-DC-SR/T7100/',
                'HIER_VAL_NM': 'T7100',
                'KIT_NM': '',
                'MTRL_ID': '',
                'NAND_Density': '',
                'NAND_FAMILY': '',
                'PCSR_NBR': 'T7100',
                'PRD_atrb_SID': 7006,
                'PRD_CAT_NM': 'Mb',
                'PRD_END_DTM': '2013-05-01T00:00:00',
                'PRD_MBR_SID': 1198,
                'PRD_STRT_DTM': '2010-04-09T00:00:00',
                'PRICE_SEGMENT': '',
                'SBS_NM': 'IBPMD8',
                'SKU_MARKET_SEGMENT': 'Perf',
                'SKU_NM': '',
                'USR_INPUT': 't7100',

				'GEO_MBR_SID' : '1,4',
				'CUST_MBR_SID' : '2503',
				'CAP' : '8.00',
				'CAP_START_DATE' : '2013-10-27 00:00:00.000',
				'CAP_END_DATE' : '9999-12-31 00:00:00.000',
				'CAP_PRC_COND' : 'YMS2',
				'Flag_pick' : 'Y',
				'YCS2' : '6.7',
				'YCS2_Start_Date' : '2013-04-19 00:00:00.000',
				'YCS2_End_Date' : '9999-12-31 00:00:00.000',

				'DEAL_START_DATE' : '2016-01-01',
				'DEAL_END_DATE' : '2017-12-12'
            }
        ]
    },
    'InValidProducts': {
        '1': [],
        '2': []
    }
}";

            #endregion JSON String - TODO: rmeove when no longer needed

            JObject jObject = JObject.Parse(jsonString);
            ProductLookup_tempWithCAP prodLookup = JsonConvert.DeserializeObject<ProductLookup_tempWithCAP>(jsonString);
            myContainer.ProductLookup = prodLookup;

            // TODO: uncomment the below rows after Product Translate is completed
            //Int32 CUST_MBR_SID = 2; // TODO: get actual cust id
            //var GEO_MBR_SID = 5; // TODO: get actual cust id
            //// Make the product
            //List<ProductEntryAttribute> userInput = contractAndPricingTable.PricingTableRow.Select(x => new ProductEntryAttribute
            //{
            //	USR_INPUT = x["PTR_USER_PRD"].ToString()
            //	, EXCLUDE = ""
            //	, FILTER = ""
            //	, START_DATE = x["START_DT"].ToString()
            //	, END_DATE = x["END_DT"].ToString()
            //}).ToList();
            // _productsLib.TranslateProducts(userInput, CUST_MBR_SID, GEO_MBR_SID);

            // Pricing Table Validation logic
            for (int i = 0; i < contractAndPricingTable.PricingTableRow.Count; i++)
            {
                // TODO: we may need ot change the below after product translate is completed maybe.
                int rowIndex = i + 1; // NOTE: this is to sync up with the Product Translate's row numbering.

                OpDataCollectorFlattenedItem row = contractAndPricingTable.PricingTableRow[i];
                myContainer.ColumnErrors = ((myContainer.ColumnErrors == null) ? new Dictionary<int, Dictionary<string, List<string>>>() : myContainer.ColumnErrors);
                myContainer.ColumnErrors[rowIndex] = new Dictionary<string, List<string>>();

                #region PricingTableRow fields

                object val_PTR_USER_PRD = new object();
                object val_ECAP_PRICE = new object();
                object val_START_DT = new object();
                object val_END_DT = new object();
                object val_PAYOUT_BASED_ON = new object();
                object val_PROGRAM_PAYMENT = new object();
                object val_REBATE_TYPE = new object();
                object val_MRKT_SEG = new object();
                object val_GEO_COMBINED = new object();
                object val_MEET_COMP_PRICE_QSTN = new object();
                object val_TERMS = new object();
                object val_PROD_INCLDS = new object();
                object val_OBJ_SET_TYPE_CD = new object();

                row.TryGetValue("PTR_USER_PRD", out val_PTR_USER_PRD);
                row.TryGetValue("ECAP_PRICE", out val_ECAP_PRICE);
                row.TryGetValue("START_DT", out val_START_DT);
                row.TryGetValue("END_DT", out val_END_DT);
                row.TryGetValue("PAYOUT_BASED_ON", out val_PAYOUT_BASED_ON);
                row.TryGetValue("PROGRAM_PAYMENT", out val_PROGRAM_PAYMENT);
                row.TryGetValue("REBATE_TYPE", out val_REBATE_TYPE);
                row.TryGetValue("MRKT_SEG", out val_MRKT_SEG);
                row.TryGetValue("GEO_COMBINED", out val_GEO_COMBINED);
                row.TryGetValue("MEET_COMP_PRICE_QSTN", out val_MEET_COMP_PRICE_QSTN);
                row.TryGetValue("TERMS", out val_TERMS);
                row.TryGetValue("PROD_INCLDS", out val_PROD_INCLDS);
                row.TryGetValue("OBJ_SET_TYPE_CD", out val_OBJ_SET_TYPE_CD);

                #endregion PricingTableRow fields

                // Check if the row has invalid or duplicate products
                if ((prodLookup.InValidProducts.ContainsKey(rowIndex.ToString())) && (prodLookup.InValidProducts[rowIndex.ToString()].Count > 0) || (prodLookup.DuplicateProducts.Count > 0))
                {
                    myContainer = AddErrorToPtrValidationContainer(myContainer, rowIndex, "PTR_USER_PRD", "Product " + val_PTR_USER_PRD.ToString() + " was invalid. Please use product corrector to select product.");
                    // Don't do any other validation logic on this row if there is an invalid product. User needs to fix this first.
                    continue;
                }
                // Get the valid product details
                else if (prodLookup.ValidProducts.Count == 0)
                {
                    // This shouldn't hit, but just in case, if there is no valid product, then go to next iteration
                    continue;
                }
                else // we have valid products for this row
                {
                    List<PRD_LOOKUP_RESULTS_tempWithCAP> myProducts = new List<PRD_LOOKUP_RESULTS_tempWithCAP>();
                    prodLookup.ValidProducts.TryGetValue(rowIndex.ToString(), out myProducts);

                    // Required fields Validation
                    foreach (KeyValuePair<string, UiFieldItem> col in uiTemplate.ModelTemplates["PRC_TBL_ROW"]["ECAP"].model.fields)
                    {
                        // do something with entry.Value or entry.Key
                        if (!col.Value.nullable) // NOTE: PTR_USER_PRD needs to be not required for the UI to consume
                        {
                            object colVal = new object();
                            row.TryGetValue(col.Key, out colVal);

                            if (colVal == null || String.IsNullOrWhiteSpace(colVal.ToString()))
                            {
                                myContainer = AddErrorToPtrValidationContainer(myContainer, rowIndex, col.Key, col.Value.label + " is required.");
                            }
                        }

                        // TODO: we need validation to make sure the user picks form the dropdwon for dropdown values
                        if (col.Value.opLookupText == "DROP_DOWN")
                        {
                            // TODO: maybe use these to try getting the correct dropdown values from the dropdown api?
                            var testfjeghre = col.Value.field;
                            var tesgrhgrehtfjeghre = col.Value.label;
                        }
                    }

                    // ECAP Price cannot be zero
                    if (val_ECAP_PRICE == null || Int32.Parse(val_ECAP_PRICE.ToString()) <= 0)
                    {
                        myContainer = AddErrorToPtrValidationContainer(myContainer, rowIndex, colName_ecapPrice, "ECAP Price must be greater than $0.00");
                    }

                    #region Market Segment Validations

                    if (!(val_MRKT_SEG == null))
                    {
                        string[] user_mrkt_segs = val_MRKT_SEG.ToString().ToUpper().Split(',').Select(mrkt => mrkt.Trim()).ToArray(); //TODO: we trim each comma separated value of white space for validation, but the trimmed white space will still be saved in the db.  Is that ok?  Need to clarify with SA/BA.

                        //"ALL" check
                        if (user_mrkt_segs.Length > 1 && Array.IndexOf(user_mrkt_segs, "ALL") >= 0)
                        {
                            myContainer = AddErrorToPtrValidationContainer(myContainer, rowIndex, colName_mrktSeg, "Market Segment ALL cannot be blended with any other Market Segment");
                        }

                        //"Embedded" check
                        if (user_mrkt_segs.Length > 1)
                        {
                            for (int j = 0; j < user_mrkt_segs.Length; j++)
                            {
                                if (VALID_MRKT_EMB_SUBSEG.FirstOrDefault(mrkt => mrkt.DROP_DOWN.ToUpper() == user_mrkt_segs[j]) != null)
                                {
                                    //encountered an embedded sub segment that is blended with other market seg inputs
                                    myContainer = AddErrorToPtrValidationContainer(myContainer, rowIndex, colName_mrktSeg, "Embedded Market Segments cannot be blended with any other market segment.");
                                }
                            }
                        }

                        //"NonCorp" check - // TODO: If Non Corp is chosen then user should not select a duplicate value outside of non corp selection.
                        if (Array.IndexOf(user_mrkt_segs, "NON CORP") >= 0)
                        {
                            //NONCORP is checked - make sure all NONCORP options are also included in user input
                            foreach (BasicDropdown mrkt in VALID_MRKT_NON_CORP)
                            {
                                if (Array.IndexOf(user_mrkt_segs, mrkt.DROP_DOWN.ToUpper()) < 0)
                                {
                                    // user selected noncorp but did not include all noncorp options
                                    myContainer = AddErrorToPtrValidationContainer(myContainer, rowIndex, colName_mrktSeg, "NonCorp Market Segment selected but " + mrkt.DROP_DOWN + " not included.");
                                }
                            }
                        }

                        // Valid Name Mrkt Seg Check
                        for (int j = 0; j < user_mrkt_segs.Length; j++)
                        {
                            if (VALID_MRKT_EMB_SUBSEG.FirstOrDefault(mrkt => mrkt.DROP_DOWN.ToUpper() == user_mrkt_segs[j]) == null &&
                                VALID_MRKT_SEG.FirstOrDefault(mrkt => mrkt.DROP_DOWN.ToUpper() == user_mrkt_segs[j]) == null)
                            {
                                // user inputed mrkt seg value does not match with any allowed mrkt seg or mrkt seg embedded values (mrkt seg includes mrkt noncorp)
                                myContainer = AddErrorToPtrValidationContainer(myContainer, rowIndex, colName_mrktSeg, user_mrkt_segs[j] + " is not a valid Market Segment.");
                            }
                        }
                    }

                    #endregion Market Segment Validations

                    #region GEO Validations

                    if (val_GEO_COMBINED != null)
                    {
                        List<string> geosList = new List<string>();
                        string geoString = val_GEO_COMBINED.ToString();
                        string newGeoString = geoString;
                        bool isBlendedGeo = geoString.Contains("[");

                        // Format geo string to make into an array
                        newGeoString = newGeoString.Replace("[", "");
                        newGeoString = newGeoString.Replace("]", "");
                        newGeoString = newGeoString.Replace(" ", "");

                        geosList = newGeoString.Split(',').ToList();

                        // Check that thse geos are valid
                        List<Dropdown> validGeoValues = _dropdownLib.GetGeosDropdown();
                        for (int g = 0; g < geosList.Count; g++)
                        {
                            string geo = geosList[g];
                            if (validGeoValues.Where(x => x.dropdownName == geo).Select(x => x.dropdownName).FirstOrDefault() == null)
                            {
                                myContainer = AddErrorToPtrValidationContainer(myContainer, rowIndex, colName_geo, (geo + " is not a valid Geo."));
                            }
                        }

                        // Blended GEO, can not mix WW and other Geo
                        if (isBlendedGeo)
                        {
                            // Is "WorldWide" inside brackets?
                            string wwRegex = @"\[((.*)" + worldWide + @"(.*))\]";
                            bool isWorldWideInsideBlended = Regex.IsMatch(geoString, wwRegex);

                            if (isWorldWideInsideBlended)
                            {
                                myContainer = AddErrorToPtrValidationContainer(myContainer, rowIndex, colName_geo, "Worldwide cannot be mixed with other geos in a blend geo.");
                            }
                        }
                    }

                    #endregion GEO Validations

                    #region Media Validations

                    // TODO: Media - It would always pull 'Tray' products for CPU.If box product is available then user could have a option to select those.

                    #endregion Media Validations

                    #region date valiations

                    if (val_START_DT == null || val_END_DT == null)
                    {
                        // NOTE: we are assuming that the required flag will catch when the strat and end dates are null
                        continue;
                    }

                    DateTime startDate;
                    DateTime endDate;
                    DateTime today = DateTime.UtcNow;
                    try
                    {
                        startDate = DateTime.Parse(val_START_DT.ToString());
                        endDate = DateTime.Parse(val_END_DT.ToString());
                    }
                    catch
                    {
                        myContainer = AddErrorToPtrValidationContainer(myContainer, rowIndex, colName_startDate, "Start or End date formatting is incorrect. Try formatting as mm/dd/yyyy.");
                        continue;
                    }

                    // Deal end date should not be before deal start date
                    if (startDate > endDate)
                    {
                        myContainer = AddErrorToPtrValidationContainer(myContainer, rowIndex, colName_startDate, "Deal end date should not be before deal start date.");
                    }

                    #endregion date valiations

                    // Product validations
                    // TODO: maybe push this out into a reusable function to be used by the product corrector?

                    #region Product/CAP relaed validations

                    if (myProducts != null)
                    {
                        foreach (PRD_LOOKUP_RESULTS_tempWithCAP prod in myProducts)
                        {
                            //// When ECAP Price is greater than CAP, UI validation check on deal creation and system should give a soft warning.
                            //if (val_ECAP_PRICE != null && prod.CAP > Int32.Parse(val_ECAP_PRICE.ToString()))
                            //{
                            //    myContainer = AddErrorToPtrValidationContainer(myContainer, rowIndex, colName_ecapPrice, "CAP price (" + prod.CAP + ") is greater than ECAP Price.");
                            //}

                            //// If the product start date is after the deal start date, then deal start date should match with product start date and back date would not apply.
                            //if (prod.PRD_STRT_DTM > prod.CAP_START_DATE)
                            //{
                            //    myContainer = AddErrorToPtrValidationContainer(myContainer, rowIndex, colName_startDate, "If the product start date is after the deal start date, then deal start date should match with product start date and back date would not apply. TODO: code this in the UI from the corrector.");
                            //    // TODO: code this in the UI from the corrector
                            //}

                            // Additional validation-for program payment=Front end, the deal st. date can not be past, it should be >= current date
                            if ((val_PROGRAM_PAYMENT != null) && (val_PROGRAM_PAYMENT.ToString().Contains("rontend")) && (startDate < today))
                            {
                                myContainer = AddErrorToPtrValidationContainer(myContainer, rowIndex, colName_startDate, "The deal start date must be greater or equal to the current date if program payment is Frontend.");
                            }

                            #region CAP Validations

                            //// IF CAP is not available at all then show as NO CAP.User can not create deals.
                            //if (prod.CAP == null || prod.CAP <= 0)
                            //{
                            //    myContainer = AddErrorToPtrValidationContainer(myContainer, rowIndex, colName_userPrd, "CAP is not available (NO CAP). You can not create deals with this product.");
                            //}

                            //// if a product entered does not have CAP within the deal start date and end date then (CAP is not overlapping deal start and end date)
                            //if (!((prod.CAP_START_DATE < endDate) && (startDate < prod.CAP_END_DATE)))
                            //{
                            //    // show a message that the product does not have CAP in these date range.
                            //    myContainer = AddErrorToPtrValidationContainer(myContainer, rowIndex, colName_userPrd, "Product entered does not have CAP within the Deal's start date and end date");
                            //}
                            //// Then if CAP exists in future outside of deal end date
                            //if (prod.CAP_START_DATE > endDate)
                            //{
                            //    // Show to user the CAP start date and CAP end date
                            //    myContainer = AddErrorToPtrValidationContainer(myContainer, rowIndex, colName_startDate, "The CAP start date (" + prod.CAP_START_DATE.ToString() + ") and end date (" + prod.CAP_END_DATE.ToString() + ") exists in future outside of deal end date. Please change the deal start date to match the CAP start date.");
                            //    // TODO:  code this in the UI from the corrector. In the UI: ask user whether to change the deal start date and if user say yes then change the deal start date to CAP start date
                            //}

                            #endregion CAP Validations

                            #region contract related validations

                            DateTime contractStartDate;
                            DateTime contractEndDate;
                            try
                            {
                                // TODO: this assumes we only get one contract which might not always true in the future? -- look at DC_PARENT_ID and DC_ID to get associated Pt, contracts, and ptrs
                                contractStartDate = DateTime.Parse(contractAndPricingTable.Contract.FirstOrDefault()[colName_contract_startDate].ToString());
                                contractEndDate = DateTime.Parse(contractAndPricingTable.Contract.FirstOrDefault()[colName_contract_endDate].ToString());
                            }
                            catch
                            {
                                myContainer = AddErrorToPtrValidationContainer(myContainer, rowIndex, colName_startDate, "The Contract's Start or End date formatting is incorrect. Please check contract details and change accordingly.");
                                continue;
                            }

                            if (contractStartDate == null || contractEndDate == null)
                            {
                                myContainer = AddErrorToPtrValidationContainer(myContainer, rowIndex, colName_startDate, "Warning: contract start and/or end dates not found.");
                            }
                            else if (!((contractStartDate < endDate) && (startDate < contractEndDate)))
                            {
                                // Deal date range should be touching the contract start date end date (Deal dates must be overlapping contract dates)
                                myContainer = AddErrorToPtrValidationContainer(myContainer, rowIndex, colName_startDate, "Deal date range should be touching the contract start date (" + contractStartDate.ToString() + ") and contract end date (" + contractEndDate.ToString() + ").");
                            }

                            #endregion contract related validations
                        }

                        #endregion Product/CAP relaed validations
                    }
                }
            }

            return myContainer;
        }
    }
}