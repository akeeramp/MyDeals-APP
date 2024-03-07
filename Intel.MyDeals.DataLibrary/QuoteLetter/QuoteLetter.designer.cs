using Telerik.Reporting;

namespace Intel.MyDeals.DataLibrary
{
    partial class QuoteLetter
    {

        #region Component Designer generated code
        /// <summary>
        /// Required method for telerik Reporting designer support - do not modify
        /// the contents of this method with the code editor. - sadly that's what we're doing when the editor won't work...
        /// </summary>
        private void InitializeComponent()
        {
            double DealDetailsHeader = 0.10D;
            double DealDetailsHeaderRow1 = 0.40D; 
            double DealDetailsTextRow1 = 0.60D; 
            double DealDetailsHeaderRow2 = 0.90D;
            double DealDetailsTextRow2 = 1.15D;

            double ProductsSectionHeader = 1.60D;
            double ProductsHeader = 1.80D;
            double PrimaryValuesRow = 2.00D; // .35 per line (Data and EPM name) instead of 20
            double PrimaryRowEPM = 2.15D;
            double S1ValuesRow = 2.35D; 
            double S1RowEPM = 2.50D;
            double S2ValuesRow = 2.70D; 
            double S2RowEPM = 2.85D;
            double S3ValuesRow = 3.05D; 
            double S3RowEPM = 3.20D;
            double S4ValuesRow = 3.35D; 
            double S4RowEPM = 3.50D;
            double S5ValuesRow = 3.70D; 
            double S5RowEPM = 3.85D;
            double S6ValuesRow = 4.05D; 
            double S6RowEPM = 4.20D;
            double S7ValuesRow = 4.40D; 
            double S7RowEPM = 4.55D;
            double S8ValuesRow = 4.75D; 
            double S8RowEPM = 4.90D;
            double S9ValuesRow = 5.10D; 
            double S9RowEPM = 5.25D;

            // Subtraction of missing product lines above is applied to lower items dynamically in QuoteLetter.CS in ProcessData function.
            // The below are just hard set to maximum values for now.

            double AdditionalInfoHeader = 5.90D;
            double AdditionalInfoRow1 = 6.10D;
            double AdditionalInfoRow2 = 6.30D;
            double LowerLegalText = 7.10D;

            // Columns and inner row layout numbers now

            double Col1Location = 0.00D;
            double Col2Location = 1.25D;
            double Col3Location = 2.50D;
            double Col4Location = 3.75D;
            double Col5Location = 5.00D;
            double Col6Location = 6.25D;

            double SingleColWidth = 1.25D;
            double SpaceholderWidth = 2.50D;  // Note that full columns width is 7.5 (6 * 1.25 = 7.5)
            double AdditionalItemsValuesWidth = 6.25D;  // Note that full columns width is 7.5 (6 * 1.25 = 7.5)

            double NormalRowHeight = 0.20D;
            double FatRowHeight = 0.25D;

            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(QuoteLetter));
            Telerik.Reporting.ReportParameter reportParameter1 = new Telerik.Reporting.ReportParameter();
            Telerik.Reporting.ReportParameter reportParameter2 = new Telerik.Reporting.ReportParameter();
            Telerik.Reporting.ReportParameter reportParameter3 = new Telerik.Reporting.ReportParameter();
            Telerik.Reporting.ReportParameter reportParameter4 = new Telerik.Reporting.ReportParameter();
            Telerik.Reporting.ReportParameter reportParameter5 = new Telerik.Reporting.ReportParameter();
            Telerik.Reporting.ReportParameter reportParameter6 = new Telerik.Reporting.ReportParameter();
            Telerik.Reporting.ReportParameter reportParameter7 = new Telerik.Reporting.ReportParameter();
            Telerik.Reporting.ReportParameter reportParameter8 = new Telerik.Reporting.ReportParameter();
            Telerik.Reporting.ReportParameter reportParameter9 = new Telerik.Reporting.ReportParameter();
            Telerik.Reporting.ReportParameter reportParameter10 = new Telerik.Reporting.ReportParameter();
            Telerik.Reporting.ReportParameter reportParameter11 = new Telerik.Reporting.ReportParameter();
            Telerik.Reporting.ReportParameter reportParameter12 = new Telerik.Reporting.ReportParameter();
            Telerik.Reporting.ReportParameter reportParameter13 = new Telerik.Reporting.ReportParameter();
            Telerik.Reporting.ReportParameter reportParameter14 = new Telerik.Reporting.ReportParameter();
            Telerik.Reporting.ReportParameter reportParameter15 = new Telerik.Reporting.ReportParameter();
            Telerik.Reporting.ReportParameter reportParameter16 = new Telerik.Reporting.ReportParameter();
            Telerik.Reporting.ReportParameter reportParameter17 = new Telerik.Reporting.ReportParameter();
            Telerik.Reporting.ReportParameter reportParameter18 = new Telerik.Reporting.ReportParameter();
            Telerik.Reporting.ReportParameter reportParameter19 = new Telerik.Reporting.ReportParameter();
            Telerik.Reporting.ReportParameter reportParameter20 = new Telerik.Reporting.ReportParameter();
            Telerik.Reporting.ReportParameter reportParameter21 = new Telerik.Reporting.ReportParameter();
            Telerik.Reporting.ReportParameter reportParameter22 = new Telerik.Reporting.ReportParameter();
            Telerik.Reporting.Drawing.StyleRule styleRule1 = new Telerik.Reporting.Drawing.StyleRule();

            this.pageHeader = new Telerik.Reporting.PageHeaderSection();
            this.picLogo = new Telerik.Reporting.PictureBox();
            this.htmlLeftHeaderTitle = new Telerik.Reporting.HtmlTextBox();
            this.currentTimeTextBox = new Telerik.Reporting.TextBox();
            this.detail = new Telerik.Reporting.DetailSection();
            this.panel1 = new Telerik.Reporting.Panel();
            this.UpperLegalContent = new Telerik.Reporting.HtmlTextBox();
            this.LowerLegalContent = new Telerik.Reporting.HtmlTextBox();

            // Deals Data
            this.DealSectionHeader = new Telerik.Reporting.HtmlTextBox();
            this.ttlKitName = new Telerik.Reporting.HtmlTextBox();
            this.EcapTypeLabel = new Telerik.Reporting.HtmlTextBox();
            this.txtECAPType = new Telerik.Reporting.HtmlTextBox();
            this.EndCustomerLabel = new Telerik.Reporting.HtmlTextBox();
            this.txtEndCustomer = new Telerik.Reporting.HtmlTextBox();
            this.DealStatusLabel = new Telerik.Reporting.HtmlTextBox();
            this.txtDealStatus = new Telerik.Reporting.HtmlTextBox();
            this.ProgramPaymentLabel = new Telerik.Reporting.HtmlTextBox();
            this.txtProgramPayment = new Telerik.Reporting.HtmlTextBox();
            this.PayoutBasedOnLabel = new Telerik.Reporting.HtmlTextBox();
            this.txtPayoutBasedOn = new Telerik.Reporting.HtmlTextBox();
            this.lblGroupType = new Telerik.Reporting.HtmlTextBox();
            this.txtGroupType = new Telerik.Reporting.HtmlTextBox();
            this.StartDateLabel = new Telerik.Reporting.HtmlTextBox();
            this.txtStartDate = new Telerik.Reporting.HtmlTextBox();
            this.EndDateLabel = new Telerik.Reporting.HtmlTextBox();
            this.txtEndDate = new Telerik.Reporting.HtmlTextBox();
            this.lblConsumptionStartDate = new Telerik.Reporting.HtmlTextBox();
            this.txtConsumptionStartDate = new Telerik.Reporting.HtmlTextBox();
            this.lblConsumptionEndDate = new Telerik.Reporting.HtmlTextBox();
            this.txtConsumptionEndDate = new Telerik.Reporting.HtmlTextBox();
            this.lblConsEmpty = new Telerik.Reporting.HtmlTextBox();
            this.txtConsEmpty = new Telerik.Reporting.HtmlTextBox();
            // Products Data
            this.ttlProductInfo = new Telerik.Reporting.HtmlTextBox();
            this.htmlTextBox2 = new Telerik.Reporting.HtmlTextBox();
            this.htmlTextBox10 = new Telerik.Reporting.HtmlTextBox();
            this.htmlTextBox13 = new Telerik.Reporting.HtmlTextBox();
            this.htmlTextBox11 = new Telerik.Reporting.HtmlTextBox();
            this.htmlTextBox3 = new Telerik.Reporting.HtmlTextBox();
            this.lblK1 = new Telerik.Reporting.HtmlTextBox();
            this.htmlTextBox14 = new Telerik.Reporting.HtmlTextBox();

            this.txtP1ProdName = new Telerik.Reporting.HtmlTextBox();
            this.txtP1FullName = new Telerik.Reporting.HtmlTextBox();
            this.lblP1 = new Telerik.Reporting.HtmlTextBox();
            this.txtP1ProdSeg = new Telerik.Reporting.HtmlTextBox();
            this.txtP1Ecap = new Telerik.Reporting.HtmlTextBox();
            this.txtQtyP1 = new Telerik.Reporting.HtmlTextBox();
            this.txtK1Ecap = new Telerik.Reporting.HtmlTextBox();
            this.txtQuantity = new Telerik.Reporting.HtmlTextBox();

            this.txtS1ProdName = new Telerik.Reporting.HtmlTextBox();
            this.txtS1FullName = new Telerik.Reporting.HtmlTextBox();
            this.lblS1 = new Telerik.Reporting.HtmlTextBox();
            this.txtS1ProdSeg = new Telerik.Reporting.HtmlTextBox();
            this.txtS1Ecap = new Telerik.Reporting.HtmlTextBox();
            this.txtQtyS1 = new Telerik.Reporting.HtmlTextBox();
            this.blankKitPriceS1 = new Telerik.Reporting.HtmlTextBox();
            this.blankMaxQtyS1 = new Telerik.Reporting.HtmlTextBox();

            this.txtS2ProdName = new Telerik.Reporting.HtmlTextBox();
            this.txtS2FullName = new Telerik.Reporting.HtmlTextBox();
            this.lblS2 = new Telerik.Reporting.HtmlTextBox();
            this.txtS2ProdSeg = new Telerik.Reporting.HtmlTextBox();
            this.txtS2Ecap = new Telerik.Reporting.HtmlTextBox();
            this.txtQtyS2 = new Telerik.Reporting.HtmlTextBox();
            this.blankKitPriceS2 = new Telerik.Reporting.HtmlTextBox();
            this.blankMaxQtyS2 = new Telerik.Reporting.HtmlTextBox();

            this.txtS3ProdName = new Telerik.Reporting.HtmlTextBox();
            this.txtS3FullName = new Telerik.Reporting.HtmlTextBox();
            this.lblS3 = new Telerik.Reporting.HtmlTextBox();
            this.txtS3ProdSeg = new Telerik.Reporting.HtmlTextBox();
            this.txtS3Ecap = new Telerik.Reporting.HtmlTextBox();
            this.txtQtyS3 = new Telerik.Reporting.HtmlTextBox();
            this.blankKitPriceS3 = new Telerik.Reporting.HtmlTextBox();
            this.blankMaxQtyS3 = new Telerik.Reporting.HtmlTextBox();

            this.txtS4ProdName = new Telerik.Reporting.HtmlTextBox();
            this.txtS4FullName = new Telerik.Reporting.HtmlTextBox();
            this.lblS4 = new Telerik.Reporting.HtmlTextBox();
            this.txtS4ProdSeg = new Telerik.Reporting.HtmlTextBox();
            this.txtS4Ecap = new Telerik.Reporting.HtmlTextBox();
            this.txtQtyS4 = new Telerik.Reporting.HtmlTextBox();
            this.blankKitPriceS4 = new Telerik.Reporting.HtmlTextBox();
            this.blankMaxQtyS4 = new Telerik.Reporting.HtmlTextBox();

            this.txtS5ProdName = new Telerik.Reporting.HtmlTextBox();
            this.txtS5FullName = new Telerik.Reporting.HtmlTextBox();
            this.lblS5 = new Telerik.Reporting.HtmlTextBox();
            this.txtS5ProdSeg = new Telerik.Reporting.HtmlTextBox();
            this.txtS5Ecap = new Telerik.Reporting.HtmlTextBox();
            this.txtQtyS5 = new Telerik.Reporting.HtmlTextBox();
            this.blankKitPriceS5 = new Telerik.Reporting.HtmlTextBox();
            this.blankMaxQtyS5 = new Telerik.Reporting.HtmlTextBox();

            this.txtS6ProdName = new Telerik.Reporting.HtmlTextBox();
            this.txtS6FullName = new Telerik.Reporting.HtmlTextBox();
            this.lblS6 = new Telerik.Reporting.HtmlTextBox();
            this.txtS6ProdSeg = new Telerik.Reporting.HtmlTextBox();
            this.txtS6Ecap = new Telerik.Reporting.HtmlTextBox();
            this.txtQtyS6 = new Telerik.Reporting.HtmlTextBox();
            this.blankKitPriceS6 = new Telerik.Reporting.HtmlTextBox();
            this.blankMaxQtyS6 = new Telerik.Reporting.HtmlTextBox();

            this.txtS7ProdName = new Telerik.Reporting.HtmlTextBox();
            this.txtS7FullName = new Telerik.Reporting.HtmlTextBox();
            this.lblS7 = new Telerik.Reporting.HtmlTextBox();
            this.txtS7ProdSeg = new Telerik.Reporting.HtmlTextBox();
            this.txtS7Ecap = new Telerik.Reporting.HtmlTextBox();
            this.txtQtyS7 = new Telerik.Reporting.HtmlTextBox();
            this.blankKitPriceS7 = new Telerik.Reporting.HtmlTextBox();
            this.blankMaxQtyS7 = new Telerik.Reporting.HtmlTextBox();

            this.txtS8ProdName = new Telerik.Reporting.HtmlTextBox();
            this.txtS8FullName = new Telerik.Reporting.HtmlTextBox();
            this.lblS8 = new Telerik.Reporting.HtmlTextBox();
            this.txtS8ProdSeg = new Telerik.Reporting.HtmlTextBox();
            this.txtS8Ecap = new Telerik.Reporting.HtmlTextBox();
            this.txtQtyS8 = new Telerik.Reporting.HtmlTextBox();
            this.blankKitPriceS8 = new Telerik.Reporting.HtmlTextBox();
            this.blankMaxQtyS8 = new Telerik.Reporting.HtmlTextBox();

            this.txtS9ProdName = new Telerik.Reporting.HtmlTextBox();
            this.txtS9FullName = new Telerik.Reporting.HtmlTextBox();
            this.lblS9 = new Telerik.Reporting.HtmlTextBox();
            this.txtS9ProdSeg = new Telerik.Reporting.HtmlTextBox();
            this.txtS9Ecap = new Telerik.Reporting.HtmlTextBox();
            this.txtQtyS9 = new Telerik.Reporting.HtmlTextBox();
            this.blankKitPriceS9 = new Telerik.Reporting.HtmlTextBox();
            this.blankMaxQtyS9 = new Telerik.Reporting.HtmlTextBox();
            // Additional
            this.ttlAdditional = new Telerik.Reporting.HtmlTextBox();
            this.lblProject = new Telerik.Reporting.HtmlTextBox();
            this.txtProject = new Telerik.Reporting.HtmlTextBox();
            this.lblTerms = new Telerik.Reporting.HtmlTextBox();
            this.txtTerms = new Telerik.Reporting.HtmlTextBox();
            // Footer
            this.pageFooter = new Telerik.Reporting.PageFooterSection();
            this.htmlTextBox18 = new Telerik.Reporting.HtmlTextBox();
            this.pageInfoTextBox = new Telerik.Reporting.TextBox();


