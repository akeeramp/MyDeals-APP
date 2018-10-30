using System;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Intel.MyDeals.IBusinessLogic;

namespace Intel.MyDeals.BusinessLogic
{
    public class ConstantsLookupsLib : IConstantsLookupsLib
    {
        /// <summary>
        /// Constants lookup Data library
        /// </summary>
        private readonly IConstantLookupDataLib _constantLookupDataLib;

        /// <summary>
        /// DataCollection Data Library, wrapper methods to access static cache
        /// </summary>
        private readonly IDataCollectionsDataLib _dataCollectionsDataLib;

        private readonly INotificationsLib _notificationsLib;

        public ConstantsLookupsLib(IConstantLookupDataLib constantLookupDataLib,
            IDataCollectionsDataLib dataCollectionsDataLib, INotificationsLib notificationsLib)
        {
            _constantLookupDataLib = constantLookupDataLib;
            _dataCollectionsDataLib = dataCollectionsDataLib;
            _notificationsLib = notificationsLib;
        }

        public ConstantsLookupsLib()
        {
            _constantLookupDataLib = new ConstantLookupDataLib();
            _dataCollectionsDataLib = new DataCollectionsDataLib();
        }

        #region Tool Constants

        public AdminConstant GetConstantsByName(string constant)
        {
            return GetAdminConstants().FirstOrDefault(c => c.CNST_NM == constant);
        }

        public AdminConstant GetConstantsByName(string constant, bool nonCachedData)
        {
            return _constantLookupDataLib.GetAdminConstants().FirstOrDefault(c => c.CNST_NM == constant);
        }

        public string GetToolConstantValue(string constant)
        {
            return GetAdminConstants()
                .Where(c => c.CNST_NM == constant)
                .Select(c => c.CNST_VAL_TXT)
                .FirstOrDefault();
        }

        #endregion Tool Constants

        #region Get Lookups

        public List<LookupItem> GetLookups()
        {
            return DataCollections.GetLookupData();
        }

        public IQueryable<LookupItem> GetLookups(string name)
        {
            return name.Replace(" ", "").IndexOf(",") >= 0
                ? GetLookups()
                    .Where(l => name.Replace(" ", "").Split(',').Any(singleName => singleName == l.ATRB_COL_NM))
                    .OrderBy(l => l.ATRB_COL_NM).ThenBy(l => l.ORD).ThenBy(l => l.DROP_DOWN).AsQueryable()
                : GetLookups()
                    .Where(l => l.ATRB_COL_NM == name)
                    .OrderBy(l => l.ORD).ThenBy(l => l.DROP_DOWN).AsQueryable();
        }

        public List<LookupItem> GetLookups(string dealType, string atrbCd)
        {
            dealType = dealType.ToUpper();
            atrbCd = atrbCd.ToUpper();
            return GetLookups()
                .Where(l => l.ATRB_COL_NM.ToUpper() == atrbCd && (dealType == "ALL" || l.DEAL_TYPE_CD.ToUpper() == "ALL DEALS" || l.DEAL_TYPE_CD.ToUpper() == dealType))
                .OrderBy(l => l.DROP_DOWN).ToList();
        }

        #endregion Get Lookups

        #region Constants Admin

        public List<AdminConstant> GetAdminConstants(bool getCachedResult = true)
        {
            if (!getCachedResult)
            {
                return _constantLookupDataLib.GetAdminConstants();
            }
            return _dataCollectionsDataLib.GetToolConstants();
        }

        public AdminConstant CreateAdminConstant(AdminConstant data)
        {
            return data == null ? null : _constantLookupDataLib.SetAdminConstants(CrudModes.Insert, data);
        }

        public AdminConstant UpdateAdminConstant(AdminConstant data)
        {
            var result = _constantLookupDataLib.SetAdminConstants(CrudModes.Update, data);
            if (data.CNST_NM == "VERBOSE_LOG_TO_DB")
            {
                EN.GLOBAL.VERBOSE_LOG_TO_DB = data.CNST_VAL_TXT.ToLower() == "true" ? true : false;
            }
            return result;
        }

        public void UpdateRecycleCacheConstants(string cnstName, string cnstVal)
        {
            _constantLookupDataLib.UpdateRecycleCacheConstants(cnstName, cnstVal);

            // After the batch is complete process the email notifications
            _notificationsLib.SendEmailNotifications();
        }

        public void DeleteAdminConstant(AdminConstant data)
        {
            if (data == null) return;

            // In proc delete operation requires only SID, if we pass CNST_NM, operation fails
            var adminConstant = new AdminConstant { CNST_SID = data.CNST_SID };
            _constantLookupDataLib.SetAdminConstants(CrudModes.Delete, adminConstant);
        }

        #endregion Constants Admin
    }
}