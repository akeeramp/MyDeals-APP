using System;
using System.Globalization;
using System.Linq;
using System.Xml.Linq;

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
            return source.Descendants("PARAMETERS").Select(el => (el.Element(key) == null) ? string.Empty : ((string)el.Element(key)).Replace("\\n", "<br />")).FirstOrDefault();
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

        string MoneyMult(string moneyValue, string qty)
        {
            var val = "$0";
            if (string.IsNullOrEmpty(qty))
            {
                qty = "1";
            }
            if (!string.IsNullOrEmpty(moneyValue))
            {
                val = (decimal.Parse(moneyValue, NumberStyles.AllowCurrencySymbol | NumberStyles.Number) * decimal.Parse(qty)).ToString("C2");
            }
            return val;
        }

        string MoneyAdd(string moneyValue1, string moneyValue2)
        {
            var val = moneyValue1;
            if (!(string.IsNullOrEmpty(moneyValue1) || string.IsNullOrEmpty(moneyValue2)))
            {
                val = (decimal.Parse(moneyValue1, NumberStyles.AllowCurrencySymbol | NumberStyles.Number) + decimal.Parse(moneyValue2, NumberStyles.AllowCurrencySymbol | NumberStyles.Number)).ToString("C2");
            }
            return val;
        }

        string MoneySub(string moneyValue1, string moneyValue2)
        {
            var val = moneyValue1;
            if (!(string.IsNullOrEmpty(moneyValue1) || string.IsNullOrEmpty(moneyValue2)))
            {
                val = (decimal.Parse(moneyValue1, NumberStyles.AllowCurrencySymbol | NumberStyles.Number) - decimal.Parse(moneyValue2, NumberStyles.AllowCurrencySymbol | NumberStyles.Number)).ToString("C2");
            }
            return val;
        }

        static string EscapeSpecialChars(string xml)
        {
            xml = xml.Replace("&amp;", "and");
            xml = xml.Replace("&", "and");
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

            string stage = GetValue("WfStgCd");
            string psStage = GetValue("PsWfStgCd");
            string tracker = GetValue("PTracker");
            txtStatus.Value = tracker == "" ? "Offer" : "Active";
            //txtStatus.Value = stage == "Draft" ? psStage : stage;

            string qtyP1, qtyS1, qtyS2, qtyS3, qtyS4, qtyS5, qtyS6, qtyS7, qtyS8, qtyS9;

            txtK1Ecap.Value = GetMoneyValue("KECAPPrice");

            txtK2Ecap.Value = GetMoneyValue("SKECAPPrice");

            txtP1Ecap.Value = GetMoneyValue("PECAPPrice");
            txtP1ProdName.Value = GetValue("PProdDesc");
            txtP1ProdSeg.Value = GetValue("PProdCat");
            qtyP1 = GetValue("PQty");

            txtS1Ecap.Value = GetMoneyValue("S1ECAPPrice");
            txtS1ProdName.Value = GetValue("S1ProdDesc");
            txtS1ProdSeg.Value = GetValue("S1ProdCat");
            qtyS1 = GetValue("S1Qty");

            txtS2Ecap.Value = GetMoneyValue("S2ECAPPrice");
            txtS2ProdName.Value = GetValue("S2ProdDesc");
            txtS2ProdSeg.Value = GetValue("S2ProdCat");
            qtyS2 = GetValue("S2Qty");

            txtS3Ecap.Value = GetMoneyValue("S3ECAPPrice");
            txtS3ProdName.Value = GetValue("S3ProdDesc");
            txtS3ProdSeg.Value = GetValue("S3ProdCat");
            qtyS3 = GetValue("S3Qty");

            txtS4Ecap.Value = GetMoneyValue("S4ECAPPrice");
            txtS4ProdName.Value = GetValue("S4ProdDesc");
            txtS4ProdSeg.Value = GetValue("S4ProdCat");
            qtyS4 = GetValue("S4Qty");

            txtS5Ecap.Value = GetMoneyValue("S5ECAPPrice");
            txtS5ProdName.Value = GetValue("S5ProdDesc");
            txtS5ProdSeg.Value = GetValue("S5ProdCat");
            qtyS5 = GetValue("S5Qty");

            txtS6Ecap.Value = GetMoneyValue("S6ECAPPrice");
            txtS6ProdName.Value = GetValue("S6ProdDesc");
            txtS6ProdSeg.Value = GetValue("S6ProdCat");
            qtyS6 = GetValue("S6Qty");

            txtS7Ecap.Value = GetMoneyValue("S7ECAPPrice");
            txtS7ProdName.Value = GetValue("S7ProdDesc");
            txtS7ProdSeg.Value = GetValue("S7ProdCat");
            qtyS7 = GetValue("S7Qty");

            txtS8Ecap.Value = GetMoneyValue("S8ECAPPrice");
            txtS8ProdName.Value = GetValue("S8ProdDesc");
            txtS8ProdSeg.Value = GetValue("S8ProdCat");
            qtyS8 = GetValue("S8Qty");

            txtS9Ecap.Value = GetMoneyValue("S9ECAPPrice");
            txtS9ProdName.Value = GetValue("S9ProdDesc");
            txtS9ProdSeg.Value = GetValue("S9ProdCat");
            qtyS9 = GetValue("S9Qty");

            //calculate kit discount - Formula: (Sum of Component ECAPs * respective QTYs) - Kit ECAP = Kit Rebate Bundle Discount
            txtK1DiscEcap.Value = "$0";
            txtK1DiscEcap.Value = MoneyAdd(txtK1DiscEcap.Value, MoneyMult(txtP1Ecap.Value, qtyP1));
            txtK1DiscEcap.Value = MoneyAdd(txtK1DiscEcap.Value, MoneyMult(txtS1Ecap.Value, qtyS1));
            txtK1DiscEcap.Value = MoneyAdd(txtK1DiscEcap.Value, MoneyMult(txtS2Ecap.Value, qtyS2));
            txtK1DiscEcap.Value = MoneyAdd(txtK1DiscEcap.Value, MoneyMult(txtS3Ecap.Value, qtyS3));
            txtK1DiscEcap.Value = MoneyAdd(txtK1DiscEcap.Value, MoneyMult(txtS4Ecap.Value, qtyS4));
            txtK1DiscEcap.Value = MoneyAdd(txtK1DiscEcap.Value, MoneyMult(txtS5Ecap.Value, qtyS5));
            txtK1DiscEcap.Value = MoneyAdd(txtK1DiscEcap.Value, MoneyMult(txtS6Ecap.Value, qtyS6));
            txtK1DiscEcap.Value = MoneyAdd(txtK1DiscEcap.Value, MoneyMult(txtS7Ecap.Value, qtyS7));
            txtK1DiscEcap.Value = MoneyAdd(txtK1DiscEcap.Value, MoneyMult(txtS8Ecap.Value, qtyS8));
            txtK1DiscEcap.Value = MoneyAdd(txtK1DiscEcap.Value, MoneyMult(txtS9Ecap.Value, qtyS9));
            txtK1DiscEcap.Value = MoneySub(txtK1DiscEcap.Value, txtK1Ecap.Value);
            txtK1DiscEcap.Value = txtK1DiscEcap.Value;

            // T's and C's
            txtProject.Value = EscapeSpecialChars(GetValue("QltrProject"));
            txtTerms.Value = EscapeSpecialChars(GetValue("Terms"));


            // Start hidding rows

            if (GetValue("KitCheck") == "N")
            {
                lblP1.Value = " ";
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
            }

            if (string.IsNullOrEmpty(txtS1ProdName.Value))
            {
                lblS1.Visible = false;
                txtS1Ecap.Visible = false;
                txtS1ProdName.Visible = false;
                txtS1ProdSeg.Visible = false;
                lblBlankS1.Visible = false;
            }

            if (GetValue("KitCheck") == "N") //string.IsNullOrEmpty(txtK1ProdName.Value)
            {
                lblK1.Visible = false;
                txtK1Ecap.Visible = false;
                txtK1ProdName.Visible = false;
                txtK1ProdSeg.Visible = false;
                lblBlankK1.Visible = false;
                lblK1Disc.Visible = false;
                txtK1DiscEcap.Visible = false;
                txtK1DiscProdName.Visible = false;
                txtK1DiscProdSeg.Visible = false;
                lblBlankK1Disc.Visible = false;
            }

            //if (GetValue("SubKitCheck") == "N")  //TODO: need to implement a sub kit check from db
            if (string.IsNullOrEmpty(txtK2ProdName.Value))
            {
                lblK2.Visible = false;
                txtK2Ecap.Visible = false;
                txtK2ProdName.Visible = false;
                txtK2ProdSeg.Visible = false;
                lblBlankK2.Visible = false;
            }

            if (string.IsNullOrEmpty(txtS2ProdName.Value))
            {
                lblS2.Visible = false;
                txtS2Ecap.Visible = false;
                txtS2ProdName.Visible = false;
                txtS2ProdSeg.Visible = false;
                lblBlankS2.Visible = false;
            }

            if (string.IsNullOrEmpty(txtS3ProdName.Value))
            {
                lblS3.Visible = false;
                txtS3Ecap.Visible = false;
                txtS3ProdName.Visible = false;
                txtS3ProdSeg.Visible = false;
                lblBlankS3.Visible = false;
            }

            if (string.IsNullOrEmpty(txtS4ProdName.Value))
            {
                lblS4.Visible = false;
                txtS4Ecap.Visible = false;
                txtS4ProdName.Visible = false;
                txtS4ProdSeg.Visible = false;
                lblBlankS4.Visible = false;
            }

            if (string.IsNullOrEmpty(txtS5ProdName.Value))
            {
                lblS5.Visible = false;
                txtS5Ecap.Visible = false;
                txtS5ProdName.Visible = false;
                txtS5ProdSeg.Visible = false;
                lblBlankS5.Visible = false;
            }

            if (string.IsNullOrEmpty(txtS6ProdName.Value))
            {
                lblS6.Visible = false;
                txtS6Ecap.Visible = false;
                txtS6ProdName.Visible = false;
                txtS6ProdSeg.Visible = false;
                lblBlankS6.Visible = false;
            }

            if (string.IsNullOrEmpty(txtS7ProdName.Value))
            {
                lblS7.Visible = false;
                txtS7Ecap.Visible = false;
                txtS7ProdName.Visible = false;
                txtS7ProdSeg.Visible = false;
                lblBlankS7.Visible = false;
            }

            if (string.IsNullOrEmpty(txtS8ProdName.Value))
            {
                lblS8.Visible = false;
                txtS8Ecap.Visible = false;
                txtS8ProdName.Visible = false;
                txtS8ProdSeg.Visible = false;
                lblBlankS8.Visible = false;
            }

            if (string.IsNullOrEmpty(txtS9ProdName.Value))
            {
                lblS9.Visible = false;
                txtS9Ecap.Visible = false;
                txtS9ProdName.Visible = false;
                txtS9ProdSeg.Visible = false;
                lblBlankS9.Visible = false;
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
            txtProgramPayment.Value = GetStringValue(parameters["ProdSegment"].Value);
            txtProject.Value = EscapeSpecialChars(GetStringValue(parameters["Project"].Value));
            txtTerms.Value = EscapeSpecialChars(GetStringValue(parameters["Terms"].Value));

            if (string.IsNullOrEmpty(txtProject.Value) && string.IsNullOrEmpty(txtTerms.Value))
            {
                ttlAdditional.Visible = false;
                lblProject.Visible = false;
                txtProject.Visible = false;
                lblTerms.Visible = false;
                txtTerms.Visible = false;
            }

        }

        static string GetStringValue(object val)
        {
            return string.IsNullOrEmpty(val?.ToString()) ? string.Empty : val.ToString();
        }
    }
}