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

        public FileAttachmentsController(IFilesLib _filesLib)
        {
            this._filesLib = _filesLib;
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
                int.TryParse(lstUnifyDeals[i].DEAL_ID != null ? lstUnifyDeals[i].DEAL_ID.ToString().Trim() : "0", out dbDealId);
                int.TryParse(lstUnifyDeals[i].UCD_GLOBAL_ID != null ? lstUnifyDeals[i].UCD_GLOBAL_ID.ToString().Trim() : "0", out dbPrimCustId);
                int.TryParse(lstUnifyDeals[i].UCD_COUNTRY_CUST_ID != null ? lstUnifyDeals[i].UCD_COUNTRY_CUST_ID.ToString().Trim() : "0", out dbPrimLvlId);
                lstUnifyDeals[i].DEAL_ID = dbDealId;
                lstUnifyDeals[i].UCD_GLOBAL_ID = dbPrimCustId;
                lstUnifyDeals[i].UCD_COUNTRY_CUST_ID = dbPrimLvlId;
                lstUnifyDeals[i].UCD_GLOBAL_NAME = lstUnifyDeals[i].UCD_GLOBAL_NAME != null ? lstUnifyDeals[i].UCD_GLOBAL_NAME.Trim() : string.Empty;
                lstUnifyDeals[i].UCD_COUNTRY = lstUnifyDeals[i].UCD_COUNTRY != null ? lstUnifyDeals[i].UCD_COUNTRY.Trim() : string.Empty;
            }
            var result = ValidateUnifyDeals(lstUnifyDeals);
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
            unifyDealValidation.DuplicateDealIds = lstUnifyDeals.GroupBy(x => x.DEAL_ID).Where(grp => grp.Count() > 1).Select(y => y.Key).ToList();
            unifyDealValidation.IsDuplicateDealIdAvailable = unifyDealValidation.DuplicateDealIds.Count > 0;
            var patt = @"^[\w\s.,'&:-]*$";
            foreach (var unify in lstUnifyDeals)
            {
                var globalid = lstUnifyDeals.Where(x => x.UCD_GLOBAL_ID == unify.UCD_GLOBAL_ID && x.UCD_GLOBAL_ID != 0).Select(y => y.UCD_GLOBAL_NAME).Distinct().ToList();
                if (globalid.Count > 1)
                {
                    unifyDealValidation.DuplicateGlobalIds.Add(unify.UCD_GLOBAL_ID);
                }
                var globalName = lstUnifyDeals.Where(x => x.UCD_GLOBAL_NAME == unify.UCD_GLOBAL_NAME
                && x.UCD_GLOBAL_NAME != null && x.UCD_GLOBAL_NAME != "" && x.UCD_GLOBAL_NAME.ToLower() != "any" && x.UCD_GLOBAL_NAME.ToLower() != "null")
                    .Select(y => y.UCD_GLOBAL_ID).Distinct().ToList();
                if (globalName.Count > 1)
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
                        || row.UCD_COUNTRY == "" || row.UCD_GLOBAL_NAME == "")
                    {
                        unifyDealValidation.InValidUnifyDeals.Add(row);
                    }
                    else if (unifyDealValidation.DuplicateDealIds.Count > 0
                        && unifyDealValidation.DuplicateDealIds.Contains(row.DEAL_ID))
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
                        && unifyDealValidation.InValidCountries.Contains(row.UCD_COUNTRY))
                    {
                        unifyDealValidation.InValidUnifyDeals.Add(row);
                    }
                    else if (unifyDealValidation.DuplicateGlobalNames.Count > 0
                        && unifyDealValidation.DuplicateGlobalNames.Contains(row.UCD_GLOBAL_NAME))
                    {
                        unifyDealValidation.InValidUnifyDeals.Add(row);
                    }
                    else if (!Regex.IsMatch(row.UCD_GLOBAL_NAME, patt))
                    {
                        unifyDealValidation.InValidUnifyDeals.Add(row);
                    }
                    else
                    {
                        unifyDealValidation.ValidUnifyDeals.Add(row);
                    }
                }
            }
            return unifyDealValidation;
        }
    }
}