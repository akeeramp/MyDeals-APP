using Intel.MyDeals.DataLibrary;
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

        public FilesLib()
        {
            _filesDataLib = new FilesDataLib();
        }

        /// <summary>
        /// Save the specified files as attachments
        /// </summary>
        public bool SaveFileAttachment(FileAttachment fileAttachment, byte[] fileData)
        {
            return _filesDataLib.SaveFileAttachment(fileAttachment, fileData);
        }

        /// <summary>
        /// Get the list of file attachments
        /// </summary>
        public List<FileAttachment> GetFileAttachments(int custMbrSid, int objTypeSid, int objSid, string includeGroup)
        {
            return _filesDataLib.GetFileAttachments(custMbrSid, objTypeSid, objSid, includeGroup);
        }

        /// <summary>
        /// Get the contents of the specified file attachment
        /// </summary>
        public FileAttachmentData GetFileAttachmentData(int fileId)
        {
            return _filesDataLib.GetFileAttachmentData(fileId);
        }

        /// <summary>
        /// Delete the specified file attachment
        /// </summary>
        public bool DeleteFileAttachment(int custMbrSid, int objTypeSid, int objSid, int fileDataSid, string includeGroup)
        {
            return _filesDataLib.DeleteFileAttachment(custMbrSid, objTypeSid, objSid, fileDataSid, includeGroup);
        }

        /// <summary>
        /// Get the list of all deals with attachments
        /// </summary>
        public List<DealsWithAttachments> GetDealsWithAttachments()
        {
            return _filesDataLib.GetDealsWithAttachments();
        }
    }
}