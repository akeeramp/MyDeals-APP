using System;
using System.Collections.Generic;
using System.Data;
using System.Xml.Linq;
using Intel.MyDeals.DataLibrary.JMS;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.DataLibrary
{
    public class JmsDataLib
    {
        private string _mIdsid;
        private string jmsServer;
        private string jmsQueue;
        private string jmsUID;
        private string jmsPWD;

        private JmsQueue _objJmsQueueRequest;

        // This is all communications to our DB as well as SAP
        public JmsDataLib()
        {
            _mIdsid = OpUserStack.MyOpUserToken.Usr.Idsid;

            Dictionary<string, string> jmsEnvs = DataLibrary.GetEnvConfigs();
            jmsServer = jmsEnvs.ContainsKey("jmsServer") ? jmsEnvs["jmsServer"] : "";
            jmsQueue = jmsEnvs.ContainsKey("jmsQueue") ? jmsEnvs["jmsQueue"] : "";
            jmsUID = jmsEnvs.ContainsKey("jmsUID") ? jmsEnvs["jmsUID"] : "";
            jmsPWD = jmsEnvs.ContainsKey("jmsPWD") ? jmsEnvs["jmsPWD"] : "";
        }

        public string OpenConnectionToJmsQueue()
        {
            string strError = "";
            try
            {
                _objJmsQueueRequest = new JmsQueue(jmsServer, jmsUID, jmsPWD, jmsQueue);

                //clsUtility.LogSQL(m_Idsid, "JMSQueue - Opening connection", false);
                _objJmsQueueRequest.OpenQueueConnection();
                //clsUtility.LogSQL(m_Idsid, "JMSQueue - Connection Opened", false);

            }
            catch (Exception eX)
            {
                strError = eX.Message;
                //clsUtility.LogSQL(m_Idsid, "JMSQueue Error Opening connection : " + strError, false);
            }

            return strError;
        }

        public string ReadMessages()
        {
            string strError = "";
            try
            {
                return _objJmsQueueRequest.GetAllMessgae();
            }
            catch (Exception eX)
            {
                strError = eX.Message;
            }
            return strError;
        }

        string SendDataToJmsQueue(string strData)
        {
            string strError = "";
            try
            {
                //clsUtility.LogSQL(m_Idsid, "JMSQueue - Sending data to SAP", false);
                _objJmsQueueRequest.SendData(strData);
                //clsUtility.LogSQL(m_Idsid, "JMSQueue - Completed sending data to SAP", false);
            }
            catch (Exception eX)
            {
                strError = eX.Message;
                //clsUtility.LogSQL(m_Idsid, "JMSQueue Error Sending Data : " + strError, false);
            }
            return strError;
        }

        public string CloseConnectionToJmsQueue()
        {
            string strError = "";
            try
            {
                //clsUtility.LogSQL(m_Idsid, "JMSQueue - Closing connection", false);
                _objJmsQueueRequest.CloseQueueConnection();
            }
            catch (Exception eX)
            {
                strError = eX.Message;
                //clsUtility.LogSQL(m_Idsid, "JMSQueue Error Closing connection : " + strError, false);
            }
            return strError;
        }

        // TODO - add in DB side - gather data and load XML object.  Straight DB call here
        // TODO - Add in build XML here

        public DataTable GetData()
        {
            DataTable dt = new DataTable();
            dt.Clear();
            dt.Columns.Add("AMT"); //CHNL_CD, CLNT_CD, CRE_DT, CRE_IDSID, CUST_ID, DEAL_ID, EXPR_DT, JMS_GRP_ID, JMS_GRP_LN_ITM_ID, JMS_ID, JMS_LN_ITM_STS_CD, 
            dt.Columns.Add("CUST_GRP_CD"); //LAST_MOD_DT, LAST_MOD_IDSID, 
            dt.Columns.Add("DUTY_EXCLD_CD");
            dt.Columns.Add("FR_DT");
            dt.Columns.Add("TO_DT");
            dt.Columns.Add("FRCST_ALTR_ID");
            dt.Columns.Add("MTRL_ID");
            dt.Columns.Add("SAP_ERR_MSG");
            dt.Columns.Add("SAP_SLS_ORG");
            dt.Columns.Add("SOLD_TO_ID");
            dt.Columns.Add("SEQUENCE_NO");
            DataRow ravi = dt.NewRow();
            ravi["AMT"] = "314";
            ravi["CUST_GRP_CD"] = "EZ";
            ravi["SAP_SLS_ORG"] = "EU01";
            ravi["FR_DT"] = "20170124"; // date format as SAP expects YYYMMDD
            ravi["TO_DT"] = "20170125"; // date format as SAP expects YYYMMDD
            ravi["DUTY_EXCLD_CD"] = "";
            ravi["FRCST_ALTR_ID"] = "CM8064401831400";
            ravi["SOLD_TO_ID"] = "";
            ravi["SEQUENCE_NO"] = "DRQ00000083100020000000001"; // Known working sample DRQ00000031950010000000001 
            dt.Rows.Add(ravi);

            DataRow ravi2 = dt.NewRow();
            ravi2["AMT"] = "108";
            ravi2["CUST_GRP_CD"] = "EZ";
            ravi2["SAP_SLS_ORG"] = "EU01";
            ravi2["FR_DT"] = "20170110"; // date format as SAP expects YYYMMDD
            ravi2["TO_DT"] = "20170116"; // date format as SAP expects YYYMMDD
            ravi2["DUTY_EXCLD_CD"] = "Z";
            ravi2["FRCST_ALTR_ID"] = "SSDSC2BB480G401";
            ravi2["SOLD_TO_ID"] = "";
            ravi2["SEQUENCE_NO"] = "DRQ00000083100020000000002"; // Known working sample DRQ00000031950010000000001 
            dt.Rows.Add(ravi2);

            return dt;
        }

        public string MakeXml(DataTable dt)
        {
            //XNamespace ns = "http://www.intel.com/xi/OrderToCash/Pricing1.1";
            //XAttribute prefix = new XAttribute(XNamespace.Xmlns + "ns0", ns);
            //XAttribute feedtype = new XAttribute("FeedType", "IDMS_Pricing_Uploads");
            //XAttribute transactionGuid = new XAttribute("GUID", new Guid());
            //XAttribute numRecords = new XAttribute("NumberOfRecords", 1);

            //var doc = new XDocument(
            //    new XDeclaration("1.0", "UTF-8", "yes"),
            //    new XElement(ns + "PricingData", prefix, feedtype, transactionGuid));

            // Build Pricing Data inner XML
            XElement pricingData = new XElement("PricingData");

            // Build Header
            XElement header = new XElement("header",
                new XElement("toolID", "DRQ"),
                new XElement("conditionType", "YCS2"),
                new XElement("operation", "U")
                );

            // Build Items
            List<XElement> itemsList = new List<XElement>();
            foreach (DataRow dataRow in dt.Rows)
            {
                XElement newItem = new XElement("item");

                newItem.Add(new XElement("salesOrg", dataRow["SAP_SLS_ORG"]));
                newItem.Add(new XElement("custGroup", dataRow["CUST_GRP_CD"]));
                newItem.Add(new XElement("condValue", dataRow["AMT"]));
                newItem.Add(new XElement("fromDate", dataRow["FR_DT"]));
                newItem.Add(new XElement("toDate", dataRow["TO_DT"]));
                newItem.Add(new XElement("exclusionInd", dataRow["DUTY_EXCLD_CD"]));
                newItem.Add(new XElement("prodHier", dataRow["FRCST_ALTR_ID"]));
                newItem.Add(new XElement("customer", dataRow["SOLD_TO_ID"]));
                newItem.Add(new XElement("sequenceNo", dataRow["SEQUENCE_NO"]));

                itemsList.Add(newItem);
            }

            // Append to PricingData
            pricingData.Add(header);
            foreach (XElement xElement in itemsList)
            {
                pricingData.Add(xElement);
            }

            // Finalize the XML Package
            XNamespace ns = "http://www.intel.com/xi/OrderToCash/Pricing1.1";
            XAttribute prefix = new XAttribute(XNamespace.Xmlns + "ns0", ns);
            XAttribute feedtype = new XAttribute("FeedType", "IDMS_Pricing_Uploads");
            XAttribute transactionGuid = new XAttribute("GUID", new Guid());
            XAttribute numRecords = new XAttribute("NumberOfRecords", dt.Rows.Count);

            var doc = new XDocument(
                new XDeclaration("1.0", "UTF-8", "yes"),
                new XElement(ns + "PricingData", prefix, feedtype, transactionGuid, numRecords));

            doc.Root?.Add(pricingData);

            return doc.ToString(); // If you _must_ have a string

            //< ns0 : PricingData xmlns: ns0 = "http://www.intel.com/xi/OrderToCash/Pricing1.1" >
            //    < PricingData >
            //    < header >
            //    < toolID > TPM </ toolID >
            //    < conditionType > YMS2 </ conditionType >
            //    < operation > U </ operation >
            //    </ header >
            //    < item >
            //    < sequenceNo > TPM00000082100020000000001 </ sequenceNo >
            //    < materialNo />
            //    < plant />
            //    < salesOrg />
            //    < custGroup />
            //    < dChannel > 01 </ dChannel >
            //    < customer />
            //    < docCurrency />
            //    < condValue > 65.00 </ condValue >
            //    < fromDate > 20161108 </ fromDate >
            //    < toDate > 99991231 </ toDate >
            //    < exclusionInd > Y </ exclusionInd >
            //    < prodHier > LAD201GLY2A </ prodHier >
            //    < shipToParty />
            //    < destCountry />
            //    < materialGrp />
            //    < incoterms />
            //    < expirtyDate />
            //    < soldToParty />
            //    < materialType />
            //    < paymentTerms />
            //    < prodGroup />
            //    < paymentTerms2 />
            //    < depCountry />
            //    < route />
            //    </ item >
            //    </ PricingData >
            //    </ ns0:PricingData >

        }


    }
}
