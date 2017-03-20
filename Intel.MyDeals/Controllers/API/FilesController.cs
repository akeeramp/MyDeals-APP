using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/Files")]
    public class FilesController : BaseApiController
    {
        private readonly IFilesLib _filesLib;

        public FilesController(IFilesLib _filesLib)
        {
            this._filesLib = _filesLib;
        }

        /// <summary>
        /// Get file attachment list
        /// </summary>
        /// <param name="custMbrSid"></param>
        /// <param name="objTypeSid"></param>
        /// <param name="objSid"></param>
        /// <param name="includeGroup"></param>
        /// <returns></returns>
        [Route("GetFileAttachments/{custMbrSid}/{objTypeSid}/{objSid}/{includeGroup}")]
        public List<FileAttachment> GetFileAttachments(int custMbrSid, int objTypeSid,
            int objSid, string includeGroup)
        {
            return SafeExecutor(() => _filesLib.GetFileAttachments(custMbrSid, objTypeSid,
                objSid, includeGroup)
                , $"Unable to get File attachment for {objSid}"
            );
        }

        /// <summary>
        /// Get file attachment data
        /// </summary>
        /// <param name="custMbrSid"></param>
        /// <param name="objTypeSid"></param>
        /// <param name="objSid"></param>
        /// <param name="includeGroup"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("OpenFileAttachment/{fileId}")]
        public HttpResponseMessage OpenFileAttachment(int fileId)
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
    }
}