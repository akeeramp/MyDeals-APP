using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.Helpers;
using static Intel.MyDeals.Entities.IqrTransferComsumptionData.RecordDetails;
using Newtonsoft.Json;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque;
using System;

namespace Intel.MyDeals.Controllers.API
{

    [RoutePrefix("api/Dropdown")]
    public class DropdownController : BaseApiController
	{
		private readonly IDropdownLib _dropdownLib;
        private readonly IJmsDataLib _jmsDataLib;
        private readonly IVistexServiceLib _vistexServiceLib;

        public DropdownController(IDropdownLib dropdownLib, IJmsDataLib jmsDataLib, IVistexServiceLib vistexServiceLib)
		{
			_dropdownLib = dropdownLib;
            _jmsDataLib = jmsDataLib;
            _vistexServiceLib = vistexServiceLib;
        }

        [Authorize]
        [Route("GetBasicDropdowns")]
        public IEnumerable<BasicDropdown> GetBasicDropdowns()
        {
            return SafeExecutor(() => _dropdownLib.GetBasicDropdowns()
                , $"Unable to get Basic Dropdowns"
            );
        }

        [Authorize]
        [Route("GetOpDataElements")]
        public IEnumerable<DropDowns> GetOpDataElements()
        {
            return SafeExecutor(() => _dropdownLib.GetOpDataElements()
                , $"Unable to get op data elements"
            );
        }

        [Authorize]
        [Route("GetDropdowns/{atrbCd}")]
        public IEnumerable<BasicDropdown> GetDropdowns(string atrbCd)
        {
            return SafeExecutor(() => _dropdownLib.GetDropdowns(atrbCd)
                , $"Unable to get Dropdowns for {atrbCd}"
            );
        }

        [Authorize]
        [Route("GetVendorDropdownsForCustId/{atrbCd}/{custId}")]
        public IEnumerable<BasicDropdown> GetVendorDropdownsForCustId(string atrbCd, int custId)
        {
            return SafeExecutor(() => _dropdownLib.GetDropdowns(atrbCd, custId)
                , $"Unable to get Dropdowns for {atrbCd}"
            );
        }

        [Authorize]
        [Route("GetDropdownsWithInactives/{atrbCd}")]
        public IEnumerable<BasicDropdown> GetDropdownsWithInactives(string atrbCd)
        {
            return SafeExecutor(() => _dropdownLib.GetDropdownsWithInactives(atrbCd)
                , $"Unable to get Dropdowns for {atrbCd}"
            );
        }

        [Authorize]
        [Route("GetDictDropDown/{atrbCd}")]
        public List<DictDropDown> GetDictDropDown(string atrbCd)
        {
            return SafeExecutor(() => _dropdownLib.GetDictDropDown(atrbCd)
                , $"Unable to get Dropdowns for {atrbCd}"
            );
        }

        [Authorize]
        [Route("GetDistinctDropdownCodes/{atrbCd}")]
        public IEnumerable<BasicDropdown> GetDistinctDropdownCodes(string atrbCd)
        {
            return SafeExecutor(() => _dropdownLib.GetDistinctDropdownCodes(atrbCd)
                , $"Unable to get Dropdowns for {atrbCd}"
            );
        }

        [Authorize]
        [Route("GetDropdowns/{atrbCd}/{dealtypeCd}")]
        public IEnumerable<BasicDropdown> GetDropdowns(string atrbCd, string dealtypeCd)
        {
            return SafeExecutor(() => _dropdownLib.GetDropdowns(atrbCd, dealtypeCd)
                , $"Unable to get Dropdowns for {atrbCd} and {dealtypeCd}"
            );
        }

        [Authorize]
        [Route("GetDropdownsWithCustomer/{atrbCd}/{custNm}")]
        public IEnumerable<BasicDropdown> GetDropdownsWithCustomer(string atrbCd, string custNm)
        {
            return SafeExecutor(() => _dropdownLib.GetDropdownsWithCustomer(atrbCd, custNm)
                , $"Unable to get Customer level Dropdowns for {atrbCd} and {custNm}"
            );
        }

        [Authorize]
        [Route("GetDropdownsWithCustomerId/{atrbCd}/{custId}")]
        public IEnumerable<BasicDropdown> GetDropdownsWithCustomerId(string atrbCd, int custId)
        {
            return SafeExecutor(() => _dropdownLib.GetDropdownsWithCustomerId(atrbCd, custId)
                , $"Unable to get Customer level Dropdowns for {atrbCd} and {custId}"
            );
        }

