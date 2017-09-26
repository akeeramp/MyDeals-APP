using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/FileAttachments")]
    public class FileAttachmentsController : BaseApiController
    {
        private readonly IFilesLib _filesLib;

        public FileAttachmentsController(IFilesLib _filesLib)
        {
            this._filesLib = _filesLib;
        }

        /// <summary>
        /// Get the list of file attachments
        /// </summary>
        [Route("Get/{custMbrSid}/{objTypeSid}/{objSid}/{includeGroup}")]
        public List<FileAttachment> Get(int custMbrSid, int objTypeSid, int objSid, string includeGroup)
        {
            return SafeExecutor(() => _filesLib.GetFileAttachments(custMbrSid, objTypeSid,
                objSid, includeGroup)
                , $"Unable to get File attachment for {objSid}"
            );
        }

        /// <summary>
        /// Get the contents of the specified file attachment
        /// </summary>
        [HttpGet]
        [Route("Open/{fileId}")]
        public HttpResponseMessage Open(int fileId)
        {
            byte[] fileBodyFinalBytes = null;

            var fileAttahment = SafeExecutor(() => _filesLib.GetFileAttachmentData(fileId)
                , $"Unable to get open attachment for {fileId}"
            );

            if (fileAttahment.FILE_DATA.Length > 0)
            {
                if (fileAttahment.IS_COMPRS) // Decompress file
                {
                    fileBodyFinalBytes = OpZipUtils.DecompressBytes(fileAttahment.FILE_DATA);
                }
                else
                {
                    fileBodyFinalBytes = fileAttahment.FILE_DATA;
                }
            }

            var result = new HttpResponseMessage(HttpStatusCode.OK);
            if (fileBodyFinalBytes != null)
            {
                Stream stream = new MemoryStream(fileBodyFinalBytes);
                result.Content = new StreamContent(stream);
            }

            string fName = fileAttahment.FILE_NM;
            string[] swapString = { "(", ")", "-", "&", "'", "*", "^", " " };
            foreach (string s in swapString)
            {
                fName = fName.Replace(s, "_");
            }
            result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
            result.Content.Headers.Add("Content-Disposition", String.Format("attachment;filename={0}", fName));

            return result;
        }

        /// <summary>
        /// Delete the specified file attachment
        /// </summary>
        [HttpPost]
        [Route("Delete/{custMbrSid}/{objTypeSid}/{objSid}/{fileDataSid}/{includeGroup}")]
        public void Delete(int custMbrSid, int objTypeSid, int objSid, int fileDataSid, string includeGroup)
        {
            if (!_filesLib.DeleteFileAttachment(custMbrSid, objTypeSid, objSid, fileDataSid, includeGroup))
                throw new HttpException(500, "Failed to delete attachment.");
        }
    }
}