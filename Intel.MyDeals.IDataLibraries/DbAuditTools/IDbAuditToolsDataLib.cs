using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IDataLibrary
{
    public interface IDbAuditToolsDataLib
    {
        string GetDbAuditData(string _mode);

        string RunDbAudit(string _mode, string _jsonData);

        string GetDbAuditObjectText(string _mode, string _jsonData);

    }
}