        [Authorize]
        [Route("GetDropdownsByCustomerOnly/{atrbCd}/{custNm}")]
        public IEnumerable<BasicDropdown> GetDropdownsByCustomerOnly(string atrbCd, string custNm)
        {
            return SafeExecutor(() => _dropdownLib.GetDropdownsByCustomerOnly(atrbCd, custNm)
                , $"Unable to get Customer only level Dropdowns for {atrbCd} and {custNm}"
            );
        }

        [Authorize]
        [Route("GetDropdownsByCustomerOnlyId/{atrbCd}/{custId}")]
        public IEnumerable<BasicDropdown> GetDropdownsByCustomerOnlyId(string atrbCd, int custId)
        {
            return SafeExecutor(() => _dropdownLib.GetDropdownsByCustomerOnlyId(atrbCd, custId)
                , $"Unable to get Customer level Dropdowns for {atrbCd} and {custId}"
            );
        }

        [Authorize]
        [Route("GetDropdownOnlyAllCustomers/{atrbCd}")]
        public IEnumerable<BasicDropdown> GetDropdownOnlyAllCustomers(string atrbCd)
        {
            return SafeExecutor(() => _dropdownLib.GetDropdownOnlyAllCustomers(atrbCd)
                , $"Unable to get Dropdowns for {atrbCd}"
            );
        }

        [Authorize]
        [Route("GetFilteredRebateTypes/{isTender}/{dealtypeCd}")]
        public IEnumerable<BasicDropdown> GetFilteredRebateTypes(bool isTender, string dealtypeCd)
        {
            return SafeExecutor(() =>
            {
                var dropdowns = _dropdownLib.GetDropdowns(AttributeCodes.REBATE_TYPE, dealtypeCd);
                return isTender
                ? dropdowns.Where(d => d.DROP_DOWN.ToUpper() == "TENDER")
                : (dealtypeCd == "ECAP") || (dealtypeCd == "KIT")
                    ? dropdowns.Where(d => d.DROP_DOWN.ToUpper() != "TENDER")
                    : dropdowns.Where(d => d.DROP_DOWN.ToUpper() != "NONE");
            }
                , $"Unable to get Dropdowns for {AttributeCodes.REBATE_TYPE} and {dealtypeCd}"
            );
        }

        [Authorize]
        [Route("GetDealTypesDropdowns")]
        public IEnumerable<Dropdown> GetDealTypesDropdowns()
        {
            return SafeExecutor(() => _dropdownLib.GetDealTypesDropdown()
                , $"Unable to get DealTypes Dropdowns"
            );
        }

        [Authorize]
        [Route("GetDropdownGroups")]
        public IEnumerable<Dropdown> GetDropdownGroups()
        {
            return SafeExecutor(() => _dropdownLib.GetDropdownGroups()
                , $"Unable to get Dropdowns Groups"
            );
        }

        [Authorize]
        [Route("GetNumTiersDropdowns")]
        public IEnumerable<Dropdown> GetNumTiersDropdowns()
        {
            return SafeExecutor(() => _dropdownLib.GetNumTiersDropdown()
                , $"Unable to get NumTiers Dropdowns"
            );
        }

        [Authorize]
        [Route("GetGeosDropdowns")]
        public IEnumerable<Dropdown> GetGeosDropdowns()
        {
            return SafeExecutor(() => _dropdownLib.GetGeosDropdown()
                , $"Unable to get Geos Dropdowns"
            );
        }

		[Authorize]
		[Route("GetProductLevelDropdowns")]
		public IEnumerable<Dropdown> GetProductLevelDropdowns()
		{
			return SafeExecutor(() => _dropdownLib.GetProductLevelDropdown()
				, $"Unable to get Geos Dropdowns"
			);
		}

		[Authorize]
        [Route("GetDropdownHierarchy/{prnt}")]
        public DropdownHierarchy[] GetDropdownHierarchy(string prnt)
        {
            return SafeExecutor(() => _dropdownLib.GetDropdownHierarchy(prnt)
                , $"Unable to get Dropdown Hierarchy for {prnt}"
            );
        }

        [Authorize]
        [Route("GetConsumptionCountryHierarchy/{prnt}")]
        public DropdownHierarchy[] GetConsumptionCountryHierarchy(string prnt)
        {
            return SafeExecutor(() => _dropdownLib.GetConsumptionCountryHierarchy(prnt)
                , $"Unable to get Dropdown Hierarchy for {prnt}"
            );
        }

