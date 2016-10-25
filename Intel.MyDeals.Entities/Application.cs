namespace Intel.MyDeals.Entities
{
    public class Application
    {
        public int ApplicationId { get; set; }

        public string ApplicationCd { get; set; }

        public string ApplicationDescription { get; set; }

        public string Suite { get; set; }

        public bool Active { get; set; }

        public bool Modified { get; set; }
    }
}