using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Helpers;
using Intel.Opaque;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;

namespace Intel.MyDeals.Controllers
{
    public class FileAttachmentsController : Controller
    {
        private const int CompressionFactor = 85;  // 10% - value we must be under to save compressed

        private readonly IFilesLib _filesLib;

        private readonly IPrimeCustomersLib _primeCustomersLib;

        public FileAttachmentsController(IFilesLib _filesLib, IPrimeCustomersLib _primeCustomersLib)
        {
            this._filesLib = _filesLib;
            this._primeCustomersLib = _primeCustomersLib;
        }

        /// <summary>
        /// Save the specified files as attachments
        /// </summary>
        [Authorize]
        public ActionResult Save(IEnumerable<HttpPostedFileBase> files, int custMbrSid, int objSid, int objTypeSid)
        {
            string response = string.Empty;
            var fileAttachment = new FileAttachment
            {
                CNTN_TYPE = "application/octet-stream",
                CUST_MBR_SID = custMbrSid,
                OBJ_SID = objSid,
                OBJ_TYPE_SID = objTypeSid,
                IS_COMPRS = false,
                SZ_COMPRS = 0,
                SZ_ORIG = 0
            };

            if (files != null)
            {
                foreach (var file in files)
                {
                    using (StreamReader reader = new StreamReader(file.InputStream))
                    {
                        byte[] textBytes = new byte[file.InputStream.Length];
                        file.InputStream.Read(textBytes, 0, textBytes.Length);

                        fileAttachment.FILE_NM = Path.GetFileName(file.FileName);
                        fileAttachment.SZ_ORIG = textBytes.Length;

                        byte[] compressBuff = OpZipUtils.CompressBytes(textBytes);

                        int currCompression = Convert.ToInt32(compressBuff.Length * 100 / textBytes.Length);

                        if (compressBuff.Length < textBytes.Length && currCompression < CompressionFactor)
                        {
                            fileAttachment.IS_COMPRS = true;
                            textBytes = compressBuff;
                            fileAttachment.SZ_COMPRS = textBytes.Length;
                        }

                        var result = _filesLib.SaveFileAttachment(fileAttachment, textBytes);

                        if (result)
                        {
                            new FilesLib().UpdateFileAttachmentBit(objTypeSid, objSid);
                        }

                        response = result ? string.Empty :
                            response += HttpUtility.HtmlEncode($"File {fileAttachment.FILE_NM} did not save properly. Please try again\n");
                    }
                }
            }

            return Json(response);
        }

        [Authorize]
        public ActionResult ExtractMeetCompFile(IEnumerable<HttpPostedFileBase> files)
        {
            List<MeetComp> lstMeetComps = new List<MeetComp>();
            if (files != null)
            {
                foreach (var file in files)
                {
                    using (StreamReader reader = new StreamReader(file.InputStream))
                    {
                        byte[] textBytes = new byte[file.InputStream.Length];
                        file.InputStream.Read(textBytes, 0, textBytes.Length);
                        lstMeetComps.AddRange(_filesLib.ExtractMeetCompFile(textBytes));
                    }
                }
            }
            if (lstMeetComps.Count > 0)
            {
                var jsonResult = Json(lstMeetComps, JsonRequestBehavior.AllowGet);
                if (lstMeetComps.Count > 5000)
                    jsonResult.MaxJsonLength = int.MaxValue;
                return jsonResult;
            }
            else
                return Json(string.Empty);
        }

        [Authorize]
        public ActionResult ExtractBulkUnifyFile(IEnumerable<HttpPostedFileBase> files)
        {
            List<UnifyDeal> lstUnifyDeals = new List<UnifyDeal>();
            List<UnifyDeal> lstUnifyDealserror = new List<UnifyDeal>();
            List<UnifyDeal> lstUnifyValidDeals = new List<UnifyDeal>();
            if (files != null)
            {
                foreach (var file in files)
                {
                    using (StreamReader reader = new StreamReader(file.InputStream))
                    {
                        byte[] textBytes = new byte[file.InputStream.Length];
                        file.InputStream.Read(textBytes, 0, textBytes.Length);
                        lstUnifyDeals.AddRange(_filesLib.ExtractBulkUnifyFile(textBytes));
                    }
                }
            }
            if (lstUnifyDeals.Count > 0)
            {
                var unifyDealValidation = ValidateUnifyDeals(lstUnifyDeals);
                var jsonResult = Json(unifyDealValidation, JsonRequestBehavior.AllowGet);
                if (lstUnifyDealserror.Count > 5000)
                    jsonResult.MaxJsonLength = int.MaxValue;
                return jsonResult;
            }
            else
                return Json(string.Empty);
        }