        [Authorize]
        [Route("GetGeoDropdownHierarchy/{prnt}")]
        public DropdownHierarchy[] GetGeoDropdownHierarchy(string prnt)
        {
            return SafeExecutor(() => _dropdownLib.GetGeoDropdownHierarchy(prnt)
                , $"Unable to get Dropdown Hierarchy for {prnt}"
            );
        }

        [HttpPut]
        [AntiForgeryValidate]
        [Route("UpdateBasicDropdowns")]
        public BasicDropdown UpdateBasicDropdowns(BasicDropdown data)
        {
            BasicDropdown retData = SafeExecutor(() => _dropdownLib.ManageBasicDropdowns(data, CrudModes.Update)
                , $"Unable to update basic dropdown"
            );

            // Do IQR updates here
            UpdateIqrValues(retData, CrudModes.Update.ToString());

            return retData;
        }

        //[Authorize]
        [HttpPost]
        [AntiForgeryValidate]
        [Route("InsertBasicDropdowns")]
        public BasicDropdown InsertBasicDropdowns(BasicDropdown data)
        {
            BasicDropdown retData = SafeExecutor(() => _dropdownLib.ManageBasicDropdowns(data, CrudModes.Insert)
                , $"Unable to insert basic dropdown"
            );

            // Do IQR updates here
            UpdateIqrValues(retData, CrudModes.Insert.ToString());

            return retData;
        }

        [HttpPut]
        [AntiForgeryValidate]
        [Route("DeleteBasicDropdowns")]
        public bool DeleteBasicDropdowns(BasicDropdown data)
        {
            int id = data.ATRB_LKUP_SID;
            bool results = SafeExecutor(() => _dropdownLib.DeleteBasicDropdowns(id)
                , $"Unable to delete basic dropdown"
            );

            if (results) // if the delete was successful, send to IQR
            {
                UpdateIqrValues(data, CrudModes.Delete.ToString());
            }

            return results;
		}

        //// TODO: Either uncomment the below out or remove it once we re-add Retail Cycle in
        //[Authorize]
        //[Route("GetRetailPull")]
        //[HttpPost]
        //public List<Dropdown> GetRetailPullFromSDM(RetailPullParams filterData)
        //{
        //	return SafeExecutor(() => _dropdownLib.GetRetailPullSDMDropdown(filterData)
        //		, $"Unable to get Retail Pull for product"
        //	);
        //}

        [Authorize]
        [Route("GetCustomersList")]
        public List<Dropdown> GetCustomersList()
        {
            return SafeExecutor(() => _dropdownLib.GetCustomersDropdown()
                , $"Unable to get Sold To Ids for the contract's customer"
            );
        }

        [Authorize]
		[Route("GetSoldToIds/{custId}")]
		public List<Dropdown> GetSoldToIds(int custId)
		{
			return SafeExecutor(() => _dropdownLib.GetSoldToIdDropdown(custId, new List<string>(), new List<string>())
				, $"Unable to get Sold To Ids for the contract's customer"
			);
		}

        [Authorize]
        [Route("GetSoldToIds/{custId}/{geos}")]
        public List<Dropdown> GetSoldToIds(int custId, string geos)
        {
            return SafeExecutor(() => _dropdownLib.GetSoldToIdDropdown(custId, geos.Split(','), null)
                , $"Unable to get Sold To Ids for the contract's customer"
            );
        }

        [Authorize]
        [Route("GetSoldToIds/{custId}/{geos}/{custDiv}")]
        public List<Dropdown> GetSoldToIds(int custId, string geos, string custDiv)
        {
            return SafeExecutor(() => _dropdownLib.GetSoldToIdDropdown(custId, geos.Split(','), custDiv.Split(','))
                , $"Unable to get Sold To Ids for the contract's customer"
            );
        }

        /// <summary>
        /// Gets a list of deal groups given a dealId
        /// </summary>
        /// <param name="dealId">A dealId</param>
        /// <returns>a list of deal groups</returns>
        [Authorize]
		[Route("GetDealGroupDropdown/{dealId}")]
		public List<OverlappingDeal> GetDealGroupDropdown(int dealId)
		{
			return SafeExecutor(() => _dropdownLib.GetDealGroupDropdown(OpDataElementType.WIP_DEAL, new List<int> { dealId })
				, $"Unable to get deal groups"
			);
		}

