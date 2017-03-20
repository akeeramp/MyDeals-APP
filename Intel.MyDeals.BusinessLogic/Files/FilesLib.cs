using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using System.Collections.Generic;

namespace Intel.MyDeals.BusinessLogic
{
    public class FilesLib : IFilesLib
    {
        private readonly IFilesDataLib _filesDataLib;

        public FilesLib(IFilesDataLib _filesDataLib)
        {
            this._filesDataLib = _filesDataLib;
        }

        /// <summary>
        /// Get file Attachment data by file id
        /// </summary>
        /// <param name="fileId"></param>
        /// <returns></returns>
        public List<FileAttachment> GetFileAttachments(int custMbrSid, int objTypeSid, int objSid, string includeGroup)
        {
            return _filesDataLib.GetFileAttachments(custMbrSid, objTypeSid, objSid, includeGroup);
        }

        /// <summary>
        /// Get file list attached to a obj type, obj type sid and customer
        /// </summary>
        /// <param name="custMbrSid"></param>
        /// <param name="objTypeSid"></param>
        /// <param name="objSid"></param>
        /// <param name="includeGroup"></param>
        /// <returns></returns>
        public FileAttachmentData GetFileAttachmentData(int fileId)
        {
            return _filesDataLib.GetFileAttachmentData(fileId);
        }

        /// <summary>
        /// Save file attachments
        /// </summary>
        /// <param name="customerMemberSid">Customer Member Sid</param>
        /// <param name="objSid">Obj Sid</param>
        /// <param name="objTypeSid">Obj Type Sid</param>
        /// <param name="contentType">Content type</param>
        /// <param name="fileName">File name</param>
        /// <param name="originalSize">Original Size</param>
        /// <param name="compressedSize">Compressed size</param>
        /// <param name="isCompressed">Is compressed</param>
        /// <param name="fileData">File data in byte array</param>
        public bool SaveFileAttachment(FileAttachment fileAttachment, byte[] fileData)
        {
            return _filesDataLib.SaveFileAttachment(fileAttachment, fileData);
        }
    }
}