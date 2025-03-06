using System;
using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface ILogArchivalLib
    {
        List<LogArchivalDetails> GetLogArchivalDetails();

        List<LogArchival> UpdateLogArchival(string mode, List<LogArchival> data);

    }
}
