using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IFilesLib
    {
        /// <summary>
        /// Get file attachment list
        /// </summary>
        /// <param name="custMbrSid"></param>
        /// <param name="objTypeSid"></param>
        /// <param name="objSid"></param>
        /// <param name="includeGroup"></param>
        /// <returns></returns>
        List<FileAttachment> GetFileAttachments(int custMbrSid, int objTypeSid, int objSid, string includeGroup);

        /// <summary>
        /// Get file list attached to a obj type, obj type sid and customer
        /// </summary>
        /// <param name="custMbrSid"></param>
        /// <param name="objTypeSid"></param>
        /// <param name="objSid"></param>
        /// <param name="includeGroup"></param>
        /// <returns></returns>
        FileAttachmentData GetFileAttachmentData(int fileId);

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
        bool SaveFileAttachment(FileAttachment fileAtatchment, byte[] fileData);
    }
}