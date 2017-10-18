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


        public MyDealsData SavePackets(OpDataCollectorFlattenedDictList data, ContractToken contractToken, List<int> validateIds, bool forcePublish, string sourceEvent, bool resetValidationChild,
            List<int> ids, List<OpDataElementType> opDataElementTypes, OpDataElementType opTypeGrp,
            List<int> secondaryIds, List<OpDataElementType> secondaryOpDataElementTypes, OpDataElementType secondaryOpTypeGrp, bool isProductTranslate)
        {
            MyDealsData myDealsData = new MyDealsData();

            // Get the data from the DB, data is the data passed from the UI, it is then merged together down below.
            if (ids.Any() && opDataElementTypes.Any())
            {
                MyDealsData primaryMyDealsData = opTypeGrp.GetByIDs(ids, opDataElementTypes, data);
                foreach (KeyValuePair<OpDataElementType, OpDataPacket<OpDataElementType>> kvp in primaryMyDealsData)
                {
                    myDealsData[kvp.Key] = kvp.Value;
                }
            }

            if (secondaryIds.Any() && secondaryOpDataElementTypes.Any())
            {
                MyDealsData secondaryMyDealsData = secondaryOpTypeGrp.GetByIDs(secondaryIds, secondaryOpDataElementTypes, data);
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
			
			return myDealsData.SavePacketsBase(data, contractToken, validateIds, forcePublish, sourceEvent, resetValidationChild, isProductTranslate);
        }

		public MyDealsData SavePackets(OpDataCollectorFlattenedDictList data, ContractToken contractToken, List<int> validateIds, bool forcePublish, string sourceEvent, bool resetValidationChild)
		{
			List<int> ids;
			List<OpDataElementType> opDataElementTypes;
			OpDataElementType opTypeGrp;

			// get all layer (OpDataElementTypes) based on passed data
			data.PredictIdsAndLevels(out ids, out opDataElementTypes, out opTypeGrp);

			// Get the data from the DB, data is the data passed from the UI, it is then merged together down below.
			MyDealsData myDealsData = opTypeGrp.GetByIDs(ids, opDataElementTypes, data);

			return myDealsData.SavePacketsBase(data, contractToken, validateIds, forcePublish, sourceEvent, resetValidationChild, false);
		}
		
	}
}
