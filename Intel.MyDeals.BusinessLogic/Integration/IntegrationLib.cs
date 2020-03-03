extern alias opaqueTools;
using Intel.MyDeals.DataLibrary;
using System;
using System.Data;
using opaqueTools.Intel.Opaque.Tools;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using System.Collections;
using System.Collections.Generic;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using Intel.Opaque.DBAccess;
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

        public void IntegrationTest()
        {
            //string m_idsid = "mhtippin";

            JmsDataLib jmsConnection = new JmsDataLib();
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


    }
}
