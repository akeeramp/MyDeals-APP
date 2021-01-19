using System;
using System.Globalization;
using System.Linq;
using System.Xml.Linq;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.DataLibrary
{
    public partial class QuoteLetter : Telerik.Reporting.Report
    {
        private XDocument source;
        public QuoteLetter()
        {
            InitializeComponent();

            NeedDataSource += Report3NeedDataSource;
        }

        public QuoteLetter(string xml, string content0, string content1, int dealId)
        {
            InitializeComponent();
            ProcessData(xml, content0, content1, dealId);
        }

        void Report3NeedDataSource(object sender, EventArgs e)
        {
            ProcessData();
        }

        string GetValue(string key)
        {
            // This fixes basic issues on getting the initial value
            string retVal = source.Descendants("PARAMETERS").Select(el => (el.Element(key) == null) ? string.Empty : ((string)el.Element(key)).Replace("\\n", "<br />")).FirstOrDefault();
            if (retVal.Contains("&") && !retVal.Contains("&amp;")) // stand alone &s need to be replaced
            {
                retVal = retVal.Replace("&", "&amp;");
            }
            // These don't contain themselves in the replacement code, so they can go without the check like &s.  Looks like Quote HTML replacement changes escaped 
            // chars to HTML, but &s still kills output.  Others replaced back to expected just in case.
            retVal = retVal.Replace("<", "&lt;");
            retVal = retVal.Replace(">", "&gt;");
            retVal = retVal.Replace("'", "&apos;");
            retVal = retVal.Replace("\"", "&quot;");
            retVal = retVal.Replace("/", "&#x2F;");
            return retVal;
        }
        string GetTrackerValue(string key)
        {
            var val = GetValue(key);

            if (!string.IsNullOrEmpty(val) && val.IndexOf("*") < 0) return val;

            return GetValue("RebateType").ToUpper() == "TENDER" ? "Bid Pending" : "In Negotiation";
        }
        string GetMoneyValue(string key)
        {
            var val = GetValue(key);
            if (!string.IsNullOrEmpty(val))
            {
                val = Convert.ToDecimal(val).ToString("C2");
            }
            return val;
        }

        ////function not used with removal of kit discount
        //string MoneyMult(string moneyValue, string qty)
        //{
        //    var val = "$0";
        //    if (string.IsNullOrEmpty(qty))
        //    {
        //        qty = "1";
        //    }
        //    if (!string.IsNullOrEmpty(moneyValue))
        //    {
        //        val = (decimal.Parse(moneyValue, NumberStyles.AllowCurrencySymbol | NumberStyles.Number) * decimal.Parse(qty)).ToString("C2");
        //    }
        //    return val;
        //}

        ////function not used with removal of kit discount
        //string MoneyAdd(string moneyValue1, string moneyValue2)
        //{
        //    var val = moneyValue1;
        //    if (!(string.IsNullOrEmpty(moneyValue1) || string.IsNullOrEmpty(moneyValue2)))
        //    {
        //        val = (decimal.Parse(moneyValue1, NumberStyles.AllowCurrencySymbol | NumberStyles.Number) + decimal.Parse(moneyValue2, NumberStyles.AllowCurrencySymbol | NumberStyles.Number)).ToString("C2");
        //    }
        //    return val;
        //}

        ////function not used with removal of kit discount
        //string MoneySub(string moneyValue1, string moneyValue2)
        //{
        //    var val = moneyValue1;
        //    if (!(string.IsNullOrEmpty(moneyValue1) || string.IsNullOrEmpty(moneyValue2)))
        //    {
        //        val = (decimal.Parse(moneyValue1, NumberStyles.AllowCurrencySymbol | NumberStyles.Number) - decimal.Parse(moneyValue2, NumberStyles.AllowCurrencySymbol | NumberStyles.Number)).ToString("C2");
        //    }
        //    return val;
        //}

        static string EscapeSpecialChars(string xml)
        {
            // This fixes final values - there is some repeat from initial values.  Stand along & are removed here since they also caught &apos;
            xml = xml.Replace("&amp;", "and");
            //xml = xml.Replace("&", "and");
            xml = xml.Replace("<", "&lt;");
            xml = xml.Replace(">", "&gt;");
            xml = xml.Replace("'", "&apos;");
            xml = xml.Replace("\"", "&quot;");
            xml = xml.Replace("{", "(");
            xml = xml.Replace("}", ")");
            xml = xml.Replace("+", "_");
            return xml;
        }

        void ProcessData(string xml, string content0, string content1, int dealId)
        {
            //xml = "<PARAMETERS><Customer>Hyve Solutions Corp</Customer><EndCustomer></EndCustomer><StartDate>01/01/2021</StartDate><CBllgStart>12/12/8888</CBllgStart><CBllgEnd>12/12/9999</CBllgEnd><EndDate>12/31/2021</EndDate><OnAddDate>01/01/2021</OnAddDate><Quantity>999999999</Quantity><ProgramPayment>FRONTEND</ProgramPayment><RebateType>MCP</RebateType><PProdDesc>CD8067303694600</PProdDesc><PProdCat>SvrWS</PProdCat><PECAPPrice>7628</PECAPPrice><KitCheck>N</KitCheck><QltrProject>BlahA</QltrProject><Terms>This Agreement constitutes the entire understanding between Intel and Customer with regard to the topics covered in this Agreement and supersedes all prior agreements, communications, representation and discussions between Intel and Customer (whether written or oral).  Any contrary or conflicting term is rejected.  Any modification or amendment to this Agreement must be in writing and accepted through Intels Click-to-Accept web interface or signed by authorized representatives of both Intel and Customer</Terms><WfStgCd>Pending</WfStgCd><PsWfStgCd>Pending</PsWfStgCd><PayoutBasedOn>Billings</PayoutBasedOn></PARAMETERS>";
            source = XDocument.Parse(xml);

            MainContent.Value = content0.Replace("CUSTOMERNAMEGOESHERE", EscapeSpecialChars(GetValue("Customer")));
            MainContent1.Value = content1;

            htmlTextBox4.Value = "Deal #" + dealId;
            txtEndCustomer.Value = EscapeSpecialChars(GetValue("EndCustomer"));
            txtStartDate.Value = GetValue("StartDate");
            txtEndDate.Value = GetValue("EndDate");
            txtECAPType.Value = GetValue("RebateType");
            txtQuantity.Value = GetValue("Quantity"); 
            txtProgramPayment.Value = GetValue("ProgramPayment");
            txtBasedOn.Value = GetValue("PayoutBasedOn");

            string stage = GetValue("WfStgCd");
            string psStage = GetValue("PsWfStgCd");
            string tracker = GetValue("PTracker");
            txtStatus.Value = stage;
            //txtStatus.Value = tracker == "" ? WorkFlowStages.Offer : WorkFlowStages.Active;
            //txtStatus.Value = stage == "Draft" ? psStage : stage;

            txtK1Ecap.Value = GetMoneyValue("KECAPPrice");

            txtConsumptionBillingStart.Value = GetValue("CBllgStart");
            txtConsumptionBillingEnd.Value = GetValue("CBllgEnd");

            //txtK2Ecap.Value = GetMoneyValue("SKECAPPrice");

            txtP1Ecap.Value = GetMoneyValue("PECAPPrice");
            txtP1ProdName.Value = GetValue("PProdDesc");
            txtP1ProdSeg.Value = GetValue("PProdCat");
            txtQtyP1.Value = GetValue("PQty");

            txtS1Ecap.Value = GetMoneyValue("S1ECAPPrice");
            txtS1ProdName.Value = GetValue("S1ProdDesc");
            txtS1ProdSeg.Value = GetValue("S1ProdCat");
            txtQtyS1.Value = GetValue("S1Qty");

            txtS2Ecap.Value = GetMoneyValue("S2ECAPPrice");
            txtS2ProdName.Value = GetValue("S2ProdDesc");
            txtS2ProdSeg.Value = GetValue("S2ProdCat");
            txtQtyS2.Value = GetValue("S2Qty");

            txtS3Ecap.Value = GetMoneyValue("S3ECAPPrice");
            txtS3ProdName.Value = GetValue("S3ProdDesc");
            txtS3ProdSeg.Value = GetValue("S3ProdCat");
            txtQtyS3.Value = GetValue("S3Qty");

            txtS4Ecap.Value = GetMoneyValue("S4ECAPPrice");
            txtS4ProdName.Value = GetValue("S4ProdDesc");
            txtS4ProdSeg.Value = GetValue("S4ProdCat");
            txtQtyS4.Value = GetValue("S4Qty");

            txtS5Ecap.Value = GetMoneyValue("S5ECAPPrice");
            txtS5ProdName.Value = GetValue("S5ProdDesc");
            txtS5ProdSeg.Value = GetValue("S5ProdCat");
            txtQtyS5.Value = GetValue("S5Qty");

            txtS6Ecap.Value = GetMoneyValue("S6ECAPPrice");
            txtS6ProdName.Value = GetValue("S6ProdDesc");
            txtS6ProdSeg.Value = GetValue("S6ProdCat");
            txtQtyS6.Value = GetValue("S6Qty");

            txtS7Ecap.Value = GetMoneyValue("S7ECAPPrice");
            txtS7ProdName.Value = GetValue("S7ProdDesc");
            txtS7ProdSeg.Value = GetValue("S7ProdCat");
            txtQtyS7.Value = GetValue("S7Qty");

            txtS8Ecap.Value = GetMoneyValue("S8ECAPPrice");
            txtS8ProdName.Value = GetValue("S8ProdDesc");
            txtS8ProdSeg.Value = GetValue("S8ProdCat");
            txtQtyS8.Value = GetValue("S8Qty");

            txtS9Ecap.Value = GetMoneyValue("S9ECAPPrice");
            txtS9ProdName.Value = GetValue("S9ProdDesc");
            txtS9ProdSeg.Value = GetValue("S9ProdCat");
            txtQtyS9.Value = GetValue("S9Qty");

            ttlKitName.Value = "Kit Name: " + GetValue("KitName");

            ////calculate kit discount - Formula: (Sum of Component ECAPs * respective QTYs) - Kit ECAP = Kit Rebate Bundle Discount
            //txtK1DiscEcap.Value = "$0";
            //txtK1DiscEcap.Value = MoneyAdd(txtK1DiscEcap.Value, MoneyMult(txtP1Ecap.Value, txtQtyP1.Value));
            //txtK1DiscEcap.Value = MoneyAdd(txtK1DiscEcap.Value, MoneyMult(txtS1Ecap.Value, txtQtyS1.Value));
            //txtK1DiscEcap.Value = MoneyAdd(txtK1DiscEcap.Value, MoneyMult(txtS2Ecap.Value, txtQtyS2.Value));
            //txtK1DiscEcap.Value = MoneyAdd(txtK1DiscEcap.Value, MoneyMult(txtS3Ecap.Value, txtQtyS3.Value));
            //txtK1DiscEcap.Value = MoneyAdd(txtK1DiscEcap.Value, MoneyMult(txtS4Ecap.Value, txtQtyS4.Value));
            //txtK1DiscEcap.Value = MoneyAdd(txtK1DiscEcap.Value, MoneyMult(txtS5Ecap.Value, txtQtyS5.Value));
            //txtK1DiscEcap.Value = MoneyAdd(txtK1DiscEcap.Value, MoneyMult(txtS6Ecap.Value, txtQtyS6.Value));
            //txtK1DiscEcap.Value = MoneyAdd(txtK1DiscEcap.Value, MoneyMult(txtS7Ecap.Value, txtQtyS7.Value));
            //txtK1DiscEcap.Value = MoneyAdd(txtK1DiscEcap.Value, MoneyMult(txtS8Ecap.Value, txtQtyS8.Value));
            //txtK1DiscEcap.Value = MoneyAdd(txtK1DiscEcap.Value, MoneyMult(txtS9Ecap.Value, txtQtyS9.Value));
            //txtK1DiscEcap.Value = MoneySub(txtK1DiscEcap.Value, txtK1Ecap.Value);
            //txtK1DiscEcap.Value = txtK1DiscEcap.Value;

            // T's and C's
            txtProject.Value = EscapeSpecialChars(GetValue("QltrProject"));
            txtTerms.Value = EscapeSpecialChars(GetValue("Terms"));


            // Start hiding rows

            if (GetValue("KitCheck") == "N")
            {
                lblP1.Value = " ";
                htmlTextBox3.Value = " ";   //the "Kit Qty" Header label
                txtQtyP1.Value = " ";
                lblK1.Value = " ";
                txtK1Ecap.Value = " ";
                ttlKitName.Value = " ";
            }

            if (string.IsNullOrEmpty(txtProject.Value) && string.IsNullOrEmpty(txtTerms.Value))
            {
                ttlAdditional.Visible = false;
            }
            if (string.IsNullOrEmpty(txtProject.Value))
            {
                lblProject.Visible = false;
                txtProject.Visible = false;
            }
            if (string.IsNullOrEmpty(txtTerms.Value))
            {
                lblTerms.Visible = false;
                txtTerms.Visible = false;
            }

            if (string.IsNullOrEmpty(txtP1ProdName.Value))
            {
                lblP1.Visible = false;
                txtP1Ecap.Visible = false;
                txtP1ProdName.Visible = false;
                txtP1ProdSeg.Visible = false;
                txtQtyP1.Visible = false;
                lblK1.Visible = false;
                txtK1Ecap.Visible = false;
            }

            if (string.IsNullOrEmpty(txtS1ProdName.Value))
            {
                lblS1.Visible = false;
                txtS1Ecap.Visible = false;
                txtS1ProdName.Visible = false;
                txtS1ProdSeg.Visible = false;
                txtQtyS1.Visible = false;
                blankKitPriceS1.Visible = false;
                blankMaxQtyS1.Visible = false;
            }

            // Hide the block if this isn't a consumption deal
            if (txtBasedOn.Value != "Consumption")
            {
                ttlConsumption.Visible = false;
                lblConsBllgStart.Visible = false;
                txtConsumptionBillingStart.Visible = false;
                lblConsBllgEnd.Visible = false;
                txtConsumptionBillingEnd.Visible = false;
                lblConsEmpty.Visible = false;
                txtConsEmpty.Visible = false;
            }

            //// no longer in use now that KIT is a column rather than a row
            //if (GetValue("KitCheck") == "N") //string.IsNullOrEmpty(txtK1ProdName.Value)
            //{
            //    //lblK1.Visible = false;
            //    //txtK1Ecap.Visible = false;
            //    //txtK1ProdName.Visible = false;
            //    //txtK1ProdSeg.Visible = false;
            //    //txtQtyK1.Visible = false;
            //    //lblK1Disc.Visible = false;
            //    //txtK1DiscEcap.Visible = false;
            //    //txtK1DiscProdName.Visible = false;
            //    //txtK1DiscProdSeg.Visible = false;
            //    //txtQtyK1Disc.Visible = false;
            //}

            ////if (GetValue("SubKitCheck") == "N")  //TODO: need to implement a sub kit check from db
            //if (string.IsNullOrEmpty(null))
            //{
            //    //lblK2.Visible = false;
            //    //txtK2Ecap.Visible = false;
            //    //txtK2ProdName.Visible = false;
            //    //txtK2ProdSeg.Visible = false;
            //    //txtQtyK2.Visible = false;
            //}

            if (string.IsNullOrEmpty(txtS2ProdName.Value))
            {
                lblS2.Visible = false;
                txtS2Ecap.Visible = false;
                txtS2ProdName.Visible = false;
                txtS2ProdSeg.Visible = false;
                txtQtyS2.Visible = false;
                blankKitPriceS2.Visible = false;
                blankMaxQtyS2.Visible = false;
            }

            if (string.IsNullOrEmpty(txtS3ProdName.Value))
            {
                lblS3.Visible = false;
                txtS3Ecap.Visible = false;
                txtS3ProdName.Visible = false;
                txtS3ProdSeg.Visible = false;
                txtQtyS3.Visible = false;
                blankKitPriceS3.Visible = false;
                blankMaxQtyS3.Visible = false;
            }

            if (string.IsNullOrEmpty(txtS4ProdName.Value))
            {
                lblS4.Visible = false;
                txtS4Ecap.Visible = false;
                txtS4ProdName.Visible = false;
                txtS4ProdSeg.Visible = false;
                txtQtyS4.Visible = false;
                blankKitPriceS4.Visible = false;
                blankMaxQtyS4.Visible = false;
            }

            if (string.IsNullOrEmpty(txtS5ProdName.Value))
            {
                lblS5.Visible = false;
                txtS5Ecap.Visible = false;
                txtS5ProdName.Visible = false;
                txtS5ProdSeg.Visible = false;
                txtQtyS5.Visible = false;
                blankKitPriceS5.Visible = false;
                blankMaxQtyS5.Visible = false;
            }

            if (string.IsNullOrEmpty(txtS6ProdName.Value))
            {
                lblS6.Visible = false;
                txtS6Ecap.Visible = false;
                txtS6ProdName.Visible = false;
                txtS6ProdSeg.Visible = false;
                txtQtyS6.Visible = false;
                blankKitPriceS6.Visible = false;
                blankMaxQtyS6.Visible = false;
            }

            if (string.IsNullOrEmpty(txtS7ProdName.Value))
            {
                lblS7.Visible = false;
                txtS7Ecap.Visible = false;
                txtS7ProdName.Visible = false;
                txtS7ProdSeg.Visible = false;
                txtQtyS7.Visible = false;
                blankKitPriceS7.Visible = false;
                blankMaxQtyS7.Visible = false;
            }

            if (string.IsNullOrEmpty(txtS8ProdName.Value))
            {
                lblS8.Visible = false;
                txtS8Ecap.Visible = false;
                txtS8ProdName.Visible = false;
                txtS8ProdSeg.Visible = false;
                txtQtyS8.Visible = false;
                blankKitPriceS8.Visible = false;
                blankMaxQtyS8.Visible = false;
            }

            if (string.IsNullOrEmpty(txtS9ProdName.Value))
            {
                lblS9.Visible = false;
                txtS9Ecap.Visible = false;
                txtS9ProdName.Visible = false;
                txtS9ProdSeg.Visible = false;
                txtQtyS9.Visible = false;
                blankKitPriceS9.Visible = false;
                blankMaxQtyS9.Visible = false;
            }


        }

        void ProcessData()
        {
            var parameters = ReportParameters;

            string xml = GetStringValue(parameters["XML"].Value);
            string content0 = GetStringValue(parameters["content0"].Value);
            string content1 = GetStringValue(parameters["content1"].Value);
            if (xml != string.Empty)
            {
                ProcessData(xml, content0, content1, 0);
                return;
            }

            MainContent.Value = MainContent.Value.Replace("CUSTOMERNAMEGOESHERE", EscapeSpecialChars(GetStringValue(parameters["Customer"].Value)));

            txtEndCustomer.Value = EscapeSpecialChars(GetStringValue(parameters["EndCustomer"].Value));

            txtStartDate.Value = GetStringValue(parameters["StartDate"].Value);
            txtEndDate.Value = GetStringValue(parameters["EndDate"].Value);
            txtECAPType.Value = GetStringValue(parameters["ECAPType"].Value);
            txtQuantity.Value = GetStringValue(parameters["Quantity"].Value);
            txtProgramPayment.Value = GetStringValue(parameters["ProgramPayment"].Value);
            txtBasedOn.Value = GetStringValue(parameters["PayoutBasedOn"].Value);
            txtProject.Value = EscapeSpecialChars(GetStringValue(parameters["Project"].Value));
            txtTerms.Value = EscapeSpecialChars(GetStringValue(parameters["Terms"].Value));
            txtConsumptionBillingStart.Value = GetStringValue(parameters["CBllgStart"].Value);
            txtConsumptionBillingEnd.Value = GetStringValue(parameters["CBllgEnd"].Value);

            if (string.IsNullOrEmpty(txtProject.Value) && string.IsNullOrEmpty(txtTerms.Value))
            {
                ttlAdditional.Visible = false;
                lblProject.Visible = false;
                txtProject.Visible = false;
                lblTerms.Visible = false;
                txtTerms.Visible = false;
            }

            //if (string.IsNullOrEmpty(txtConsumptionBillingStart.Value) && string.IsNullOrEmpty(txtConsumptionBillingEnd.Value))
            //{
            //    lblConsumptionBillingStart.Visible = false;
            //    txtConsumptionBillingStart.Visible = false;
            //    lblConsumptionBillingEnd.Visible = false;
            //    txtConsumptionBillingEnd.Visible = false;
            //}

        }

        static string GetStringValue(object val)
        {
            return string.IsNullOrEmpty(val?.ToString()) ? string.Empty : val.ToString();
        }
    }
}