            ((System.ComponentModel.ISupportInitialize)(this)).BeginInit();
            // 
            // pageHeader
            // 
            this.pageHeader.Height = Telerik.Reporting.Drawing.Unit.Inch(1.4000D);
            this.pageHeader.Items.AddRange(new Telerik.Reporting.ReportItemBase[] {
            this.picLogo,
            this.htmlLeftHeaderTitle});
            this.pageHeader.Name = "pageHeader";
            this.pageHeader.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.pageHeader.Style.BackgroundImage.MimeType = "image/jpeg";
            this.pageHeader.Style.BorderStyle.Bottom = Telerik.Reporting.Drawing.BorderType.None;
            this.pageHeader.Style.BorderWidth.Default = Telerik.Reporting.Drawing.Unit.Point(0D);
            // 
            // picLogo
            // 
            this.picLogo.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(5.90D), Telerik.Reporting.Drawing.Unit.Inch(0.10D));
            this.picLogo.MimeType = "image/png";
            this.picLogo.Name = "picLogo";
            this.picLogo.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.60D), Telerik.Reporting.Drawing.Unit.Inch(1.00D));
            this.picLogo.Sizing = Telerik.Reporting.Drawing.ImageSizeMode.ScaleProportional;
            this.picLogo.Value = ((object)(resources.GetObject("picLogo.Value")));
            // 
            // htmlLeftHeaderTitle
            // 
            this.htmlLeftHeaderTitle.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(0.00D), Telerik.Reporting.Drawing.Unit.Inch(0.10D));
            this.htmlLeftHeaderTitle.Name = "htmlLeftHeaderTitle";
            this.htmlLeftHeaderTitle.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(3.90D), Telerik.Reporting.Drawing.Unit.Inch(1.10D));
            this.htmlLeftHeaderTitle.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(125)))), ((int)(((byte)(197)))));
            this.htmlLeftHeaderTitle.Style.Font.Name = "Neo Sans Intel";
            this.htmlLeftHeaderTitle.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Point(18D);
            this.htmlLeftHeaderTitle.Value = "<p style=\"text-align: left\"><span style=\"font-size: 30pt\"></span></p><p><span style=\"font-size: 30pt\">Intel</span><span style=\"font-size: 30pt\">® <br />Quote Sheet&nbsp;&nbsp; </span></p>";
            // 
            // currentTimeTextBox
            // 
            this.currentTimeTextBox.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(5.30D), Telerik.Reporting.Drawing.Unit.Inch(0.00D));
            this.currentTimeTextBox.Name = "currentTimeTextBox";
            this.currentTimeTextBox.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(2.10D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.currentTimeTextBox.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(125)))), ((int)(((byte)(197)))));
            this.currentTimeTextBox.Style.Font.Name = "Neo Sans Intel";
            this.currentTimeTextBox.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(11D);
            this.currentTimeTextBox.Style.TextAlign = Telerik.Reporting.Drawing.HorizontalAlign.Right;
            this.currentTimeTextBox.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Bottom;
            this.currentTimeTextBox.StyleName = "PageInfo";
            this.currentTimeTextBox.Value = "=NOW()";
            // 
            // detail
            // 
            this.detail.Height = Telerik.Reporting.Drawing.Unit.Inch(25.00D);
            this.detail.Items.AddRange(new Telerik.Reporting.ReportItemBase[] {
            this.panel1,
            this.currentTimeTextBox,
            this.UpperLegalContent});
            this.detail.Name = "detail";

            // 
            // panel1
            // 
            this.panel1.Items.AddRange(new Telerik.Reporting.ReportItemBase[] {
            //this.UpperLegalContent,
            this.LowerLegalContent,
            this.DealSectionHeader,
            this.ttlKitName,
            this.EcapTypeLabel,
            this.txtECAPType,
            this.EndCustomerLabel,
            this.txtEndCustomer,
            this.DealStatusLabel,
            this.txtDealStatus,
            this.ProgramPaymentLabel,
            this.txtProgramPayment,
            this.PayoutBasedOnLabel,
            this.txtPayoutBasedOn,
            this.lblGroupType,
            this.txtGroupType,
            this.StartDateLabel,
            this.txtStartDate,
            this.EndDateLabel,
            this.txtEndDate,
            this.lblConsumptionStartDate,
            this.txtConsumptionStartDate,
            this.lblConsumptionEndDate,
            this.txtConsumptionEndDate,
            this.lblConsEmpty,
            this.txtConsEmpty,
            this.ttlProductInfo,
            this.htmlTextBox2,
            this.htmlTextBox10,
            this.htmlTextBox13,
            this.htmlTextBox11,
            this.htmlTextBox3,
            this.lblK1,
            this.htmlTextBox14,
            this.txtP1ProdName,
            this.txtP1FullName,
            this.lblP1,
            this.txtP1ProdSeg,
            this.txtP1Ecap,
            this.txtQtyP1,
            this.txtK1Ecap,
            this.txtQuantity,
            this.txtS1ProdName,
            this.txtS1FullName,
            this.lblS1,
            this.txtS1ProdSeg,
            this.txtS1Ecap,
            this.txtQtyS1,
            this.blankKitPriceS1,
            this.blankMaxQtyS1,
            this.txtS2ProdName,
            this.txtS2FullName,
            this.lblS2,
            this.txtS2ProdSeg,
            this.txtS2Ecap,
            this.txtQtyS2,
            this.blankKitPriceS2,
            this.blankMaxQtyS2,
            this.txtS3ProdName,
            this.txtS3FullName,
            this.lblS3,
            this.txtS3ProdSeg,
            this.txtS3Ecap,
            this.txtQtyS3,
            this.blankKitPriceS3,
            this.blankMaxQtyS3,
            this.txtS4ProdName,
            this.txtS4FullName,
            this.lblS4,
            this.txtS4ProdSeg,
            this.txtS4Ecap,
            this.txtQtyS4,
            this.blankKitPriceS4,
            this.blankMaxQtyS4,
            this.txtS5ProdName,
            this.txtS5FullName,
            this.lblS5,
            this.txtS5ProdSeg,
            this.txtS5Ecap,
            this.txtQtyS5,
            this.blankKitPriceS5,
            this.blankMaxQtyS5,
            this.txtS6ProdName,
            this.txtS6FullName,
            this.lblS6,
            this.txtS6ProdSeg,
            this.txtS6Ecap,
            this.txtQtyS6,
            this.blankKitPriceS6,
            this.blankMaxQtyS6,
            this.txtS7ProdName,
            this.txtS7FullName,
            this.lblS7,
            this.txtS7ProdSeg,
            this.txtS7Ecap,
            this.txtQtyS7,
            this.blankKitPriceS7,
            this.blankMaxQtyS7,
            this.txtS8ProdName,
            this.txtS8FullName,
            this.lblS8,
            this.txtS8ProdSeg,
            this.txtS8Ecap,
            this.txtQtyS8,
            this.blankKitPriceS8,
            this.blankMaxQtyS8,
            this.txtS9ProdName,
            this.txtS9FullName,
            this.lblS9,
            this.txtS9ProdSeg,
            this.txtS9Ecap,
            this.txtQtyS9,
            this.blankKitPriceS9,
            this.blankMaxQtyS9,
            this.ttlAdditional,
            this.lblProject,
            this.txtProject,
            this.lblTerms,
            this.txtTerms
            });
            this.panel1.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(0.00D), Telerik.Reporting.Drawing.Unit.Inch(0.60D)); //.93
            this.panel1.Name = "panel1";
            this.panel1.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(7.60D), Telerik.Reporting.Drawing.Unit.Inch(24.00D));
            //this.panel1.Style.BackgroundColor = System.Drawing.Color.LightSeaGreen;


            // 
            // UpperLegalContent (Upper Body Legal Text)
            // 
            this.UpperLegalContent.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(0.00), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.UpperLegalContent.Name = "UpperLegalContent";
            this.UpperLegalContent.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(7.50D), Telerik.Reporting.Drawing.Unit.Inch(0.40D)); //.70
            //this.UpperLegalContent.Style.BackgroundColor = System.Drawing.Color.LightCyan;
            this.UpperLegalContent.Style.Font.Name = "Intel Clear";
            this.UpperLegalContent.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.UpperLegalContent.Style.Padding.Top = Telerik.Reporting.Drawing.Unit.Pixel(6D);
            this.UpperLegalContent.Value = resources.GetString("UpperLegalContent.Value");

            // 
            // LowerLegalContent (Lower Legal Text Field)
            // 
            this.LowerLegalContent.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(0.00D), Telerik.Reporting.Drawing.Unit.Inch(LowerLegalText)); // 5.0
            this.LowerLegalContent.Name = "LowerLegalContent";
            this.LowerLegalContent.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(7.50D), Telerik.Reporting.Drawing.Unit.Inch(18.00D));
            //this.UpperLegalContent.Style.BackgroundColor = System.Drawing.Color.YellowGreen;
            this.LowerLegalContent.Style.Font.Name = "Intel Clear";
            this.LowerLegalContent.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.LowerLegalContent.Style.Padding.Top = Telerik.Reporting.Drawing.Unit.Pixel(6D);
            this.LowerLegalContent.Value = resources.GetString("LowerLegalContent.Value");


            //-----------------------------------------------------------------------------------------------------------------------------------------------------------
            // DEALS INFORMATION TABLE
            //
            // DealSectionHeader (Deal header block titlebar, first 2 columns)
            // 
            this.DealSectionHeader.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(0.00D), Telerik.Reporting.Drawing.Unit.Inch(DealDetailsHeader));
            this.DealSectionHeader.Name = "DealSectionHeader";
            this.DealSectionHeader.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(7.50D), Telerik.Reporting.Drawing.Unit.Inch(NormalRowHeight));
            this.DealSectionHeader.Style.BackgroundColor = System.Drawing.Color.FromArgb(((int)(((byte)(200)))), ((int)(((byte)(214)))), ((int)(((byte)(227)))), ((int)(((byte)(247)))));
            this.DealSectionHeader.Style.BorderColor.Top = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.DealSectionHeader.Style.BorderStyle.Top = Telerik.Reporting.Drawing.BorderType.Solid;
            this.DealSectionHeader.Style.BorderWidth.Top = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.DealSectionHeader.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(125)))), ((int)(((byte)(197)))));
            this.DealSectionHeader.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.DealSectionHeader.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.DealSectionHeader.Value = "Intel Quote";

            // 
            // ttlKitName (Kit Name Block - Overwrite Title block if KIT)
            // 
            this.ttlKitName.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(2.50D), Telerik.Reporting.Drawing.Unit.Inch(DealDetailsHeader));
            this.ttlKitName.Name = "ttlKitName";
            this.ttlKitName.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(5.00D), Telerik.Reporting.Drawing.Unit.Inch(NormalRowHeight));
            this.ttlKitName.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(125)))), ((int)(((byte)(197)))));
            this.ttlKitName.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.ttlKitName.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.ttlKitName.Value = "Kit Name";

            // 
            // ECAP Type
            // 
            this.EcapTypeLabel.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(Col1Location), Telerik.Reporting.Drawing.Unit.Inch(DealDetailsHeaderRow1));
            this.EcapTypeLabel.Name = "EcapTypeLabel";
            this.EcapTypeLabel.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(SingleColWidth), Telerik.Reporting.Drawing.Unit.Inch(NormalRowHeight));
            this.EcapTypeLabel.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.EcapTypeLabel.Style.BorderColor.Bottom = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.EcapTypeLabel.Style.BorderColor.Default = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.EcapTypeLabel.Style.BorderColor.Left = System.Drawing.Color.Transparent;
            this.EcapTypeLabel.Style.BorderColor.Right = System.Drawing.Color.Transparent;
            this.EcapTypeLabel.Style.BorderColor.Top = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.EcapTypeLabel.Style.BorderStyle.Bottom = Telerik.Reporting.Drawing.BorderType.Solid;
            this.EcapTypeLabel.Style.BorderStyle.Default = Telerik.Reporting.Drawing.BorderType.None;
            this.EcapTypeLabel.Style.BorderStyle.Left = Telerik.Reporting.Drawing.BorderType.None;
            this.EcapTypeLabel.Style.BorderStyle.Right = Telerik.Reporting.Drawing.BorderType.None;
            this.EcapTypeLabel.Style.BorderStyle.Top = Telerik.Reporting.Drawing.BorderType.Solid;
            this.EcapTypeLabel.Style.BorderWidth.Bottom = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.EcapTypeLabel.Style.BorderWidth.Default = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.EcapTypeLabel.Style.BorderWidth.Left = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.EcapTypeLabel.Style.BorderWidth.Right = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.EcapTypeLabel.Style.BorderWidth.Top = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.EcapTypeLabel.Style.Font.Bold = true;
            this.EcapTypeLabel.Style.Font.Name = "Intel Clear";
            this.EcapTypeLabel.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Point(11D);
            this.EcapTypeLabel.Style.LineWidth = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.EcapTypeLabel.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.EcapTypeLabel.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.EcapTypeLabel.Value = "<span style=\"font-size: 10px; font-family: neo sans intel\"><strong>ECAP Type<br>&nbsp;</strong></span>";
            // 
            // ECAP Type Value
            // 
            this.txtECAPType.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(Col1Location), Telerik.Reporting.Drawing.Unit.Inch(DealDetailsTextRow1));
            this.txtECAPType.Name = "txtECAPType";
            this.txtECAPType.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(SingleColWidth), Telerik.Reporting.Drawing.Unit.Inch(NormalRowHeight));
            this.txtECAPType.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtECAPType.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtECAPType.Style.Font.Name = "Intel Clear";
            this.txtECAPType.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtECAPType.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtECAPType.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtECAPType.Value = "";

            // 
            // End Customer
            // 
            this.EndCustomerLabel.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(Col2Location), Telerik.Reporting.Drawing.Unit.Inch(DealDetailsHeaderRow1));
            this.EndCustomerLabel.Name = "EndCustomerLabel";
            this.EndCustomerLabel.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(SingleColWidth), Telerik.Reporting.Drawing.Unit.Inch(NormalRowHeight));
            this.EndCustomerLabel.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.EndCustomerLabel.Style.BorderColor.Bottom = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.EndCustomerLabel.Style.BorderColor.Default = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.EndCustomerLabel.Style.BorderColor.Left = System.Drawing.Color.Transparent;
            this.EndCustomerLabel.Style.BorderColor.Right = System.Drawing.Color.Transparent;
            this.EndCustomerLabel.Style.BorderColor.Top = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.EndCustomerLabel.Style.BorderStyle.Bottom = Telerik.Reporting.Drawing.BorderType.Solid;
            this.EndCustomerLabel.Style.BorderStyle.Default = Telerik.Reporting.Drawing.BorderType.None;
            this.EndCustomerLabel.Style.BorderStyle.Left = Telerik.Reporting.Drawing.BorderType.None;
            this.EndCustomerLabel.Style.BorderStyle.Right = Telerik.Reporting.Drawing.BorderType.None;
            this.EndCustomerLabel.Style.BorderStyle.Top = Telerik.Reporting.Drawing.BorderType.Solid;
            this.EndCustomerLabel.Style.BorderWidth.Bottom = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.EndCustomerLabel.Style.BorderWidth.Default = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.EndCustomerLabel.Style.BorderWidth.Left = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.EndCustomerLabel.Style.BorderWidth.Right = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.EndCustomerLabel.Style.BorderWidth.Top = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.EndCustomerLabel.Style.Font.Bold = true;
            this.EndCustomerLabel.Style.Font.Name = "Intel Clear";
            this.EndCustomerLabel.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Point(11D);
            this.EndCustomerLabel.Style.LineWidth = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.EndCustomerLabel.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.EndCustomerLabel.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.EndCustomerLabel.Value = "<span style=\"font-size: 10px; font-family: neo sans intel\"><strong>End Customer<br>&nbsp;</strong></span>";
            // 
            // End Customer Value
            // 
            this.txtEndCustomer.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(Col2Location), Telerik.Reporting.Drawing.Unit.Inch(DealDetailsTextRow1));
            this.txtEndCustomer.Name = "txtEndCustomer";
            this.txtEndCustomer.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(SingleColWidth), Telerik.Reporting.Drawing.Unit.Inch(NormalRowHeight));
            this.txtEndCustomer.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtEndCustomer.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtEndCustomer.Style.Font.Name = "Intel Clear";
            this.txtEndCustomer.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtEndCustomer.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtEndCustomer.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtEndCustomer.Value = "";

            // 
            // Deal Status
            // 
            this.DealStatusLabel.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(Col3Location), Telerik.Reporting.Drawing.Unit.Inch(DealDetailsHeaderRow1));
            this.DealStatusLabel.Name = "DealStatusLabel";
            this.DealStatusLabel.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(SingleColWidth), Telerik.Reporting.Drawing.Unit.Inch(NormalRowHeight));
            this.DealStatusLabel.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.DealStatusLabel.Style.BorderColor.Bottom = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.DealStatusLabel.Style.BorderColor.Default = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.DealStatusLabel.Style.BorderColor.Left = System.Drawing.Color.Transparent;
            this.DealStatusLabel.Style.BorderColor.Right = System.Drawing.Color.Transparent;
            this.DealStatusLabel.Style.BorderColor.Top = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.DealStatusLabel.Style.BorderStyle.Bottom = Telerik.Reporting.Drawing.BorderType.Solid;
            this.DealStatusLabel.Style.BorderStyle.Default = Telerik.Reporting.Drawing.BorderType.None;
            this.DealStatusLabel.Style.BorderStyle.Left = Telerik.Reporting.Drawing.BorderType.None;
            this.DealStatusLabel.Style.BorderStyle.Right = Telerik.Reporting.Drawing.BorderType.None;
            this.DealStatusLabel.Style.BorderStyle.Top = Telerik.Reporting.Drawing.BorderType.Solid;
            this.DealStatusLabel.Style.BorderWidth.Bottom = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.DealStatusLabel.Style.BorderWidth.Default = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.DealStatusLabel.Style.BorderWidth.Left = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.DealStatusLabel.Style.BorderWidth.Right = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.DealStatusLabel.Style.BorderWidth.Top = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.DealStatusLabel.Style.Font.Bold = true;
            this.DealStatusLabel.Style.Font.Name = "Intel Clear";
            this.DealStatusLabel.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Point(11D);
            this.DealStatusLabel.Style.LineWidth = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.DealStatusLabel.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.DealStatusLabel.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.DealStatusLabel.Value = "<span style=\"font-family: neo sans intel; font-size: 10px\"><strong>Deal Status<br>&nbsp;</strong></span>";
            // 
            // Deal Status Value
            // 
            this.txtDealStatus.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(Col3Location), Telerik.Reporting.Drawing.Unit.Inch(DealDetailsTextRow1));
            this.txtDealStatus.Name = "txtDealStatus";
            this.txtDealStatus.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(SingleColWidth), Telerik.Reporting.Drawing.Unit.Inch(NormalRowHeight));
            this.txtDealStatus.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtDealStatus.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtDealStatus.Style.Font.Name = "Intel Clear";
            this.txtDealStatus.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtDealStatus.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtDealStatus.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtDealStatus.Value = "";

            // 
            // Program Payment
            // 
            this.ProgramPaymentLabel.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(Col4Location), Telerik.Reporting.Drawing.Unit.Inch(DealDetailsHeaderRow1));
            this.ProgramPaymentLabel.Name = "ProgramPaymentLabel";
            this.ProgramPaymentLabel.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(SingleColWidth), Telerik.Reporting.Drawing.Unit.Inch(NormalRowHeight));
            this.ProgramPaymentLabel.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.ProgramPaymentLabel.Style.BorderColor.Bottom = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.ProgramPaymentLabel.Style.BorderColor.Default = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.ProgramPaymentLabel.Style.BorderColor.Left = System.Drawing.Color.Transparent;
            this.ProgramPaymentLabel.Style.BorderColor.Right = System.Drawing.Color.Transparent;
            this.ProgramPaymentLabel.Style.BorderColor.Top = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.ProgramPaymentLabel.Style.BorderStyle.Bottom = Telerik.Reporting.Drawing.BorderType.Solid;
            this.ProgramPaymentLabel.Style.BorderStyle.Default = Telerik.Reporting.Drawing.BorderType.None;
            this.ProgramPaymentLabel.Style.BorderStyle.Left = Telerik.Reporting.Drawing.BorderType.None;
            this.ProgramPaymentLabel.Style.BorderStyle.Right = Telerik.Reporting.Drawing.BorderType.None;
            this.ProgramPaymentLabel.Style.BorderStyle.Top = Telerik.Reporting.Drawing.BorderType.Solid;
            this.ProgramPaymentLabel.Style.BorderWidth.Bottom = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.ProgramPaymentLabel.Style.BorderWidth.Default = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.ProgramPaymentLabel.Style.BorderWidth.Left = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.ProgramPaymentLabel.Style.BorderWidth.Right = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.ProgramPaymentLabel.Style.BorderWidth.Top = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.ProgramPaymentLabel.Style.Font.Bold = true;
            this.ProgramPaymentLabel.Style.Font.Name = "Intel Clear";
            this.ProgramPaymentLabel.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Point(11D);
            this.ProgramPaymentLabel.Style.LineWidth = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.ProgramPaymentLabel.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.ProgramPaymentLabel.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.ProgramPaymentLabel.Value = "<span style=\"font-size: 10px; font-family: neo sans intel\"><strong>Program Payment<br>&nbsp;</strong></span>";
            // 
            // Program Payment Value
            // 
            this.txtProgramPayment.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(Col4Location), Telerik.Reporting.Drawing.Unit.Inch(DealDetailsTextRow1));
            this.txtProgramPayment.Name = "txtProgramPayment";
            this.txtProgramPayment.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(SingleColWidth), Telerik.Reporting.Drawing.Unit.Inch(NormalRowHeight));
            this.txtProgramPayment.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtProgramPayment.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtProgramPayment.Style.Font.Name = "Intel Clear";
            this.txtProgramPayment.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtProgramPayment.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtProgramPayment.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtProgramPayment.Value = "";

            // 
            // Based On
            // 
            this.PayoutBasedOnLabel.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(Col5Location), Telerik.Reporting.Drawing.Unit.Inch(DealDetailsHeaderRow1));
            this.PayoutBasedOnLabel.Name = "PayoutBasedOnLabel";
            this.PayoutBasedOnLabel.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(SingleColWidth), Telerik.Reporting.Drawing.Unit.Inch(NormalRowHeight));
            this.PayoutBasedOnLabel.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.PayoutBasedOnLabel.Style.BorderColor.Bottom = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.PayoutBasedOnLabel.Style.BorderColor.Default = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.PayoutBasedOnLabel.Style.BorderColor.Left = System.Drawing.Color.Transparent;
            this.PayoutBasedOnLabel.Style.BorderColor.Right = System.Drawing.Color.Transparent;
            this.PayoutBasedOnLabel.Style.BorderColor.Top = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.PayoutBasedOnLabel.Style.BorderStyle.Bottom = Telerik.Reporting.Drawing.BorderType.Solid;
            this.PayoutBasedOnLabel.Style.BorderStyle.Default = Telerik.Reporting.Drawing.BorderType.None;
            this.PayoutBasedOnLabel.Style.BorderStyle.Left = Telerik.Reporting.Drawing.BorderType.None;
            this.PayoutBasedOnLabel.Style.BorderStyle.Right = Telerik.Reporting.Drawing.BorderType.None;
            this.PayoutBasedOnLabel.Style.BorderStyle.Top = Telerik.Reporting.Drawing.BorderType.Solid;
            this.PayoutBasedOnLabel.Style.BorderWidth.Bottom = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.PayoutBasedOnLabel.Style.BorderWidth.Default = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.PayoutBasedOnLabel.Style.BorderWidth.Left = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.PayoutBasedOnLabel.Style.BorderWidth.Right = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.PayoutBasedOnLabel.Style.BorderWidth.Top = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.PayoutBasedOnLabel.Style.Font.Bold = true;
            this.PayoutBasedOnLabel.Style.Font.Name = "Intel Clear";
            this.PayoutBasedOnLabel.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Point(11D);
            this.PayoutBasedOnLabel.Style.LineWidth = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.PayoutBasedOnLabel.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.PayoutBasedOnLabel.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.PayoutBasedOnLabel.Value = "<span style=\"font-size: 10px; font-family: neo sans intel\"><strong>Based On<br>&nbsp;</strong></span>";
            // 
            // Based On Value
            // 
            this.txtPayoutBasedOn.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(Col5Location), Telerik.Reporting.Drawing.Unit.Inch(DealDetailsTextRow1));
            this.txtPayoutBasedOn.Name = "txtPayoutBasedOn";
            this.txtPayoutBasedOn.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(SingleColWidth), Telerik.Reporting.Drawing.Unit.Inch(NormalRowHeight));
            this.txtPayoutBasedOn.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtPayoutBasedOn.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtPayoutBasedOn.Style.Font.Name = "Intel Clear";
            this.txtPayoutBasedOn.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtPayoutBasedOn.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtPayoutBasedOn.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtPayoutBasedOn.Value = "";

            // 
            // Group Type 
            // 
            this.lblGroupType.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(Col6Location), Telerik.Reporting.Drawing.Unit.Inch(DealDetailsHeaderRow1));
            this.lblGroupType.Name = "lblGroupType";
            this.lblGroupType.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(SingleColWidth), Telerik.Reporting.Drawing.Unit.Inch(NormalRowHeight));
            this.lblGroupType.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.lblGroupType.Style.BorderColor.Bottom = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.lblGroupType.Style.BorderColor.Default = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.lblGroupType.Style.BorderColor.Left = System.Drawing.Color.Transparent;
            this.lblGroupType.Style.BorderColor.Right = System.Drawing.Color.Transparent;
            this.lblGroupType.Style.BorderColor.Top = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.lblGroupType.Style.BorderStyle.Bottom = Telerik.Reporting.Drawing.BorderType.Solid;
            this.lblGroupType.Style.BorderStyle.Default = Telerik.Reporting.Drawing.BorderType.None;
            this.lblGroupType.Style.BorderStyle.Left = Telerik.Reporting.Drawing.BorderType.None;
            this.lblGroupType.Style.BorderStyle.Right = Telerik.Reporting.Drawing.BorderType.None;
            this.lblGroupType.Style.BorderStyle.Top = Telerik.Reporting.Drawing.BorderType.Solid;
            this.lblGroupType.Style.BorderWidth.Bottom = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.lblGroupType.Style.BorderWidth.Default = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.lblGroupType.Style.BorderWidth.Left = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.lblGroupType.Style.BorderWidth.Right = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.lblGroupType.Style.BorderWidth.Top = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.lblGroupType.Style.Font.Bold = true;
            this.lblGroupType.Style.Font.Name = "Intel Clear";
            this.lblGroupType.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Point(11D);
            this.lblGroupType.Style.LineWidth = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.lblGroupType.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.lblGroupType.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.lblGroupType.Value = "<span style=\"font-size: 10px; font-family: neo sans intel\"><strong>Group Type<br>&nbsp;</strong></span>";

            // 
            // Group Type Value
            // 
            this.txtGroupType.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(Col6Location), Telerik.Reporting.Drawing.Unit.Inch(DealDetailsTextRow1));
            this.txtGroupType.Name = "txtGroupType";
            this.txtGroupType.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(SingleColWidth), Telerik.Reporting.Drawing.Unit.Inch(NormalRowHeight));
            this.txtGroupType.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtGroupType.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtGroupType.Style.Font.Name = "Intel Clear";
            this.txtGroupType.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtGroupType.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtGroupType.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtGroupType.Value = "";

            // -----ROW 2-----
            // 
            // Start Date
            // 
            this.StartDateLabel.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(Col1Location), Telerik.Reporting.Drawing.Unit.Inch(DealDetailsHeaderRow2));
            this.StartDateLabel.Name = "StartDateLabel";
            this.StartDateLabel.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(SingleColWidth), Telerik.Reporting.Drawing.Unit.Inch(FatRowHeight));
            this.StartDateLabel.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.StartDateLabel.Style.BorderColor.Bottom = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.StartDateLabel.Style.BorderColor.Default = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.StartDateLabel.Style.BorderColor.Left = System.Drawing.Color.Transparent;
            this.StartDateLabel.Style.BorderColor.Right = System.Drawing.Color.Transparent;
            this.StartDateLabel.Style.BorderColor.Top = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.StartDateLabel.Style.BorderStyle.Bottom = Telerik.Reporting.Drawing.BorderType.Solid;
            this.StartDateLabel.Style.BorderStyle.Default = Telerik.Reporting.Drawing.BorderType.None;
            this.StartDateLabel.Style.BorderStyle.Left = Telerik.Reporting.Drawing.BorderType.None;
            this.StartDateLabel.Style.BorderStyle.Right = Telerik.Reporting.Drawing.BorderType.None;
            this.StartDateLabel.Style.BorderStyle.Top = Telerik.Reporting.Drawing.BorderType.Solid;
            this.StartDateLabel.Style.BorderWidth.Bottom = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.StartDateLabel.Style.BorderWidth.Default = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.StartDateLabel.Style.BorderWidth.Left = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.StartDateLabel.Style.BorderWidth.Right = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.StartDateLabel.Style.BorderWidth.Top = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.StartDateLabel.Style.Font.Bold = true;
            this.StartDateLabel.Style.Font.Name = "Intel Clear";
            this.StartDateLabel.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Point(11D);
            this.StartDateLabel.Style.LineWidth = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.StartDateLabel.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.StartDateLabel.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.StartDateLabel.StyleName = "BlueLine";
            this.StartDateLabel.Value = "<span style=\"font-family: neo sans intel; font-size: 10px\"><strong>Billings Effective Start Date</strong></span>";
            // 
            // Start Date Value
            // 
            this.txtStartDate.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(Col1Location), Telerik.Reporting.Drawing.Unit.Inch(DealDetailsTextRow2));
            this.txtStartDate.Name = "txtStartDate";
            this.txtStartDate.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(SingleColWidth), Telerik.Reporting.Drawing.Unit.Inch(NormalRowHeight));
            this.txtStartDate.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtStartDate.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtStartDate.Style.Font.Name = "Intel Clear";
            this.txtStartDate.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtStartDate.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtStartDate.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtStartDate.Value = "";

            // 
            // End Date
            // 
            this.EndDateLabel.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(Col2Location), Telerik.Reporting.Drawing.Unit.Inch(DealDetailsHeaderRow2));
            this.EndDateLabel.Name = "EndDateLabel";
            this.EndDateLabel.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(SingleColWidth), Telerik.Reporting.Drawing.Unit.Inch(FatRowHeight));
            this.EndDateLabel.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.EndDateLabel.Style.BorderColor.Bottom = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.EndDateLabel.Style.BorderColor.Default = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.EndDateLabel.Style.BorderColor.Left = System.Drawing.Color.Transparent;
            this.EndDateLabel.Style.BorderColor.Right = System.Drawing.Color.Transparent;
            this.EndDateLabel.Style.BorderColor.Top = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.EndDateLabel.Style.BorderStyle.Bottom = Telerik.Reporting.Drawing.BorderType.Solid;
            this.EndDateLabel.Style.BorderStyle.Default = Telerik.Reporting.Drawing.BorderType.None;
            this.EndDateLabel.Style.BorderStyle.Left = Telerik.Reporting.Drawing.BorderType.None;
            this.EndDateLabel.Style.BorderStyle.Right = Telerik.Reporting.Drawing.BorderType.None;
            this.EndDateLabel.Style.BorderStyle.Top = Telerik.Reporting.Drawing.BorderType.Solid;
            this.EndDateLabel.Style.BorderWidth.Bottom = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.EndDateLabel.Style.BorderWidth.Default = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.EndDateLabel.Style.BorderWidth.Left = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.EndDateLabel.Style.BorderWidth.Right = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.EndDateLabel.Style.BorderWidth.Top = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.EndDateLabel.Style.Font.Bold = true;
            this.EndDateLabel.Style.Font.Name = "Intel Clear";
            this.EndDateLabel.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Point(11D);
            this.EndDateLabel.Style.LineWidth = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.EndDateLabel.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.EndDateLabel.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.EndDateLabel.Value = "<span style=\"font-family: neo sans intel; font-size: 10px\"><strong>Billings Effective End Date</strong></span>";
            // 
            // End Date Value
            // 
            this.txtEndDate.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(Col2Location), Telerik.Reporting.Drawing.Unit.Inch(DealDetailsTextRow2));
            this.txtEndDate.Name = "txtEndDate";
            this.txtEndDate.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(SingleColWidth), Telerik.Reporting.Drawing.Unit.Inch(NormalRowHeight));
            this.txtEndDate.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtEndDate.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtEndDate.Style.Font.Name = "Intel Clear";
            this.txtEndDate.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtEndDate.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtEndDate.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtEndDate.Value = "";

            // 
            // Consumption Billing Start 
            // 
            this.lblConsumptionStartDate.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(Col3Location), Telerik.Reporting.Drawing.Unit.Inch(DealDetailsHeaderRow2));
            this.lblConsumptionStartDate.Name = "lblConsumptionStartDate";
            this.lblConsumptionStartDate.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(SingleColWidth), Telerik.Reporting.Drawing.Unit.Inch(FatRowHeight));
            this.lblConsumptionStartDate.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.lblConsumptionStartDate.Style.BorderColor.Bottom = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.lblConsumptionStartDate.Style.BorderColor.Default = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.lblConsumptionStartDate.Style.BorderColor.Left = System.Drawing.Color.Transparent;
            this.lblConsumptionStartDate.Style.BorderColor.Right = System.Drawing.Color.Transparent;
            this.lblConsumptionStartDate.Style.BorderColor.Top = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.lblConsumptionStartDate.Style.BorderStyle.Bottom = Telerik.Reporting.Drawing.BorderType.Solid;
            this.lblConsumptionStartDate.Style.BorderStyle.Default = Telerik.Reporting.Drawing.BorderType.None;
            this.lblConsumptionStartDate.Style.BorderStyle.Left = Telerik.Reporting.Drawing.BorderType.None;
            this.lblConsumptionStartDate.Style.BorderStyle.Right = Telerik.Reporting.Drawing.BorderType.None;
            this.lblConsumptionStartDate.Style.BorderStyle.Top = Telerik.Reporting.Drawing.BorderType.Solid;
            this.lblConsumptionStartDate.Style.BorderWidth.Bottom = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.lblConsumptionStartDate.Style.BorderWidth.Default = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.lblConsumptionStartDate.Style.BorderWidth.Left = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.lblConsumptionStartDate.Style.BorderWidth.Right = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.lblConsumptionStartDate.Style.BorderWidth.Top = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.lblConsumptionStartDate.Style.Font.Bold = true;
            this.lblConsumptionStartDate.Style.Font.Name = "Intel Clear";
            this.lblConsumptionStartDate.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Point(11D);
            this.lblConsumptionStartDate.Style.LineWidth = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.lblConsumptionStartDate.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.lblConsumptionStartDate.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.lblConsumptionStartDate.Value = "<span style=\"font-size: 10px; font-family: neo sans intel\"><span style=\"color: #000000\"><strong>Consumption Start Date</strong></span></span>";
            // 
            // Consumption Billing Start Value
            // 
            this.txtConsumptionStartDate.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(Col3Location), Telerik.Reporting.Drawing.Unit.Inch(DealDetailsTextRow2));
            this.txtConsumptionStartDate.Name = "txtConsumptionStartDate";
            this.txtConsumptionStartDate.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(SingleColWidth), Telerik.Reporting.Drawing.Unit.Inch(NormalRowHeight));
            this.txtConsumptionStartDate.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtConsumptionStartDate.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtConsumptionStartDate.Style.Font.Name = "Intel Clear";
            this.txtConsumptionStartDate.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtConsumptionStartDate.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtConsumptionStartDate.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtConsumptionStartDate.Value = "";

            // 
            // Consumption Billing End (End Customer Block)
            // 
            this.lblConsumptionEndDate.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(Col4Location), Telerik.Reporting.Drawing.Unit.Inch(DealDetailsHeaderRow2));
            this.lblConsumptionEndDate.Name = "lblConsumptionEndDate";
            this.lblConsumptionEndDate.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(SingleColWidth), Telerik.Reporting.Drawing.Unit.Inch(FatRowHeight));
            this.lblConsumptionEndDate.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.lblConsumptionEndDate.Style.BorderColor.Bottom = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.lblConsumptionEndDate.Style.BorderColor.Default = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.lblConsumptionEndDate.Style.BorderColor.Left = System.Drawing.Color.Transparent;
            this.lblConsumptionEndDate.Style.BorderColor.Right = System.Drawing.Color.Transparent;
            this.lblConsumptionEndDate.Style.BorderColor.Top = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.lblConsumptionEndDate.Style.BorderStyle.Bottom = Telerik.Reporting.Drawing.BorderType.Solid;
            this.lblConsumptionEndDate.Style.BorderStyle.Default = Telerik.Reporting.Drawing.BorderType.None;
            this.lblConsumptionEndDate.Style.BorderStyle.Left = Telerik.Reporting.Drawing.BorderType.None;
            this.lblConsumptionEndDate.Style.BorderStyle.Right = Telerik.Reporting.Drawing.BorderType.None;
            this.lblConsumptionEndDate.Style.BorderStyle.Top = Telerik.Reporting.Drawing.BorderType.Solid;
            this.lblConsumptionEndDate.Style.BorderWidth.Bottom = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.lblConsumptionEndDate.Style.BorderWidth.Default = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.lblConsumptionEndDate.Style.BorderWidth.Left = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.lblConsumptionEndDate.Style.BorderWidth.Right = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.lblConsumptionEndDate.Style.BorderWidth.Top = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.lblConsumptionEndDate.Style.Font.Bold = true;
            this.lblConsumptionEndDate.Style.Font.Name = "Intel Clear";
            this.lblConsumptionEndDate.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Point(11D);
            this.lblConsumptionEndDate.Style.LineWidth = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.lblConsumptionEndDate.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.lblConsumptionEndDate.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.lblConsumptionEndDate.Value = "<span style=\"font-size: 10px; font-family: neo sans intel\"><span style=\"color: #000000\"><strong>Consumption End Date</strong></span></span>";
            // 
            // Consumption Billing End Value
            // 
            this.txtConsumptionEndDate.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(Col4Location), Telerik.Reporting.Drawing.Unit.Inch(DealDetailsTextRow2));
            this.txtConsumptionEndDate.Name = "txtConsumptionEndDate";
            this.txtConsumptionEndDate.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(SingleColWidth), Telerik.Reporting.Drawing.Unit.Inch(NormalRowHeight));
            this.txtConsumptionEndDate.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtConsumptionEndDate.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtConsumptionEndDate.Style.Font.Name = "Intel Clear";
            this.txtConsumptionEndDate.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtConsumptionEndDate.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtConsumptionEndDate.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtConsumptionEndDate.Value = "";
            

            // 
            // Last Consumption Empty Placeholder Label Box
            // 
            this.lblConsEmpty.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(Col5Location), Telerik.Reporting.Drawing.Unit.Inch(DealDetailsHeaderRow2));
            this.lblConsEmpty.Name = "lblConsEmpty";
            this.lblConsEmpty.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(SpaceholderWidth), Telerik.Reporting.Drawing.Unit.Inch(FatRowHeight));
            this.lblConsEmpty.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.lblConsEmpty.Style.BorderColor.Bottom = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.lblConsEmpty.Style.BorderColor.Default = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.lblConsEmpty.Style.BorderColor.Left = System.Drawing.Color.Transparent;
            this.lblConsEmpty.Style.BorderColor.Right = System.Drawing.Color.Transparent;
            this.lblConsEmpty.Style.BorderColor.Top = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.lblConsEmpty.Style.BorderStyle.Bottom = Telerik.Reporting.Drawing.BorderType.Solid;
            this.lblConsEmpty.Style.BorderStyle.Default = Telerik.Reporting.Drawing.BorderType.None;
            this.lblConsEmpty.Style.BorderStyle.Left = Telerik.Reporting.Drawing.BorderType.None;
            this.lblConsEmpty.Style.BorderStyle.Right = Telerik.Reporting.Drawing.BorderType.None;
            this.lblConsEmpty.Style.BorderStyle.Top = Telerik.Reporting.Drawing.BorderType.Solid;
            this.lblConsEmpty.Style.BorderWidth.Bottom = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.lblConsEmpty.Style.BorderWidth.Default = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.lblConsEmpty.Style.BorderWidth.Left = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.lblConsEmpty.Style.BorderWidth.Right = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.lblConsEmpty.Style.BorderWidth.Top = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.lblConsEmpty.Style.Font.Bold = true;
            this.lblConsEmpty.Style.Font.Name = "Intel Clear";
            this.lblConsEmpty.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Point(11D);
            this.lblConsEmpty.Style.LineWidth = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.lblConsEmpty.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.lblConsEmpty.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.lblConsEmpty.Value = "&nbsp;";
            // 
            // Last Consumption Empty Placeholder Value Box
            // 
            this.txtConsEmpty.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(Col5Location), Telerik.Reporting.Drawing.Unit.Inch(DealDetailsTextRow2));
            this.txtConsEmpty.Name = "txtConsEmpty";
            this.txtConsEmpty.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(2.50D), Telerik.Reporting.Drawing.Unit.Inch(NormalRowHeight));
            this.txtConsEmpty.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtConsEmpty.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtConsEmpty.Style.Font.Name = "Intel Clear";
            this.txtConsEmpty.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtConsEmpty.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtConsEmpty.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtConsEmpty.Value = "&nbsp;";


            //-----------------------------------------------------------------------------------------------------------------------------------------------------------
            // THIS IS ALL UNDER PRODUCTS BLOCK
            // 
            // Products Information Block - Labels first
            // 
            this.ttlProductInfo.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(0.00D), Telerik.Reporting.Drawing.Unit.Inch(ProductsSectionHeader));
            this.ttlProductInfo.Name = "ttlProductInfo";
            this.ttlProductInfo.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(7.50D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.ttlProductInfo.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.ttlProductInfo.Style.BackgroundColor = System.Drawing.Color.FromArgb(((int)(((byte)(200)))), ((int)(((byte)(214)))), ((int)(((byte)(227)))), ((int)(((byte)(247)))));
            this.ttlProductInfo.Style.BorderColor.Left = System.Drawing.Color.Black;
            this.ttlProductInfo.Style.BorderColor.Top = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.ttlProductInfo.Style.BorderStyle.Left = Telerik.Reporting.Drawing.BorderType.None;
            this.ttlProductInfo.Style.BorderStyle.Top = Telerik.Reporting.Drawing.BorderType.Solid;
            this.ttlProductInfo.Style.BorderWidth.Default = Telerik.Reporting.Drawing.Unit.Point(0D);
            this.ttlProductInfo.Style.BorderWidth.Top = Telerik.Reporting.Drawing.Unit.Point(1D);
            this.ttlProductInfo.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(125)))), ((int)(((byte)(197)))));
            this.ttlProductInfo.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.ttlProductInfo.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.ttlProductInfo.Value = "Product Information";

            // 
            // Blank Products Filler Label
            // 
            this.htmlTextBox2.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(0.0D), Telerik.Reporting.Drawing.Unit.Inch(ProductsHeader));
            this.htmlTextBox2.Name = "htmlTextBox2";
            this.htmlTextBox2.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.htmlTextBox2.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.htmlTextBox2.Style.BorderColor.Bottom = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.htmlTextBox2.Style.BorderColor.Default = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.htmlTextBox2.Style.BorderColor.Left = System.Drawing.Color.Transparent;
            this.htmlTextBox2.Style.BorderColor.Right = System.Drawing.Color.Transparent;
            this.htmlTextBox2.Style.BorderColor.Top = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.htmlTextBox2.Style.BorderStyle.Bottom = Telerik.Reporting.Drawing.BorderType.Solid;
            this.htmlTextBox2.Style.BorderStyle.Default = Telerik.Reporting.Drawing.BorderType.None;
            this.htmlTextBox2.Style.BorderStyle.Left = Telerik.Reporting.Drawing.BorderType.None;
            this.htmlTextBox2.Style.BorderStyle.Right = Telerik.Reporting.Drawing.BorderType.None;
            this.htmlTextBox2.Style.BorderStyle.Top = Telerik.Reporting.Drawing.BorderType.None;
            this.htmlTextBox2.Style.BorderWidth.Bottom = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.htmlTextBox2.Style.BorderWidth.Default = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.htmlTextBox2.Style.BorderWidth.Left = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.htmlTextBox2.Style.BorderWidth.Right = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.htmlTextBox2.Style.BorderWidth.Top = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.htmlTextBox2.Style.Font.Bold = true;
            this.htmlTextBox2.Style.Font.Name = "Intel Clear";
            this.htmlTextBox2.Style.LineWidth = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.htmlTextBox2.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.htmlTextBox2.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.htmlTextBox2.Value = "&nbsp;";
            // 
            // Product Name
            // 
            this.htmlTextBox10.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(ProductsHeader));
            this.htmlTextBox10.Name = "htmlTextBox10";
            this.htmlTextBox10.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.50D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.htmlTextBox10.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.htmlTextBox10.Style.BorderColor.Bottom = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.htmlTextBox10.Style.BorderColor.Default = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.htmlTextBox10.Style.BorderColor.Left = System.Drawing.Color.Transparent;
            this.htmlTextBox10.Style.BorderColor.Right = System.Drawing.Color.Transparent;
            this.htmlTextBox10.Style.BorderColor.Top = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.htmlTextBox10.Style.BorderStyle.Bottom = Telerik.Reporting.Drawing.BorderType.Solid;
            this.htmlTextBox10.Style.BorderStyle.Default = Telerik.Reporting.Drawing.BorderType.None;
            this.htmlTextBox10.Style.BorderStyle.Left = Telerik.Reporting.Drawing.BorderType.None;
            this.htmlTextBox10.Style.BorderStyle.Right = Telerik.Reporting.Drawing.BorderType.None;
            this.htmlTextBox10.Style.BorderStyle.Top = Telerik.Reporting.Drawing.BorderType.Solid;
            this.htmlTextBox10.Style.BorderWidth.Bottom = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.htmlTextBox10.Style.BorderWidth.Default = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.htmlTextBox10.Style.BorderWidth.Left = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.htmlTextBox10.Style.BorderWidth.Right = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.htmlTextBox10.Style.BorderWidth.Top = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.htmlTextBox10.Style.Font.Bold = true;
            this.htmlTextBox10.Style.Font.Name = "Intel Clear";
            this.htmlTextBox10.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Point(11D);
            this.htmlTextBox10.Style.LineWidth = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.htmlTextBox10.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.htmlTextBox10.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.htmlTextBox10.Value = "<span style=\"font-size: 10px; font-family: neo sans intel\"><span style=\"color: #000000\"><strong>Product Name</strong></span></span>";

            // 
            // Product Segment
            // 
            this.htmlTextBox13.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(2.50D), Telerik.Reporting.Drawing.Unit.Inch(ProductsHeader));
            this.htmlTextBox13.Name = "htmlTextBox13";
            this.htmlTextBox13.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.htmlTextBox13.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.htmlTextBox13.Style.BorderColor.Bottom = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.htmlTextBox13.Style.BorderColor.Default = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.htmlTextBox13.Style.BorderColor.Left = System.Drawing.Color.Transparent;
            this.htmlTextBox13.Style.BorderColor.Right = System.Drawing.Color.Transparent;
            this.htmlTextBox13.Style.BorderColor.Top = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.htmlTextBox13.Style.BorderStyle.Bottom = Telerik.Reporting.Drawing.BorderType.Solid;
            this.htmlTextBox13.Style.BorderStyle.Default = Telerik.Reporting.Drawing.BorderType.None;
            this.htmlTextBox13.Style.BorderStyle.Left = Telerik.Reporting.Drawing.BorderType.None;
            this.htmlTextBox13.Style.BorderStyle.Right = Telerik.Reporting.Drawing.BorderType.None;
            this.htmlTextBox13.Style.BorderStyle.Top = Telerik.Reporting.Drawing.BorderType.Solid;
            this.htmlTextBox13.Style.BorderWidth.Bottom = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.htmlTextBox13.Style.BorderWidth.Default = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.htmlTextBox13.Style.BorderWidth.Left = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.htmlTextBox13.Style.BorderWidth.Right = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.htmlTextBox13.Style.BorderWidth.Top = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.htmlTextBox13.Style.Font.Bold = true;
            this.htmlTextBox13.Style.Font.Name = "Intel Clear";
            this.htmlTextBox13.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Point(11D);
            this.htmlTextBox13.Style.LineWidth = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.htmlTextBox13.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.htmlTextBox13.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.htmlTextBox13.Value = "<span style=\"font-size: 10px; font-family: neo sans intel\"><span style=\"color: #000000\"><strong>Product Segment</strong></span></span>";

            // 
            // Standalone Price
            // 
            this.htmlTextBox11.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(3.50D), Telerik.Reporting.Drawing.Unit.Inch(ProductsHeader));
            this.htmlTextBox11.Name = "htmlTextBox11";
            this.htmlTextBox11.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.htmlTextBox11.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.htmlTextBox11.Style.BorderColor.Bottom = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.htmlTextBox11.Style.BorderColor.Default = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.htmlTextBox11.Style.BorderColor.Left = System.Drawing.Color.Transparent;
            this.htmlTextBox11.Style.BorderColor.Right = System.Drawing.Color.Transparent;
            this.htmlTextBox11.Style.BorderColor.Top = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.htmlTextBox11.Style.BorderStyle.Bottom = Telerik.Reporting.Drawing.BorderType.Solid;
            this.htmlTextBox11.Style.BorderStyle.Default = Telerik.Reporting.Drawing.BorderType.None;
            this.htmlTextBox11.Style.BorderStyle.Left = Telerik.Reporting.Drawing.BorderType.None;
            this.htmlTextBox11.Style.BorderStyle.Right = Telerik.Reporting.Drawing.BorderType.None;
            this.htmlTextBox11.Style.BorderStyle.Top = Telerik.Reporting.Drawing.BorderType.Solid;
            this.htmlTextBox11.Style.BorderWidth.Bottom = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.htmlTextBox11.Style.BorderWidth.Default = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.htmlTextBox11.Style.BorderWidth.Left = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.htmlTextBox11.Style.BorderWidth.Right = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.htmlTextBox11.Style.BorderWidth.Top = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.htmlTextBox11.Style.Font.Bold = true;
            this.htmlTextBox11.Style.Font.Name = "Intel Clear";
            this.htmlTextBox11.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Point(11D);
            this.htmlTextBox11.Style.LineWidth = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.htmlTextBox11.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.htmlTextBox11.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.htmlTextBox11.Value = "<span style=\"font-size: 10px; font-family: neo sans intel\"><strong>Standalone Price </strong></span>";

            // 
            // Kit Qty
            // 
            this.htmlTextBox3.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(4.50D), Telerik.Reporting.Drawing.Unit.Inch(ProductsHeader));
            this.htmlTextBox3.Name = "htmlTextBox3";
            this.htmlTextBox3.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.htmlTextBox3.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.htmlTextBox3.Style.BorderColor.Bottom = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.htmlTextBox3.Style.BorderColor.Default = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.htmlTextBox3.Style.BorderColor.Left = System.Drawing.Color.Transparent;
            this.htmlTextBox3.Style.BorderColor.Right = System.Drawing.Color.Transparent;
            this.htmlTextBox3.Style.BorderColor.Top = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.htmlTextBox3.Style.BorderStyle.Bottom = Telerik.Reporting.Drawing.BorderType.Solid;
            this.htmlTextBox3.Style.BorderStyle.Default = Telerik.Reporting.Drawing.BorderType.None;
            this.htmlTextBox3.Style.BorderStyle.Left = Telerik.Reporting.Drawing.BorderType.None;
            this.htmlTextBox3.Style.BorderStyle.Right = Telerik.Reporting.Drawing.BorderType.None;
            this.htmlTextBox3.Style.BorderStyle.Top = Telerik.Reporting.Drawing.BorderType.Solid;
            this.htmlTextBox3.Style.BorderWidth.Bottom = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.htmlTextBox3.Style.BorderWidth.Default = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.htmlTextBox3.Style.BorderWidth.Left = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.htmlTextBox3.Style.BorderWidth.Right = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.htmlTextBox3.Style.BorderWidth.Top = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.htmlTextBox3.Style.Font.Bold = true;
            this.htmlTextBox3.Style.Font.Name = "Intel Clear";
            this.htmlTextBox3.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Point(11D);
            this.htmlTextBox3.Style.LineWidth = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.htmlTextBox3.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.htmlTextBox3.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.htmlTextBox3.Value = "<span style=\"font-size: 10px; font-family: neo sans intel\"><strong>Kit Qty</strong></span>";

            // 
            // Kit Price
            // 
            this.lblK1.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(5.50D), Telerik.Reporting.Drawing.Unit.Inch(ProductsHeader));
            this.lblK1.Name = "lblK1";
            this.lblK1.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.lblK1.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.lblK1.Style.BorderColor.Bottom = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.lblK1.Style.BorderColor.Default = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.lblK1.Style.BorderColor.Left = System.Drawing.Color.Transparent;
            this.lblK1.Style.BorderColor.Right = System.Drawing.Color.Transparent;
            this.lblK1.Style.BorderColor.Top = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.lblK1.Style.BorderStyle.Bottom = Telerik.Reporting.Drawing.BorderType.Solid;
            this.lblK1.Style.BorderStyle.Default = Telerik.Reporting.Drawing.BorderType.None;
            this.lblK1.Style.BorderStyle.Left = Telerik.Reporting.Drawing.BorderType.None;
            this.lblK1.Style.BorderStyle.Right = Telerik.Reporting.Drawing.BorderType.None;
            this.lblK1.Style.BorderStyle.Top = Telerik.Reporting.Drawing.BorderType.Solid;
            this.lblK1.Style.BorderWidth.Bottom = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.lblK1.Style.BorderWidth.Default = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.lblK1.Style.BorderWidth.Left = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.lblK1.Style.BorderWidth.Right = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.lblK1.Style.BorderWidth.Top = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.lblK1.Style.Font.Bold = true;
            this.lblK1.Style.Font.Name = "Intel Clear";
            this.lblK1.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Point(11D);
            this.lblK1.Style.LineWidth = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.lblK1.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.lblK1.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.lblK1.Value = "<span style=\"font-size: 10px; font-family: neo sans intel\"><span style=\"color: #000000\">KIT Price&nbsp;&nbsp; </span></span>";

            // 
            // Max Qty
            // 
            this.htmlTextBox14.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(6.50D), Telerik.Reporting.Drawing.Unit.Inch(ProductsHeader));
            this.htmlTextBox14.Name = "htmlTextBox14";
            this.htmlTextBox14.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.htmlTextBox14.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.htmlTextBox14.Style.BorderColor.Bottom = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.htmlTextBox14.Style.BorderColor.Default = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.htmlTextBox14.Style.BorderColor.Left = System.Drawing.Color.Transparent;
            this.htmlTextBox14.Style.BorderColor.Right = System.Drawing.Color.Transparent;
            this.htmlTextBox14.Style.BorderColor.Top = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.htmlTextBox14.Style.BorderStyle.Bottom = Telerik.Reporting.Drawing.BorderType.Solid;
            this.htmlTextBox14.Style.BorderStyle.Default = Telerik.Reporting.Drawing.BorderType.None;
            this.htmlTextBox14.Style.BorderStyle.Left = Telerik.Reporting.Drawing.BorderType.None;
            this.htmlTextBox14.Style.BorderStyle.Right = Telerik.Reporting.Drawing.BorderType.None;
            this.htmlTextBox14.Style.BorderStyle.Top = Telerik.Reporting.Drawing.BorderType.Solid;
            this.htmlTextBox14.Style.BorderWidth.Bottom = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.htmlTextBox14.Style.BorderWidth.Default = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.htmlTextBox14.Style.BorderWidth.Left = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.htmlTextBox14.Style.BorderWidth.Right = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.htmlTextBox14.Style.BorderWidth.Top = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.htmlTextBox14.Style.Font.Bold = true;
            this.htmlTextBox14.Style.Font.Name = "Intel Clear";
            this.htmlTextBox14.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Point(11D);
            this.htmlTextBox14.Style.LineWidth = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.htmlTextBox14.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.htmlTextBox14.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.htmlTextBox14.Value = "<span style=\"font-size: 10px; font-family: neo sans intel\"><strong>Max Qty</strong></span>";



            // 
            // ----------Primary Products Information Block - Values----------
            // 
            // Product Name Value (P)
            // 
            this.txtP1ProdName.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(PrimaryValuesRow));
            this.txtP1ProdName.Name = "txtP1ProdName";
            this.txtP1ProdName.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.50D), Telerik.Reporting.Drawing.Unit.Inch(NormalRowHeight));
            this.txtP1ProdName.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtP1ProdName.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtP1ProdName.Style.Font.Name = "Intel Clear";
            this.txtP1ProdName.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtP1ProdName.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtP1ProdName.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtP1ProdName.Value = "";

            // 
            // lbl P1
            // 
            this.lblP1.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(0.00D), Telerik.Reporting.Drawing.Unit.Inch(PrimaryValuesRow));
            this.lblP1.Name = "lblP1";
            this.lblP1.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(NormalRowHeight));
            this.lblP1.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.lblP1.Style.Font.Bold = true;
            this.lblP1.Style.Font.Name = "Intel Clear";
            this.lblP1.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Point(11D);
            this.lblP1.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.lblP1.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.lblP1.Value = "<span style=\"font-size: 10px; font-family: neo sans intel\"><span style=\"color: #000000\">Primary&nbsp;&nbsp; </span></span>";

            // 
            // Product Segment P1
            // 
            this.txtP1ProdSeg.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(2.50D), Telerik.Reporting.Drawing.Unit.Inch(PrimaryValuesRow));
            this.txtP1ProdSeg.Name = "txtP1ProdSeg";
            this.txtP1ProdSeg.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(NormalRowHeight));
            this.txtP1ProdSeg.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtP1ProdSeg.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtP1ProdSeg.Style.Font.Name = "Intel Clear";
            this.txtP1ProdSeg.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtP1ProdSeg.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtP1ProdSeg.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtP1ProdSeg.Value = "";

            // 
            // Standalone Price P1
            // 
            this.txtP1Ecap.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(3.50D), Telerik.Reporting.Drawing.Unit.Inch(PrimaryValuesRow));
            this.txtP1Ecap.Name = "txtP1Ecap";
            this.txtP1Ecap.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(NormalRowHeight));
            this.txtP1Ecap.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtP1Ecap.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtP1Ecap.Style.Font.Name = "Intel Clear";
            this.txtP1Ecap.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtP1Ecap.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtP1Ecap.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtP1Ecap.Value = "";

            //
            // Kit Qty P1
            //
            this.txtQtyP1.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(4.50D), Telerik.Reporting.Drawing.Unit.Inch(PrimaryValuesRow));
            this.txtQtyP1.Name = "txtQtyP1";
            this.txtQtyP1.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(NormalRowHeight));
            this.txtQtyP1.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtQtyP1.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtQtyP1.Style.Font.Name = "Intel Clear";
            this.txtQtyP1.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtQtyP1.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtQtyP1.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtQtyP1.Value = "";

            // 
            // Kit Price Value P1 with Value
            // 
            this.txtK1Ecap.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(5.50D), Telerik.Reporting.Drawing.Unit.Inch(PrimaryValuesRow));
            this.txtK1Ecap.Name = "txtK1Ecap";
            this.txtK1Ecap.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(NormalRowHeight));
            this.txtK1Ecap.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtK1Ecap.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtK1Ecap.Style.Font.Name = "Intel Clear";
            this.txtK1Ecap.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtK1Ecap.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtK1Ecap.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtK1Ecap.Value = "";

            // 
            // Max Qty P1 Value
            // 
            this.txtQuantity.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(6.50D), Telerik.Reporting.Drawing.Unit.Inch(PrimaryValuesRow));
            this.txtQuantity.Name = "txtQuantity";
            this.txtQuantity.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(NormalRowHeight));
            this.txtQuantity.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtQuantity.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtQuantity.Style.Font.Name = "Intel Clear";
            this.txtQuantity.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtQuantity.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtQuantity.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtQuantity.Value = "";

            // 
            // P1 Long EPM Name
            // 
            this.txtP1FullName.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(0.00D), Telerik.Reporting.Drawing.Unit.Inch(PrimaryRowEPM));
            this.txtP1FullName.Name = "txtP1FullName";
            this.txtP1FullName.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(7.50D), Telerik.Reporting.Drawing.Unit.Inch(NormalRowHeight));
            this.txtP1FullName.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtP1FullName.Style.BorderColor.Bottom = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.txtP1FullName.Style.BorderColor.Default = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.txtP1FullName.Style.BorderColor.Left = System.Drawing.Color.Transparent;
            this.txtP1FullName.Style.BorderColor.Right = System.Drawing.Color.Transparent;
            this.txtP1FullName.Style.BorderColor.Top = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.txtP1FullName.Style.BorderStyle.Bottom = Telerik.Reporting.Drawing.BorderType.Solid;
            this.txtP1FullName.Style.BorderStyle.Default = Telerik.Reporting.Drawing.BorderType.None;
            this.txtP1FullName.Style.BorderStyle.Left = Telerik.Reporting.Drawing.BorderType.None;
            this.txtP1FullName.Style.BorderStyle.Right = Telerik.Reporting.Drawing.BorderType.None;
            this.txtP1FullName.Style.BorderStyle.Top = Telerik.Reporting.Drawing.BorderType.Solid;
            this.txtP1FullName.Style.BorderWidth.Bottom = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.txtP1FullName.Style.BorderWidth.Default = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtP1FullName.Style.BorderWidth.Left = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtP1FullName.Style.BorderWidth.Right = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtP1FullName.Style.BorderWidth.Top = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtP1FullName.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtP1FullName.Style.Font.Name = "Intel Clear";
            this.txtP1FullName.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtP1FullName.Style.LineWidth = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.txtP1FullName.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtP1FullName.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtP1FullName.Value = "";

            // 
            // ----------S1 Products Information Block - Values----------
            // 
            // Product Name Value (S1)
            // 
            this.txtS1ProdName.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(S1ValuesRow));
            this.txtS1ProdName.Name = "txtS1ProdName";
            this.txtS1ProdName.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.50D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.txtS1ProdName.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtS1ProdName.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtS1ProdName.Style.Font.Name = "Intel Clear";
            this.txtS1ProdName.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtS1ProdName.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtS1ProdName.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtS1ProdName.Value = "";

            // 
            // lbl S1
            // 
            this.lblS1.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(0.00D), Telerik.Reporting.Drawing.Unit.Inch(S1ValuesRow));
            this.lblS1.Name = "lblS1";
            this.lblS1.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.lblS1.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.lblS1.Style.Font.Bold = true;
            this.lblS1.Style.Font.Name = "Intel Clear";
            this.lblS1.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Point(11D);
            this.lblS1.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.lblS1.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.lblS1.Value = "<span style=\"font-size: 10px; font-family: neo sans intel\"><span style=\"color: #000000\">Secondary&nbsp;&nbsp; </span></span>";

            // 
            // Product Segment S1
            // 
            this.txtS1ProdSeg.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(2.50D), Telerik.Reporting.Drawing.Unit.Inch(S1ValuesRow));
            this.txtS1ProdSeg.Name = "txtS1ProdSeg";
            this.txtS1ProdSeg.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.txtS1ProdSeg.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtS1ProdSeg.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtS1ProdSeg.Style.Font.Name = "Intel Clear";
            this.txtS1ProdSeg.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtS1ProdSeg.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtS1ProdSeg.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtS1ProdSeg.Value = "";

            // 
            // Standalone Price S1
            // 
            this.txtS1Ecap.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(3.50D), Telerik.Reporting.Drawing.Unit.Inch(S1ValuesRow));
            this.txtS1Ecap.Name = "txtS1Ecap";
            this.txtS1Ecap.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.txtS1Ecap.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtS1Ecap.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtS1Ecap.Style.Font.Name = "Intel Clear";
            this.txtS1Ecap.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtS1Ecap.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtS1Ecap.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtS1Ecap.Value = "";

            // 
            // Kit Qty S1
            // 
            this.txtQtyS1.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(4.50D), Telerik.Reporting.Drawing.Unit.Inch(S1ValuesRow));
            this.txtQtyS1.Name = "txtQtyS1";
            this.txtQtyS1.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.txtQtyS1.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtQtyS1.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtQtyS1.Style.Font.Name = "Intel Clear";
            this.txtQtyS1.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtQtyS1.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtQtyS1.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtQtyS1.Value = "&nbsp;";

            // 
            // blank Kit Price S1
            // 
            this.blankKitPriceS1.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(5.50D), Telerik.Reporting.Drawing.Unit.Inch(S1ValuesRow));
            this.blankKitPriceS1.Name = "blankKitPriceS1";
            this.blankKitPriceS1.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.blankKitPriceS1.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.blankKitPriceS1.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.blankKitPriceS1.Style.Font.Name = "Intel Clear";
            this.blankKitPriceS1.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.blankKitPriceS1.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.blankKitPriceS1.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.blankKitPriceS1.Value = "&nbsp;";

            // 
            // blank Max Qty S1
            // 
            this.blankMaxQtyS1.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(6.50D), Telerik.Reporting.Drawing.Unit.Inch(S1ValuesRow));
            this.blankMaxQtyS1.Name = "blankMaxQtyS1";
            this.blankMaxQtyS1.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.blankMaxQtyS1.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.blankMaxQtyS1.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.blankMaxQtyS1.Style.Font.Name = "Intel Clear";
            this.blankMaxQtyS1.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.blankMaxQtyS1.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.blankMaxQtyS1.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.blankMaxQtyS1.Value = "&nbsp;";

            // 
            // S1 Long EPM Name
            // 
            this.txtS1FullName.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(0.00D), Telerik.Reporting.Drawing.Unit.Inch(S1RowEPM));
            this.txtS1FullName.Name = "txtS1FullName";
            this.txtS1FullName.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(7.50D), Telerik.Reporting.Drawing.Unit.Inch(NormalRowHeight));
            this.txtS1FullName.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtS1FullName.Style.BorderColor.Bottom = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.txtS1FullName.Style.BorderColor.Default = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.txtS1FullName.Style.BorderColor.Left = System.Drawing.Color.Transparent;
            this.txtS1FullName.Style.BorderColor.Right = System.Drawing.Color.Transparent;
            this.txtS1FullName.Style.BorderColor.Top = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.txtS1FullName.Style.BorderStyle.Bottom = Telerik.Reporting.Drawing.BorderType.Solid;
            this.txtS1FullName.Style.BorderStyle.Default = Telerik.Reporting.Drawing.BorderType.None;
            this.txtS1FullName.Style.BorderStyle.Left = Telerik.Reporting.Drawing.BorderType.None;
            this.txtS1FullName.Style.BorderStyle.Right = Telerik.Reporting.Drawing.BorderType.None;
            this.txtS1FullName.Style.BorderStyle.Top = Telerik.Reporting.Drawing.BorderType.Solid;
            this.txtS1FullName.Style.BorderWidth.Bottom = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.txtS1FullName.Style.BorderWidth.Default = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtS1FullName.Style.BorderWidth.Left = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtS1FullName.Style.BorderWidth.Right = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtS1FullName.Style.BorderWidth.Top = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtS1FullName.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtS1FullName.Style.Font.Name = "Intel Clear";
            this.txtS1FullName.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtS1FullName.Style.LineWidth = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.txtS1FullName.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtS1FullName.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtS1FullName.Value = "";

            // 
            // ----------S2 Products Information Block - Values----------
            // 
            // Product Name Value (S2)
            // 
            this.txtS2ProdName.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(S2ValuesRow));
            this.txtS2ProdName.Name = "txtS2ProdName";
            this.txtS2ProdName.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.50D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.txtS2ProdName.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtS2ProdName.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtS2ProdName.Style.Font.Name = "Intel Clear";
            this.txtS2ProdName.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtS2ProdName.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtS2ProdName.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtS2ProdName.Value = "";

            // 
            // lbl S2
            // 
            this.lblS2.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(0.00D), Telerik.Reporting.Drawing.Unit.Inch(S2ValuesRow));
            this.lblS2.Name = "lblS2";
            this.lblS2.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.lblS2.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.lblS2.Style.Font.Bold = true;
            this.lblS2.Style.Font.Name = "Intel Clear";
            this.lblS2.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Point(11D);
            this.lblS2.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.lblS2.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.lblS2.Value = "<span style=\"font-size: 10px; font-family: neo sans intel\"><span style=\"color: #000000\">Component 3&nbsp;&nbsp; </span></span>";

            // 
            // Product Segment S2
            // 
            this.txtS2ProdSeg.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(2.50D), Telerik.Reporting.Drawing.Unit.Inch(S2ValuesRow));
            this.txtS2ProdSeg.Name = "txtS2ProdSeg";
            this.txtS2ProdSeg.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.txtS2ProdSeg.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtS2ProdSeg.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtS2ProdSeg.Style.Font.Name = "Intel Clear";
            this.txtS2ProdSeg.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtS2ProdSeg.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtS2ProdSeg.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtS2ProdSeg.Value = "";

            // 
            // Standalone Price S2
            // 
            this.txtS2Ecap.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(3.50D), Telerik.Reporting.Drawing.Unit.Inch(S2ValuesRow));
            this.txtS2Ecap.Name = "txtS2Ecap";
            this.txtS2Ecap.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.txtS2Ecap.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtS2Ecap.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtS2Ecap.Style.Font.Name = "Intel Clear";
            this.txtS2Ecap.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtS2Ecap.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtS2Ecap.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtS2Ecap.Value = "";

            // 
            // Kit Qty S2
            // 
            this.txtQtyS2.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(4.50D), Telerik.Reporting.Drawing.Unit.Inch(S2ValuesRow));
            this.txtQtyS2.Name = "txtQtyS2";
            this.txtQtyS2.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.txtQtyS2.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtQtyS2.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtQtyS2.Style.Font.Name = "Intel Clear";
            this.txtQtyS2.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtQtyS2.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtQtyS2.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtQtyS2.Value = "&nbsp;";

            // 
            // blank Kit Price S2
            // 
            this.blankKitPriceS2.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(5.50D), Telerik.Reporting.Drawing.Unit.Inch(S2ValuesRow));
            this.blankKitPriceS2.Name = "blankKitPriceS2";
            this.blankKitPriceS2.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.blankKitPriceS2.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.blankKitPriceS2.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.blankKitPriceS2.Style.Font.Name = "Intel Clear";
            this.blankKitPriceS2.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.blankKitPriceS2.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.blankKitPriceS2.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.blankKitPriceS2.Value = "&nbsp;";

            // 
            // blank Max Qty S2
            // 
            this.blankMaxQtyS2.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(6.50D), Telerik.Reporting.Drawing.Unit.Inch(S2ValuesRow));
            this.blankMaxQtyS2.Name = "blankMaxQtyS2";
            this.blankMaxQtyS2.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.blankMaxQtyS2.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.blankMaxQtyS2.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.blankMaxQtyS2.Style.Font.Name = "Intel Clear";
            this.blankMaxQtyS2.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.blankMaxQtyS2.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.blankMaxQtyS2.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.blankMaxQtyS2.Value = "&nbsp;";

            // 
            // S2 Long EPM Name
            // 
            this.txtS2FullName.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(0.00D), Telerik.Reporting.Drawing.Unit.Inch(S2RowEPM));
            this.txtS2FullName.Name = "txtS2FullName";
            this.txtS2FullName.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(7.50D), Telerik.Reporting.Drawing.Unit.Inch(NormalRowHeight));
            this.txtS2FullName.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtS2FullName.Style.BorderColor.Bottom = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.txtS2FullName.Style.BorderColor.Default = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.txtS2FullName.Style.BorderColor.Left = System.Drawing.Color.Transparent;
            this.txtS2FullName.Style.BorderColor.Right = System.Drawing.Color.Transparent;
            this.txtS2FullName.Style.BorderColor.Top = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.txtS2FullName.Style.BorderStyle.Bottom = Telerik.Reporting.Drawing.BorderType.Solid;
            this.txtS2FullName.Style.BorderStyle.Default = Telerik.Reporting.Drawing.BorderType.None;
            this.txtS2FullName.Style.BorderStyle.Left = Telerik.Reporting.Drawing.BorderType.None;
            this.txtS2FullName.Style.BorderStyle.Right = Telerik.Reporting.Drawing.BorderType.None;
            this.txtS2FullName.Style.BorderStyle.Top = Telerik.Reporting.Drawing.BorderType.Solid;
            this.txtS2FullName.Style.BorderWidth.Bottom = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.txtS2FullName.Style.BorderWidth.Default = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtS2FullName.Style.BorderWidth.Left = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtS2FullName.Style.BorderWidth.Right = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtS2FullName.Style.BorderWidth.Top = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtS2FullName.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtS2FullName.Style.Font.Name = "Intel Clear";
            this.txtS2FullName.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtS2FullName.Style.LineWidth = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.txtS2FullName.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtS2FullName.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtS2FullName.Value = "";

            // 
            // ----------S3 Products Information Block - Values----------
            // 
            // Product Name Value (S3)
            // 
            this.txtS3ProdName.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(S3ValuesRow));
            this.txtS3ProdName.Name = "txtS3ProdName";
            this.txtS3ProdName.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.50D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.txtS3ProdName.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtS3ProdName.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtS3ProdName.Style.Font.Name = "Intel Clear";
            this.txtS3ProdName.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtS3ProdName.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtS3ProdName.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtS3ProdName.Value = "";

            // 
            // lbl S3
            // 
            this.lblS3.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(0.00D), Telerik.Reporting.Drawing.Unit.Inch(S3ValuesRow));
            this.lblS3.Name = "lblS3";
            this.lblS3.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.lblS3.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.lblS3.Style.Font.Bold = true;
            this.lblS3.Style.Font.Name = "Intel Clear";
            this.lblS3.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Point(11D);
            this.lblS3.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.lblS3.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.lblS3.Value = "<span style=\"font-size: 10px; font-family: neo sans intel\"><span style=\"color: #000000\">Component 4&nbsp;&nbsp; </span></span>";

            // 
            // Product Segment S3
            // 
            this.txtS3ProdSeg.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(2.50D), Telerik.Reporting.Drawing.Unit.Inch(S3ValuesRow));
            this.txtS3ProdSeg.Name = "txtS3ProdSeg";
            this.txtS3ProdSeg.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.txtS3ProdSeg.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtS3ProdSeg.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtS3ProdSeg.Style.Font.Name = "Intel Clear";
            this.txtS3ProdSeg.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtS3ProdSeg.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtS3ProdSeg.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtS3ProdSeg.Value = "";

            // 
            // Standalone Price S3
            // 
            this.txtS3Ecap.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(3.50D), Telerik.Reporting.Drawing.Unit.Inch(S3ValuesRow));
            this.txtS3Ecap.Name = "txtS3Ecap";
            this.txtS3Ecap.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.txtS3Ecap.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtS3Ecap.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtS3Ecap.Style.Font.Name = "Intel Clear";
            this.txtS3Ecap.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtS3Ecap.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            //this.txtS3Ecap.Style.TextAlign = Telerik.Reporting.Drawing.HorizontalAlign.Left;
            this.txtS3Ecap.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtS3Ecap.Value = "";

            // 
            // Kit Qty S3
            // 
            this.txtQtyS3.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(4.50D), Telerik.Reporting.Drawing.Unit.Inch(S3ValuesRow));
            this.txtQtyS3.Name = "txtQtyS3";
            this.txtQtyS3.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.txtQtyS3.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtQtyS3.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtQtyS3.Style.Font.Name = "Intel Clear";
            this.txtQtyS3.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtQtyS3.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtQtyS3.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtQtyS3.Value = "&nbsp;";

            // 
            // blank Kit Price S3
            // 
            this.blankKitPriceS3.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(5.50D), Telerik.Reporting.Drawing.Unit.Inch(S3ValuesRow));
            this.blankKitPriceS3.Name = "blankKitPriceS3";
            this.blankKitPriceS3.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.blankKitPriceS3.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.blankKitPriceS3.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.blankKitPriceS3.Style.Font.Name = "Intel Clear";
            this.blankKitPriceS3.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.blankKitPriceS3.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.blankKitPriceS3.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.blankKitPriceS3.Value = "&nbsp;";

            // 
            // blank Max Qty S3
            // 
            this.blankMaxQtyS3.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(6.50D), Telerik.Reporting.Drawing.Unit.Inch(S3ValuesRow));
            this.blankMaxQtyS3.Name = "blankMaxQtyS3";
            this.blankMaxQtyS3.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.blankMaxQtyS3.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.blankMaxQtyS3.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.blankMaxQtyS3.Style.Font.Name = "Intel Clear";
            this.blankMaxQtyS3.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.blankMaxQtyS3.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.blankMaxQtyS3.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.blankMaxQtyS3.Value = "&nbsp;";

            // 
            // S3 Long EPM Name
            // 
            this.txtS3FullName.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(0.00D), Telerik.Reporting.Drawing.Unit.Inch(S3RowEPM));
            this.txtS3FullName.Name = "txtS3FullName";
            this.txtS3FullName.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(7.50D), Telerik.Reporting.Drawing.Unit.Inch(NormalRowHeight));
            this.txtS3FullName.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtS3FullName.Style.BorderColor.Bottom = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.txtS3FullName.Style.BorderColor.Default = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.txtS3FullName.Style.BorderColor.Left = System.Drawing.Color.Transparent;
            this.txtS3FullName.Style.BorderColor.Right = System.Drawing.Color.Transparent;
            this.txtS3FullName.Style.BorderColor.Top = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.txtS3FullName.Style.BorderStyle.Bottom = Telerik.Reporting.Drawing.BorderType.Solid;
            this.txtS3FullName.Style.BorderStyle.Default = Telerik.Reporting.Drawing.BorderType.None;
            this.txtS3FullName.Style.BorderStyle.Left = Telerik.Reporting.Drawing.BorderType.None;
            this.txtS3FullName.Style.BorderStyle.Right = Telerik.Reporting.Drawing.BorderType.None;
            this.txtS3FullName.Style.BorderStyle.Top = Telerik.Reporting.Drawing.BorderType.Solid;
            this.txtS3FullName.Style.BorderWidth.Bottom = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.txtS3FullName.Style.BorderWidth.Default = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtS3FullName.Style.BorderWidth.Left = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtS3FullName.Style.BorderWidth.Right = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtS3FullName.Style.BorderWidth.Top = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtS3FullName.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtS3FullName.Style.Font.Name = "Intel Clear";
            this.txtS3FullName.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtS3FullName.Style.LineWidth = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.txtS3FullName.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtS3FullName.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtS3FullName.Value = "";

            // 
            // ----------S4 Products Information Block - Values----------
            // 
            // Product Name Value (S4)
            // 
            this.txtS4ProdName.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(S4ValuesRow));
            this.txtS4ProdName.Name = "txtS4ProdName";
            this.txtS4ProdName.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.50D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.txtS4ProdName.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtS4ProdName.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtS4ProdName.Style.Font.Name = "Intel Clear";
            this.txtS4ProdName.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtS4ProdName.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtS4ProdName.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtS4ProdName.Value = "";

            // 
            // lbl S4
            // 
            this.lblS4.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(0.00D), Telerik.Reporting.Drawing.Unit.Inch(S4ValuesRow));
            this.lblS4.Name = "lblS4";
            this.lblS4.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.lblS4.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.lblS4.Style.Font.Bold = true;
            this.lblS4.Style.Font.Name = "Intel Clear";
            this.lblS4.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Point(11D);
            this.lblS4.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.lblS4.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.lblS4.Value = "<span style=\"font-size: 10px; font-family: neo sans intel\"><span style=\"color: #000000\">Component 5&nbsp;&nbsp; </span></span>";

            // 
            // Product Segment S4
            // 
            this.txtS4ProdSeg.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(2.50D), Telerik.Reporting.Drawing.Unit.Inch(S4ValuesRow));
            this.txtS4ProdSeg.Name = "txtS4ProdSeg";
            this.txtS4ProdSeg.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.txtS4ProdSeg.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtS4ProdSeg.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtS4ProdSeg.Style.Font.Name = "Intel Clear";
            this.txtS4ProdSeg.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtS4ProdSeg.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtS4ProdSeg.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtS4ProdSeg.Value = "";

            // 
            // Standalone Price S4
            // 
            this.txtS4Ecap.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(3.50D), Telerik.Reporting.Drawing.Unit.Inch(S4ValuesRow));
            this.txtS4Ecap.Name = "txtS4Ecap";
            this.txtS4Ecap.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.txtS4Ecap.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtS4Ecap.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtS4Ecap.Style.Font.Name = "Intel Clear";
            this.txtS4Ecap.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtS4Ecap.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtS4Ecap.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtS4Ecap.Value = "";

            // 
            // Kit Qty S4
            // 
            this.txtQtyS4.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(4.50D), Telerik.Reporting.Drawing.Unit.Inch(S4ValuesRow));
            this.txtQtyS4.Name = "txtQtyS4";
            this.txtQtyS4.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.txtQtyS4.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtQtyS4.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtQtyS4.Style.Font.Name = "Intel Clear";
            this.txtQtyS4.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtQtyS4.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtQtyS4.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtQtyS4.Value = "&nbsp;";

            // 
            // blank Kit Price S4
            // 
            this.blankKitPriceS4.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(5.50D), Telerik.Reporting.Drawing.Unit.Inch(S4ValuesRow));
            this.blankKitPriceS4.Name = "blankKitPriceS4";
            this.blankKitPriceS4.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.blankKitPriceS4.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.blankKitPriceS4.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.blankKitPriceS4.Style.Font.Name = "Intel Clear";
            this.blankKitPriceS4.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.blankKitPriceS4.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.blankKitPriceS4.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.blankKitPriceS4.Value = "&nbsp;";

            // 
            // blank Max Qty S4
            // 
            this.blankMaxQtyS4.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(6.50D), Telerik.Reporting.Drawing.Unit.Inch(S4ValuesRow));
            this.blankMaxQtyS4.Name = "blankMaxQtyS4";
            this.blankMaxQtyS4.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.blankMaxQtyS4.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.blankMaxQtyS4.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.blankMaxQtyS4.Style.Font.Name = "Intel Clear";
            this.blankMaxQtyS4.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.blankMaxQtyS4.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.blankMaxQtyS4.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.blankMaxQtyS4.Value = "&nbsp;";

            // 
            // S4 Long EPM Name
            // 
            this.txtS4FullName.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(0.00D), Telerik.Reporting.Drawing.Unit.Inch(S4RowEPM));
            this.txtS4FullName.Name = "txtS4FullName";
            this.txtS4FullName.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(7.50D), Telerik.Reporting.Drawing.Unit.Inch(NormalRowHeight));
            this.txtS4FullName.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtS4FullName.Style.BorderColor.Bottom = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.txtS4FullName.Style.BorderColor.Default = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.txtS4FullName.Style.BorderColor.Left = System.Drawing.Color.Transparent;
            this.txtS4FullName.Style.BorderColor.Right = System.Drawing.Color.Transparent;
            this.txtS4FullName.Style.BorderColor.Top = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.txtS4FullName.Style.BorderStyle.Bottom = Telerik.Reporting.Drawing.BorderType.Solid;
            this.txtS4FullName.Style.BorderStyle.Default = Telerik.Reporting.Drawing.BorderType.None;
            this.txtS4FullName.Style.BorderStyle.Left = Telerik.Reporting.Drawing.BorderType.None;
            this.txtS4FullName.Style.BorderStyle.Right = Telerik.Reporting.Drawing.BorderType.None;
            this.txtS4FullName.Style.BorderStyle.Top = Telerik.Reporting.Drawing.BorderType.Solid;
            this.txtS4FullName.Style.BorderWidth.Bottom = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.txtS4FullName.Style.BorderWidth.Default = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtS4FullName.Style.BorderWidth.Left = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtS4FullName.Style.BorderWidth.Right = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtS4FullName.Style.BorderWidth.Top = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtS4FullName.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtS4FullName.Style.Font.Name = "Intel Clear";
            this.txtS4FullName.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtS4FullName.Style.LineWidth = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.txtS4FullName.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtS4FullName.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtS4FullName.Value = "";

            // 
            // ----------S5 Products Information Block - Values----------
            // 
            // Product Name Value (S5)
            // 
            this.txtS5ProdName.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(S5ValuesRow));
            this.txtS5ProdName.Name = "txtS5ProdName";
            this.txtS5ProdName.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.50D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.txtS5ProdName.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtS5ProdName.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtS5ProdName.Style.Font.Name = "Intel Clear";
            this.txtS5ProdName.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtS5ProdName.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtS5ProdName.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtS5ProdName.Value = "";

            // 
            // lbl S5
            // 
            this.lblS5.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(0.00D), Telerik.Reporting.Drawing.Unit.Inch(S5ValuesRow));
            this.lblS5.Name = "lblS5";
            this.lblS5.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.lblS5.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.lblS5.Style.Font.Bold = true;
            this.lblS5.Style.Font.Name = "Intel Clear";
            this.lblS5.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Point(11D);
            this.lblS5.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.lblS5.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.lblS5.Value = "<span style=\"font-size: 10px; font-family: neo sans intel\"><span style=\"color: #000000\">Component 6&nbsp;&nbsp; </span></span>";

            // 
            // Product Segment S5
            // 
            this.txtS5ProdSeg.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(2.50D), Telerik.Reporting.Drawing.Unit.Inch(S5ValuesRow));
            this.txtS5ProdSeg.Name = "txtS5ProdSeg";
            this.txtS5ProdSeg.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.txtS5ProdSeg.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtS5ProdSeg.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtS5ProdSeg.Style.Font.Name = "Intel Clear";
            this.txtS5ProdSeg.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtS5ProdSeg.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtS5ProdSeg.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtS5ProdSeg.Value = "";

            // 
            // Standalone Price S5
            // 
            this.txtS5Ecap.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(3.50D), Telerik.Reporting.Drawing.Unit.Inch(S5ValuesRow));
            this.txtS5Ecap.Name = "txtS5Ecap";
            this.txtS5Ecap.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.txtS5Ecap.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtS5Ecap.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtS5Ecap.Style.Font.Name = "Intel Clear";
            this.txtS5Ecap.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtS5Ecap.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtS5Ecap.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtS5Ecap.Value = "";

            // 
            // Kit Qty S5
            // 
            this.txtQtyS5.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(4.50D), Telerik.Reporting.Drawing.Unit.Inch(S5ValuesRow));
            this.txtQtyS5.Name = "txtQtyS5";
            this.txtQtyS5.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.txtQtyS5.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtQtyS5.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtQtyS5.Style.Font.Name = "Intel Clear";
            this.txtQtyS5.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtQtyS5.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtQtyS5.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtQtyS5.Value = "&nbsp;";

            // 
            // blank Kit Price S5
            // 
            this.blankKitPriceS5.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(5.50D), Telerik.Reporting.Drawing.Unit.Inch(S5ValuesRow));
            this.blankKitPriceS5.Name = "blankKitPriceS5";
            this.blankKitPriceS5.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.blankKitPriceS5.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.blankKitPriceS5.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.blankKitPriceS5.Style.Font.Name = "Intel Clear";
            this.blankKitPriceS5.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.blankKitPriceS5.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.blankKitPriceS5.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.blankKitPriceS5.Value = "&nbsp;";

            // 
            // blank Max Qty S5
            // 
            this.blankMaxQtyS5.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(6.50D), Telerik.Reporting.Drawing.Unit.Inch(S5ValuesRow));
            this.blankMaxQtyS5.Name = "blankMaxQtyS5";
            this.blankMaxQtyS5.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.blankMaxQtyS5.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.blankMaxQtyS5.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.blankMaxQtyS5.Style.Font.Name = "Intel Clear";
            this.blankMaxQtyS5.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.blankMaxQtyS5.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.blankMaxQtyS5.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.blankMaxQtyS5.Value = "&nbsp;";

            // 
            // S5 Long EPM Name
            // 
            this.txtS5FullName.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(0.00D), Telerik.Reporting.Drawing.Unit.Inch(S5RowEPM));
            this.txtS5FullName.Name = "txtS5FullName";
            this.txtS5FullName.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(7.50D), Telerik.Reporting.Drawing.Unit.Inch(NormalRowHeight));
            this.txtS5FullName.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtS5FullName.Style.BorderColor.Bottom = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.txtS5FullName.Style.BorderColor.Default = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.txtS5FullName.Style.BorderColor.Left = System.Drawing.Color.Transparent;
            this.txtS5FullName.Style.BorderColor.Right = System.Drawing.Color.Transparent;
            this.txtS5FullName.Style.BorderColor.Top = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.txtS5FullName.Style.BorderStyle.Bottom = Telerik.Reporting.Drawing.BorderType.Solid;
            this.txtS5FullName.Style.BorderStyle.Default = Telerik.Reporting.Drawing.BorderType.None;
            this.txtS5FullName.Style.BorderStyle.Left = Telerik.Reporting.Drawing.BorderType.None;
            this.txtS5FullName.Style.BorderStyle.Right = Telerik.Reporting.Drawing.BorderType.None;
            this.txtS5FullName.Style.BorderStyle.Top = Telerik.Reporting.Drawing.BorderType.Solid;
            this.txtS5FullName.Style.BorderWidth.Bottom = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.txtS5FullName.Style.BorderWidth.Default = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtS5FullName.Style.BorderWidth.Left = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtS5FullName.Style.BorderWidth.Right = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtS5FullName.Style.BorderWidth.Top = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtS5FullName.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtS5FullName.Style.Font.Name = "Intel Clear";
            this.txtS5FullName.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtS5FullName.Style.LineWidth = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.txtS5FullName.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtS5FullName.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtS5FullName.Value = "";

            // 
            // ----------S6 Products Information Block - Values----------
            // 
            // Product Name Value (S6)
            // 
            this.txtS6ProdName.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(S6ValuesRow));
            this.txtS6ProdName.Name = "txtS6ProdName";
            this.txtS6ProdName.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.50D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.txtS6ProdName.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtS6ProdName.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtS6ProdName.Style.Font.Name = "Intel Clear";
            this.txtS6ProdName.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtS6ProdName.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtS6ProdName.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtS6ProdName.Value = "";

            // 
            // lbl S6
            // 
            this.lblS6.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(0.00D), Telerik.Reporting.Drawing.Unit.Inch(S6ValuesRow));
            this.lblS6.Name = "lblS6";
            this.lblS6.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.lblS6.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.lblS6.Style.Font.Bold = true;
            this.lblS6.Style.Font.Name = "Intel Clear";
            this.lblS6.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Point(11D);
            this.lblS6.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.lblS6.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.lblS6.Value = "<span style=\"font-size: 10px; font-family: neo sans intel\"><span style=\"color: #000000\">Component 7&nbsp;&nbsp; </span></span>";

            // 
            // Product Segment S6
            // 
            this.txtS6ProdSeg.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(2.50D), Telerik.Reporting.Drawing.Unit.Inch(S6ValuesRow));
            this.txtS6ProdSeg.Name = "txtS6ProdSeg";
            this.txtS6ProdSeg.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.0D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.txtS6ProdSeg.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtS6ProdSeg.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtS6ProdSeg.Style.Font.Name = "Intel Clear";
            this.txtS6ProdSeg.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtS6ProdSeg.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtS6ProdSeg.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtS6ProdSeg.Value = "";

            // 
            // Standalone Price S6
            // 
            this.txtS6Ecap.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(3.50D), Telerik.Reporting.Drawing.Unit.Inch(S6ValuesRow));
            this.txtS6Ecap.Name = "txtS6Ecap";
            this.txtS6Ecap.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.txtS6Ecap.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtS6Ecap.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtS6Ecap.Style.Font.Name = "Intel Clear";
            this.txtS6Ecap.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtS6Ecap.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtS6Ecap.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtS6Ecap.Value = "";

            // 
            // blank Kit Price S6
            // 
            this.blankKitPriceS6.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(5.50D), Telerik.Reporting.Drawing.Unit.Inch(S6ValuesRow));
            this.blankKitPriceS6.Name = "blankKitPriceS6";
            this.blankKitPriceS6.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.blankKitPriceS6.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.blankKitPriceS6.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.blankKitPriceS6.Style.Font.Name = "Intel Clear";
            this.blankKitPriceS6.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.blankKitPriceS6.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.blankKitPriceS6.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.blankKitPriceS6.Value = "&nbsp;";

            // 
            // Kit Qty S6
            // 
            this.txtQtyS6.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(4.50D), Telerik.Reporting.Drawing.Unit.Inch(S6ValuesRow));
            this.txtQtyS6.Name = "txtQtyS6";
            this.txtQtyS6.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.txtQtyS6.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtQtyS6.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtQtyS6.Style.Font.Name = "Intel Clear";
            this.txtQtyS6.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtQtyS6.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtQtyS6.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtQtyS6.Value = "&nbsp;";

            // 
            // blank Max Qty S6
            // 
            this.blankMaxQtyS6.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(6.50D), Telerik.Reporting.Drawing.Unit.Inch(S6ValuesRow));
            this.blankMaxQtyS6.Name = "blankMaxQtyS6";
            this.blankMaxQtyS6.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.blankMaxQtyS6.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.blankMaxQtyS6.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.blankMaxQtyS6.Style.Font.Name = "Intel Clear";
            this.blankMaxQtyS6.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.blankMaxQtyS6.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.blankMaxQtyS6.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.blankMaxQtyS6.Value = "&nbsp;";

            // 
            // S6 Long EPM Name
            // 
            this.txtS6FullName.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(0.00D), Telerik.Reporting.Drawing.Unit.Inch(S6RowEPM));
            this.txtS6FullName.Name = "txtS6FullName";
            this.txtS6FullName.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(7.50D), Telerik.Reporting.Drawing.Unit.Inch(NormalRowHeight));
            this.txtS6FullName.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtS6FullName.Style.BorderColor.Bottom = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.txtS6FullName.Style.BorderColor.Default = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.txtS6FullName.Style.BorderColor.Left = System.Drawing.Color.Transparent;
            this.txtS6FullName.Style.BorderColor.Right = System.Drawing.Color.Transparent;
            this.txtS6FullName.Style.BorderColor.Top = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.txtS6FullName.Style.BorderStyle.Bottom = Telerik.Reporting.Drawing.BorderType.Solid;
            this.txtS6FullName.Style.BorderStyle.Default = Telerik.Reporting.Drawing.BorderType.None;
            this.txtS6FullName.Style.BorderStyle.Left = Telerik.Reporting.Drawing.BorderType.None;
            this.txtS6FullName.Style.BorderStyle.Right = Telerik.Reporting.Drawing.BorderType.None;
            this.txtS6FullName.Style.BorderStyle.Top = Telerik.Reporting.Drawing.BorderType.Solid;
            this.txtS6FullName.Style.BorderWidth.Bottom = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.txtS6FullName.Style.BorderWidth.Default = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtS6FullName.Style.BorderWidth.Left = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtS6FullName.Style.BorderWidth.Right = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtS6FullName.Style.BorderWidth.Top = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtS6FullName.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtS6FullName.Style.Font.Name = "Intel Clear";
            this.txtS6FullName.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtS6FullName.Style.LineWidth = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.txtS6FullName.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtS6FullName.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtS6FullName.Value = "";

            // 
            // ----------S7 Products Information Block - Values----------
            // 
            // Product Name Value (S7)
            // 
            this.txtS7ProdName.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(S7ValuesRow));
            this.txtS7ProdName.Name = "txtS7ProdName";
            this.txtS7ProdName.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.50D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.txtS7ProdName.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtS7ProdName.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtS7ProdName.Style.Font.Name = "Intel Clear";
            this.txtS7ProdName.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtS7ProdName.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtS7ProdName.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtS7ProdName.Value = "";

            // 
            // lbl S7
            // 
            this.lblS7.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(0.00D), Telerik.Reporting.Drawing.Unit.Inch(S7ValuesRow));
            this.lblS7.Name = "lblS7";
            this.lblS7.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.lblS7.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.lblS7.Style.Font.Bold = true;
            this.lblS7.Style.Font.Name = "Intel Clear";
            this.lblS7.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Point(11D);
            this.lblS7.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.lblS7.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.lblS7.Value = "<span style=\"font-size: 10px; font-family: neo sans intel\"><span style=\"color: #000000\">Component 8&nbsp;&nbsp; </span></span>";

            // 
            // Product Segment S7
            // 
            this.txtS7ProdSeg.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(2.50D), Telerik.Reporting.Drawing.Unit.Inch(S7ValuesRow));
            this.txtS7ProdSeg.Name = "txtS7ProdSeg";
            this.txtS7ProdSeg.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.txtS7ProdSeg.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtS7ProdSeg.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtS7ProdSeg.Style.Font.Name = "Intel Clear";
            this.txtS7ProdSeg.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtS7ProdSeg.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtS7ProdSeg.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtS7ProdSeg.Value = "";

            // 
            // Standalone Price S7
            // 
            this.txtS7Ecap.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(3.50D), Telerik.Reporting.Drawing.Unit.Inch(S7ValuesRow));
            this.txtS7Ecap.Name = "txtS7Ecap";
            this.txtS7Ecap.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.txtS7Ecap.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtS7Ecap.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtS7Ecap.Style.Font.Name = "Intel Clear";
            this.txtS7Ecap.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtS7Ecap.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtS7Ecap.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtS7Ecap.Value = "";

            // 
            // Kit Qty S7
            // 
            this.txtQtyS7.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(4.50D), Telerik.Reporting.Drawing.Unit.Inch(S7ValuesRow));
            this.txtQtyS7.Name = "txtQtyS7";
            this.txtQtyS7.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.txtQtyS7.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtQtyS7.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtQtyS7.Style.Font.Name = "Intel Clear";
            this.txtQtyS7.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtQtyS7.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtQtyS7.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtQtyS7.Value = "&nbsp;";

            // 
            // blank Kit Price S7
            // 
            this.blankKitPriceS7.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(5.50D), Telerik.Reporting.Drawing.Unit.Inch(S7ValuesRow));
            this.blankKitPriceS7.Name = "blankKitPriceS7";
            this.blankKitPriceS7.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.blankKitPriceS7.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.blankKitPriceS7.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.blankKitPriceS7.Style.Font.Name = "Intel Clear";
            this.blankKitPriceS7.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.blankKitPriceS7.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.blankKitPriceS7.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.blankKitPriceS7.Value = "&nbsp;";

            // 
            // blank Max Qty S7
            // 
            this.blankMaxQtyS7.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(6.50D), Telerik.Reporting.Drawing.Unit.Inch(S7ValuesRow));
            this.blankMaxQtyS7.Name = "blankMaxQtyS7";
            this.blankMaxQtyS7.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.blankMaxQtyS7.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.blankMaxQtyS7.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.blankMaxQtyS7.Style.Font.Name = "Intel Clear";
            this.blankMaxQtyS7.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.blankMaxQtyS7.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.blankMaxQtyS7.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.blankMaxQtyS7.Value = "&nbsp;";

            // 
            // S7 Long EPM Name
            // 
            this.txtS7FullName.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(0.00D), Telerik.Reporting.Drawing.Unit.Inch(S7RowEPM));
            this.txtS7FullName.Name = "txtS7FullName";
            this.txtS7FullName.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(7.50D), Telerik.Reporting.Drawing.Unit.Inch(NormalRowHeight));
            this.txtS7FullName.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtS7FullName.Style.BorderColor.Bottom = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.txtS7FullName.Style.BorderColor.Default = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.txtS7FullName.Style.BorderColor.Left = System.Drawing.Color.Transparent;
            this.txtS7FullName.Style.BorderColor.Right = System.Drawing.Color.Transparent;
            this.txtS7FullName.Style.BorderColor.Top = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.txtS7FullName.Style.BorderStyle.Bottom = Telerik.Reporting.Drawing.BorderType.Solid;
            this.txtS7FullName.Style.BorderStyle.Default = Telerik.Reporting.Drawing.BorderType.None;
            this.txtS7FullName.Style.BorderStyle.Left = Telerik.Reporting.Drawing.BorderType.None;
            this.txtS7FullName.Style.BorderStyle.Right = Telerik.Reporting.Drawing.BorderType.None;
            this.txtS7FullName.Style.BorderStyle.Top = Telerik.Reporting.Drawing.BorderType.Solid;
            this.txtS7FullName.Style.BorderWidth.Bottom = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.txtS7FullName.Style.BorderWidth.Default = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtS7FullName.Style.BorderWidth.Left = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtS7FullName.Style.BorderWidth.Right = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtS7FullName.Style.BorderWidth.Top = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtS7FullName.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtS7FullName.Style.Font.Name = "Intel Clear";
            this.txtS7FullName.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtS7FullName.Style.LineWidth = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.txtS7FullName.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtS7FullName.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtS7FullName.Value = "";

            // 
            // ----------S8 Products Information Block - Values----------
            // 
            // Product Name Value (S8)
            // 
            this.txtS8ProdName.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(S8ValuesRow));
            this.txtS8ProdName.Name = "txtS8ProdName";
            this.txtS8ProdName.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.50D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.txtS8ProdName.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtS8ProdName.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtS8ProdName.Style.Font.Name = "Intel Clear";
            this.txtS8ProdName.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtS8ProdName.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtS8ProdName.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtS8ProdName.Value = "";

            // 
            // lbl S8
            // 
            this.lblS8.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(0.00D), Telerik.Reporting.Drawing.Unit.Inch(S8ValuesRow));
            this.lblS8.Name = "lblS8";
            this.lblS8.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.lblS8.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.lblS8.Style.Font.Bold = true;
            this.lblS8.Style.Font.Name = "Intel Clear";
            this.lblS8.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Point(11D);
            this.lblS8.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.lblS8.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.lblS8.Value = "<span style=\"font-size: 10px; font-family: neo sans intel\"><span style=\"color: #000000\">Component 9&nbsp;&nbsp; </span></span>";

            // 
            // Product Segment S8
            // 
            this.txtS8ProdSeg.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(2.50D), Telerik.Reporting.Drawing.Unit.Inch(S8ValuesRow));
            this.txtS8ProdSeg.Name = "txtS8ProdSeg";
            this.txtS8ProdSeg.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.txtS8ProdSeg.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtS8ProdSeg.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtS8ProdSeg.Style.Font.Name = "Intel Clear";
            this.txtS8ProdSeg.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtS8ProdSeg.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtS8ProdSeg.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtS8ProdSeg.Value = "";

            // 
            // Standalone Price S8
            // 
            this.txtS8Ecap.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(3.50D), Telerik.Reporting.Drawing.Unit.Inch(S8ValuesRow));
            this.txtS8Ecap.Name = "txtS8Ecap";
            this.txtS8Ecap.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.txtS8Ecap.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtS8Ecap.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtS8Ecap.Style.Font.Name = "Intel Clear";
            this.txtS8Ecap.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtS8Ecap.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtS8Ecap.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtS8Ecap.Value = "";

            // 
            // Kit Qty S8
            // 
            this.txtQtyS8.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(4.50D), Telerik.Reporting.Drawing.Unit.Inch(S8ValuesRow));
            this.txtQtyS8.Name = "txtQtyS8";
            this.txtQtyS8.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.txtQtyS8.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtQtyS8.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtQtyS8.Style.Font.Name = "Intel Clear";
            this.txtQtyS8.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtQtyS8.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtQtyS8.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtQtyS8.Value = "&nbsp;";

            // 
            // blank Kit Price S8
            // 
            this.blankKitPriceS8.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(5.50D), Telerik.Reporting.Drawing.Unit.Inch(S8ValuesRow));
            this.blankKitPriceS8.Name = "blankKitPriceS8";
            this.blankKitPriceS8.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.blankKitPriceS8.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.blankKitPriceS8.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.blankKitPriceS8.Style.Font.Name = "Intel Clear";
            this.blankKitPriceS8.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.blankKitPriceS8.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.blankKitPriceS8.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.blankKitPriceS8.Value = "&nbsp;";

            // 
            // blank Max Qty S8
            // 
            this.blankMaxQtyS8.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(6.50D), Telerik.Reporting.Drawing.Unit.Inch(S8ValuesRow));
            this.blankMaxQtyS8.Name = "blankMaxQtyS8";
            this.blankMaxQtyS8.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.blankMaxQtyS8.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.blankMaxQtyS8.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.blankMaxQtyS8.Style.Font.Name = "Intel Clear";
            this.blankMaxQtyS8.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.blankMaxQtyS8.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.blankMaxQtyS8.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.blankMaxQtyS8.Value = "&nbsp;";

            // 
            // S8 Long EPM Name
            // 
            this.txtS8FullName.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(0.00D), Telerik.Reporting.Drawing.Unit.Inch(S8RowEPM));
            this.txtS8FullName.Name = "txtS8FullName";
            this.txtS8FullName.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(7.50D), Telerik.Reporting.Drawing.Unit.Inch(NormalRowHeight));
            this.txtS8FullName.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtS8FullName.Style.BorderColor.Bottom = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.txtS8FullName.Style.BorderColor.Default = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.txtS8FullName.Style.BorderColor.Left = System.Drawing.Color.Transparent;
            this.txtS8FullName.Style.BorderColor.Right = System.Drawing.Color.Transparent;
            this.txtS8FullName.Style.BorderColor.Top = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.txtS8FullName.Style.BorderStyle.Bottom = Telerik.Reporting.Drawing.BorderType.Solid;
            this.txtS8FullName.Style.BorderStyle.Default = Telerik.Reporting.Drawing.BorderType.None;
            this.txtS8FullName.Style.BorderStyle.Left = Telerik.Reporting.Drawing.BorderType.None;
            this.txtS8FullName.Style.BorderStyle.Right = Telerik.Reporting.Drawing.BorderType.None;
            this.txtS8FullName.Style.BorderStyle.Top = Telerik.Reporting.Drawing.BorderType.Solid;
            this.txtS8FullName.Style.BorderWidth.Bottom = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.txtS8FullName.Style.BorderWidth.Default = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtS8FullName.Style.BorderWidth.Left = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtS8FullName.Style.BorderWidth.Right = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtS8FullName.Style.BorderWidth.Top = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtS8FullName.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtS8FullName.Style.Font.Name = "Intel Clear";
            this.txtS8FullName.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtS8FullName.Style.LineWidth = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.txtS8FullName.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtS8FullName.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtS8FullName.Value = "";

            // 
            // ----------S9 Products Information Block - Values----------
            // 
            // Product Name Value (S9)
            // 
            this.txtS9ProdName.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(S9ValuesRow));
            this.txtS9ProdName.Name = "txtS9ProdName";
            this.txtS9ProdName.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.50D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.txtS9ProdName.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtS9ProdName.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtS9ProdName.Style.Font.Name = "Intel Clear";
            this.txtS9ProdName.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtS9ProdName.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtS9ProdName.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtS9ProdName.Value = "";

            // 
            // lbl S9
            // 
            this.lblS9.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(0.00D), Telerik.Reporting.Drawing.Unit.Inch(S9ValuesRow));
            this.lblS9.Name = "lblS9";
            this.lblS9.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.lblS9.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.lblS9.Style.Font.Bold = true;
            this.lblS9.Style.Font.Name = "Intel Clear";
            this.lblS9.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Point(11D);
            this.lblS9.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.lblS9.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.lblS9.Value = "<span style=\"font-size: 10px; font-family: neo sans intel\"><span style=\"color: #000000\">Component 10&nbsp;&nbsp; </span></span>";

            // 
            // Product Segment S9
            // 
            this.txtS9ProdSeg.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(2.50D), Telerik.Reporting.Drawing.Unit.Inch(S9ValuesRow));
            this.txtS9ProdSeg.Name = "txtS9ProdSeg";
            this.txtS9ProdSeg.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.txtS9ProdSeg.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtS9ProdSeg.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtS9ProdSeg.Style.Font.Name = "Intel Clear";
            this.txtS9ProdSeg.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtS9ProdSeg.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtS9ProdSeg.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtS9ProdSeg.Value = "";

            // 
            // Standalone Price S9
            // 
            this.txtS9Ecap.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(3.50D), Telerik.Reporting.Drawing.Unit.Inch(S9ValuesRow));
            this.txtS9Ecap.Name = "txtS9Ecap";
            this.txtS9Ecap.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.txtS9Ecap.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtS9Ecap.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtS9Ecap.Style.Font.Name = "Intel Clear";
            this.txtS9Ecap.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtS9Ecap.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtS9Ecap.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtS9Ecap.Value = "";

            // 
            // Kit Qty S9
            // 
            this.txtQtyS9.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(4.50D), Telerik.Reporting.Drawing.Unit.Inch(S9ValuesRow));
            this.txtQtyS9.Name = "txtQtyS9";
            this.txtQtyS9.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.txtQtyS9.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtQtyS9.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtQtyS9.Style.Font.Name = "Intel Clear";
            this.txtQtyS9.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtQtyS9.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtQtyS9.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtQtyS9.Value = "&nbsp;";

            // 
            // blank Kit Price S9
            // 
            this.blankKitPriceS9.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(5.50D), Telerik.Reporting.Drawing.Unit.Inch(S9ValuesRow));
            this.blankKitPriceS9.Name = "blankKitPriceS9";
            this.blankKitPriceS9.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.blankKitPriceS9.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.blankKitPriceS9.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.blankKitPriceS9.Style.Font.Name = "Intel Clear";
            this.blankKitPriceS9.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.blankKitPriceS9.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.blankKitPriceS9.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.blankKitPriceS9.Value = "&nbsp;";

            // 
            // blank Max Qty S9
            // 
            this.blankMaxQtyS9.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(6.50D), Telerik.Reporting.Drawing.Unit.Inch(S9ValuesRow));
            this.blankMaxQtyS9.Name = "blankMaxQtyS9";
            this.blankMaxQtyS9.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.00D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.blankMaxQtyS9.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.blankMaxQtyS9.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.blankMaxQtyS9.Style.Font.Name = "Intel Clear";
            this.blankMaxQtyS9.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.blankMaxQtyS9.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.blankMaxQtyS9.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.blankMaxQtyS9.Value = "&nbsp;";

            // 
            // S9 Long EPM Name
            // 
            this.txtS9FullName.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(0.00D), Telerik.Reporting.Drawing.Unit.Inch(S9RowEPM));
            this.txtS9FullName.Name = "txtS9FullName";
            this.txtS9FullName.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(7.50D), Telerik.Reporting.Drawing.Unit.Inch(NormalRowHeight));
            this.txtS9FullName.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtS9FullName.Style.BorderColor.Bottom = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.txtS9FullName.Style.BorderColor.Default = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.txtS9FullName.Style.BorderColor.Left = System.Drawing.Color.Transparent;
            this.txtS9FullName.Style.BorderColor.Right = System.Drawing.Color.Transparent;
            this.txtS9FullName.Style.BorderColor.Top = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.txtS9FullName.Style.BorderStyle.Bottom = Telerik.Reporting.Drawing.BorderType.Solid;
            this.txtS9FullName.Style.BorderStyle.Default = Telerik.Reporting.Drawing.BorderType.None;
            this.txtS9FullName.Style.BorderStyle.Left = Telerik.Reporting.Drawing.BorderType.None;
            this.txtS9FullName.Style.BorderStyle.Right = Telerik.Reporting.Drawing.BorderType.None;
            this.txtS9FullName.Style.BorderStyle.Top = Telerik.Reporting.Drawing.BorderType.Solid;
            this.txtS9FullName.Style.BorderWidth.Bottom = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.txtS9FullName.Style.BorderWidth.Default = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtS9FullName.Style.BorderWidth.Left = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtS9FullName.Style.BorderWidth.Right = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtS9FullName.Style.BorderWidth.Top = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtS9FullName.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtS9FullName.Style.Font.Name = "Intel Clear";
            this.txtS9FullName.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtS9FullName.Style.LineWidth = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.txtS9FullName.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtS9FullName.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtS9FullName.Value = "";



            // THIS IS ALL UNDER ADDITIONAL BLOCK
            // Additional Information Block
            // 
            this.ttlAdditional.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(Col1Location), Telerik.Reporting.Drawing.Unit.Inch(AdditionalInfoHeader));
            this.ttlAdditional.Name = "ttlAdditional";
            this.ttlAdditional.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(7.50D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.ttlAdditional.Style.BackgroundColor = System.Drawing.Color.FromArgb(((int)(((byte)(200)))), ((int)(((byte)(214)))), ((int)(((byte)(227)))), ((int)(((byte)(247)))));
            this.ttlAdditional.Style.BorderColor.Left = System.Drawing.Color.Black;
            this.ttlAdditional.Style.BorderColor.Top = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.ttlAdditional.Style.BorderStyle.Left = Telerik.Reporting.Drawing.BorderType.None;
            this.ttlAdditional.Style.BorderStyle.Top = Telerik.Reporting.Drawing.BorderType.Solid;
            this.ttlAdditional.Style.BorderWidth.Default = Telerik.Reporting.Drawing.Unit.Point(0D);
            this.ttlAdditional.Style.BorderWidth.Top = Telerik.Reporting.Drawing.Unit.Point(1D);
            this.ttlAdditional.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(125)))), ((int)(((byte)(197)))));
            this.ttlAdditional.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.ttlAdditional.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.ttlAdditional.Value = "Additional Information";

            // 
            // Project
            // 
            this.lblProject.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(Col1Location), Telerik.Reporting.Drawing.Unit.Inch(AdditionalInfoRow1));
            this.lblProject.Name = "lblProject";
            this.lblProject.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(SingleColWidth), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.lblProject.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.lblProject.Style.BorderColor.Bottom = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.lblProject.Style.BorderColor.Default = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.lblProject.Style.BorderColor.Left = System.Drawing.Color.Transparent;
            this.lblProject.Style.BorderColor.Right = System.Drawing.Color.Transparent;
            this.lblProject.Style.BorderColor.Top = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.lblProject.Style.BorderStyle.Bottom = Telerik.Reporting.Drawing.BorderType.Solid;
            this.lblProject.Style.BorderStyle.Default = Telerik.Reporting.Drawing.BorderType.None;
            this.lblProject.Style.BorderStyle.Left = Telerik.Reporting.Drawing.BorderType.None;
            this.lblProject.Style.BorderStyle.Right = Telerik.Reporting.Drawing.BorderType.None;
            this.lblProject.Style.BorderStyle.Top = Telerik.Reporting.Drawing.BorderType.Solid;
            this.lblProject.Style.BorderWidth.Bottom = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.lblProject.Style.BorderWidth.Default = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.lblProject.Style.BorderWidth.Left = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.lblProject.Style.BorderWidth.Right = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.lblProject.Style.BorderWidth.Top = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.lblProject.Style.Font.Bold = true;
            this.lblProject.Style.Font.Name = "Intel Clear";
            this.lblProject.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Point(11D);
            this.lblProject.Style.LineWidth = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.lblProject.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.lblProject.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.lblProject.Value = "<span style=\"font-family: neo sans intel; font-size: 10px\"><span style=\"color: #000000\"><strong>Project:</strong></span></span>";
            // 
            // Project Value
            // 
            this.txtProject.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(Col2Location), Telerik.Reporting.Drawing.Unit.Inch(AdditionalInfoRow1));
            this.txtProject.Name = "txtProject";
            this.txtProject.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(AdditionalItemsValuesWidth), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.txtProject.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtProject.Style.BorderColor.Bottom = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.txtProject.Style.BorderColor.Default = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.txtProject.Style.BorderColor.Left = System.Drawing.Color.Transparent;
            this.txtProject.Style.BorderColor.Right = System.Drawing.Color.Transparent;
            this.txtProject.Style.BorderColor.Top = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.txtProject.Style.BorderStyle.Bottom = Telerik.Reporting.Drawing.BorderType.Solid;
            this.txtProject.Style.BorderStyle.Default = Telerik.Reporting.Drawing.BorderType.None;
            this.txtProject.Style.BorderStyle.Left = Telerik.Reporting.Drawing.BorderType.None;
            this.txtProject.Style.BorderStyle.Right = Telerik.Reporting.Drawing.BorderType.None;
            this.txtProject.Style.BorderStyle.Top = Telerik.Reporting.Drawing.BorderType.Solid;
            this.txtProject.Style.BorderWidth.Bottom = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.txtProject.Style.BorderWidth.Default = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtProject.Style.BorderWidth.Left = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtProject.Style.BorderWidth.Right = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtProject.Style.BorderWidth.Top = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtProject.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtProject.Style.Font.Name = "Intel Clear";
            this.txtProject.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtProject.Style.LineWidth = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.txtProject.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtProject.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtProject.Value = "";

            // 
            // Terms
            // 
            this.lblTerms.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(Col1Location), Telerik.Reporting.Drawing.Unit.Inch(AdditionalInfoRow2));
            this.lblTerms.Name = "lblTerms";
            this.lblTerms.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(SingleColWidth), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.lblTerms.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.lblTerms.Style.BorderColor.Bottom = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.lblTerms.Style.BorderColor.Default = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.lblTerms.Style.BorderColor.Left = System.Drawing.Color.Transparent;
            this.lblTerms.Style.BorderColor.Right = System.Drawing.Color.Transparent;
            this.lblTerms.Style.BorderColor.Top = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.lblTerms.Style.BorderStyle.Bottom = Telerik.Reporting.Drawing.BorderType.Solid;
            this.lblTerms.Style.BorderStyle.Default = Telerik.Reporting.Drawing.BorderType.None;
            this.lblTerms.Style.BorderStyle.Left = Telerik.Reporting.Drawing.BorderType.None;
            this.lblTerms.Style.BorderStyle.Right = Telerik.Reporting.Drawing.BorderType.None;
            this.lblTerms.Style.BorderStyle.Top = Telerik.Reporting.Drawing.BorderType.Solid;
            this.lblTerms.Style.BorderWidth.Bottom = Telerik.Reporting.Drawing.Unit.Pixel(0D); // Was 1D
            this.lblTerms.Style.BorderWidth.Default = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.lblTerms.Style.BorderWidth.Left = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.lblTerms.Style.BorderWidth.Right = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.lblTerms.Style.BorderWidth.Top = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.lblTerms.Style.Font.Bold = true;
            this.lblTerms.Style.Font.Name = "Intel Clear";
            this.lblTerms.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Point(11D);
            this.lblTerms.Style.LineWidth = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.lblTerms.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.lblTerms.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.lblTerms.Value = "<span style=\"font-family: neo sans intel; font-size: 10px\"><span style=\"color: #000000\"><strong>Additional T &amp; C\'s:</strong></span></span>";
            // 
            // Terms Value
            // 
            this.txtTerms.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(Col2Location), Telerik.Reporting.Drawing.Unit.Inch(AdditionalInfoRow2));
            this.txtTerms.Name = "txtTerms";
            this.txtTerms.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(AdditionalItemsValuesWidth), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.txtTerms.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.txtTerms.Style.BorderColor.Bottom = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.txtTerms.Style.BorderColor.Default = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.txtTerms.Style.BorderColor.Left = System.Drawing.Color.Transparent;
            this.txtTerms.Style.BorderColor.Right = System.Drawing.Color.Transparent;
            this.txtTerms.Style.BorderColor.Top = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(130)))), ((int)(((byte)(206)))));
            this.txtTerms.Style.BorderStyle.Bottom = Telerik.Reporting.Drawing.BorderType.Solid;
            this.txtTerms.Style.BorderStyle.Default = Telerik.Reporting.Drawing.BorderType.None;
            this.txtTerms.Style.BorderStyle.Left = Telerik.Reporting.Drawing.BorderType.None;
            this.txtTerms.Style.BorderStyle.Right = Telerik.Reporting.Drawing.BorderType.None;
            this.txtTerms.Style.BorderStyle.Top = Telerik.Reporting.Drawing.BorderType.Solid;
            this.txtTerms.Style.BorderWidth.Bottom = Telerik.Reporting.Drawing.Unit.Pixel(0D); // Was 1D
            this.txtTerms.Style.BorderWidth.Default = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtTerms.Style.BorderWidth.Left = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtTerms.Style.BorderWidth.Right = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtTerms.Style.BorderWidth.Top = Telerik.Reporting.Drawing.Unit.Pixel(0D);
            this.txtTerms.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.txtTerms.Style.Font.Name = "Intel Clear";
            this.txtTerms.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.txtTerms.Style.LineWidth = Telerik.Reporting.Drawing.Unit.Pixel(1D);
            this.txtTerms.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtTerms.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.txtTerms.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.txtTerms.Value = "";



            // 
            // pageFooter
            // 
            this.pageFooter.Height = Telerik.Reporting.Drawing.Unit.Inch(0.20D);
            this.pageFooter.Items.AddRange(new Telerik.Reporting.ReportItemBase[] {
            this.htmlTextBox18,
            this.pageInfoTextBox});
            this.pageFooter.Name = "pageFooter";
            this.pageFooter.Style.BackgroundColor = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(125)))), ((int)(((byte)(197)))));
            // 
            // htmlTextBox18
            // 
            this.htmlTextBox18.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(0.00D), Telerik.Reporting.Drawing.Unit.Inch(0.00D));
            this.htmlTextBox18.Name = "htmlTextBox18";
            this.htmlTextBox18.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(1.10D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.htmlTextBox18.Style.Color = System.Drawing.Color.Transparent;
            this.htmlTextBox18.Style.Font.Bold = true;
            this.htmlTextBox18.Style.Font.Name = "Verdana";
            this.htmlTextBox18.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.htmlTextBox18.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.htmlTextBox18.Style.TextAlign = Telerik.Reporting.Drawing.HorizontalAlign.Right;
            this.htmlTextBox18.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.htmlTextBox18.Value = "<span style=\"font-family: neo sans intel; font-size: 10px\"><span style=\"color: #FFFFFF\"><strong>Intel Confidential</strong></span></span>";
            // 
            // pageInfoTextBox
            // 
            this.pageInfoTextBox.Location = new Telerik.Reporting.Drawing.PointU(Telerik.Reporting.Drawing.Unit.Inch(5.20D), Telerik.Reporting.Drawing.Unit.Inch(0.00D));
            this.pageInfoTextBox.Name = "pageInfoTextBox";
            this.pageInfoTextBox.Size = new Telerik.Reporting.Drawing.SizeU(Telerik.Reporting.Drawing.Unit.Inch(2.30D), Telerik.Reporting.Drawing.Unit.Inch(0.20D));
            this.pageInfoTextBox.Style.Color = System.Drawing.Color.Transparent;
            this.pageInfoTextBox.Style.Font.Name = "Verdana";
            this.pageInfoTextBox.Style.Font.Size = Telerik.Reporting.Drawing.Unit.Pixel(10D);
            this.pageInfoTextBox.Style.Padding.Left = Telerik.Reporting.Drawing.Unit.Pixel(5D);
            this.pageInfoTextBox.Style.TextAlign = Telerik.Reporting.Drawing.HorizontalAlign.Right;
            this.pageInfoTextBox.Style.VerticalAlign = Telerik.Reporting.Drawing.VerticalAlign.Middle;
            this.pageInfoTextBox.Style.Color = System.Drawing.Color.FromArgb(((int)(((byte)(255)))), ((int)(((byte)(255)))), ((int)(((byte)(255)))));
            this.pageInfoTextBox.StyleName = "PageInfo";
            this.pageInfoTextBox.Value = "=PageNumber";



            // 
            // QuoteLetter
            // 
            this.Items.AddRange(new Telerik.Reporting.ReportItemBase[] {
            this.pageHeader,
            this.detail,
            this.pageFooter});
            this.Name = "QuoteLetter";
            this.PageSettings.Landscape = false;
            this.PageSettings.Margins = new Telerik.Reporting.Drawing.MarginsU(Telerik.Reporting.Drawing.Unit.Inch(0.40D), Telerik.Reporting.Drawing.Unit.Inch(0.40D), 
                Telerik.Reporting.Drawing.Unit.Inch(0.40D), Telerik.Reporting.Drawing.Unit.Inch(0.40D));
            this.PageSettings.PaperKind = System.Drawing.Printing.PaperKind.Letter;
            reportParameter1.Name = "Customer";
            reportParameter1.Value = "Customer";
            reportParameter2.Name = "Tracker";
            reportParameter2.Value = "Tracker";
            reportParameter3.Name = "EndCustomer";
            reportParameter3.Value = "End Customer";
            reportParameter4.Name = "StartDate";
            reportParameter4.Value = "Start Date";
            reportParameter5.Name = "EndDate";
            reportParameter5.Value = "End Date";
            reportParameter6.Name = "OnAdDate";
            reportParameter6.Value = "On Ad Date";
            reportParameter7.Name = "Quantity";
            reportParameter7.Value = "Quantity";
            reportParameter8.Name = "ProdSegment";
            reportParameter8.Value = "Segment";
            reportParameter9.Name = "ECAPType";
            reportParameter9.Value = "ECAP Type";
            reportParameter10.Name = "Commit";
            reportParameter10.Value = "Product code";
            reportParameter11.Name = "ProdDesc";
            reportParameter11.Value = "ProdDesc";
            reportParameter12.Name = "ECAPPrice";
            reportParameter12.Value = "ECAP";
            reportParameter13.Name = "CPU";
            reportParameter13.Value = "CPU";
            reportParameter14.Name = "CPUTracker";
            reportParameter14.Value = "CPUTracker";
            reportParameter15.Name = "CS";
            reportParameter15.Value = "CS";
            reportParameter16.Name = "CSTracker";
            reportParameter16.Value = "CSTracker";
            reportParameter17.Name = "CPUECAPPrice";
            reportParameter17.Value = "CPUECAPPrice";
            reportParameter18.Name = "CSECAPPrice";
            reportParameter18.Value = "CSECAPPrice";
            reportParameter19.Name = "Environment";
            reportParameter19.Value = "Environment";
            reportParameter20.Name = "Project";
            reportParameter20.Value = "ProjectValue";
            reportParameter21.Name = "Terms";
            reportParameter21.Value = "TermsValue";
            reportParameter22.Name = "XML";
            reportParameter22.Value = "";
            this.ReportParameters.Add(reportParameter1);
            this.ReportParameters.Add(reportParameter2);
            this.ReportParameters.Add(reportParameter3);
            this.ReportParameters.Add(reportParameter4);
            this.ReportParameters.Add(reportParameter5);
            this.ReportParameters.Add(reportParameter6);
            this.ReportParameters.Add(reportParameter7);
            this.ReportParameters.Add(reportParameter8);
            this.ReportParameters.Add(reportParameter9);
            this.ReportParameters.Add(reportParameter10);
            this.ReportParameters.Add(reportParameter11);
            this.ReportParameters.Add(reportParameter12);
            this.ReportParameters.Add(reportParameter13);
            this.ReportParameters.Add(reportParameter14);
            this.ReportParameters.Add(reportParameter15);
            this.ReportParameters.Add(reportParameter16);
            this.ReportParameters.Add(reportParameter17);
            this.ReportParameters.Add(reportParameter18);
            this.ReportParameters.Add(reportParameter19);
            this.ReportParameters.Add(reportParameter20);
            this.ReportParameters.Add(reportParameter21);
            this.ReportParameters.Add(reportParameter22);
            this.Style.BackgroundColor = System.Drawing.Color.Transparent;
            this.Style.Padding.Top = Telerik.Reporting.Drawing.Unit.Inch(0D);
            styleRule1.Style.Padding.Right = Telerik.Reporting.Drawing.Unit.Pixel(6D);
            this.StyleSheet.AddRange(new Telerik.Reporting.Drawing.StyleRule[] {
            styleRule1});
            this.Width = Telerik.Reporting.Drawing.Unit.Inch(7.70D);
            ((System.ComponentModel.ISupportInitialize)(this)).EndInit();

        }
        #endregion

        private Telerik.Reporting.PageHeaderSection pageHeader;
        private Telerik.Reporting.DetailSection detail;
        private Telerik.Reporting.PageFooterSection pageFooter;
        private HtmlTextBox htmlTextBox18;
        private Telerik.Reporting.Panel panel1;

        private int NumOfProducts;
        private HtmlTextBox UpperLegalContent;
        private HtmlTextBox LowerLegalContent;
        private Telerik.Reporting.TextBox pageInfoTextBox;
        private Telerik.Reporting.TextBox currentTimeTextBox;
        private Telerik.Reporting.PictureBox picLogo;
        private HtmlTextBox htmlLeftHeaderTitle;
        private HtmlTextBox DealSectionHeader;
        private HtmlTextBox ttlKitName;
        private HtmlTextBox EcapTypeLabel;
        private HtmlTextBox txtECAPType;
        private HtmlTextBox EndCustomerLabel;
        private HtmlTextBox txtEndCustomer;
        private HtmlTextBox DealStatusLabel;
        private HtmlTextBox txtDealStatus;
        private HtmlTextBox ProgramPaymentLabel;
        private HtmlTextBox txtProgramPayment;
        private HtmlTextBox PayoutBasedOnLabel;
        private HtmlTextBox txtPayoutBasedOn;
        private HtmlTextBox lblGroupType;
        private HtmlTextBox txtGroupType;
        private HtmlTextBox StartDateLabel;
        private HtmlTextBox txtStartDate;
        private HtmlTextBox EndDateLabel;
        private HtmlTextBox txtEndDate;
        private HtmlTextBox lblConsumptionStartDate;
        private HtmlTextBox txtConsumptionStartDate;
        private HtmlTextBox lblConsumptionEndDate;
        private HtmlTextBox txtConsumptionEndDate;
        private HtmlTextBox lblConsEmpty;
        private HtmlTextBox txtConsEmpty;
        private HtmlTextBox ttlProductInfo;
        private HtmlTextBox htmlTextBox2;
        private HtmlTextBox htmlTextBox10;
        private HtmlTextBox htmlTextBox13;
        private HtmlTextBox htmlTextBox11;
        private HtmlTextBox htmlTextBox3;
        private HtmlTextBox lblK1;
        private HtmlTextBox htmlTextBox14;
        private HtmlTextBox txtP1ProdName;
        private HtmlTextBox txtP1FullName;
        private HtmlTextBox lblP1;
        private HtmlTextBox txtP1ProdSeg;
        private HtmlTextBox txtP1Ecap;
        private HtmlTextBox txtQtyP1;
        private HtmlTextBox txtK1Ecap;
        private HtmlTextBox txtQuantity;
        private HtmlTextBox txtS1ProdName;
        private HtmlTextBox txtS1FullName;
        private HtmlTextBox lblS1;
        private HtmlTextBox txtS1ProdSeg;
        private HtmlTextBox txtS1Ecap;
        private HtmlTextBox txtQtyS1;
        private HtmlTextBox blankKitPriceS1;
        private HtmlTextBox blankMaxQtyS1;
        private HtmlTextBox txtS2ProdName;
        private HtmlTextBox txtS2FullName;
        private HtmlTextBox lblS2;
        private HtmlTextBox txtS2ProdSeg;
        private HtmlTextBox txtS2Ecap;
        private HtmlTextBox txtQtyS2;
        private HtmlTextBox blankKitPriceS2;
        private HtmlTextBox blankMaxQtyS2;
        private HtmlTextBox txtS3ProdName;
        private HtmlTextBox txtS3FullName;
        private HtmlTextBox lblS3;
        private HtmlTextBox txtS3ProdSeg;
        private HtmlTextBox txtS3Ecap;
        private HtmlTextBox txtQtyS3;
        private HtmlTextBox blankKitPriceS3;
        private HtmlTextBox blankMaxQtyS3;
        private HtmlTextBox txtS4ProdName;
        private HtmlTextBox lblS4;
        private HtmlTextBox txtS4ProdSeg;
        private HtmlTextBox txtS4FullName;
        private HtmlTextBox txtS4Ecap;
        private HtmlTextBox txtQtyS4;
        private HtmlTextBox blankKitPriceS4;
        private HtmlTextBox blankMaxQtyS4;
        private HtmlTextBox txtS5ProdName;
        private HtmlTextBox txtS5FullName;
        private HtmlTextBox lblS5;
        private HtmlTextBox txtS5ProdSeg;
        private HtmlTextBox txtS5Ecap;
        private HtmlTextBox txtQtyS5;
        private HtmlTextBox blankKitPriceS5;
        private HtmlTextBox blankMaxQtyS5;
        private HtmlTextBox txtS6ProdName;
        private HtmlTextBox txtS6FullName;
        private HtmlTextBox lblS6;
        private HtmlTextBox txtS6ProdSeg;
        private HtmlTextBox txtS6Ecap;
        private HtmlTextBox txtQtyS6;
        private HtmlTextBox blankKitPriceS6;
        private HtmlTextBox blankMaxQtyS6;
        private HtmlTextBox txtS7ProdName;
        private HtmlTextBox txtS7FullName;
        private HtmlTextBox lblS7;
        private HtmlTextBox txtS7ProdSeg;
        private HtmlTextBox txtS7Ecap;
        private HtmlTextBox txtQtyS7;
        private HtmlTextBox blankKitPriceS7;
        private HtmlTextBox blankMaxQtyS7;
        private HtmlTextBox txtS8ProdName;
        private HtmlTextBox txtS8FullName;
        private HtmlTextBox lblS8;
        private HtmlTextBox txtS8ProdSeg;
        private HtmlTextBox txtS8Ecap;
        private HtmlTextBox txtQtyS8;
        private HtmlTextBox blankKitPriceS8;
        private HtmlTextBox blankMaxQtyS8;
        private HtmlTextBox txtS9ProdName;
        private HtmlTextBox txtS9FullName;
        private HtmlTextBox lblS9;
        private HtmlTextBox txtS9ProdSeg;
        private HtmlTextBox txtS9Ecap;
        private HtmlTextBox txtQtyS9;
        private HtmlTextBox blankKitPriceS9;
        private HtmlTextBox blankMaxQtyS9;
        private HtmlTextBox ttlAdditional;
        private HtmlTextBox lblProject;
        private HtmlTextBox txtProject;
        private HtmlTextBox lblTerms;
        private HtmlTextBox txtTerms;

    }
}