        [Authorize]
        [Route("ValidateUnifyDeals")]
        [HttpPost]
        [AntiForgeryValidate]
        public ActionResult ValidateBulkUnifyDeals(List<UnifyDeal> lstUnifyDeals)
        {
            for (var i = 0; i < lstUnifyDeals.Count; i++)
            {
                int dbDealId = 0;
                int dbPrimCustId = 0;
                int dbPrimLvlId = 0;
                int.TryParse(lstUnifyDeals[i].DEAL_ID != null && lstUnifyDeals[i].DEAL_ID > 0 ? lstUnifyDeals[i].DEAL_ID.ToString().Trim() : "0", out dbDealId);
                int.TryParse(lstUnifyDeals[i].UCD_GLOBAL_ID != null && lstUnifyDeals[i].UCD_GLOBAL_ID > 0 ? lstUnifyDeals[i].UCD_GLOBAL_ID.ToString().Trim() : "0", out dbPrimCustId);
                int.TryParse(lstUnifyDeals[i].UCD_COUNTRY_CUST_ID != null && lstUnifyDeals[i].UCD_COUNTRY_CUST_ID > 0 ? lstUnifyDeals[i].UCD_COUNTRY_CUST_ID.ToString().Trim() : "0", out dbPrimLvlId);
                lstUnifyDeals[i].DEAL_ID = dbDealId;
                lstUnifyDeals[i].UCD_GLOBAL_ID = dbPrimCustId;
                lstUnifyDeals[i].UCD_COUNTRY_CUST_ID = dbPrimLvlId;
                lstUnifyDeals[i].UCD_GLOBAL_NAME = lstUnifyDeals[i].UCD_GLOBAL_NAME != null ? lstUnifyDeals[i].UCD_GLOBAL_NAME.TrimEnd() : string.Empty;
                lstUnifyDeals[i].UCD_COUNTRY = lstUnifyDeals[i].UCD_COUNTRY != null ? lstUnifyDeals[i].UCD_COUNTRY.TrimEnd() : string.Empty;
                lstUnifyDeals[i].DEAL_END_CUSTOMER_RETAIL = lstUnifyDeals[i].DEAL_END_CUSTOMER_RETAIL != null ? lstUnifyDeals[i].DEAL_END_CUSTOMER_RETAIL.TrimEnd() : string.Empty;
                lstUnifyDeals[i].DEAL_END_CUSTOMER_COUNTRY = lstUnifyDeals[i].DEAL_END_CUSTOMER_COUNTRY != null ? lstUnifyDeals[i].DEAL_END_CUSTOMER_COUNTRY.TrimEnd() : string.Empty;
                lstUnifyDeals[i].RPL_STS_CODE = lstUnifyDeals[i].RPL_STS_CODE != null ? lstUnifyDeals[i].RPL_STS_CODE.TrimEnd() : string.Empty;
            }
            var result = ValidateUnifyDeals(lstUnifyDeals);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [Authorize]
        public ActionResult ExtractDealReconFile(IEnumerable<HttpPostedFileBase> files)
        {
            List<DealRecon> lstDealRecons = new List<DealRecon>();
            if (files != null)
            {
                foreach (var file in files)
                {
                    using (StreamReader reader = new StreamReader(file.InputStream))
                    {
                        byte[] textBytes = new byte[file.InputStream.Length];
                        file.InputStream.Read(textBytes, 0, textBytes.Length);
                        lstDealRecons.AddRange(_filesLib.ExtractDealReconFile(textBytes));
                    }
                }
            }
            if (lstDealRecons.Count > 0)
            {
                var dealReconValidation = ValidateDealRecon(lstDealRecons);
                var jsonResult = Json(dealReconValidation, JsonRequestBehavior.AllowGet);
                if (dealReconValidation.inValidRecords.Count > 5000)
                    jsonResult.MaxJsonLength = int.MaxValue;
                return jsonResult;
            }
            else
                return Json(string.Empty);
        }

        [Authorize]
        [Route("ValidateDealReconRecords")]
        [HttpPost]
        [AntiForgeryValidate]
        public ActionResult ValidateDealReconRecords(List<DealRecon> lstDealRecons)
        {
            for (var i = 0; i < lstDealRecons.Count; i++)
            {
                int dbDealId = 0;
                int dbPrimCustId = 0;
                int dbPrimLvlId = 0;
                int dbToBePrimCustId = 0;
                int dbToBePrimLvlId = 0;
                int.TryParse(lstDealRecons[i].Deal_ID != null && lstDealRecons[i].Deal_ID > 0 ? lstDealRecons[i].Deal_ID.ToString().Trim() : "0", out dbDealId);
                int.TryParse(lstDealRecons[i].Unified_Customer_ID != null && lstDealRecons[i].Unified_Customer_ID > 0 ? lstDealRecons[i].Unified_Customer_ID.ToString().Trim() : "0", out dbPrimCustId);
                int.TryParse(lstDealRecons[i].Country_Region_Customer_ID != null && lstDealRecons[i].Country_Region_Customer_ID > 0 ? lstDealRecons[i].Country_Region_Customer_ID.ToString().Trim() : "0", out dbPrimLvlId);
                int.TryParse(lstDealRecons[i].To_be_Unified_Customer_ID != null && lstDealRecons[i].To_be_Unified_Customer_ID > 0 ? lstDealRecons[i].To_be_Unified_Customer_ID.ToString().Trim() : "0", out dbToBePrimCustId);
                int.TryParse(lstDealRecons[i].To_be_Country_Region_Customer_ID != null && lstDealRecons[i].To_be_Country_Region_Customer_ID > 0 ? lstDealRecons[i].To_be_Country_Region_Customer_ID.ToString().Trim() : "0", out dbToBePrimLvlId);
                lstDealRecons[i].Deal_ID = dbDealId;
                lstDealRecons[i].Unified_Customer_ID = dbPrimCustId;
                lstDealRecons[i].Country_Region_Customer_ID = dbPrimLvlId;
                lstDealRecons[i].To_be_Unified_Customer_ID = dbToBePrimCustId;
                lstDealRecons[i].To_be_Country_Region_Customer_ID = dbToBePrimLvlId;
                lstDealRecons[i].Unified_Customer_Name = lstDealRecons[i].Unified_Customer_Name != null ? lstDealRecons[i].Unified_Customer_Name.TrimEnd() : string.Empty;
                lstDealRecons[i].Unified_Country_Region = lstDealRecons[i].Unified_Country_Region != null ? lstDealRecons[i].Unified_Country_Region.TrimEnd() : string.Empty;
                lstDealRecons[i].To_be_Unified_Customer_Name = lstDealRecons[i].To_be_Unified_Customer_Name != null ? lstDealRecons[i].To_be_Unified_Customer_Name.TrimEnd() : string.Empty;
                lstDealRecons[i].To_be_Unified_Country_Region = lstDealRecons[i].To_be_Unified_Country_Region != null ? lstDealRecons[i].To_be_Unified_Country_Region.TrimEnd() : string.Empty;
                lstDealRecons[i].Rpl_Status_Code = lstDealRecons[i].Rpl_Status_Code != null ? lstDealRecons[i].Rpl_Status_Code.TrimEnd() : string.Empty;
            }
            var result = ValidateDealRecon(lstDealRecons);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        private UnifyDealValidation ValidateUnifyDeals(List<UnifyDeal> lstUnifyDeals)
        {
            UnifyDealValidation unifyDealValidation = new UnifyDealValidation();
            unifyDealValidation.IsEmptyDealAvailable = lstUnifyDeals.Where(x => x.DEAL_ID <= 0).Count() > 0;
            unifyDealValidation.IsEmptyCustIdAvailable = lstUnifyDeals.Where(x => x.UCD_GLOBAL_ID <= 0).Count() > 0;
            unifyDealValidation.IsEmptyCustNameAvailable = lstUnifyDeals.Where(x => x.UCD_GLOBAL_NAME.Trim() == string.Empty).Count() > 0;
            unifyDealValidation.IsEmptyCountryIdAvailable = lstUnifyDeals.Where(x => x.UCD_COUNTRY_CUST_ID <= 0).Count() > 0;
            unifyDealValidation.IsEmptyCountryAvailable = lstUnifyDeals.Where(x => x.UCD_COUNTRY.Trim() == string.Empty).Count() > 0;
            unifyDealValidation.DuplicateGlobalIds = new List<int>();
            unifyDealValidation.DuplicateGlobalNames = new List<string>();
            unifyDealValidation.InValidUnifyDeals = new List<UnifyDeal>();
            unifyDealValidation.ValidUnifyDeals = new List<UnifyDeal>();
            unifyDealValidation.UnifiedCombination = new List<UnifyInvalidCombination>();
            unifyDealValidation.InvalidDeals = new List<KeyValuePair<int, string>>();
            unifyDealValidation.AlreadyUnifiedDeals = new List<int>();
            unifyDealValidation.InValidCombination = new List<UnifyInvalidCombination>();
            unifyDealValidation.InvalidRPLStsCode = new List<UnifyDeal>();
            var validRows = lstUnifyDeals.Where(x => x.DEAL_ID != 0 && x.UCD_GLOBAL_ID != 0 && x.UCD_GLOBAL_NAME != "" && x.UCD_COUNTRY_CUST_ID != 0 && x.UCD_COUNTRY != "").ToList();
            unifyDealValidation.DuplicateDealCombination = validRows.GroupBy(x => new { x.DEAL_ID, x.UCD_GLOBAL_ID,x.UCD_GLOBAL_NAME,x.UCD_COUNTRY_CUST_ID,x.UCD_COUNTRY})
                .Where(grp => grp.Count() > 1).Select(y => y.Key.DEAL_ID).ToList();
            unifyDealValidation.DuplicateDealEntryCombination = validRows.Where(x => x.DEAL_END_CUSTOMER_RETAIL != "" && x.DEAL_END_CUSTOMER_COUNTRY != "").ToList().
                GroupBy(x => new { x.DEAL_ID, x.DEAL_END_CUSTOMER_COUNTRY, x.DEAL_END_CUSTOMER_RETAIL }).Where(grp => grp.Count() > 1).Select(y => y.Key.DEAL_ID).ToList();
            var patt = @"^[\w\s.,'&:+-]*$";
            var RPLStsPattern = @"^[A-Za-z\s,]*$";
            var validUcdRow = lstUnifyDeals.Where(x => x.UCD_GLOBAL_ID != 0 && x.UCD_GLOBAL_NAME != "").ToList();
            foreach (var unify in validUcdRow)
            {
                var globalid = validUcdRow.Where(x => x.UCD_GLOBAL_ID == unify.UCD_GLOBAL_ID && x.UCD_GLOBAL_ID != 0)
                        .Select(y => y.UCD_GLOBAL_NAME).Distinct().ToList();
                if (globalid.Count > 1 && !unifyDealValidation.DuplicateGlobalIds.Contains(unify.UCD_GLOBAL_ID))
                {
                    unifyDealValidation.DuplicateGlobalIds.Add(unify.UCD_GLOBAL_ID);
                }
                
                var globalName = validUcdRow.Where(x => x.UCD_GLOBAL_NAME == unify.UCD_GLOBAL_NAME
                    && !string.IsNullOrEmpty(x.UCD_GLOBAL_NAME) && x.UCD_GLOBAL_NAME.ToLower() != "any" && x.UCD_GLOBAL_NAME.ToLower() != "null")
                        .Select(y => y.UCD_GLOBAL_ID).Distinct().ToList();
                if (globalName.Count > 1 && !unifyDealValidation.DuplicateGlobalNames.Contains(unify.UCD_GLOBAL_NAME))
                {
                    unifyDealValidation.DuplicateGlobalNames.Add(unify.UCD_GLOBAL_NAME);
                }
            }
            unifyDealValidation.InValidCountries = lstUnifyDeals.Where(x => x.UCD_COUNTRY.Trim() != string.Empty).Select(x => x.UCD_COUNTRY.Trim().ToLower()).Except(DataCollections.GetCountries().Select(x => x.CTRY_NM.ToLower())).Where(x => x != string.Empty).ToList();
             if (lstUnifyDeals.Count > 0)
            {
                foreach (var row in lstUnifyDeals)
                {
                    if (row.DEAL_ID == 0 || row.UCD_COUNTRY_CUST_ID == 0 || row.UCD_GLOBAL_ID == 0
                        || row.UCD_COUNTRY == null || row.UCD_GLOBAL_NAME == null
                        || row.UCD_COUNTRY == "" || row.UCD_GLOBAL_NAME == "" || row.DEAL_END_CUSTOMER_RETAIL == "" && row.DEAL_END_CUSTOMER_COUNTRY == "")
                    {
                        unifyDealValidation.InValidUnifyDeals.Add(row);
                    }
                    else if(row.UCD_COUNTRY != "" && row.DEAL_END_CUSTOMER_COUNTRY != "" && row.UCD_COUNTRY.ToLower() != row.DEAL_END_CUSTOMER_COUNTRY.ToLower())
                    {
                        unifyDealValidation.InValidUnifyDeals.Add(row);
                    }
                    else if (unifyDealValidation.DuplicateDealCombination.Count > 0
                        && unifyDealValidation.DuplicateDealCombination.Contains(row.DEAL_ID) &&
                        lstUnifyDeals.Where(x => x.DEAL_ID == row.DEAL_ID && x.UCD_GLOBAL_ID == row.UCD_GLOBAL_ID && x.UCD_GLOBAL_NAME == row.UCD_GLOBAL_NAME
                        && x.UCD_COUNTRY_CUST_ID == row.UCD_COUNTRY_CUST_ID && x.UCD_COUNTRY == row.UCD_COUNTRY).ToList().Count > 1)
                    {
                        unifyDealValidation.InValidUnifyDeals.Add(row);
                    }
                    else if (unifyDealValidation.DuplicateDealEntryCombination.Count > 0
                        && unifyDealValidation.DuplicateDealEntryCombination.Contains(row.DEAL_ID)
                        && lstUnifyDeals.Where(x  => x.DEAL_ID == row.DEAL_ID && x.DEAL_END_CUSTOMER_RETAIL == row.DEAL_END_CUSTOMER_RETAIL &&
                        x.DEAL_END_CUSTOMER_COUNTRY == row.DEAL_END_CUSTOMER_COUNTRY).ToList().Count > 1)
                    {
                        unifyDealValidation.InValidUnifyDeals.Add(row);
                    }
                    else if (row.UCD_GLOBAL_NAME.ToLower() == "any" || row.UCD_GLOBAL_NAME.ToLower() == "null")
                    {
                        unifyDealValidation.InValidUnifyDeals.Add(row);
                    }
                    else if (unifyDealValidation.DuplicateGlobalIds.Count > 0
                        && unifyDealValidation.DuplicateGlobalIds.Contains(row.UCD_GLOBAL_ID))
                    {
                        unifyDealValidation.InValidUnifyDeals.Add(row);
                    }
                    else if (unifyDealValidation.InValidCountries.Count > 0
                        && unifyDealValidation.InValidCountries.Contains(row.UCD_COUNTRY.ToLower()))
                    {
                        unifyDealValidation.InValidUnifyDeals.Add(row);
                    }
                    else if (unifyDealValidation.DuplicateGlobalNames.Count > 0
                        && unifyDealValidation.DuplicateGlobalNames.Contains(row.UCD_GLOBAL_NAME))
                    {
                        unifyDealValidation.InValidUnifyDeals.Add(row);
                    }
                    else if (!Regex.IsMatch(row.UCD_GLOBAL_NAME, patt) || row.UCD_GLOBAL_NAME.Length > 65)
                    {
                        unifyDealValidation.InValidUnifyDeals.Add(row);
                    }
                    else if(row.UCD_GLOBAL_ID != 0 && row.UCD_COUNTRY_CUST_ID != 0 && row.UCD_GLOBAL_ID == row.UCD_COUNTRY_CUST_ID)
                    {
                        unifyDealValidation.InValidUnifyDeals.Add(row);
                    }
                    else if (!Regex.IsMatch(row.RPL_STS_CODE, RPLStsPattern))
                    {
                        unifyDealValidation.InValidUnifyDeals.Add(row);
                    }
                    else
                    {
                        if(row.RPL_STS_CODE!=null || row.RPL_STS_CODE != "")
                        {
                            //To remove consecutive commas,spaces and duplicate values in the given RPL status code input
                            var formattedRPLInput = row.RPL_STS_CODE.Split(',').Select(x => x.Trim()).Where(x => !string.IsNullOrWhiteSpace(x)).ToArray().Select(x => x.ToLower()).Distinct();
                            row.RPL_STS_CODE = string.Join(",", formattedRPLInput);

                        }

                        unifyDealValidation.ValidUnifyDeals.Add(row);
                    }
                }
            }
            if (unifyDealValidation.ValidUnifyDeals.Count > 0)
            {
                var result = _primeCustomersLib.ValidateBulkUnifyDeals(unifyDealValidation.ValidUnifyDeals);
                if(result != null && result.Count>0)
                {
                    foreach(var data in result)
                    {
                        var dealData = new UnifyInvalidCombination();
                        dealData.DEAL_ID = data.OBJ_SID;
                        dealData.DEAL_END_CUSTOMER_COUNTRY = data.END_CUSTOMER_COUNTRY;
                        dealData.DEAL_END_CUSTOMER_RETAIL = data.END_CUSTOMER_RETAIL;
                        if (data.COMMENTS.Trim().ToLower() == "not exist" || data.COMMENTS.Trim().ToLower() == "cancelled" 
                            || data.COMMENTS.Trim().ToLower() == "lost" || data.COMMENTS.Trim().ToLower() == "deal expired" 
                            || data.COMMENTS.Trim().ToLower() == "end cust obj not exists")
                        {
                            if (!unifyDealValidation.InvalidDeals.Any(x => x.Key == dealData.DEAL_ID))
                            {
                                unifyDealValidation.InvalidDeals.Add(new KeyValuePair<int, string>(dealData.DEAL_ID, data.COMMENTS.Trim().ToLower()));
                                var invalidDataList = unifyDealValidation.ValidUnifyDeals.Where(x => x.DEAL_ID == dealData.DEAL_ID).ToList();
                                foreach (var invalidData in invalidDataList)
                                {
                                    if (!unifyDealValidation.InValidUnifyDeals.Contains(invalidData))
                                    {
                                        unifyDealValidation.InValidUnifyDeals.Add(invalidData);
                                        unifyDealValidation.ValidUnifyDeals.Remove(invalidData);
                                    }
                                    
                                }
                            }
                        }
                        else if (data.COMMENTS.Trim().ToLower() == "invalid rpl status code")
                        {
                            if (!unifyDealValidation.InvalidDeals.Any(x => x.Key == dealData.DEAL_ID))
                            {
                                unifyDealValidation.InvalidDeals.Add(new KeyValuePair<int, string>(dealData.DEAL_ID, data.COMMENTS.Trim().ToLower()));
                                var invalidDataList = lstUnifyDeals.Where(x => x.DEAL_ID == dealData.DEAL_ID).ToList();
                                foreach (var invalidData in invalidDataList)
                                {
                                    if (!unifyDealValidation.InValidUnifyDeals.Contains(invalidData))
                                    {
                                      unifyDealValidation.InValidUnifyDeals.Add(invalidData);
                                        
                                      unifyDealValidation.ValidUnifyDeals.Remove(invalidData);
                                    }
                                    unifyDealValidation.InvalidRPLStsCode.Add(invalidData);
                                }
                            }
                        }
                        else if (data.COMMENTS.Trim().ToLower() == "already unified")
                        {
                            if (string.IsNullOrEmpty(data.END_CUSTOMER_COUNTRY) && string.IsNullOrEmpty(data.END_CUSTOMER_RETAIL))
                            {
                                var alreadyunified = unifyDealValidation.ValidUnifyDeals.Where(x => x.DEAL_ID == dealData.DEAL_ID).FirstOrDefault();
                                if (alreadyunified != null && !unifyDealValidation.InValidUnifyDeals.Contains(alreadyunified))
                                {
                                    unifyDealValidation.AlreadyUnifiedDeals.Add(data.OBJ_SID);
                                    unifyDealValidation.InValidUnifyDeals.Add(alreadyunified);
                                    unifyDealValidation.ValidUnifyDeals.Remove(alreadyunified);
                                }
                            }
                            else
                            {
                                var invalidData = unifyDealValidation.ValidUnifyDeals.Where(x => x.DEAL_ID == dealData.DEAL_ID
                                && x.DEAL_END_CUSTOMER_COUNTRY.Trim().ToLower() == dealData.DEAL_END_CUSTOMER_COUNTRY.Trim().ToLower()
                                && x.DEAL_END_CUSTOMER_RETAIL.Trim().ToLower() == dealData.DEAL_END_CUSTOMER_RETAIL.Trim().ToLower()).FirstOrDefault();
                                if (invalidData != null && !unifyDealValidation.InValidUnifyDeals.Contains(invalidData))
                                {
                                    unifyDealValidation.UnifiedCombination.Add(dealData);
                                    unifyDealValidation.InValidUnifyDeals.Add(invalidData);
                                    unifyDealValidation.ValidUnifyDeals.Remove(invalidData);
                                }
                            }
                        }
                        else if (data.COMMENTS.Trim().ToLower() == "count mismatch")
                        {
                            if (!unifyDealValidation.InvalidDeals.Any(x => x.Key == dealData.DEAL_ID))
                            {
                                unifyDealValidation.InvalidDeals.Add(new KeyValuePair<int, string>(dealData.DEAL_ID, data.COMMENTS.Trim().ToLower()));
                                var invalidDataList = unifyDealValidation.ValidUnifyDeals.Where(x => x.DEAL_ID == dealData.DEAL_ID).ToList();
                                foreach (var invalidData in invalidDataList)
                                {
                                    if (!unifyDealValidation.InValidUnifyDeals.Contains(invalidData))
                                    {
                                        unifyDealValidation.InValidUnifyDeals.Add(invalidData);
                                        unifyDealValidation.ValidUnifyDeals.Remove(invalidData);
                                    }
                                }
                            }
                        }
                        else if (data.COMMENTS.Trim().ToLower() == "end customer and country mismatch")
                        {
                            var invalidData = unifyDealValidation.ValidUnifyDeals.Where(x => x.DEAL_ID == dealData.DEAL_ID
                            && x.DEAL_END_CUSTOMER_COUNTRY.Trim().ToLower() == dealData.DEAL_END_CUSTOMER_COUNTRY.Trim().ToLower()
                            && x.DEAL_END_CUSTOMER_RETAIL.Trim().ToLower() == dealData.DEAL_END_CUSTOMER_RETAIL.Trim().ToLower()).FirstOrDefault();
                            if (invalidData != null && !unifyDealValidation.InValidUnifyDeals.Contains(invalidData))
                            {
                                unifyDealValidation.InValidCombination.Add(dealData);
                                unifyDealValidation.InValidUnifyDeals.Add(invalidData);
                                unifyDealValidation.ValidUnifyDeals.Remove(invalidData);
                            }
                        }
                    }
                }
            }
            if(unifyDealValidation.InValidUnifyDeals.Count >0)
                unifyDealValidation.InValidUnifyDeals = unifyDealValidation.InValidUnifyDeals.OrderBy(x => x.DEAL_ID).ToList();
            return unifyDealValidation;
        }

        private DealReconValidationSummary ValidateDealRecon(List<DealRecon> lstDealRecons)
        {
            var validationSummary = new DealReconValidationSummary();
            validationSummary.validRecords = new List<DealRecon>();
            validationSummary.inValidRecords = new List<DealRecon>();
            validationSummary.invalidCountries = new List<string>();
            validationSummary.toBeInvalidCountries = new List<string>();
            validationSummary.duplicateDealCombination = new List<int>();
            validationSummary.duplicateCustIds = new List<int>();
            validationSummary.duplicateCustNames = new List<string>();
            validationSummary.duplicateCtryIds = new List<CustomerCountryDetail>();
            validationSummary.duplicateCtryNms = new List<CustomerCountryDetail>();
            validationSummary.duplicateToBeCustNames = new List<string>();
            validationSummary.duplicateToBeCustIds = new List<int>();
            validationSummary.duplicateToBeCtryIds = new List<CustomerCountryDetail>();
            validationSummary.duplicateToBeCtryNms = new List<CustomerCountryDetail>();
            validationSummary.invalidRplStatusCodes = new List<string>();
            var rplStatcusCodeList = _primeCustomersLib.GetRplStatusCodes().Select(y =>y.RPL_STS_CD).ToList();
            var patt = @"^[\w\s.,'&:+-]*$";
            var RPLStsPattern = @"^[A-Za-z\s,]*$";
            validationSummary.invalidCountries = lstDealRecons.Where(x => x.Unified_Country_Region.Trim() != string.Empty).Select(x => x.Unified_Country_Region.Trim().ToLower()).Except(DataCollections.GetCountries().Select(x => x.CTRY_NM.ToLower())).Where(x => x != string.Empty).ToList();
            validationSummary.toBeInvalidCountries = lstDealRecons.Where(x => x.To_be_Unified_Country_Region.Trim() != string.Empty).Select(x => x.To_be_Unified_Country_Region.Trim().ToLower()).Except(DataCollections.GetCountries().Select(x => x.CTRY_NM.ToLower())).Where(x => x != string.Empty).ToList();
            var validRows = lstDealRecons.Where(x => x.Deal_ID != 0 && x.Unified_Customer_ID != 0 && !string.IsNullOrEmpty(x.Unified_Customer_Name)
            && x.Country_Region_Customer_ID != 0 && !string.IsNullOrEmpty(x.Unified_Country_Region)).ToList();
            validationSummary.duplicateDealCombination = validRows.GroupBy(x => new { x.Deal_ID, x.Unified_Customer_ID, x.Unified_Customer_Name, x.Country_Region_Customer_ID, x.Unified_Country_Region })
                .Where(grp => grp.Count() > 1).Select(y => y.Key.Deal_ID).ToList();
            var validRecord = lstDealRecons.Where(x => x.Unified_Customer_ID != 0 && !string.IsNullOrEmpty(x.Unified_Customer_Name)
            && x.Country_Region_Customer_ID != 0 && !string.IsNullOrEmpty(x.Unified_Country_Region)).ToList();
            foreach (var unify in validRecord)
            {
                var ctryId = validRecord.Where(x => x.Unified_Customer_ID == unify.Unified_Customer_ID && x.Unified_Customer_Name == unify.Unified_Customer_Name
                && x.Country_Region_Customer_ID == unify.Country_Region_Customer_ID).Select(y => y.Unified_Country_Region).Distinct().ToList();
                var duplicateComb = new CustomerCountryDetail
                {
                    cust_Id = unify.Unified_Customer_ID,
                    cust_Nm = unify.Unified_Customer_Name,
                    ctry_Id = unify.Country_Region_Customer_ID,
                    ctry_Nm = unify.Unified_Country_Region
                };
                if (ctryId.Count > 1 && !validationSummary.duplicateCtryIds.Contains(duplicateComb))
                {
                    validationSummary.duplicateCtryIds.Add(duplicateComb);
                }

                var ctryName = validRecord.Where(x => x.Unified_Customer_Name == unify.Unified_Customer_Name
                    && x.Unified_Customer_ID == unify.Unified_Customer_ID && x.Unified_Country_Region == unify.Unified_Country_Region)
                        .Select(y => y.Country_Region_Customer_ID).Distinct().ToList();
                if (ctryName.Count > 1 && !validationSummary.duplicateCtryNms.Contains(duplicateComb))
                {
                    validationSummary.duplicateCtryNms.Add(duplicateComb);
                }
            }
            var validToBeRows = lstDealRecons.Where(x => x.To_be_Unified_Customer_ID != 0 && !string.IsNullOrEmpty(x.To_be_Unified_Customer_Name)
            && x.To_be_Country_Region_Customer_ID != 0 && !string.IsNullOrEmpty(x.To_be_Unified_Country_Region)).ToList();
            foreach (var unify in validToBeRows)
            {
                var ctryId = validToBeRows.Where(x => x.To_be_Unified_Customer_ID == unify.To_be_Unified_Customer_ID && x.To_be_Unified_Customer_Name == unify.To_be_Unified_Customer_Name
                && x.To_be_Country_Region_Customer_ID == unify.To_be_Country_Region_Customer_ID).Select(y => y.To_be_Unified_Country_Region).Distinct().ToList();
                var duplicateComb = new CustomerCountryDetail
                {
                    cust_Id = unify.To_be_Unified_Customer_ID,
                    cust_Nm = unify.To_be_Unified_Customer_Name,
                    ctry_Id = unify.To_be_Country_Region_Customer_ID,
                    ctry_Nm = unify.To_be_Unified_Country_Region
                };
                if (ctryId.Count > 1 && !validationSummary.duplicateToBeCtryIds.Contains(duplicateComb))
                {
                    validationSummary.duplicateToBeCtryIds.Add(duplicateComb);
                }

                var ctryName = validToBeRows.Where(x => x.To_be_Unified_Customer_Name == unify.To_be_Unified_Customer_Name
                    && x.To_be_Unified_Customer_ID == unify.To_be_Unified_Customer_ID && x.To_be_Unified_Country_Region == unify.To_be_Unified_Country_Region)
                        .Select(y => y.To_be_Country_Region_Customer_ID).Distinct().ToList();
                if (ctryName.Count > 1 && !validationSummary.duplicateToBeCtryNms.Contains(duplicateComb))
                {
                    validationSummary.duplicateToBeCtryNms.Add(duplicateComb);
                }
            }
            var validUcdRow = lstDealRecons.Where(x => x.Unified_Customer_ID != 0 && x.Unified_Customer_Name != "").ToList();
            foreach (var unify in validUcdRow)
            {
                var globalid = validUcdRow.Where(x => x.Unified_Customer_ID == unify.Unified_Customer_ID && x.Unified_Customer_ID != 0)
                        .Select(y => y.Unified_Customer_Name).Distinct().ToList();
                if (globalid.Count > 1 && !validationSummary.duplicateCustIds.Contains(unify.Unified_Customer_ID))
                {
                    validationSummary.duplicateCustIds.Add(unify.Unified_Customer_ID);
                }

                var globalName = validUcdRow.Where(x => x.Unified_Customer_Name == unify.Unified_Customer_Name
                    && !string.IsNullOrEmpty(x.Unified_Customer_Name) && x.Unified_Customer_Name.ToLower() != "any" && x.Unified_Customer_Name.ToLower() != "null")
                        .Select(y => y.Unified_Customer_ID).Distinct().ToList();
                if (globalName.Count > 1 && !validationSummary.duplicateCustNames.Contains(unify.Unified_Customer_Name))
                {
                    validationSummary.duplicateCustNames.Add(unify.Unified_Customer_Name);
                }
            }
            validUcdRow = lstDealRecons.Where(x => x.To_be_Unified_Customer_ID != 0 && x.To_be_Unified_Customer_Name != "").ToList();
            foreach (var unify in validUcdRow)
            {
                var globalid = validUcdRow.Where(x => x.To_be_Unified_Customer_ID == unify.To_be_Unified_Customer_ID && x.To_be_Unified_Customer_ID != 0)
                        .Select(y => y.To_be_Unified_Customer_Name).Distinct().ToList();
                if (globalid.Count > 1 && !validationSummary.duplicateToBeCustIds.Contains(unify.To_be_Unified_Customer_ID))
                {
                    validationSummary.duplicateToBeCustIds.Add(unify.To_be_Unified_Customer_ID);
                }

                var globalName = validUcdRow.Where(x => x.To_be_Unified_Customer_Name == unify.To_be_Unified_Customer_Name
                    && !string.IsNullOrEmpty(x.To_be_Unified_Customer_Name) && x.To_be_Unified_Customer_Name.ToLower() != "any" && x.To_be_Unified_Customer_Name.ToLower() != "null")
                        .Select(y => y.To_be_Unified_Customer_ID).Distinct().ToList();
                if (globalName.Count > 1 && !validationSummary.duplicateToBeCustNames.Contains(unify.To_be_Unified_Customer_Name))
                {
                    validationSummary.duplicateToBeCustNames.Add(unify.To_be_Unified_Customer_Name);
                }
            }
            if (lstDealRecons.Count > 0)
            {
                foreach (var row in lstDealRecons)
                {
                    var list = new List<string>();
                    if (!string.IsNullOrEmpty(row.Rpl_Status_Code))
                    {
                        //To remove consecutive commas,spaces and duplicate values in the given RPL status code input
                        var formattedRPLInput = row.Rpl_Status_Code.Split(',').Select(x => x.Trim()).Where(x => !string.IsNullOrWhiteSpace(x)).ToArray().Select(x => x.ToUpper()).Distinct();
                        row.Rpl_Status_Code = string.Join(",", formattedRPLInput);
                        list = row.Rpl_Status_Code.Split(',').ToList();
                        if (list.Except(rplStatcusCodeList).ToList().Count > 0)
                            validationSummary.invalidRplStatusCodes.Add(row.Rpl_Status_Code);
                    }
                    if (row.Deal_ID == 0 || row.Unified_Customer_ID == 0 || string.IsNullOrEmpty(row.Unified_Customer_Name)
                        || row.Country_Region_Customer_ID == 0 || string.IsNullOrEmpty(row.Unified_Country_Region)
                        || row.To_be_Unified_Customer_ID == 0 || string.IsNullOrEmpty(row.To_be_Unified_Customer_Name)
                        || row.To_be_Country_Region_Customer_ID == 0 || string.IsNullOrEmpty(row.To_be_Unified_Country_Region))
                    {
                        validationSummary.inValidRecords.Add(row);
                    }
                    else if (!Regex.IsMatch(row.Unified_Customer_Name, patt) || row.Unified_Customer_Name.Length > 65
                        || !Regex.IsMatch(row.To_be_Unified_Customer_Name, patt) || row.To_be_Unified_Customer_Name.Length > 65)
                    {
                        validationSummary.inValidRecords.Add(row);
                    }
                    else if (row.Unified_Customer_Name.ToLower() == "any" || row.Unified_Customer_Name.ToLower() == "null" ||
                        row.To_be_Unified_Customer_Name.ToLower() == "any" || row.To_be_Unified_Customer_Name.ToLower() == "null")
                    {
                        validationSummary.inValidRecords.Add(row);
                    }
                    else if (!Regex.IsMatch(row.Rpl_Status_Code, RPLStsPattern))
                    {
                        validationSummary.inValidRecords.Add(row);
                    }
                    else if ((validationSummary.invalidCountries.Count > 0 && validationSummary.invalidCountries.Contains(row.Unified_Country_Region.ToLower()))
                        || validationSummary.toBeInvalidCountries.Count > 0 && validationSummary.toBeInvalidCountries.Contains(row.To_be_Unified_Country_Region.ToLower()))
                    {
                        validationSummary.inValidRecords.Add(row);
                    }
                    else if (row.Unified_Country_Region != "" && row.To_be_Unified_Country_Region != "" && row.Unified_Country_Region.ToLower() != row.To_be_Unified_Country_Region.ToLower())
                    {
                        validationSummary.inValidRecords.Add(row);
                    }
                    else if ((row.To_be_Unified_Customer_ID != 0 && row.To_be_Country_Region_Customer_ID != 0 && row.To_be_Unified_Customer_ID == row.To_be_Country_Region_Customer_ID)
                        || (row.Unified_Customer_ID != 0 && row.Country_Region_Customer_ID != 0 && row.Country_Region_Customer_ID == row.Unified_Customer_ID))
                    {
                        validationSummary.inValidRecords.Add(row);
                    }
                    else if (validationSummary.duplicateDealCombination.Count > 0
                        && validationSummary.duplicateDealCombination.Contains(row.Deal_ID) &&
                        validRows.Where(x => x.Deal_ID == row.Deal_ID && x.Unified_Customer_ID == row.Unified_Customer_ID 
                        && x.Unified_Customer_Name == row.Unified_Customer_Name && x.Country_Region_Customer_ID == row.Country_Region_Customer_ID 
                        && x.Unified_Country_Region == row.Unified_Country_Region).ToList().Count > 1)
                    {
                        validationSummary.inValidRecords.Add(row);
                    }
                    else if (validationSummary.duplicateCustIds.Count > 0
                        && validationSummary.duplicateCustIds.Contains(row.Unified_Customer_ID))
                    {
                        validationSummary.inValidRecords.Add(row);
                    }
                    else if (validationSummary.duplicateCustNames.Count > 0
                        && validationSummary.duplicateCustNames.Contains(row.Unified_Customer_Name))
                    {
                        validationSummary.inValidRecords.Add(row);
                    }
                    else if (validationSummary.duplicateCtryIds.Count > 0
                        && validationSummary.duplicateCtryIds.Where(x => x.cust_Id == row.Unified_Customer_ID
                        && x.cust_Nm == row.Unified_Customer_Name && x.ctry_Nm == row.Unified_Country_Region 
                        && x.ctry_Id == row.Country_Region_Customer_ID).Any())
                    {
                        validationSummary.inValidRecords.Add(row);
                    }
                    else if (validationSummary.duplicateCtryNms.Count > 0
                        && validationSummary.duplicateCtryNms.Where(x => x.cust_Id == row.Unified_Customer_ID
                        && x.cust_Nm == row.Unified_Customer_Name && x.ctry_Id == row.Country_Region_Customer_ID
                        && x.ctry_Nm == row.Unified_Country_Region).Any())
                    {
                        validationSummary.inValidRecords.Add(row);
                    }
                    else if (validationSummary.duplicateToBeCtryIds.Count > 0
                        && validationSummary.duplicateToBeCtryIds.Where(x => x.cust_Id == row.To_be_Unified_Customer_ID
                        && x.cust_Nm == row.To_be_Unified_Customer_Name && x.ctry_Nm == row.To_be_Unified_Country_Region
                        && x.ctry_Id == row.To_be_Country_Region_Customer_ID).Any())
                    {
                        validationSummary.inValidRecords.Add(row);
                    }
                    else if (validationSummary.duplicateToBeCtryNms.Count > 0
                        && validationSummary.duplicateToBeCtryNms.Where(x => x.cust_Id == row.To_be_Unified_Customer_ID
                        && x.cust_Nm == row.To_be_Unified_Customer_Name && x.ctry_Id == row.To_be_Country_Region_Customer_ID
                        && x.ctry_Nm == row.To_be_Unified_Country_Region).Any())
                    {
                        validationSummary.inValidRecords.Add(row);
                    }
                    else if (validationSummary.duplicateToBeCustIds.Count > 0
                        && validationSummary.duplicateToBeCustIds.Contains(row.To_be_Unified_Customer_ID))
                    {
                        validationSummary.inValidRecords.Add(row);
                    }
                    else if (validationSummary.duplicateToBeCustNames.Count > 0
                        && validationSummary.duplicateToBeCustNames.Contains(row.To_be_Unified_Customer_Name))
                    {
                        validationSummary.inValidRecords.Add(row);
                    }
                    else if (!string.IsNullOrEmpty(row.Rpl_Status_Code) && validationSummary.invalidRplStatusCodes.Contains(row.Rpl_Status_Code))
                    {
                        validationSummary.inValidRecords.Add(row);
                    }
                    else
                    {
                        validationSummary.validRecords.Add(row);
                    }
                }
            }
            return validationSummary;
        }
    }
}