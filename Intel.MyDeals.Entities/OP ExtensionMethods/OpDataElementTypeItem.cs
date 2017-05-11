using Intel.MyDeals.Entities;

namespace Intel.Opaque.Data
{
    public class OpDataElementTypeItem
    {
        public int Id { get; set; }
        public OpDataElementType OpDeType { get; set; }
        public string Alias { get; set; }
        public string Description { get; set; }
        public int Order { get; set; }
    }
}