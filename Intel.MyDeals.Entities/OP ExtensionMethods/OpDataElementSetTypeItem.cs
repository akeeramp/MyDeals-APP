using Intel.MyDeals.Entities;

namespace Intel.Opaque.Data
{
    public class OpDataElementSetTypeItem
    {
        public int Id { get; set; }
        public OpDataElementSetType OpDeSetType { get; set; }
        public string Alias { get; set; }
        public string Description { get; set; }
        public int TemplateDealNumber { get; set; }
        public string TrackerDtLetter { get; set; }
        public int Order { get; set; }
    }
}