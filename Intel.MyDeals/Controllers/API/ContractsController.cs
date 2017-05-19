using System.Web.Http;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;
using System.Net.Http.Formatting;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Net;
using System.Net.Http;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using Intel.MyDeals.BusinessLogic;

namespace Intel.MyDeals.Controllers.API
{
	[RoutePrefix("api/Contracts/v1")]
	public class ContractsController : BaseApiController
	{
		private readonly IContractsLib _contractsLib;
		private readonly IProductsLib _productsLib;
		private readonly IDropdownLib _dropdownLib;
		private readonly IUiTemplateLib _uiTemplateLib;

		public ContractsController(IContractsLib contractsLib, IProductsLib productsLib, IDropdownLib dropdownLib, IUiTemplateLib uiTemplateLib)
		{
			this._contractsLib = contractsLib;
			this._productsLib = productsLib;
			this._dropdownLib = dropdownLib;
			this._uiTemplateLib = uiTemplateLib;
		}

		[Authorize]
		[Route("GetContract/{id}")]
		public MyDealsData GetContract(int id)
		{
			return SafeExecutor(() => _contractsLib.GetContract(id)
				, $"Unable to get Contract {id}"
			);
		}

		[Authorize]
		[Route("GetFullNestedContract/{id}")]
		public MyDealsData GetFullNestedContract(int id)
		{
			return SafeExecutor(() => _contractsLib.GetContract(id, true)
				, $"Unable to get Contract {id}"
			);
		}

		[Authorize]
		[Route("GetUpperContract/{id}")]
		public OpDataCollectorFlattenedList GetUpperContract(int id)
		{
			return SafeExecutor(() => _contractsLib.GetUpperContract(id)
				, $"Unable to get Contract {id}"
			);
		}

		[Authorize]
		[Route("GetContractStatus/{id}")]
		public OpDataCollectorFlattenedList GetContractStatus(int id)
		{
			return SafeExecutor(() => _contractsLib.GetContractStatus(id)
				, $"Unable to get Contract {id}"
			);
		}


		[Authorize]
		[Route("GetFullContract/{id}")]
		public OpDataCollectorFlattenedDictList GetFullContract(int id)
		{
			return SafeExecutor(() => _contractsLib.GetFullContract(id)
				, $"Unable to get Contract {id}"
			);
		}

        [Authorize]
        [Route("SaveContract/{custId}")]
        [HttpPost]
        public OpDataCollectorFlattenedDictList SaveContract(int custId, OpDataCollectorFlattenedList contracts)
        {
            return SafeExecutor(() => _contractsLib.SaveContract(contracts, custId, false, false)
                , "Unable to save the Contract"
            );
        }

        [Authorize]
        [Route("SaveFullContract/{custId}")]
        [HttpPost]
        public OpDataCollectorFlattenedDictList SaveFullContract(int custId, OpDataCollectorFlattenedDictList fullContracts)
        {
            return SafeExecutor(() => _contractsLib.SaveFullContract(custId, fullContracts, false, false)
                , "Unable to save the Contract"
            );
        }

        [Authorize]
        [Route("SaveContractAndPricingTable/{custId}")]
        [HttpPost]
        public OpDataCollectorFlattenedDictList SaveContractAndPricingTable(int custId, ContractTransferPacket contractAndPricingTable)
        {
            return SafeExecutor(() => _contractsLib.SaveContractAndPricingTable(custId, contractAndPricingTable, false, false)
                , "Unable to save the Contract"
            );
        }

		[Authorize]
		[Route("SaveAndValidateContractAndPricingTable/{custId}")]
		[HttpPost]
		public OpDataCollectorFlattenedDictList SaveAndValidateContractAndPricingTable(int custId, ContractTransferPacket contractAndPricingTable)
		{
			PtrValidationContainer errorList = new PtrValidationContainer();
			errorList = ValidateEcapPricingTableRows(contractAndPricingTable);

			if (errorList.ColumnErrors.Count > 0)
			{
				// Pricing Table Row has errors, so throw an exception
				throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.InternalServerError)
				{
					Content = new ObjectContent<PtrValidationContainer>(errorList, new JsonMediaTypeFormatter())
				});
			}

