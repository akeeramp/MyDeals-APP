using System;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.BusinessLogic.DataCollectors;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque.Data;

namespace Intel.MyDeals.BusinessLogic
{
    public class OpDataCollectorLib : IOpDataCollectorLib
    {
        /// <summary>
        /// DataCollector Data Library, wrapper methods to access static cache
        /// </summary>
        private readonly IOpDataCollectorDataLib _dataCollectorDataLib;

        public OpDataCollectorLib(IOpDataCollectorDataLib dataCollectorDataLib)
        {
            _dataCollectorDataLib = dataCollectorDataLib;
        }


        public MyDealsData SavePackets(OpDataCollectorFlattenedDictList data, SavePacket savePacket,
            List<int> ids, List<OpDataElementType> opDataElementTypes, OpDataElementType opTypeGrp,
            List<int> secondaryIds, List<OpDataElementType> secondaryOpDataElementTypes, OpDataElementType secondaryOpTypeGrp)
        {
            MyDealsData myDealsData = new MyDealsData();

            // Get the data from the DB, data is the data passed from the UI, it is then merged together down below.
            if (ids.Any() && opDataElementTypes.Any())
            {
                DateTime start = DateTime.Now;
                MyDealsData primaryMyDealsData = opTypeGrp.GetByIDs(ids, opDataElementTypes, data, savePacket);
                savePacket.MyContractToken.AddMark("GetByIDs - PR_MYDL_GET_OBJS_BY_SIDS", TimeFlowMedia.DB, (DateTime.Now - start).TotalMilliseconds);

                foreach (KeyValuePair<OpDataElementType, OpDataPacket<OpDataElementType>> kvp in primaryMyDealsData)
                {
                    myDealsData[kvp.Key] = kvp.Value;
                }
            }


            if (secondaryIds.Any() && secondaryOpDataElementTypes.Any())
            {
                DateTime start = DateTime.Now;
                MyDealsData secondaryMyDealsData = secondaryOpTypeGrp.GetByIDs(secondaryIds, secondaryOpDataElementTypes, data, savePacket);
                savePacket.MyContractToken.AddMark("GetByIDs - PR_MYDL_GET_OBJS_BY_SIDS", TimeFlowMedia.DB, (DateTime.Now - start).TotalMilliseconds);

                foreach (KeyValuePair<OpDataElementType, OpDataPacket<OpDataElementType>> kvp in secondaryMyDealsData)
                {
                    if (kvp.Value.AllDataElements.Any())
                    {
                        myDealsData[kvp.Key] = kvp.Value;
                        foreach (OpDataCollector dc in myDealsData[kvp.Key].AllDataCollectors)
                        {
                            if (dc.DcParentID == 0 && dc.DcParentType == dc.DcType && dc.DataElements.Any())
                            {
                                // reset parent
                                dc.DcParentID = dc.DataElements.First().DcParentID;
                                dc.DcParentType = dc.DcParentType;
                            }
                        }
                    }
                }
            }
		
			return myDealsData.SavePacketsBase(data, savePacket);
        }

		public MyDealsData SavePackets(OpDataCollectorFlattenedDictList data, SavePacket savePacket)
		{
			List<int> ids;
			List<OpDataElementType> opDataElementTypes;
			OpDataElementType opTypeGrp;

			// get all layer (OpDataElementTypes) based on passed data
			data.PredictIdsAndLevels(out ids, out opDataElementTypes, out opTypeGrp);

			// Get the data from the DB, data is the data passed from the UI, it is then merged together down below.
			MyDealsData myDealsData = opTypeGrp.GetByIDs(ids, opDataElementTypes, data, savePacket);

			return myDealsData.SavePacketsBase(data, savePacket);
		}
		
	}
}
