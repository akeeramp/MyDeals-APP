using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque;
using Intel.Opaque.DBAccess;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;

namespace Intel.MyDeals.DataLibrary
{
    public class FilesDataLib : IFilesDataLib
    {
        public List<MeetComp> ExtractMeetCompFile(byte[] fileData)
        {
            List<MeetComp> lstRtn = new List<MeetComp>();
            using (MemoryStream memStream = new MemoryStream(fileData))
            {
                using (ExcelPackage excelPackage = new ExcelPackage(memStream))
                {
                    ExcelWorksheet worksheet = excelPackage.Workbook.Worksheets.FirstOrDefault();

                    if (worksheet.Dimension != null)
                    {
                        // get number of rows and columns in the sheet
                        int iRows = worksheet.Dimension.Rows;
                        int iColumns = worksheet.Dimension.Columns;

                        if (iRows >= 2 && iColumns >= 6)
                        {
                            // loop through the worksheet rows and columns
                            for (int i = 2; i <= iRows; i++)
                            {
                                decimal dblMeetCompPrc = 0;
                                decimal dblIABench = 0;
                                decimal dblCompBench = 0;

                                decimal.TryParse(worksheet.Cells[i, 4].Value != null ? worksheet.Cells[i, 4].Value.ToString() : "0", out dblMeetCompPrc);
                                decimal.TryParse(worksheet.Cells[i, 5].Value != null ? worksheet.Cells[i, 5].Value.ToString() : "0", out dblIABench);
                                decimal.TryParse(worksheet.Cells[i, 6].Value != null ? worksheet.Cells[i, 6].Value.ToString() : "0", out dblCompBench);

                                lstRtn.Add(new MeetComp
                                {
                                    CUST_NM = worksheet.Cells[i, 1].Value != null ? worksheet.Cells[i, 1].Value.ToString() : string.Empty,
                                    HIER_VAL_NM = worksheet.Cells[i, 2].Value != null ? worksheet.Cells[i, 2].Value.ToString() : string.Empty,
                                    MEET_COMP_PRD = worksheet.Cells[i, 3].Value != null ? worksheet.Cells[i, 3].Value.ToString() : string.Empty,
                                    MEET_COMP_PRC = dblMeetCompPrc,
                                    IA_BNCH = dblIABench,
                                    COMP_BNCH = dblCompBench
                                });
                            }
                        }

                    }
                }
            }
            return lstRtn.Distinct(new DistinctItemComparerMeetComp()).ToList();
        }

        public FileAttachmentData GetMeetCompTemplateFile()
        {
            FileAttachmentData fileAttachmentData = new FileAttachmentData();
            fileAttachmentData.FILE_NM = "MeetComp.xlsx";
            fileAttachmentData.IS_COMPRS = false;
            string strTemplateContent = string.Join("\n", string.Join("\t", "Customer", "Deal Product", "Meet Comp Sku", "Meet Comp Price", "IA Bench", "Comp Bench"));
            string[][] arrTemplate = strTemplateContent.Split('\n').Select(x => x.Split('\t')).ToArray();
            using (ExcelPackage excelPackage = new ExcelPackage())
            {
                ExcelWorksheet excelWorksheet = excelPackage.Workbook.Worksheets.Add("MeetComp");
                excelWorksheet.Cells["A1"].LoadFromArrays(arrTemplate);
                double dblMaxWidthOfColumn = 300;
                for (int iColumnCount = 1; iColumnCount <= arrTemplate[0].Length; iColumnCount++)
                {
                    excelWorksheet.Column(iColumnCount).AutoFit();
                    if (excelWorksheet.Column(iColumnCount).Width > dblMaxWidthOfColumn)
                        excelWorksheet.Column(iColumnCount).Width = dblMaxWidthOfColumn;
                }
                excelWorksheet.Row(1).Style.Font.Bold = true;
                excelWorksheet.View.FreezePanes(2, 1);
                fileAttachmentData.FILE_DATA = excelPackage.GetAsByteArray();
            }
            return fileAttachmentData;
        }

