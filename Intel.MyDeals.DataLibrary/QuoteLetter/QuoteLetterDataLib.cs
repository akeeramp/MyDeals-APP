using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque;
using Intel.Opaque.DBAccess;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
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
                GenerateQuoteLetterPDF(qlData);  
        }
        public QuoteLetterFile GetDealQuoteLetter(QuoteLetterData quoteLetterDealData, string headerInfo, string bodyInfo)
        {                        
            QuoteLetterFile quoteLetterPdfBytes = new QuoteLetterFile();
            var quoteLetterDataList = new List<QuoteLetterData>() { quoteLetterDealData };

            //preview quote letter data
            if (!string.IsNullOrEmpty(headerInfo) && !string.IsNullOrEmpty(bodyInfo))
                SetDealQuoteLetterPreviewData(quoteLetterDataList[0], headerInfo, bodyInfo);
            else
                GetDealQuoteLetterData(quoteLetterDataList, 2); 

            quoteLetterPdfBytes = GenerateQuoteLetterPDF(quoteLetterDataList[0]);
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
                    int IDX_EMAIL = DB.GetReaderOrdinal(rdr, "EMAIL");
                    int IDX_OBJ_SET_TYPE_CD = DB.GetReaderOrdinal(rdr, "OBJ_SET_TYPE_CD");
                    int IDX_OBJ_SID = DB.GetReaderOrdinal(rdr, "OBJ_SID");
                    int IDX_PDF_FILE = DB.GetReaderOrdinal(rdr, "PDF_FILE");
                    int IDX_PROGRAM_PAYMENT = DB.GetReaderOrdinal(rdr, "PROGRAM_PAYMENT");
                    int IDX_QUOTE_LETTER = DB.GetReaderOrdinal(rdr, "QUOTE_LETTER");
                    int IDX_TRKR_NBR = DB.GetReaderOrdinal(rdr, "TRKR_NBR");

                    while (rdr.Read())
                    {
                        var quoteLetterContentData = (new QuoteLetterContentInfo
                        {
                            EMAIL = (IDX_EMAIL < 0 || rdr.IsDBNull(IDX_EMAIL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_EMAIL),
                            OBJ_SET_TYPE_CD = (IDX_OBJ_SET_TYPE_CD < 0 || rdr.IsDBNull(IDX_OBJ_SET_TYPE_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OBJ_SET_TYPE_CD),
                            OBJ_SID = (IDX_OBJ_SID < 0 || rdr.IsDBNull(IDX_OBJ_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_OBJ_SID),
                            PDF_FILE = (IDX_PDF_FILE < 0 || rdr.IsDBNull(IDX_PDF_FILE)) ? default(System.Byte[]) : rdr.GetFieldValue<System.Byte[]>(IDX_PDF_FILE),
                            PROGRAM_PAYMENT = (IDX_PROGRAM_PAYMENT < 0 || rdr.IsDBNull(IDX_PROGRAM_PAYMENT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PROGRAM_PAYMENT),
                            QUOTE_LETTER = (IDX_QUOTE_LETTER < 0 || rdr.IsDBNull(IDX_QUOTE_LETTER)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_QUOTE_LETTER),
                            TRKR_NBR = (IDX_TRKR_NBR < 0 || rdr.IsDBNull(IDX_TRKR_NBR)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_TRKR_NBR)
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
                        foreach(var qlData in quoteLetterDataList)
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

        private QuoteLetterFile GenerateQuoteLetterPDF(QuoteLetterData quoteLetterData)
        {            
            byte[] quoteLetterBytes;
            string fileName = string.Empty;            
            string fileNameDealId = string.IsNullOrEmpty(quoteLetterData.ObjectSid) ? "Preview" : quoteLetterData.ObjectSid;

            if (quoteLetterData.ContentInfo.QUOTE_LETTER != null)
            {
                // If there is an existing PDF file exists in DB, use the existing one
                if (quoteLetterData.ContentInfo.PDF_FILE != null && quoteLetterData.ContentInfo.PDF_FILE.Length > 0)
                {
                    quoteLetterBytes = quoteLetterData.ContentInfo.PDF_FILE;
                }
                else
                {               
                    // Generate new quote Letter PDf and Save to DB/Display to user
                    Telerik.Reporting.Report reportToExport = new QuoteLetter(quoteLetterData.ContentInfo.QUOTE_LETTER, quoteLetterData.TemplateInfo.HDR_INFO, quoteLetterData.TemplateInfo.BODY_INFO);
                    ReportProcessor reportProcessor = new ReportProcessor();
                    Telerik.Reporting.InstanceReportSource instanceReportSource = new Telerik.Reporting.InstanceReportSource { ReportDocument = reportToExport };
                    RenderingResult result = reportProcessor.RenderReport("PDF", instanceReportSource, null);

                    
                    fileName = result.DocumentName + "_" + fileNameDealId + ".pdf";
                    var ms = new MemoryStream(result.DocumentBytes) { Position = 0 };
                    quoteLetterBytes = ms.ToArray();

                    // Save to DB here since this was generated (Mode 3 and didn't have a pre-existin PDF)
                    if (!(string.IsNullOrEmpty(quoteLetterData.ContentInfo.TRKR_NBR)) && !(quoteLetterData.ContentInfo.TRKR_NBR.Contains("*")))
                        SaveQuotePDF(quoteLetterData, quoteLetterData.ContentInfo.TRKR_NBR, quoteLetterBytes);
                }
            }
            else
            {
                string failedMessage = "XML data was empty: aborting send and removing" + fileNameDealId + " from list.";
                quoteLetterBytes = Encoding.ASCII.GetBytes(failedMessage);
            }

            var quoteLetterFile = new QuoteLetterFile();
            quoteLetterFile.Content = quoteLetterBytes;
            quoteLetterFile.Name = string.IsNullOrEmpty(fileName) ? fileName = "QuoteLetter" + "_" + quoteLetterData.ContentInfo.OBJ_SID + ".pdf" : fileName;

            return quoteLetterFile;


            //var cmd = new PR_IDMS_GET_QUOTE_INFO
            //{
            //    dealID = dealID.ToString(),
            //    callMode = runMode
            //};

            //var returnedDS = DataAccess.ExecuteSpDataSetProc(ConnectionString, 0, cmd);  //Get XML data for thie specified deal

            //DataTable dealDataTable = returnedDS.Tables[0];
            //DataTable quoteTemplateTable = returnedDS.Tables[1];

            //DataRow row = dealDataTable.Rows[0];
            //var inputXML = row["QUOTE_LETTER"];
            //var mailToList = row["EMAIL"].ToString();
            //byte[] pdfFile = row["PDF_FILE"] as byte[]; // Read in the previously generated PDF file if one exists - short out generation if so.
            //string trkrNbr = row["TRKR_NBR"].ToString();

            //DataRow rowContent = quoteTemplateTable.Rows[0];
            //var content0 = rowContent["CONTENT0"];
            //var content1 = rowContent["CONTENT1"];


            //if (runMode == 2) // Automated mailing batch
            //{
            //    var myMail = new MailMessage();

            //    char[] splitter = { ';' };
            //    string strReturnMessage;

            //    if (env != "Production" || mailToList == string.Empty)
            //    // This should never be empty, but you kow those whacky assumptions...
            //    {
            //        myMail.Subject = "[" + env + "] Quote Letter for Deal ID " + dealID;
            //        myMail.Body = "See Attachment for Quote Letter<br>In production, this would be mailed to: " +
            //                      mailToList;
            //        mailToList = WebConfigurationManager.AppSettings["SupportDevelopers"];
            //        if (env == "Test" || env == "CONS")
            //        // OverrideMode mailing list if needed for non-prod envs or prod no mail list header
            //        {
            //            mailToList = WebConfigurationManager.AppSettings["QuoteTestingEMail"];
            //        }
            //        if (env == "Production")
            //        {
            //            myMail.Subject = "[Empty Production Mailing List] Quote Letter for Deal ID " + dealID;
            //        }
            //    }
            //    else
            //    {
            //        myMail.Subject = "Quote Letter for Deal ID " + dealID;
            //        myMail.Body = "See Attachment for Quote Letter";
            //    }

            //    myMail.From = new MailAddress(WebConfigurationManager.AppSettings["SupportEMail"]);

            //    var arMailToList = mailToList.Split(splitter);
            //    foreach (var t in arMailToList.Where(t => t.Length > 0))
            //    {
            //        myMail.To.Add(new MailAddress(t));
            //    }

            //    myMail.IsBodyHtml = true;

            //    var attachment = new Attachment(ms, fileName);
            //    myMail.Attachments.Add(attachment);

            //    // Save to DB since this was just generated for the first time (Mode 2)
            //    if (!(string.IsNullOrEmpty(trkrNbr)) && !(trkrNbr.Contains("*"))) SaveQuotePDF(dealID, trkrNbr, ms.ToArray());

            //    var client = new SmtpClient();
            //    try
            //    {
            //        client.Send(myMail);
            //        strReturnMessage = "Message sent:" + dealID;
            //    }
            //    catch (Exception ex)
            //    {
            //        strReturnMessage = "Message send Failed: Deal ID = " + dealID + ", Message = " + ex.Message;
            //    }

            //    returnResults = Encoding.ASCII.GetBytes(strReturnMessage);
            //}
            //else
            //{
            //    byte[] response = ms.ToArray();

            //    // Save to DB here since this was generated (Mode 3 and didn't have a pre-existin PDF)
            //    if (!(string.IsNullOrEmpty(trkrNbr)) && !(trkrNbr.Contains("*"))) SaveQuotePDF(dealID, trkrNbr, response);

            //    returnResults = response;
            //}


            //return returnResults;
        }

        private void SaveQuotePDF(QuoteLetterData quoteLetterData, string trkrNumber, byte[] quoteLetterPdf)
        {
            Procs.dbo.PR_MYDL_SAVE_QUOTE_LTTR_DATA cmd = new Procs.dbo.PR_MYDL_SAVE_QUOTE_LTTR_DATA
            {
               CUST_MBR_SID = Convert.ToInt32(quoteLetterData.CustomerId),
               OBJ_TYPE_SID = Convert.ToInt32(quoteLetterData.ObjectTypeId),
               OBJ_SID = Convert.ToInt32(quoteLetterData.ObjectSid),
               TRKR_NBR = trkrNumber,
               FILE_DATA = quoteLetterPdf
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

            //return template;
            //var timer = DateTime.Now;

            ////TBD - VN
            //var cmd = new PR_SAVE_QUOTE_LTTR_DATA
            //{
            //        (@CUST_MBR_SID INT,
            //@OBJ_TYPE_SID INT,
            //@OBJ_SID INT,

            //      DEAL_MBR_SID = dealId,
            //    TRKR_NBR = trkr,
            //    FILE_DATA = pdfBody
            //};

            //try
            //{
            //    StartCmdLogMessage(null, "SaveQuotePDF", cmd, timer);

            //    //string stringXML = DataAccess.ExecuteSpScalarProc(ConnectionString, LogLevel, cmd) as String;
            //    DataAccess.ExecuteSpNonQuery(cmd);

            //    EndCmdLogMessage(null, "SaveQuotePDF", cmd, "Returned Void", timer);
            //}
            //catch (Exception ex)
            //{
            //    //WriteToEventViewer("SaveQuotePDF", ex.Message, "IDMS", EventLogEntryType.Error, "CDMS");
            //    //EndCmdLogMessage(null, "SaveQuotePDF", cmd, "SaveQuotePDF Failure : (" + ex.Message + ")", timer);
            //    //throw MsgQueue.CreateFault(ex);
            //}
        }
    }
}