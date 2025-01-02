using System;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque.Data;


namespace Intel.MyDeals.BusinessLogic
{
    public class JobMonitorLib : IJobMonitorLib
    {
        private readonly IJobMonitorDataLib _jobMonitorDataLib;

        public JobMonitorLib(IJobMonitorDataLib jobMonitorDataLib)
        {
            _jobMonitorDataLib = jobMonitorDataLib;           
        }

        public List<BatchRunHealthSts> GetBatchRunHealthStatus()
        {
            return new JobMonitorDataLib().GetBatchRunHealthStatus();
        }

        public List<BatchRunHealthSts> GetBatchStepsRunHealthStatus(string jobNm)
        {
            return new JobMonitorDataLib().GetBatchStepsRunHealthStatus(jobNm);
        }

        public List<BatchRunHealthSts> GetBatchStepRunHistory(string btchNm, string stepNm, int take)
        {
            return new JobMonitorDataLib().GetBatchStepRunHistory(btchNm, stepNm, take);
        }

    }
}