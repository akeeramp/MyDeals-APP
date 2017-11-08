using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IOpDataCollectorLib
    {
		MyDealsData SavePackets(OpDataCollectorFlattenedDictList data, SavePacket savePacket);

        MyDealsData SavePackets(OpDataCollectorFlattenedDictList data, SavePacket savePacket,
            List<int> ids, List<OpDataElementType> opDataElementTypes, OpDataElementType opTypeGrp,
            List<int> secondaryIds, List<OpDataElementType> secondaryOpDataElementTypes,
            OpDataElementType secondaryOpTypeGrp);
		
	}
}