        [Authorize]
        [Route("GetProgPaymentDropdowns/{atrbCd}")]
        public IEnumerable<BasicDropdown> GetProgPaymentDropdowns(string atrbCd)
        {
            return SafeExecutor(() => _dropdownLib.GetDropdowns(atrbCd).Where(d => d.DROP_DOWN != "Frontend YCS2")
                , $"Unable to get Dropdowns for {atrbCd}"
            );
        }

        [Authorize]
        [Route("GetHybridPaymentDropdowns/{atrbCd}")]
        public IEnumerable<BasicDropdown> GetHybridPaymentDropdowns(string atrbCd)
        {
            return SafeExecutor(() => _dropdownLib.GetDropdowns(atrbCd).Where(d => d.DROP_DOWN.Contains("Frontend") != true )
                , $"Unable to get Dropdowns for {atrbCd}"
            );
        }

        [Authorize]
        [Route("GetConsumptionPayoutDropdowns/{atrbCd}")]
        public IEnumerable<BasicDropdown> GetConsumptionPayoutDropdowns(string atrbCd)
        {
            return SafeExecutor(() => _dropdownLib.GetDropdowns(atrbCd).Where(d => d.DROP_DOWN != "Billings")
                , $"Unable to get Dropdowns for {atrbCd}"
            );
        }

        #region IQR Dropdown additions
        private void UpdateIqrValues(BasicDropdown data, string mode)
        {
            // If no CIM ID and customer is not all customers, don't bother and bail, not an IQR customer
            if (data == null || (data.CUST_CIM_ID == "" && data.CUST_MBR_SID != 1)) return;

            List<string> IqrDropdownAtrbs = new List<string>() {
                AttributeCodes.CONSUMPTION_CUST_RPT_GEO,
                AttributeCodes.CONSUMPTION_CUST_PLATFORM
            };

            // Make the update package and send it to outbound Tenders queue
            if (IqrDropdownAtrbs.Contains(data.ATRB_CD))
            {
                IqrTransferComsumptionData jsonData = new IqrTransferComsumptionData();
                jsonData.header = new IqrTransferComsumptionData.Header();
                jsonData.header.xid = "00000000-0000-0000-0000-000000000000";
                jsonData.header.target_system = "Tender";
                jsonData.header.source_system = "MyDeals";
                jsonData.header.action = "UpdateDropdowns";

                jsonData.recordDetails = new IqrTransferComsumptionData.RecordDetails();
                jsonData.recordDetails.consumptionData = new List<ConsumptionData>();
                ConsumptionData body = new ConsumptionData();
                body.ConsumptionType = data.ATRB_CD;
                body.Value = data.DROP_DOWN;
                body.IsActive = data.ACTV_IND;
                body.Mode = mode;
                body.CIMId = data.CUST_CIM_ID != "" ? data.CUST_CIM_ID : "0";

                jsonData.recordDetails.consumptionData.Add(body);

                List<int> deadIdList = new List<int>() { 0 };

                // Insert into the stage table here - one update item (0 id as dummy item)
                var responseGuid = _jmsDataLib.SaveTendersDataToStage("IQR_CONSUMPTION_DATA", deadIdList, JsonConvert.SerializeObject(jsonData, Formatting.None));
                if (responseGuid != null)
                {
                    SendIQRConsumptionData("IQR_CONSUMPTION_DATA", "N");
                }
            }
        }

