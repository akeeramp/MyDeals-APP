using Intel.MyDeals.Entities;
using Intel.Opaque;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface ITendersLib
    {
        OpDataCollectorFlattenedDictList GetMaster(int id);

        OpDataCollectorFlattenedDictList GetChildren(int id);

        OpDataCollectorFlattenedList GetTenderList(SearchParams data);

        OpMsgQueue ActionTenders(string dcIds, string actn);
    }
}