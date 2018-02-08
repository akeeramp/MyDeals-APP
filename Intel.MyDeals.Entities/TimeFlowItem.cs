namespace Intel.MyDeals.Entities
{
    public class TimeFlowItem
    {
        public TimeFlowItem()
        {
            Media = TimeFlowMedia.MT;
        }

        public int StepNum { get; set; }
        public string StepTitle { get; set; }
        public double MsLapseTiming { get; set; }
        public double MsExecutionTiming { get; set; }
        public TimeFlowMedia Media { get; set; }
        public string Details { get; set; }

    }
}