        /// <summary>
        /// Save the specified files as attachments
        /// </summary>
        public bool SaveFileAttachment(FileAttachment fileAtatchment, byte[] fileData)
        {
            OpLog.Log("SaveFileAttachment");
            var ret = false;
            try
            {
                var cmd = new Procs.dbo.PR_MYDL_SAVE_ATTCH_DATA
                {
                    EMP_WWID = OpUserStack.MyOpUserToken.Usr.WWID,
                    CUST_MBR_SID = fileAtatchment.CUST_MBR_SID,
                    OBJ_SID = fileAtatchment.OBJ_SID,
                    OBJ_TYPE_SID = fileAtatchment.OBJ_TYPE_SID,
                    FILE_NM = fileAtatchment.FILE_NM,
                    CNTN_TYPE = fileAtatchment.CNTN_TYPE,
                    SZ_ORIG = fileAtatchment.SZ_ORIG,
                    SZ_COMPRS = fileAtatchment.SZ_COMPRS,
                    IS_COMPRS = fileAtatchment.IS_COMPRS,
                    FILE_DATA = fileData
                };

                using (DataAccess.ExecuteDataSet(cmd))
                {
                }
                ret = true;
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }
            return ret;
        }

        /// <summary>
        /// Get the list of file attachments
        /// </summary>
        public List<FileAttachment> GetFileAttachments(int custMbrSid, int objTypeSid, int objSid, string includeGroup)
        {
            OpLog.Log("GetFileAttachments");
            var ret = new List<FileAttachment>();
            try
            {
                var cmd = new Procs.dbo.PR_MYDL_GET_ATTCH_LIST
                {
                    CUST_MBR_SID = custMbrSid,
                    OBJ_TYPE_SID = objTypeSid,
                    OBJ_SID = objSid,
                    INCL_GRP = includeGroup
                };

                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_ATTCH_SID = DB.GetReaderOrdinal(rdr, "ATTCH_SID");
                    int IDX_CHG_DTM = DB.GetReaderOrdinal(rdr, "CHG_DTM");
                    int IDX_CHG_EMP_WWID = DB.GetReaderOrdinal(rdr, "CHG_EMP_WWID");
                    int IDX_CNTN_TYPE = DB.GetReaderOrdinal(rdr, "CNTN_TYPE");
                    int IDX_CRE_DTM = DB.GetReaderOrdinal(rdr, "CRE_DTM");
                    int IDX_CRE_EMP_WWID = DB.GetReaderOrdinal(rdr, "CRE_EMP_WWID");
                    int IDX_CUST_MBR_SID = DB.GetReaderOrdinal(rdr, "CUST_MBR_SID");
                    int IDX_FILE_DATA_SID = DB.GetReaderOrdinal(rdr, "FILE_DATA_SID");
                    int IDX_FILE_NM = DB.GetReaderOrdinal(rdr, "FILE_NM");
                    int IDX_IS_COMPRS = DB.GetReaderOrdinal(rdr, "IS_COMPRS");
                    int IDX_OBJ_SID = DB.GetReaderOrdinal(rdr, "OBJ_SID");
                    int IDX_OBJ_TYPE_SID = DB.GetReaderOrdinal(rdr, "OBJ_TYPE_SID");
                    int IDX_SZ_COMPRS = DB.GetReaderOrdinal(rdr, "SZ_COMPRS");
                    int IDX_SZ_ORIG = DB.GetReaderOrdinal(rdr, "SZ_ORIG");

                    while (rdr.Read())
                    {
                        ret.Add(new FileAttachment
                        {
                            ATTCH_SID = (IDX_ATTCH_SID < 0 || rdr.IsDBNull(IDX_ATTCH_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ATTCH_SID),
                            CHG_DTM = (IDX_CHG_DTM < 0 || rdr.IsDBNull(IDX_CHG_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CHG_DTM),
                            CHG_EMP_WWID = (IDX_CHG_EMP_WWID < 0 || rdr.IsDBNull(IDX_CHG_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CHG_EMP_WWID),
                            CNTN_TYPE = (IDX_CNTN_TYPE < 0 || rdr.IsDBNull(IDX_CNTN_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CNTN_TYPE),
                            CRE_DTM = (IDX_CRE_DTM < 0 || rdr.IsDBNull(IDX_CRE_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CRE_DTM),
                            CRE_EMP_WWID = (IDX_CRE_EMP_WWID < 0 || rdr.IsDBNull(IDX_CRE_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CRE_EMP_WWID),
                            CUST_MBR_SID = (IDX_CUST_MBR_SID < 0 || rdr.IsDBNull(IDX_CUST_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CUST_MBR_SID),
                            FILE_DATA_SID = (IDX_FILE_DATA_SID < 0 || rdr.IsDBNull(IDX_FILE_DATA_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_FILE_DATA_SID),
                            FILE_NM = (IDX_FILE_NM < 0 || rdr.IsDBNull(IDX_FILE_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_FILE_NM),
                            IS_COMPRS = (IDX_IS_COMPRS < 0 || rdr.IsDBNull(IDX_IS_COMPRS)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_IS_COMPRS),
                            OBJ_SID = (IDX_OBJ_SID < 0 || rdr.IsDBNull(IDX_OBJ_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_OBJ_SID),
                            OBJ_TYPE_SID = (IDX_OBJ_TYPE_SID < 0 || rdr.IsDBNull(IDX_OBJ_TYPE_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_OBJ_TYPE_SID),
                            SZ_COMPRS = (IDX_SZ_COMPRS < 0 || rdr.IsDBNull(IDX_SZ_COMPRS)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_SZ_COMPRS),
                            SZ_ORIG = (IDX_SZ_ORIG < 0 || rdr.IsDBNull(IDX_SZ_ORIG)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_SZ_ORIG)
                        });
                    } // while
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }
            return ret;
        }

        /// <summary>
        /// Get the contents of the specified file attachment
        /// </summary>
        public FileAttachmentData GetFileAttachmentData(int fileId)
        {
            OpLog.Log("GetFileAttachmentData");

            // get current user details
            var opUserToken = OpUserStack.MyOpUserToken.EnsurePopulated();
            if (opUserToken.Role?.RoleTypeCd == null) //sequential check to be safe. Then check to see if they have a role
                return null;                          //No role = deny file access

            var ret = new List<FileAttachmentData>();
            try
            {
                var cmd = new Procs.dbo.PR_MYDL_GET_ATTCH_DATA
                {
                    FILE_DATA_SID = fileId
                };

                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_CNTN_TYPE = DB.GetReaderOrdinal(rdr, "CNTN_TYPE");
                    int IDX_FILE_DATA = DB.GetReaderOrdinal(rdr, "FILE_DATA");
                    int IDX_FILE_NM = DB.GetReaderOrdinal(rdr, "FILE_NM");
                    int IDX_IS_COMPRS = DB.GetReaderOrdinal(rdr, "IS_COMPRS");
                    int IDX_SZ_ORIG = DB.GetReaderOrdinal(rdr, "SZ_ORIG");

                    while (rdr.Read())
                    {
                        ret.Add(new FileAttachmentData
                        {
                            CNTN_TYPE = (IDX_CNTN_TYPE < 0 || rdr.IsDBNull(IDX_CNTN_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CNTN_TYPE),
                            FILE_DATA = (IDX_FILE_DATA < 0 || rdr.IsDBNull(IDX_FILE_DATA)) ? default(System.Byte[]) : rdr.GetFieldValue<System.Byte[]>(IDX_FILE_DATA),
                            FILE_NM = (IDX_FILE_NM < 0 || rdr.IsDBNull(IDX_FILE_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_FILE_NM),
                            IS_COMPRS = (IDX_IS_COMPRS < 0 || rdr.IsDBNull(IDX_IS_COMPRS)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_IS_COMPRS),
                            SZ_ORIG = (IDX_SZ_ORIG < 0 || rdr.IsDBNull(IDX_SZ_ORIG)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_SZ_ORIG)
                        });
                    } // while
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }
            return ret.FirstOrDefault();
        }

        /// <summary>
        /// Delete the specified file attachment
        /// </summary>
        public bool DeleteFileAttachment(int custMbrSid, int objTypeSid, int objSid, int fileDataSid, string includeGroup)
        {
            OpLog.Log("DeleteFileAttachment");
            var ret = false;
            try
            {
                var cmd = new Procs.dbo.PR_MYDL_DELETE_ATTCH_DATA
                {
                    CUST_MBR_SID = custMbrSid,
                    OBJ_TYPE_SID = objTypeSid,
                    OBJ_SID = objSid,
                    FILE_DATA_SID = fileDataSid,
                    INCL_GRP = includeGroup
                };

                using (DataAccess.ExecuteDataSet(cmd))
                { }
                ret = true;
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }
            return ret;
        }

        /// <summary>
        /// Get Unify excel template
        /// </summary>
        public FileAttachmentData GetBulkUnifyTemplateFile()
        {
            FileAttachmentData fileAttachmentData = new FileAttachmentData();
            fileAttachmentData.FILE_NM = "BulkUnifyDeals.xlsx";
            fileAttachmentData.IS_COMPRS = false;
            string strTemplateContent = string.Join("\n", string.Join("\t", "DEAL ID", "UCD_GLOBAL_ID", "UCD_GLOBAL_NAME", "UCD_COUNTRY_CUST_ID", "UCD_COUNTRY"));
            string[][] arrTemplate = strTemplateContent.Split('\n').Select(x => x.Split('\t')).ToArray();
            using (ExcelPackage excelPackage = new ExcelPackage())
            {
                ExcelWorksheet excelWorksheet = excelPackage.Workbook.Worksheets.Add("UnifyDeals");
                excelWorksheet.Cells["A1"].LoadFromArrays(arrTemplate);
                double dblMaxWidthOfColumn = 300;
                for (int iColumnCount = 1; iColumnCount <= arrTemplate[0].Length; iColumnCount++)
                {
                    excelWorksheet.Column(iColumnCount).AutoFit();
                    if (excelWorksheet.Column(iColumnCount).Width > dblMaxWidthOfColumn)
                        excelWorksheet.Column(iColumnCount).Width = dblMaxWidthOfColumn;
                }
                excelWorksheet.Row(1).Style.Font.Bold = true;
                excelWorksheet.View.FreezePanes(2, 1);
                fileAttachmentData.FILE_DATA = excelPackage.GetAsByteArray();
            }
            return fileAttachmentData;
        }

        public List<UnifyDeal> ExtractBulkUnifyFile(byte[] fileData)
        {
            List<UnifyDeal> lstRtn = new List<UnifyDeal>();
            using (MemoryStream memStream = new MemoryStream(fileData))
            {
                using (ExcelPackage excelPackage = new ExcelPackage(memStream))
                {
                    ExcelWorksheet worksheet = excelPackage.Workbook.Worksheets.FirstOrDefault();

                    if (worksheet.Dimension != null)
                    {
                        // get number of rows and columns in the sheet
                        int iRows = worksheet.Dimension.Rows;
                        int iColumns = worksheet.Dimension.Columns;

                        if (iRows >= 2 && iColumns >= 5)
                        {
                            // loop through the worksheet rows and columns 
                            for (int i = 2; i <= iRows; i++)
                            {
                                int dbDealId = 0;
                                int dbPrimCustId = 0;
                                int dbPrimLvlId = 0;

                                int.TryParse(worksheet.Cells[i, 1].Value != null ? worksheet.Cells[i, 1].Value.ToString().Trim() : "0", out dbDealId);
                                int.TryParse(worksheet.Cells[i, 2].Value != null ? worksheet.Cells[i, 2].Value.ToString().Trim() : "0", out dbPrimCustId);
                                int.TryParse(worksheet.Cells[i, 4].Value != null ? worksheet.Cells[i, 4].Value.ToString().Trim() : "0", out dbPrimLvlId);

                                lstRtn.Add(new UnifyDeal
                                {
                                    DEAL_ID = dbDealId,
                                    UCD_GLOBAL_ID = dbPrimCustId,
                                    UCD_GLOBAL_NAME = worksheet.Cells[i, 3].Value != null ? worksheet.Cells[i, 3].Value.ToString().Trim() : string.Empty,
                                    UCD_COUNTRY_CUST_ID = dbPrimLvlId,
                                    UCD_COUNTRY = worksheet.Cells[i, 5].Value != null ? worksheet.Cells[i, 5].Value.ToString().Trim() : string.Empty
                                });
                            }
                        }

                    }
                }
            }
            return lstRtn;
        }
    }
}