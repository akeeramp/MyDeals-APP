extern alias opaqueTools; 
using System;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using Intel.Opaque.Data;

namespace Intel.MyDeals.BusinessLogic
{
    public class BulkPriceUpdateLib: IBulkPriceUpdateLib
    {
        private readonly IJmsDataLib _jmsDataLib; // Used for save process - leveraging existing save routes

        public BulkPriceUpdateLib(IJmsDataLib jmsDataLib)
        {
            _jmsDataLib = jmsDataLib;
        }

        public BulkPriceUpdateRecordsList TestMyGuid(BulkPriceUpdateRecordsList myList)
        {
            foreach (BulkPriceUpdateRecordsList.BulkPriceUpdateRecord myRecord in myList.bulkPriceUpdateRecord)
            {
                bool test = UpdateDealFromPriceUpdateRecord(myRecord);
            }

            return myList;
        }

        private void TagSaveActionsAndBatches(MyDealsData myDealsData)
        {
            foreach (OpDataElementType objKey in myDealsData.Keys)
            {
                if (myDealsData[objKey].GetChanges().AllDataElements.Any())
                {
                    if (objKey != OpDataElementType.WIP_DEAL)// To Add save action for Non-WIP packets
                    {
                        myDealsData[objKey].AddSaveActions();
                    }
                    if (objKey == OpDataElementType.PRC_ST)// Append Audit Actions for Pricing Startegy
                    {
                        List<int> auditIds = myDealsData[objKey].AllDataCollectors.Where(d => d.DcID > 0).Select(d => d.DcID).ToList();
                        if (auditIds.Any()) myDealsData[objKey].AddAuditActions(auditIds);
                    }
                    if (objKey == OpDataElementType.WIP_DEAL) // Execute normal save Actions with Attributes for additionl Sync
                    {
                        List<int> possibleIds = myDealsData[objKey].AllDataCollectors.Where(d => d.DcID > 0).Select(d => d.DcID).ToList();
                        myDealsData[objKey].AddSaveActions(null, possibleIds, DataCollections.GetAttributeData());
                    }
                }
            }
            myDealsData.EnsureBatchIDs();
        }

        private void UpdateDeValue(IOpDataElement myDe, string myValue)
        {
            // Only update if passed value contains something and we find a valid DE Element
            if (!String.IsNullOrEmpty(myValue) && myDe != null && myDe.AtrbValue.ToString() != myValue.ToString())
            {
                myDe.AtrbValue = myValue;
            }
        }

