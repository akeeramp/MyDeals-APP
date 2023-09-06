using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;

namespace Intel.MyDeals.BusinessLogic
{
    public class DbAuditToolsLib : IDbAuditToolsLib
    {
        private readonly IDbAuditToolsDataLib _dbAuditToolsDataLib;
        /// <summary>
        /// Customer Library
        /// </summary>
        public DbAuditToolsLib()
        {
            _dbAuditToolsDataLib = new DbAuditToolsDataLib();
        }

        public string GetDbAuditData(string _mode)
        {
            return _dbAuditToolsDataLib.GetDbAuditData(_mode);
        }

        public string RunDbAudit(string _mode, string _jsonData)
        {
            return _dbAuditToolsDataLib.RunDbAudit(_mode, _jsonData);
        }

        public string GetDbAuditObjectText(string _mode, string _jsonData)
        {
            return _dbAuditToolsDataLib.GetDbAuditObjectText(_mode, _jsonData);
        }

    }
}