			return SafeExecutor(() => _contractsLib.SaveContractAndPricingTable(custId, contractAndPricingTable, true, false) // TODO: Phil/Mike: check if the last param is what you want
				, "Unable to save the Contract"
			);
		}

		[Authorize]
		[Route("ValidatePricingTableRows")]
		[HttpPost]
		public PtrValidationContainer ValidatePricingTableRows(ContractTransferPacket contractAndPricingTable)
		{
			if ((contractAndPricingTable.PricingTable.Count <= 0) || (contractAndPricingTable.PricingTableRow.Count <= 0))
			{
				PtrValidationContainer myContainer = new PtrValidationContainer();
				myContainer.ColumnErrors = new Dictionary<int, Dictionary<string, List<string>>>();
				myContainer.ColumnErrors[0] = new Dictionary<string, List<string>>();
				myContainer.ColumnErrors[0]["general"].Add("No Pricing Table or Rows were found to check validations against.");

				return myContainer;
			}

			// TODO: this assumes we only get one contract which might not always true in the future? -- look at DC_PARENT_ID and DC_ID to get associated Pt, contracts, and ptrs
			if ((string)contractAndPricingTable.PricingTable.FirstOrDefault()["OBJ_SET_TYPE_CD"] == ObjSetTypeCodes.ECAP.ToString())
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
            //TODO: All of this "logic" should be moved to Business Layer Project to adhere to our coding convention - API controllers should just be logic-free shells invoking Business Logic functions

            PtrValidationContainer myContainer = new PtrValidationContainer();
			UiTemplates uiTemplate = _uiTemplateLib.GetUiTemplates();

			List<BasicDropdown> VALID_MRKT_SEG = _dropdownLib.GetDropdowns(AttributeCodes.MRKT_SEG).ToList();
			List<BasicDropdown> VALID_MRKT_NON_CORP = _dropdownLib.GetDropdowns(AttributeCodes.MRKT_SEG_NON_CORP).ToList();
			List<BasicDropdown> VALID_MRKT_EMB_SUBSEG = _dropdownLib.GetDropdowns(AttributeCodes.MRKT_SUB_SEGMENT).ToList();

			// Hard coded values :C
			string worldWide = "Worldwide";
			string colName_ecapPrice = "ECAP_PRICE_____10___0";
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
				'1': [
		            'e3200'
        ],
        '2': [
            't7100'
        ]
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
			#endregion
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
				object val_ECAP_TYPE = new object();
				object val_MRKT_SEG = new object();
				object val_GEO_COMBINED = new object();
				object val_MEET_COMP_PRICE_QSTN = new object();
				object val_TERMS = new object();
				object val_MM_MEDIA_CD = new object();
				object val_OBJ_SET_TYPE_CD = new object();

				row.TryGetValue("PTR_USER_PRD", out val_PTR_USER_PRD);
				row.TryGetValue("ECAP_PRICE_____10___0", out val_ECAP_PRICE);
				row.TryGetValue("START_DT", out val_START_DT);
				row.TryGetValue("END_DT", out val_END_DT);
				row.TryGetValue("PAYOUT_BASED_ON", out val_PAYOUT_BASED_ON);
				row.TryGetValue("PROGRAM_PAYMENT", out val_PROGRAM_PAYMENT);
				row.TryGetValue("ECAP_TYPE", out val_ECAP_TYPE);
				row.TryGetValue("MRKT_SEG", out val_MRKT_SEG);
				row.TryGetValue("GEO_COMBINED", out val_GEO_COMBINED);
				row.TryGetValue("MEET_COMP_PRICE_QSTN", out val_MEET_COMP_PRICE_QSTN);
				row.TryGetValue("TERMS", out val_TERMS);
				row.TryGetValue("MM_MEDIA_CD", out val_MM_MEDIA_CD);
				row.TryGetValue("OBJ_SET_TYPE_CD", out val_OBJ_SET_TYPE_CD);
				#endregion

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

							if (colVal == null || String.IsNullOrEmpty(colVal.ToString()))
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
                                if(Array.IndexOf(user_mrkt_segs, mrkt.DROP_DOWN.ToUpper()) < 0)
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
                    #endregion

					#region GEO Validations
					if (val_GEO_COMBINED != null) {
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
					#endregion

					#region Media Validations
					// TODO: Media - It would always pull 'Tray' products for CPU.If box product is available then user could have a option to select those.
					#endregion

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
					#endregion

					// Product validations
					// TODO: maybe push this out into a reusable function to be used by the product corrector?
					#region Product/CAP relaed validations
					if (myProducts != null)
					{
						foreach (PRD_LOOKUP_RESULTS_tempWithCAP prod in myProducts)
						{
							// When ECAP Price is greater than CAP, UI validation check on deal creation and system should give a soft warning. 
							if (val_ECAP_PRICE != null && prod.CAP > Int32.Parse(val_ECAP_PRICE.ToString()))
							{
								myContainer = AddErrorToPtrValidationContainer(myContainer, rowIndex, colName_ecapPrice, "CAP price (" + prod.CAP + ") is graeter than ECAP Price.");
							}

							// If the product start date is after the deal start date, then deal start date should match with product start date and back date would not apply.
							if (prod.PRD_STRT_DTM > prod.CAP_START_DATE)
							{
								myContainer = AddErrorToPtrValidationContainer(myContainer, rowIndex, colName_startDate, "If the product start date is after the deal start date, then deal start date should match with product start date and back date would not apply. TODO: code this in the UI from the corrector.");
								// TODO: code this in the UI from the corrector
							}

							// Additional validation-for program payment=Front end, the deal st. date can not be past, it should be >= current date 
							if ((val_PROGRAM_PAYMENT != null) && (val_PROGRAM_PAYMENT.ToString().Contains("rontend")) && (startDate < today))
							{
								myContainer = AddErrorToPtrValidationContainer(myContainer, rowIndex, colName_startDate, "The deal start date must be greater or equal to the current date if program payment is Frontend.");
							}
							
							#region CAP Validations
							// IF CAP is not available at all then show as NO CAP.User can not create deals.
							if (prod.CAP == null || prod.CAP <= 0)
							{
								myContainer = AddErrorToPtrValidationContainer(myContainer, rowIndex, colName_userPrd, "CAP is not available (NO CAP). You can not create deals with this product.");
							}

							// if a product entered does not have CAP within the deal start date and end date then (CAP is not overlapping deal start and end date)
							if (!((prod.CAP_START_DATE < endDate) && (startDate < prod.CAP_END_DATE)))
							{
								// show a message that the product does not have CAP in these date range.
								myContainer = AddErrorToPtrValidationContainer(myContainer, rowIndex, colName_userPrd, "Product entered does not have CAP within the Deal's start date and end date");
							}
							// Then if CAP exists in future outside of deal end date 
							if (prod.CAP_START_DATE > endDate)
							{
								// Show to user the CAP start date and CAP end date  
								myContainer = AddErrorToPtrValidationContainer(myContainer, rowIndex, colName_startDate, "The CAP start date (" + prod.CAP_START_DATE.ToString() + ") and end date (" + prod.CAP_END_DATE.ToString() + ") exists in future outside of deal end date. Please change the deal start date to match the CAP start date.");
								// TODO:  code this in the UI from the corrector. In the UI: ask user whether to change the deal start date and if user say yes then change the deal start date to CAP start date
							}
							#endregion


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
							#endregion

						}
						#endregion
					}
				}

			}

			return myContainer;
		}


		[Authorize]
		[Route("DeleteContract/{id}")]
		[HttpGet]
		public OpMsg DeleteContract(int id)
		{
			return SafeExecutor(() => _contractsLib.DeleteContract(id)
				, "Unable to delete the Contract {id}"
			);
		}

		[Authorize]
		[Route("IsDuplicateContractTitle/{dcId}/{title}")]
		[HttpGet]
		public bool IsDuplicateContractTitle(int dcId, string title)
		{
			return SafeExecutor(() => _contractsLib.IsDuplicateContractTitle(dcId, title)
				, "Unable to validate contract name {title}"
			);
		}

        [Authorize]
        [Route("GetContractsStatus")]
        [HttpPost]
        public dynamic GetContractsStatus([FromBody] DashboardFilter data)
        {
            return SafeExecutor(() => _contractsLib.GetContractsStatus(data)
                , $"Unable to get Contracts Status"
            );
        }

        [Authorize]
        [Route("GetWipFromContract/{id}")]
        public OpDataCollectorFlattenedDictList GetWipFromContract(int id)
        {
            return SafeExecutor(() => _contractsLib.GetWipFromContract(id)
                , $"Unable to get WIP Deals {id}"
            );
        }

    }
}