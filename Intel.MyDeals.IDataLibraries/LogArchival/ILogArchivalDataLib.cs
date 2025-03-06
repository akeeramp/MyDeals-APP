using System;
using System.Collections.Generic;
using Intel.MyDeals.Entities;


namespace Intel.MyDeals.IDataLibrary
{
    public interface ILogArchivalDataLib
    {
        List<LogArchivalDetails> GetLogArchivalDetails();

        List<LogArchival> SetLogArchival(string mode, List<LogArchival> logArchivals);
    }
}
