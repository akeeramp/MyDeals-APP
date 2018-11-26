using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque;
using Intel.Opaque.DBAccess;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Telerik.Reporting.Processing;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;

namespace Intel.MyDeals.DataLibrary
{
    public class QuoteLetterDataLib : IQuoteLetterDataLib
    {
        public QuoteLetterDataLib()
        {
        }

        public List<AdminQuoteLetter> AdminGetTemplates()
        {
            var ret = new List<AdminQuoteLetter>();
            Procs.dbo.PR_MANAGE_QUOTE_LETTER_TEMPLATES cmd = new Procs.dbo.PR_MANAGE_QUOTE_LETTER_TEMPLATES()
            {
                intWWID = OpUserStack.MyOpUserToken.Usr.WWID,
                mode = "Get",
                tmpltSid = 0, // Not used for get operations.
                headerInfo = null, // Not used for get operations.
                bodyInfo = null, // Not used for get operations.
                debug = false
            };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_BODY_INFO = DB.GetReaderOrdinal(rdr, "BODY_INFO");
                    int IDX_HDR_INFO = DB.GetReaderOrdinal(rdr, "HDR_INFO");
                    int IDX_OBJ_SET_TYPE_CD = DB.GetReaderOrdinal(rdr, "OBJ_SET_TYPE_CD");
                    int IDX_PROGRAM_PAYMENT = DB.GetReaderOrdinal(rdr, "PROGRAM_PAYMENT");
                    int IDX_TMPLT_SID = DB.GetReaderOrdinal(rdr, "TMPLT_SID");

                    while (rdr.Read())
                    {
                        ret.Add(new AdminQuoteLetter
                        {
                            BODY_INFO = (IDX_BODY_INFO < 0 || rdr.IsDBNull(IDX_BODY_INFO)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_BODY_INFO),
                            HDR_INFO = (IDX_HDR_INFO < 0 || rdr.IsDBNull(IDX_HDR_INFO)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_HDR_INFO),
                            OBJ_SET_TYPE_CD = (IDX_OBJ_SET_TYPE_CD < 0 || rdr.IsDBNull(IDX_OBJ_SET_TYPE_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OBJ_SET_TYPE_CD),
                            PROGRAM_PAYMENT = (IDX_PROGRAM_PAYMENT < 0 || rdr.IsDBNull(IDX_PROGRAM_PAYMENT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PROGRAM_PAYMENT),
                            TMPLT_SID = (IDX_TMPLT_SID < 0 || rdr.IsDBNull(IDX_TMPLT_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_TMPLT_SID)
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }
            return ret;
        }

        public AdminQuoteLetter AdminSaveTemplate(AdminQuoteLetter template)
        {
            Procs.dbo.PR_MANAGE_QUOTE_LETTER_TEMPLATES cmd = new Procs.dbo.PR_MANAGE_QUOTE_LETTER_TEMPLATES
            {
                intWWID = OpUserStack.MyOpUserToken.Usr.WWID,
                mode = "Update",
                tmpltSid = template.TMPLT_SID,
                bodyInfo = template.BODY_INFO,
                headerInfo = template.HDR_INFO,
                debug = false
            };

            try
            {
                using (var rdr = DataAccess.ExecuteDataSet(cmd))
                {
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }

            return template;
        }

        public void GenerateBulkQuoteLetter(List<QuoteLetterData> quoteLetterDealInfoList)
        {
            GetDealQuoteLetterData(quoteLetterDealInfoList, 2);
            foreach (var qlData in quoteLetterDealInfoList)
            {
                Thread quoteLetterThread = new Thread(() => GenerateQuoteLetterPDF(qlData, true));
                quoteLetterThread.Start();
                //GenerateQuoteLetterPDF(qlData, true);  // Force quote letter generation when a deal is approved (part of deal Approval flow)
            }
        }

        public QuoteLetterFile GetDealQuoteLetter(QuoteLetterData quoteLetterDealData, string headerInfo, string bodyInfo, bool forceRegenerateQuoteLetter = false)
        {
            QuoteLetterFile quoteLetterPdfBytes = new QuoteLetterFile();
            var quoteLetterDataList = new List<QuoteLetterData> { quoteLetterDealData };

            //preview quote letter data
            if (!string.IsNullOrEmpty(headerInfo) && !string.IsNullOrEmpty(bodyInfo))
                SetDealQuoteLetterPreviewData(quoteLetterDataList[0], headerInfo, bodyInfo);
            else
                GetDealQuoteLetterData(quoteLetterDataList, 2);

            quoteLetterPdfBytes = GenerateQuoteLetterPDF(quoteLetterDataList[0], forceRegenerateQuoteLetter);
            return quoteLetterPdfBytes;
        }

        private void SetDealQuoteLetterPreviewData(QuoteLetterData quoteLetterData, string headerInfo, string bodyInfo)
        {
            var quoteLetterContentData = new QuoteLetterContentInfo();
            var quoteLetterTemplateData = new QuoteLetterTemplateInfo();

            quoteLetterContentData.QUOTE_LETTER = @"<PARAMETERS>
                                                      <Customer>XXX</Customer>
                                                      <EndCustomer />
                                                      <StartDate>01/08/2018</StartDate>
                                                      <EndDate>3/31/2018 </EndDate>
                                                      <OnAdDate>1/8/2018 </OnAdDate>
                                                      <Quantity>999999999</Quantity>
                                                      <ProdSegment>DT</ProdSegment>
                                                      <ECAPType>Kitted / MCP</ECAPType>
                                                      <ProdDesc>i7-xxxx</ProdDesc>
                                                      <ECAPPrice>$2 - 502124 (2018-01-08 - 2018-03-31)</ECAPPrice>
                                                      <Commit>i7-xxxx</Commit>
                                                      <CPUECAPPrice>$3 - 502124 (2018-01-08 - 2018-03-31)</CPUECAPPrice>
                                                      <CPU>i7-xxxx</CPU>
                                                      <CSECAPPrice>$4 - 502124 (2018-01-08 - 2018-03-31)</CSECAPPrice>
                                                      <CS>i7-xxxx</CS>
                                                      <KitCheck>Y</KitCheck>
                                                    </PARAMETERS>";
            quoteLetterTemplateData.BODY_INFO = bodyInfo;
            quoteLetterTemplateData.HDR_INFO = headerInfo;

            quoteLetterData.ContentInfo = quoteLetterContentData;
            quoteLetterData.TemplateInfo = quoteLetterTemplateData;
        }

        private static string EscapeSpecialChars(string val)
        {
            val = val.Replace("&amp;", "and");
            val = val.Replace("&", "and");
            val = val.Replace("<", "&lt;");
            val = val.Replace(">", "&gt;");
            val = val.Replace("'", "&apos;");
            val = val.Replace("\"", "&quot;");
            val = val.Replace("{", "(");
            val = val.Replace("}", ")");
            val = val.Replace("+", "_");
            return val;
        }

        /// <summary>
        /// Get quote letter body based on deal id list
        /// </summary>
        /// <returns>QuoteLetterData with Content and Template data</returns>
        private List<QuoteLetterData> GetDealQuoteLetterData(List<QuoteLetterData> quoteLetterDealInfoList, int callMode)
        {
            string dealIds = string.Empty;
            dealIds = string.Join(",", quoteLetterDealInfoList.Select(dealInfo => dealInfo.ObjectSid).ToArray());

            Procs.dbo.PR_MYDL_GET_QUOTE_INFO cmd = new Procs.dbo.PR_MYDL_GET_QUOTE_INFO()
            {
                @ObjSidLst = dealIds, //String.Join(",", dealIds)
                @callMode = callMode
            };
            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    //Table 1
                    int IDX_CONTRACT_PRODUCT = DB.GetReaderOrdinal(rdr, "CONTRACT_PRODUCT");
                    int IDX_CUST_NM = DB.GetReaderOrdinal(rdr, "CUST_NM");
                    int IDX_EMAIL_ADDR = DB.GetReaderOrdinal(rdr, "EMAIL_ADDR");
                    int IDX_END_CUSTOMER = DB.GetReaderOrdinal(rdr, "END_CUSTOMER");
                    int IDX_OBJ_SET_TYPE_CD = DB.GetReaderOrdinal(rdr, "OBJ_SET_TYPE_CD");
                    int IDX_OBJ_SID = DB.GetReaderOrdinal(rdr, "OBJ_SID");
                    int IDX_PDF_FILE = DB.GetReaderOrdinal(rdr, "PDF_FILE");
                    int IDX_PROGRAM_PAYMENT = DB.GetReaderOrdinal(rdr, "PROGRAM_PAYMENT");
                    int IDX_QUOTE_LETTER = DB.GetReaderOrdinal(rdr, "QUOTE_LETTER");
                    int IDX_REBATE_TYPE = DB.GetReaderOrdinal(rdr, "REBATE_TYPE");
                    int IDX_TRKR_NBR = DB.GetReaderOrdinal(rdr, "TRKR_NBR");
                    int IDX_WF_STG_CD = DB.GetReaderOrdinal(rdr, "WF_STG_CD");

                    while (rdr.Read())
                    {
                        var quoteLetterContentData = (new QuoteLetterContentInfo
                        {
                            CONTRACT_PRODUCT = (IDX_CONTRACT_PRODUCT < 0 || rdr.IsDBNull(IDX_CONTRACT_PRODUCT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CONTRACT_PRODUCT),
                            CUST_NM = (IDX_CUST_NM < 0 || rdr.IsDBNull(IDX_CUST_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CUST_NM),
                            EMAIL_ADDR = (IDX_EMAIL_ADDR < 0 || rdr.IsDBNull(IDX_EMAIL_ADDR)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_EMAIL_ADDR),
                            END_CUSTOMER = (IDX_END_CUSTOMER < 0 || rdr.IsDBNull(IDX_END_CUSTOMER)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_END_CUSTOMER),
                            OBJ_SET_TYPE_CD = (IDX_OBJ_SET_TYPE_CD < 0 || rdr.IsDBNull(IDX_OBJ_SET_TYPE_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OBJ_SET_TYPE_CD),
                            OBJ_SID = (IDX_OBJ_SID < 0 || rdr.IsDBNull(IDX_OBJ_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_OBJ_SID),
                            PDF_FILE = (IDX_PDF_FILE < 0 || rdr.IsDBNull(IDX_PDF_FILE)) ? default(System.Byte[]) : rdr.GetFieldValue<System.Byte[]>(IDX_PDF_FILE),
                            PROGRAM_PAYMENT = (IDX_PROGRAM_PAYMENT < 0 || rdr.IsDBNull(IDX_PROGRAM_PAYMENT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PROGRAM_PAYMENT),
                            QUOTE_LETTER = (IDX_QUOTE_LETTER < 0 || rdr.IsDBNull(IDX_QUOTE_LETTER)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_QUOTE_LETTER),
                            REBATE_TYPE = (IDX_REBATE_TYPE < 0 || rdr.IsDBNull(IDX_REBATE_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_REBATE_TYPE),
                            TRKR_NBR = (IDX_TRKR_NBR < 0 || rdr.IsDBNull(IDX_TRKR_NBR)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_TRKR_NBR),
                            WF_STG_CD = (IDX_WF_STG_CD < 0 || rdr.IsDBNull(IDX_WF_STG_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WF_STG_CD)
                        });

                        var quoteLetterData = quoteLetterDealInfoList.FirstOrDefault(qlData => qlData.ObjectSid == quoteLetterContentData.OBJ_SID.ToString());
                        if (quoteLetterData != null)
                            quoteLetterData.ContentInfo = quoteLetterContentData;
                    } // while

                    rdr.NextResult();

                    //Table 2

                    int IDX_BODY_INFO = DB.GetReaderOrdinal(rdr, "BODY_INFO");
                    int IDX_CHG_DTM = DB.GetReaderOrdinal(rdr, "CHG_DTM");
                    int IDX_CHG_EMP_WWID = DB.GetReaderOrdinal(rdr, "CHG_EMP_WWID");
                    int IDX_CRE_DTM = DB.GetReaderOrdinal(rdr, "CRE_DTM");
                    int IDX_CRE_EMP_WWID = DB.GetReaderOrdinal(rdr, "CRE_EMP_WWID");
                    int IDX_HDR_INFO = DB.GetReaderOrdinal(rdr, "HDR_INFO");
                    int IDX_T_OBJ_SET_TYPE_CD = DB.GetReaderOrdinal(rdr, "OBJ_SET_TYPE_CD");
                    int IDX_T_PROGRAM_PAYMENT = DB.GetReaderOrdinal(rdr, "PROGRAM_PAYMENT");
                    int IDX_RLSE_ID = DB.GetReaderOrdinal(rdr, "RLSE_ID");
                    int IDX_TMPLT_SID = DB.GetReaderOrdinal(rdr, "TMPLT_SID");

                    while (rdr.Read())
                    {
                        var quoteLetterTemplateData = (new QuoteLetterTemplateInfo
                        {
                            BODY_INFO = (IDX_BODY_INFO < 0 || rdr.IsDBNull(IDX_BODY_INFO)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_BODY_INFO),
                            CHG_DTM = (IDX_CHG_DTM < 0 || rdr.IsDBNull(IDX_CHG_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CHG_DTM),
                            CHG_EMP_WWID = (IDX_CHG_EMP_WWID < 0 || rdr.IsDBNull(IDX_CHG_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CHG_EMP_WWID),
                            CRE_DTM = (IDX_CRE_DTM < 0 || rdr.IsDBNull(IDX_CRE_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CRE_DTM),
                            CRE_EMP_WWID = (IDX_CRE_EMP_WWID < 0 || rdr.IsDBNull(IDX_CRE_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CRE_EMP_WWID),
                            HDR_INFO = (IDX_HDR_INFO < 0 || rdr.IsDBNull(IDX_HDR_INFO)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_HDR_INFO),
                            OBJ_SET_TYPE_CD = (IDX_T_OBJ_SET_TYPE_CD < 0 || rdr.IsDBNull(IDX_T_OBJ_SET_TYPE_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_T_OBJ_SET_TYPE_CD),
                            PROGRAM_PAYMENT = (IDX_T_PROGRAM_PAYMENT < 0 || rdr.IsDBNull(IDX_T_PROGRAM_PAYMENT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_T_PROGRAM_PAYMENT),
                            RLSE_ID = (IDX_RLSE_ID < 0 || rdr.IsDBNull(IDX_RLSE_ID)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RLSE_ID),
                            TMPLT_SID = (IDX_TMPLT_SID < 0 || rdr.IsDBNull(IDX_TMPLT_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_TMPLT_SID)
                        });

                        var quoteLetterDataList = quoteLetterDealInfoList.Where(qlData => qlData.ContentInfo.PROGRAM_PAYMENT.ToUpper() == quoteLetterTemplateData.PROGRAM_PAYMENT.ToUpper() &&
                                                                                               qlData.ContentInfo.OBJ_SET_TYPE_CD.ToUpper() == quoteLetterTemplateData.OBJ_SET_TYPE_CD.ToUpper());
                        foreach (var qlData in quoteLetterDataList)
                            qlData.TemplateInfo = quoteLetterTemplateData;
                    } // while
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }
            return quoteLetterDealInfoList;
        }

        private QuoteLetterFile GenerateQuoteLetterPDF(QuoteLetterData quoteLetterData, bool forceRegenerateQuoteLetter = false)
        {
            byte[] quoteLetterBytes;
            string dealId = quoteLetterData.ObjectSid;

            if (quoteLetterData.TemplateInfo == null)
            {
                return null;
            }

            string fileName = $"QuoteLetter_Preview.pdf";
            if (!string.IsNullOrWhiteSpace(quoteLetterData.ContentInfo.CUST_NM) &&
                !string.IsNullOrWhiteSpace(quoteLetterData.ContentInfo.CONTRACT_PRODUCT) &&
                !string.IsNullOrWhiteSpace(quoteLetterData.ContentInfo.REBATE_TYPE))
            {
                var custNm = EscapeSpecialChars(quoteLetterData.ContentInfo.CUST_NM);
                var endcust = EscapeSpecialChars(quoteLetterData.ContentInfo.END_CUSTOMER);
                var sku = EscapeSpecialChars(quoteLetterData.ContentInfo.CONTRACT_PRODUCT).Split(',')[0];
                var ecapType = quoteLetterData.ContentInfo.REBATE_TYPE;

                fileName = $"{custNm} {(ecapType.ToUpper() == "TENDER" ? endcust : string.Empty)} {sku} {ecapType} {dealId}.pdf";
            }

            var inNegotiation = string.IsNullOrEmpty(quoteLetterData.ContentInfo.TRKR_NBR) || quoteLetterData.ContentInfo.TRKR_NBR.IndexOf("*") >= 0;
            var isTenderOfferStg = quoteLetterData.ContentInfo.WF_STG_CD;

            if (quoteLetterData.ContentInfo.QUOTE_LETTER != null)
            {
                // If there is an existing PDF file exists in DB, use the existing one
                if (!forceRegenerateQuoteLetter &&
                    quoteLetterData.ContentInfo.PDF_FILE != null && quoteLetterData.ContentInfo.PDF_FILE.Length > 0)
                {
                    quoteLetterBytes = quoteLetterData.ContentInfo.PDF_FILE;
                }
                else
                {
                    // Generate new quote Letter PDf and Save to DB/Display to user
                    Telerik.Reporting.Report reportToExport = new QuoteLetter(quoteLetterData.ContentInfo.QUOTE_LETTER, quoteLetterData.TemplateInfo.HDR_INFO, quoteLetterData.TemplateInfo.BODY_INFO, string.IsNullOrWhiteSpace(dealId) ? 0 : int.Parse(dealId));

                    if (inNegotiation) // add a water mark to signify that this is not a real contract
                    {
                        Telerik.Reporting.Drawing.TextWatermark textWatermark1 = new Telerik.Reporting.Drawing.TextWatermark();
                        textWatermark1.Color = System.Drawing.Color.Gray;
                        textWatermark1.Font.Bold = true;
                        textWatermark1.Font.Size = Telerik.Reporting.Drawing.Unit.Point(72D);
                        textWatermark1.Orientation = Telerik.Reporting.Drawing.WatermarkOrientation.Diagonal;
                        textWatermark1.Position = Telerik.Reporting.Drawing.WatermarkPosition.Behind;
                        textWatermark1.PrintOnFirstPage = true;
                        textWatermark1.PrintOnLastPage = true;
                        if (isTenderOfferStg == "Offer")
                        {
                            textWatermark1.Text = "Offer";
                        }
                        else
                        {
                            textWatermark1.Text = "Not an Offer";
                        }
                        textWatermark1.Opacity = 0.3D;

                        reportToExport.PageSettings.Watermarks.Add(textWatermark1);
                    }

                    ReportProcessor reportProcessor = new ReportProcessor();
                    Telerik.Reporting.InstanceReportSource instanceReportSource = new Telerik.Reporting.InstanceReportSource { ReportDocument = reportToExport };
                    RenderingResult result = reportProcessor.RenderReport("PDF", instanceReportSource, null);

                    var ms = new MemoryStream(result.DocumentBytes) { Position = 0 };
                    quoteLetterBytes = ms.ToArray();

                    // Save to DB here since this was generated (Mode 3 and didn't have a pre-existin PDF)
                    // forceRegenerateQuoteLetter adds all ECAP/KIT deals by default, but is not set on adhoc calls to Active deals not already saved.  We don't want to save tenders (or any deals) with no trackers.
                    if (!inNegotiation || (forceRegenerateQuoteLetter && !inNegotiation))
                    {
                        bool quoteResult = forceRegenerateQuoteLetter ?
                            SaveQuotePDF(quoteLetterData, quoteLetterData.ContentInfo.TRKR_NBR, quoteLetterBytes).Result:
                            SaveQuotePDFWait(quoteLetterData, quoteLetterData.ContentInfo.TRKR_NBR, quoteLetterBytes);
                    }
                }
            }
            else
            {
                string failedMessage = "XML data was empty: aborting send and removing" + dealId + " from list.";
                quoteLetterBytes = Encoding.ASCII.GetBytes(failedMessage);
            }

            return new QuoteLetterFile
            {
                Content = quoteLetterBytes,
                Name = fileName
            };
        }

        private async Task<bool> SaveQuotePDF(QuoteLetterData quoteLetterData, string trkrNumber, byte[] quoteLetterPdf)
        {
            try
            {
                Procs.dbo.PR_MYDL_SAVE_QUOTE_LTTR_DATA cmd = new Procs.dbo.PR_MYDL_SAVE_QUOTE_LTTR_DATA
                {
                    CUST_MBR_SID = Convert.ToInt32(quoteLetterData.CustomerId),
                    OBJ_TYPE_SID = Convert.ToInt32(quoteLetterData.ObjectTypeId),
                    OBJ_SID = Convert.ToInt32(quoteLetterData.ObjectSid),
                    TRKR_NBR = trkrNumber,
                    FILE_DATA = quoteLetterPdf
                };
                using (var async = await DataAccess.ExecuteReaderAsync(cmd))
                {
                }
                return true;
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }
        }

        private bool SaveQuotePDFWait(QuoteLetterData quoteLetterData, string trkrNumber, byte[] quoteLetterPdf)
        {
            try
            {
                Procs.dbo.PR_MYDL_SAVE_QUOTE_LTTR_DATA cmd = new Procs.dbo.PR_MYDL_SAVE_QUOTE_LTTR_DATA
                {
                    CUST_MBR_SID = Convert.ToInt32(quoteLetterData.CustomerId),
                    OBJ_TYPE_SID = Convert.ToInt32(quoteLetterData.ObjectTypeId),
                    OBJ_SID = Convert.ToInt32(quoteLetterData.ObjectSid),
                    TRKR_NBR = trkrNumber,
                    FILE_DATA = quoteLetterPdf
                };
                using (DataAccess.ExecuteReader(cmd))
                {
                }
                return true;
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }
        }
    }
}