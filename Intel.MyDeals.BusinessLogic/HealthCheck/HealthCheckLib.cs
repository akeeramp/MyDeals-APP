using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using System.Collections.Generic;

namespace Intel.MyDeals.BusinessLogic
{
    public class HealthCheckLib : IHealthCheckLib
    {
        private readonly IHealthCheckDataLib _healthCheckDataLib;
        public HealthCheckLib(IHealthCheckDataLib healthCheckDataLib) 
        {
            _healthCheckDataLib = healthCheckDataLib;
        }

        public List<HealthCheckData> GetDbHealthCheckStatus()
        {
            List<HealthCheckData> res = _healthCheckDataLib.GetDbHealthCheckStatus();
            return res;
        }

        public int GetDbaasCpuHealthStatus()
        {
            int res = _healthCheckDataLib.GetDbaasCpuHealthStatus();
            return res;
        }
    }
}