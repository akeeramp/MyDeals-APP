using System;
using System.Collections.Generic;
using System.Linq;

namespace Intel.MyDeals.Entities
{
    public static class TimeFlowHelper
    {
        public static List<PerformanceTime> GetPerformanceTimes(DateTime start, string title, List<TimeFlowItem> timeFlows )
        {
            double ms = (DateTime.Now - start).TotalMilliseconds;
            double dbMs = timeFlows.Where(t => t.Media == TimeFlowMedia.DB).Select(d => d.MsExecutionTiming).Sum();

            List <PerformanceTime> times = new List<PerformanceTime>
            {
                new PerformanceTime
                {
                    Title = title,
                    ExecutionTime = ms - dbMs,
                    Media = TimeFlowMedia.MT
                }
            };
            times.AddRange(timeFlows.Where(t => t.Media == TimeFlowMedia.DB).Select(item => new PerformanceTime
            {
                Title = item.StepTitle,
                ExecutionTime = item.MsExecutionTiming,
                Media = item.Media
            }));

            return times;
        }
    }
}
