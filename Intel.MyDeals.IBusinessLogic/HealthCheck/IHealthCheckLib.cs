using Intel.MyDeals.Entities;
using System.Collections.Generic;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IHealthCheckLib
    {
        List<HealthCheckData> GetDbHealthCheckStatus();
        int GetDbaasCpuHealthStatus();
    }
}
