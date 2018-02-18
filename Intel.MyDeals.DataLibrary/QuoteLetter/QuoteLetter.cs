using System;
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

            htmlTextBox4.Value = "Intel Quote for Deal " + dealId;
            txtEndCustomer.Value = EscapeSpecialChars(GetValue("EndCustomer"));
            txtStartDate.Value = GetValue("StartDate");
            txtEndDate.Value = GetValue("EndDate");
            txtECAPType.Value = GetValue("RebateType");
            txtQuantity.Value = GetValue("Quantity");
            txtProgramPayment.Value = GetValue("ProgramPayment");


            txtK1Ecap.Value = GetMoneyValue("KECAPPrice");
            txtK1Tracker.Value = GetTrackerValue("KTracker");

            txtK2Ecap.Value = GetMoneyValue("SKECAPPrice");
            txtK2Tracker.Value = GetTrackerValue("SKTracker");

            txtP1Ecap.Value = GetMoneyValue("PECAPPrice");
            txtP1ProdName.Value = GetValue("PProdDesc");
            txtP1ProdSeg.Value = GetValue("PProdCat");
            txtP1Tracker.Value = GetTrackerValue("PTracker");

            txtS1Ecap.Value = GetMoneyValue("S1ECAPPrice");
            txtS1ProdName.Value = GetValue("S1ProdDesc");
            txtS1ProdSeg.Value = GetValue("S1ProdCat");
            txtS1Tracker.Value = GetTrackerValue("S1Tracker");

            txtS2Ecap.Value = GetMoneyValue("S2ECAPPrice");
            txtS2ProdName.Value = GetValue("S2ProdDesc");
            txtS2ProdSeg.Value = GetValue("S2ProdCat");
            txtS2Tracker.Value = GetTrackerValue("S2Tracker");

            txtS3Ecap.Value = GetMoneyValue("S3ECAPPrice");
            txtS3ProdName.Value = GetValue("S3ProdDesc");
            txtS3ProdSeg.Value = GetValue("S3ProdCat");
            txtS3Tracker.Value = GetTrackerValue("S3Tracker");

            txtS4Ecap.Value = GetMoneyValue("S4ECAPPrice");
            txtS4ProdName.Value = GetValue("S4ProdDesc");
            txtS4ProdSeg.Value = GetValue("S4ProdCat");
            txtS4Tracker.Value = GetTrackerValue("S4Tracker");

            txtS5Ecap.Value = GetMoneyValue("S5ECAPPrice");
            txtS5ProdName.Value = GetValue("S5ProdDesc");
            txtS5ProdSeg.Value = GetValue("S5ProdCat");
            txtS5Tracker.Value = GetTrackerValue("S5Tracker");

            txtS6Ecap.Value = GetMoneyValue("S6ECAPPrice");
            txtS6ProdName.Value = GetValue("S6ProdDesc");
            txtS6ProdSeg.Value = GetValue("S6ProdCat");
            txtS6Tracker.Value = GetTrackerValue("S6Tracker");

            txtS7Ecap.Value = GetMoneyValue("S7ECAPPrice");
            txtS7ProdName.Value = GetValue("S7ProdDesc");
            txtS7ProdSeg.Value = GetValue("S7ProdCat");
            txtS7Tracker.Value = GetTrackerValue("S7Tracker");

            txtS8Ecap.Value = GetMoneyValue("S8ECAPPrice");
            txtS8ProdName.Value = GetValue("S8ProdDesc");
            txtS8ProdSeg.Value = GetValue("S8ProdCat");
            txtS8Tracker.Value = GetTrackerValue("S8Tracker");
            


            // T's and C's
            txtProject.Value = EscapeSpecialChars(GetValue("QltrProject"));
            txtTerms.Value = EscapeSpecialChars(GetValue("Terms"));


            // Start hidding rows

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
                txtP1Tracker.Visible = false;
            }

            if (string.IsNullOrEmpty(txtK1ProdName.Value))
            {
                lblK1.Visible = false;
                txtK1Ecap.Visible = false;
                txtK1ProdName.Visible = false;
                txtK1ProdSeg.Visible = false;
                txtK1Tracker.Visible = false;
            }

            if (string.IsNullOrEmpty(txtK2ProdName.Value))
            {
                lblK2.Visible = false;
                txtK2Ecap.Visible = false;
                txtK2ProdName.Visible = false;
                txtK2ProdSeg.Visible = false;
                txtK2Tracker.Visible = false;
            }

            if (string.IsNullOrEmpty(txtS1ProdName.Value))
            {
                lblS1.Visible = false;
                txtS1Ecap.Visible = false;
                txtS1ProdName.Visible = false;
                txtS1ProdSeg.Visible = false;
                txtS1Tracker.Visible = false;
            }

            if (string.IsNullOrEmpty(txtS2ProdName.Value))
            {
                lblS2.Visible = false;
                txtS2Ecap.Visible = false;
                txtS2ProdName.Visible = false;
                txtS2ProdSeg.Visible = false;
                txtS2Tracker.Visible = false;
            }

            if (string.IsNullOrEmpty(txtS3ProdName.Value))
            {
                lblS3.Visible = false;
                txtS3Ecap.Visible = false;
                txtS3ProdName.Visible = false;
                txtS3ProdSeg.Visible = false;
                txtS3Tracker.Visible = false;
            }

            if (string.IsNullOrEmpty(txtS4ProdName.Value))
            {
                lblS4.Visible = false;
                txtS4Ecap.Visible = false;
                txtS4ProdName.Visible = false;
                txtS4ProdSeg.Visible = false;
                txtS4Tracker.Visible = false;
            }

            if (string.IsNullOrEmpty(txtS5ProdName.Value))
            {
                lblS5.Visible = false;
                txtS5Ecap.Visible = false;
                txtS5ProdName.Visible = false;
                txtS5ProdSeg.Visible = false;
                txtS5Tracker.Visible = false;
            }

            if (string.IsNullOrEmpty(txtS6ProdName.Value))
            {
                lblS6.Visible = false;
                txtS6Ecap.Visible = false;
                txtS6ProdName.Visible = false;
                txtS6ProdSeg.Visible = false;
                txtS6Tracker.Visible = false;
            }

            if (string.IsNullOrEmpty(txtS7ProdName.Value))
            {
                lblS7.Visible = false;
                txtS7Ecap.Visible = false;
                txtS7ProdName.Visible = false;
                txtS7ProdSeg.Visible = false;
                txtS7Tracker.Visible = false;
            }

            if (string.IsNullOrEmpty(txtS8ProdName.Value))
            {
                lblS8.Visible = false;
                txtS8Ecap.Visible = false;
                txtS8ProdName.Visible = false;
                txtS8ProdSeg.Visible = false;
                txtS8Tracker.Visible = false;
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