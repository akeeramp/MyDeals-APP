using Intel.MyDeals.Entities;
using Intel.Opaque.Data;

namespace Intel.MyDeals.Entities
{
    public class WorkFlowQueueItem
    {
        public int Order { get; set; }
        public OpDataElementType DataElementType { get; set; }
        public int DataTypeOrder { get; set; }
        public MyDealsDataAction DcsAction { get; set; }
        public WorkFlowQueueStatus Status { get; set; }
    }
}