        [Authorize]
        [Route("FetchSalesForceDropdownData/{atrbCd}/")]
        [HttpGet]
        public string FetchSalesForceDropdownData(string atrbCd)
        {
            string returnData = "";
            int recordCount = 0;
            List<string> IqrDropdownAtrbs = new List<string>() {
                AttributeCodes.CONSUMPTION_CUST_RPT_GEO,
                AttributeCodes.CONSUMPTION_CUST_PLATFORM
            };

            // Make the update package and send it to outbound Tenders queue
            if (IqrDropdownAtrbs.Contains(atrbCd))
            {
                // calling inactives to get IQR fully up to date with all of our actions except for deletion, no way to chase that.
                IEnumerable<BasicDropdown> blah = SafeExecutor(() => _dropdownLib.GetDropdownsWithInactives(atrbCd)
                    , $"Unable to get Dropdowns for {atrbCd}"
                );

                IqrTransferComsumptionData jsonData = new IqrTransferComsumptionData();
                jsonData.header = new IqrTransferComsumptionData.Header();
                jsonData.header.xid = "00000000-0000-0000-0000-000000000000";
                jsonData.header.target_system = "Tender";
                jsonData.header.source_system = "MyDeals";
                jsonData.header.action = "UpdateDropdowns";

                jsonData.recordDetails = new IqrTransferComsumptionData.RecordDetails();
                jsonData.recordDetails.consumptionData = new List<ConsumptionData>();

                foreach (BasicDropdown dropdown in blah)
                {
                    if (dropdown.CUST_MBR_SID == 1 || dropdown.CUST_CIM_ID != "")
                    {
                        jsonData.recordDetails.consumptionData.Add(
                            new ConsumptionData()
                            {
                                ConsumptionType = dropdown.ATRB_CD,
                                Value = dropdown.DROP_DOWN,
                                IsActive = dropdown.ACTV_IND,
                                // Assuming select in this case.
                                Mode = CrudModes.Select.ToString(),
                                CIMId = dropdown.CUST_CIM_ID != "" ? dropdown.CUST_CIM_ID : "0"
                            });
                        recordCount++;
                    }
                }

                List<int> deadIdList = new List<int>() { 0 };

                if (recordCount > 0)
                {
                    // Insert into the stage table here - one update item (0 id as dummy item)
                    var responseGuid = _jmsDataLib.SaveTendersDataToStage("IQR_CONSUMPTION_DATA", deadIdList, JsonConvert.SerializeObject(jsonData, Formatting.None));
                    if (responseGuid != null)
                    {
                        SendIQRConsumptionData("IQR_CONSUMPTION_DATA", "N");
                        returnData = "There are " + recordCount.ToString() + " records for attribute " + atrbCd + " staged for send to IQR.";
                    }
                }
                else
                {
                    returnData = "There are no existing records for attribute " + atrbCd + " to be staged for send to IQR.";
                }
            }
            else
            {
                returnData = "Attribute " + atrbCd + " data will not be sent to IQR as they do not currently consume this data.";
            }

            return returnData;
        }

        public VistexDFDataResponseObject SendIQRConsumptionData(string packetType, string runMode)
        {
            VistexDFDataResponseObject responseObject = new VistexDFDataResponseObject();
            responseObject.MessageLog = new List<string>();
            try
            {
                responseObject.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, "Controller - GetVistexDealOutBoundData - Called") + Environment.NewLine);
                responseObject = _vistexServiceLib.GetVistexDealOutBoundData(packetType, runMode, responseObject);
                responseObject.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, "Controller - GetVistexDealOutBoundData - Success") + Environment.NewLine);
            }
            catch (Exception ex)
            {
                responseObject.BatchMessage = "Exception: " + ex.Message + "\n" + "Innerexception: " + ex.InnerException;
                responseObject.BatchStatus = "Exception";
                responseObject.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, ex.Message) + Environment.NewLine);
                OpLogPerf.Log($"Thrown from: VistexServiceController - DEALS - Vistex SAP PO Error: {ex.Message}|Innerexception: {ex.InnerException} | Stack Trace{ex.StackTrace}", LogCategory.Error);
            }
            return responseObject;
        }


        //This API call is for to Push consumption data , if any failure happend while sending the payload to IQR 
        [Authorize]
        [Route("SendIQRConsumptionDataManual/{packetType}/{runMode}")] //VTX_OBJ: CLAIM DATA
        [HttpPost]
        public VistexDFDataResponseObject SendIQRConsumptionDataManual(string packetType, string runMode)
        {
            VistexDFDataResponseObject responseObject = new VistexDFDataResponseObject();
            responseObject.MessageLog = new List<string>();
            try
            {
                responseObject.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, "Controller - GetVistexDealOutBoundData - Called") + Environment.NewLine);
                responseObject = _vistexServiceLib.GetVistexDealOutBoundData(packetType, runMode, responseObject);
                responseObject.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, "Controller - GetVistexDealOutBoundData - Success") + Environment.NewLine);
            }
            catch (Exception ex)
            {
                responseObject.BatchMessage = "Exception: " + ex.Message + "\n" + "Innerexception: " + ex.InnerException;
                responseObject.BatchStatus = "Exception";
                responseObject.MessageLog.Add(String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, ex.Message) + Environment.NewLine);
                OpLogPerf.Log($"Thrown from: VistexServiceController - DEALS - Vistex SAP PO Error: {ex.Message}|Innerexception: {ex.InnerException} | Stack Trace{ex.StackTrace}", LogCategory.Error);
            }
            return responseObject;
        }
        #endregion IQR Dropdown additions

    }
}
