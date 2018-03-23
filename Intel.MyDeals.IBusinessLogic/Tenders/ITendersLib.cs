using System.Collections.Generic;
using Intel.MyDeals.Entities;
using Intel.Opaque;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface ITendersLib
    {
        OpDataCollectorFlattenedDictList GetMaster(int id);

        OpDataCollectorFlattenedDictList GetChildren(int id);

        SearchResultPacket GetTenderList(SearchParams data);

        OpMsgQueue ActionTenders(ContractToken contractToken, List<TenderActionItem> data, string actn);
    }
}