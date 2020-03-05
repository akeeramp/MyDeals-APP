extern alias opaqueTools;
using System;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using System.Collections.Generic;
using Intel.MyDeals.Entities;
using Newtonsoft.Json;

namespace Intel.MyDeals.BusinessLogic
{
    public class IntegrationLib: IIntegrationLib
    {
        private readonly IJmsDataLib _jmsDataLib; // change out later to IntegrationDataLib

        public IntegrationLib(IJmsDataLib jmsDataLib)
        {
            _jmsDataLib = jmsDataLib;
        }

        public Guid SaveSalesForceTenderData(TenderTransferRootObject jsonDataPacket)
        {
            Guid myGuid = Guid.Empty;

            List<int> deadIdList = new List<int>() { -100 };

            string jsonData = JsonConvert.SerializeObject(jsonDataPacket, Formatting.Indented);

            // Insert into the stage table here - one deal item (-100 id as new item), one deal data object
            myGuid = _jmsDataLib.SaveTendersDataToStage("TENDER_DEALS", deadIdList, jsonData);

            return myGuid;
        }

        public Boolean SaveVistexResponseData(VistexResponseMsg jsonDataPacket)
        {
            // TODO: get the response message, turn it into something to pass Kannan, then call out last status change to close out whole transaction
            //foreach deal item - strip deal data and place into list of deal / err pairs - Kannan to provide new type
            // Insert into the stage table here - one deal item (-100 id as new item), one deal data object
            //return _jmsDataLib.SaveVistexResponseData(jsonData);
            return false;
        }


    }
}
