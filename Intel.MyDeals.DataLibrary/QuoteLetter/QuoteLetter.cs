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

        public QuoteLetter(string xml, string content0, string content1)
        {
            InitializeComponent();
            ProcessData(xml, content0, content1);
        }

        void Report3NeedDataSource(object sender, EventArgs e)
        {
            ProcessData();
        }

        string GetValue(string key)
        {
            return source.Descendants("PARAMETERS").Select(el => (el.Element(key) == null) ? string.Empty : ((string)el.Element(key)).Replace("\\n", "<br />")).FirstOrDefault();
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
            return xml;
        }

        void ProcessData(string xml, string content0, string content1)
        {
            source = XDocument.Parse(xml);

            MainContent.Value = content0.Replace("CUSTOMERNAMEGOESHERE", EscapeSpecialChars(GetValue("Customer")));
            MainContent1.Value = content1;

            txtEndCustomer.Value = EscapeSpecialChars(GetValue("EndCustomer"));

            txtStartDate.Value = GetValue("StartDate");
            txtEndDate.Value = GetValue("EndDate");
            txtOnAdDate.Value = GetValue("OnAdDate");
            txtQuantity.Value = GetValue("Quantity");
            txtProdSegment.Value = GetValue("ProdSegment");

            // Product Info
            txtECAPType.Value = GetValue("ECAPType");
            txtProdDesc.Value = EscapeSpecialChars(GetValue("ProdDesc"));
            txtECAPPrice.Value = GetValue("ECAPPrice");
            txtCommit.Value = GetValue("Commit");


            // Kit Info
            string KitTrackerData = GetValue("ECAPPrice");
            string CPUTrackerData = GetValue("CPUECAPPrice");
            string CSTrackerData = GetValue("CSECAPPrice");

            txtCPUECAPPrice.Value = (string.IsNullOrEmpty(CPUTrackerData) && string.IsNullOrEmpty(CSTrackerData)) ? "" : KitTrackerData + "<br /><br />" + CPUTrackerData + "<br /><br />" + CSTrackerData;
            txtCPU.Value = GetValue("CPU");
            txtCS.Value = GetValue("CS");

            // T's and C's
            txtProject.Value = EscapeSpecialChars(GetValue("Project"));
            txtTerms.Value = EscapeSpecialChars(GetValue("Terms"));

            if (string.IsNullOrEmpty(txtProject.Value) && string.IsNullOrEmpty(txtTerms.Value))
            {
                ttlAdditional.Visible = false;

                lblProject.Visible = false;
                txtProject.Visible = false;

                lblTerms.Visible = false;
                txtTerms.Visible = false;
            }

            if (string.IsNullOrEmpty(txtCPUECAPPrice.Value) && string.IsNullOrEmpty(txtCPU.Value) && string.IsNullOrEmpty(txtCS.Value))
            {
                ttlKitInfo.Visible = false;

                lblPriPrice.Visible = false;
                txtCPUECAPPrice.Visible = false;

                lblPriCommit.Visible = false;
                txtCPU.Visible = false;

                //lblCSPrice.Visible = false;
                //txtCSECAPPrice.Visible = false;

                lblCSCommit.Visible = false;
                txtCS.Visible = false;
            }
            else
            {
                ttlProductInfo.Visible = false;

                lblStdAloneType.Visible = false;
                txtECAPType.Visible = false;

                lblStdAlonePrice.Visible = false;
                txtECAPPrice.Visible = false;

                lblStdAloneCommit.Visible = false;
                txtCommit.Visible = false;

                lblStdAloneDesc.Visible = false;
                txtProdDesc.Visible = false;
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
                ProcessData(xml, content0, content1);
                return;
            }

            MainContent.Value = MainContent.Value.Replace("CUSTOMERNAMEGOESHERE", EscapeSpecialChars(GetStringValue(parameters["Customer"].Value)));

            txtEndCustomer.Value = EscapeSpecialChars(GetStringValue(parameters["EndCustomer"].Value));

            txtStartDate.Value = GetStringValue(parameters["StartDate"].Value);
            txtEndDate.Value = GetStringValue(parameters["EndDate"].Value);
            txtOnAdDate.Value = GetStringValue(parameters["OnAdDate"].Value);
            txtQuantity.Value = GetStringValue(parameters["Quantity"].Value);
            txtProdSegment.Value = GetStringValue(parameters["ProdSegment"].Value);
            txtECAPType.Value = GetStringValue(parameters["ECAPType"].Value);
            txtProdDesc.Value = EscapeSpecialChars(GetStringValue(parameters["ProdDesc"].Value));

            //txtTracker.Value = GetStringValue(parameters["Tracker"].Value);
            txtECAPPrice.Value = GetStringValue(parameters["ECAPPrice"].Value);
            txtCommit.Value = GetStringValue(parameters["Commit"].Value);

            //txtCPUTracker.Value = GetStringValue(parameters["CPUTracker"].Value);
            txtCPUECAPPrice.Value = GetStringValue(parameters["CPUECAPPrice"].Value);
            txtCPU.Value = GetStringValue(parameters["CPU"].Value);

            //txtCSTracker.Value = GetStringValue(parameters["CSTracker"].Value);
            //txtCSECAPPrice.Value = GetStringValue(parameters["CSECAPPrice"].Value);
            txtCS.Value = GetStringValue(parameters["CS"].Value);

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
            if (val == null || string.IsNullOrEmpty(val.ToString())) return string.Empty;
            return val.ToString();
        }
    }
}