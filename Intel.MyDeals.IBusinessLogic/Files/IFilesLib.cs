using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IFilesLib
    {
        List<MeetComp> ExtractMeetCompFile(byte[] fileData);
        /// <summary>
        /// Save the specified files as attachments
        /// </summary>
        bool SaveFileAttachment(FileAttachment fileAtatchment, byte[] fileData);

        /// <summary>
        /// Get the list of file attachments
        /// </summary>
        List<FileAttachment> GetFileAttachments(int custMbrSid, int objTypeSid, int objSid, string includeGroup);

        /// <summary>
        /// Get the contents of the specified file attachment
        /// </summary>
        FileAttachmentData GetFileAttachmentData(int fileId);

        /// <summary>
        /// Delete the specified file attachment
        /// </summary>
        bool DeleteFileAttachment(int custMbrSid, int objTypeSid, int objSid, int fileDataSid, string includeGroup);

    }
}