        private bool UpdateDealFromPriceUpdateRecord(BulkPriceUpdateRecordsList.BulkPriceUpdateRecord bulkPriceUpdateRecord)
        {
            int dealId = bulkPriceUpdateRecord.DealId;

            // fetch objects - if it doesn't find the deal or the deal is an IQR deal, bail out of setting values
            List<int> passedDealIds = new List<int>() { dealId };
            MyDealsData myDealsData = OpDataElementType.WIP_DEAL.GetByIDs(passedDealIds, new List<OpDataElementType> { OpDataElementType.CNTRCT, OpDataElementType.PRC_ST, OpDataElementType.PRC_TBL, OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL }).FillInHolesFromAtrbTemplate(); // Make the save object .FillInHolesFromAtrbTemplate()

            if (!myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.Any())
            {
                bulkPriceUpdateRecord.ValidationMessages += "Deal " + dealId + " was not found in My Deals.  Please contact My Deals Support.";
                return false; // Pre-emptive stop for this record attempt
            }

            if (myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElementValue(AttributeCodes.SALESFORCE_ID) != "") // IF SF DEAL - DONT ALLOW EDIT AND BAIL
            {
                bulkPriceUpdateRecord.ValidationMessages += "Deal " + dealId + " is an IQR deal.  Edits are not allowed for these deals.";
                return false; // Pre-emptive stop for this record attempt
            }

            int custId = Int32.Parse(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElementValue(AttributeCodes.CUST_MBR_SID));
            int cntrctId = myDealsData[OpDataElementType.CNTRCT].Data.Keys.FirstOrDefault();
            int psId = myDealsData[OpDataElementType.PRC_ST].Data.Keys.FirstOrDefault();
            int ptId = myDealsData[OpDataElementType.PRC_TBL].Data.Keys.FirstOrDefault();
            int ptrId = myDealsData[OpDataElementType.PRC_TBL_ROW].Data.Keys.FirstOrDefault(); // Can do this because pulled deal tree from WIP up, so only 1 parent table row

            // Make field updates per record item
            string dealDesc = bulkPriceUpdateRecord.DealDesc;
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[ptrId].GetDataElement(AttributeCodes.DEAL_DESC), dealDesc);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.DEAL_DESC), dealDesc);

            // ECAP Prices are potentially dimensional, so operate according to needs
            if (!string.IsNullOrEmpty(bulkPriceUpdateRecord.EcapPrice))
            {
                string ecapPrice = bulkPriceUpdateRecord.EcapPrice; // Special case because kits will use dimensional
                string dealType = myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElementValue(AttributeCodes.OBJ_SET_TYPE_CD);
                if (dealType == "ECAP") // One price, only deal side is dimensional
                {
                    UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[ptrId].GetDataElement(AttributeCodes.ECAP_PRICE), ecapPrice);
                    UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElementsWhere(de => de.AtrbCd == AttributeCodes.ECAP_PRICE && de.DimKey.HashPairs == "20:0").FirstOrDefault(), ecapPrice);
                }
                else if (dealType == "KIT")
                {
                    UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[ptrId].GetDataElementsWhere(de => de.AtrbCd == AttributeCodes.ECAP_PRICE && de.DimKey.HashPairs == "20:0").FirstOrDefault(), ecapPrice);
                    UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElementsWhere(de => de.AtrbCd == AttributeCodes.ECAP_PRICE && de.DimKey.HashPairs == "20:0").FirstOrDefault(), ecapPrice);
                    // append other possible levels for KIT here
                }
            }

            string volume = bulkPriceUpdateRecord.Volume;
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[ptrId].GetDataElement(AttributeCodes.VOLUME), volume);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.VOLUME), volume);

            if (!string.IsNullOrEmpty(bulkPriceUpdateRecord.DealStartDate))
            {
                DateTime dealStartDate = DateTime.ParseExact(bulkPriceUpdateRecord.DealStartDate, "yyyy-MM-dd", null); // Assuming that UI sends US formatted dates
                UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[ptrId].GetDataElement(AttributeCodes.START_DT), dealStartDate.ToString("MM/dd/yyyy"));
                UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.START_DT), dealStartDate.ToString("MM/dd/yyyy"));
                UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.ON_ADD_DT), dealStartDate.ToString("MM/dd/yyyy"));
                if (dealStartDate < DateTime.Now) // If start date is in past, set default backdate reason
                {
                    UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.BACK_DATE_RSN), "Contract Negotiation Delay");
                }
            }

            if (!string.IsNullOrEmpty(bulkPriceUpdateRecord.DealEndDate))
            {
                DateTime dealEndDate = DateTime.ParseExact(bulkPriceUpdateRecord.DealEndDate, "yyyy-MM-dd", null); // Assuming that UI sends US formatted dates
                UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[ptrId].GetDataElement(AttributeCodes.END_DT), dealEndDate.ToString("MM/dd/yyyy"));
                UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.END_DT), dealEndDate.ToString("MM/dd/yyyy"));
            }

            string projectName = bulkPriceUpdateRecord.ProjectName;
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[ptrId].GetDataElement(AttributeCodes.QLTR_PROJECT), projectName);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.QLTR_PROJECT), projectName);

            if (!string.IsNullOrEmpty(bulkPriceUpdateRecord.BillingsStartDate))
            {
                DateTime billingStartDate = DateTime.ParseExact(bulkPriceUpdateRecord.BillingsStartDate, "yyyy-MM-dd", null); // Assuming that UI sends US formatted dates
                UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.REBATE_BILLING_START), billingStartDate.ToString("MM/dd/yyyy"));
            }

            if (!string.IsNullOrEmpty(bulkPriceUpdateRecord.BillingsEndDate))
            {
                DateTime billingEndDate = DateTime.ParseExact(bulkPriceUpdateRecord.BillingsEndDate, "yyyy-MM-dd", null); // Assuming that UI sends US formatted dates
                UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.REBATE_BILLING_END), billingEndDate.ToString("MM/dd/yyyy"));
            }

            if (!string.IsNullOrEmpty(bulkPriceUpdateRecord.TrackerEffectiveStartDate)) 
            {
                // RedealNoEarlierThenPrevious check the date entered by user and raises validation error is needed.  Might wish to put additional safety checks ehre later if needed.
                DateTime trackerEffectiveStartDate = DateTime.ParseExact(bulkPriceUpdateRecord.TrackerEffectiveStartDate, "yyyy-MM-dd", null); // Assuming that UI sends US formatted dates
                UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.LAST_REDEAL_DT), trackerEffectiveStartDate.ToString("MM/dd/yyyy"));
                UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.LAST_REDEAL_BY), OpUserStack.MyOpUserToken.Usr.WWID.ToString());
            }

            string additionalTermsAndConditions = bulkPriceUpdateRecord.AdditionalTermsAndConditions;
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[ptrId].GetDataElement(AttributeCodes.TERMS), additionalTermsAndConditions);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.TERMS), additionalTermsAndConditions);

            // Clear out system comments to all objects so that updates don't stack comments incorrectly
            //UpdateDeValue(myDealsData[OpDataElementType.CNTRCT].Data[folioId].GetDataElement(AttributeCodes.SYS_COMMENTS), ""); // Removed since we actually don't need to do this at CNTRCT
            UpdateDeValue(myDealsData[OpDataElementType.PRC_ST].Data[psId].GetDataElement(AttributeCodes.SYS_COMMENTS), "");
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL].Data[ptId].GetDataElement(AttributeCodes.SYS_COMMENTS), "");
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[ptrId].GetDataElement(AttributeCodes.SYS_COMMENTS), "");
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.SYS_COMMENTS), "");


            // Validate and Save - Using this to allow us to dive right into rules engines
            SavePacket savePacket = new SavePacket()
            {
                MyContractToken = new ContractToken("ContractToken Created - SaveFullContract")
                {
                    CustId = custId,
                    ContractId = custId
                },
                ValidateIds = new List<int> { dealId }
            };

            myDealsData.ValidationApplyRules(savePacket); //myDealsData.ApplyRules(MyRulesTrigger.OnValidate) - myDealsData.ValidationApplyRules(savePacket)
            foreach (OpDataElementType dpKey in myDealsData.Keys) // dpKey is like OpDataElementType.WIP_DEAL
            {
                foreach (OpDataCollector dc in myDealsData[dpKey].AllDataCollectors)
                {
                    foreach (OpMsg opMsg in dc.Message.Messages) // If validation errors, log and skip to next
                    {
                        if (opMsg.Message != "Validation Errors detected in deal") bulkPriceUpdateRecord.ValidationMessages += bulkPriceUpdateRecord.ValidationMessages.Length == 0 ? 
                                "[" + dpKey + "] " + opMsg.Message : 
                                "; " + "[" + dpKey + "] " + opMsg.Message;
                    }
                }
            }

            // SAVE
            ContractToken saveContractToken = new ContractToken("ContractToken Created - Save IRQ Deal Updates")
            {
                CustId = custId,
                ContractId = custId
            };

            TagSaveActionsAndBatches(myDealsData); // Add needed save actions and batch IDs for the save
            MyDealsData saveResponse = myDealsData.Save(saveContractToken);
            // SAVE COMPLETE

            if (myDealsData[OpDataElementType.WIP_DEAL].Actions.Any() && !saveResponse.Keys.Any())
            {
                bulkPriceUpdateRecord.UpdateStatus = "Failed Save";
                return false; // Pre-emptive continue to next object
            }
            bulkPriceUpdateRecord.UpdateStatus = "Successful Save";

            // Check returned data for current stage information
            string psWfStage = saveResponse.ContainsKey(OpDataElementType.PRC_ST) ?
                saveResponse[OpDataElementType.PRC_ST].Data[psId].GetDataElementValue(AttributeCodes.WF_STG_CD) :
                myDealsData[OpDataElementType.PRC_ST].Data[psId].GetDataElementValue(AttributeCodes.WF_STG_CD);
            string wipWfStage = saveResponse.ContainsKey(OpDataElementType.WIP_DEAL) ?
                saveResponse[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElementValue(AttributeCodes.WF_STG_CD) :
                myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElementValue(AttributeCodes.WF_STG_CD);

            bulkPriceUpdateRecord.DealStage = wipWfStage == WorkFlowStages.Draft ? psWfStage : wipWfStage;

            return true;
        }


    }
}
