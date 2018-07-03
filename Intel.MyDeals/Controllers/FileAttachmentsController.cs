using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;
using System;
using System.Collections.Generic;
using System.IO;
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
    }
}