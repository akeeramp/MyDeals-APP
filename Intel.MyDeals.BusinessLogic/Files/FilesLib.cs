using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque.Data;
using System;
using System.Collections.Generic;
using System.Linq;

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

        public List<MeetComp> ExtractMeetCompFile(byte[] fileData)
        {
            return _filesDataLib.ExtractMeetCompFile(fileData);
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

        public void UpdateFileAttachmentBit(int objTypeSid, int objSid)
        {
            OpDataElementType opType = objTypeSid.IdToOpDataElementTypeString();
            MyDealsData myDealsData = opType.GetByIDs(new List<int> { objSid });

            OpDataCollector dc = myDealsData[opType].AllDataCollectors.FirstOrDefault();
            IOpDataElement de = dc.GetDataElement(AttributeCodes.HAS_ATTACHED_FILES);
            IOpDataElement deCust = dc.GetDataElement(AttributeCodes.CUST_MBR_SID);

            ContractToken contractToken = new ContractToken { CustId = int.Parse(deCust.AtrbValue.ToString()), ContractId = objSid };

            if (de == null)
            {
                dc.DataElements.Add (new OpDataElement {
                    DcID = deCust.DcID,
                    DcType = deCust.DcType,
                    DcParentType = deCust.DcParentType,
                    DcParentID = deCust.DcParentID,
                    AtrbID = 103,
                    AtrbValue = 1,
                    AtrbCd = "HAS_ATTACHED_FILES",
                    State = OpDataElementState.Modified
                });
            }
            else
            {
                de.SetAtrbValue(1);
                de.State = OpDataElementState.Modified;
            }

            myDealsData[opType].BatchID = Guid.NewGuid();
            myDealsData[opType].GroupID = -101; // Whatever the real ID of this object is
            myDealsData[opType].AddSaveActions();
            myDealsData.EnsureBatchIDs();

            myDealsData.Save(contractToken);
        }

    }
}