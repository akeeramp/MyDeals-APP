using System;
using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IJobMonitorLib
    {
        List<BatchRunHealthSts> GetBatchRunHealthStatus();
        List<BatchRunHealthSts> GetBatchStepsRunHealthStatus(string jobNm);
        List<BatchRunHealthSts> GetBatchStepRunHistory(string btchNm, string stepNm, int take);
    }
}
