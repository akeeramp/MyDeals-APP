using System.Collections.Generic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using System;
using System.Linq;
using Intel.MyDeals.BusinessRules;
using Intel.MyDeals.DataLibrary;

namespace Intel.MyDeals.BusinessLogic
{
    public class MeetCompLib : IMeetCompLib
    {
        private readonly IMeetCompDataLib _meetCompCollectorLib;

        public MeetCompLib(IMeetCompDataLib meetCompCollectorLib)
        {
            _meetCompCollectorLib = meetCompCollectorLib;
        }

        public MeetCompLib()
        {
            _meetCompCollectorLib = new MeetCompDataLib();
        }

        /// <summary>
        /// Get All Meet Comp Data
        /// </summary>
        /// <returns>List of all Meet Comp data</returns>
        public List<MeetComp> GetMeetCompData(int CUST_MBR_SID, string PRD_CAT_NM, string BRND_NM, string HIER_VAL_NM)
        {
            // TODO :Later need to decide caching will be apply or not
            return _meetCompCollectorLib.GetMeetCompData(CUST_MBR_SID, PRD_CAT_NM, BRND_NM, HIER_VAL_NM);
        }

        public List<MEET_COMP_DIM> GetMeetCompDIMData(int CUST_MBR_SID, string MODE)
        {
            // TODO :Later need to decide caching will be apply or not
            return _meetCompCollectorLib.GetMeetCompDIMData(CUST_MBR_SID, MODE);
        }

        public MeetCompValidation ValidateMeetComps(List<MeetComp> lstMeetComp)
        {
            MeetCompValidation meetCompValidation = new MeetCompValidation();
            //Note: Taking more time load data from cache
            //List<string> lstRtn = new List<string>();
            //IEnumerable<Product> lstProductFromCache = new ProductsLib().GetProducts(true).Where(x => x.PRD_ATRB_SID == 7006 || x.PRD_ATRB_SID == 7007);
            //lstRtn.AddRange(lstProductFromCache.Where(x => x.PRD_ATRB_SID == 7006 && lstProducts.Contains(x.PCSR_NBR.ToLower())).Select(x => x.PCSR_NBR).ToList());
            //lstRtn.AddRange(lstProductFromCache.Where(x => x.PRD_ATRB_SID == 7007 && lstProducts.Contains(x.DEAL_PRD_NM.ToLower())).Select(x => x.DEAL_PRD_NM).ToList());
            //return lstRtn.Distinct().ToList();
            lstMeetComp = lstMeetComp.Distinct(new DistinctItemComparerMeetComp()).ToList();
            meetCompValidation.IsEmptyCustomerAvailable = lstMeetComp.Where(x => x.CUST_NM.Trim() == string.Empty).Count() > 0;
            meetCompValidation.IsEmptyMeetCompPriceAvailable = lstMeetComp.Where(x => x.MEET_COMP_PRC <= 0).Count() > 0;
            meetCompValidation.IsEmptyMeetCompSkuAvailable = lstMeetComp.Where(x => x.MEET_COMP_PRD.Trim() == string.Empty).Count() > 0;
            meetCompValidation.IsEmptyProductAvailable = lstMeetComp.Where(x => x.HIER_VAL_NM.Trim() == string.Empty).Count() > 0;
            meetCompValidation.InValidCustomers = lstMeetComp.Select(x => x.CUST_NM.Trim().ToLower()).Except(DataCollections.GetMyCustomers().CustomerInfo.Select(x => x.CUST_NM.ToLower())).Where(x => x != string.Empty).ToList();
            List<MeetCompProductValidation> lstValidatedProducts = _meetCompCollectorLib.GetValidProducts(lstMeetComp.Select(x => x.HIER_VAL_NM).ToList());
            meetCompValidation.InValidProducts = lstMeetComp.Select(x => x.HIER_VAL_NM.Trim().ToLower()).Except(lstValidatedProducts.Select(x => x.ProductName).ToList()).ToList();
            meetCompValidation.ProductsRequiredBench = lstMeetComp.Where(x => x.IA_BNCH <= 0 || x.COMP_BNCH <= 0).Select(x => x.HIER_VAL_NM.Trim().ToLower()).Intersect(lstValidatedProducts.Where(x => x.IsServerProduct).Select(x => x.ProductName)).ToList();
            meetCompValidation.IsInvalidIABenchAvailable = lstMeetComp.Where(x => x.IA_BNCH <= 0 && meetCompValidation.ProductsRequiredBench.Contains(x.HIER_VAL_NM.Trim().ToLower())).Count() > 0;
            meetCompValidation.IsInvalidCompBenchAvailable = lstMeetComp.Where(x => x.COMP_BNCH <= 0 && meetCompValidation.ProductsRequiredBench.Contains(x.HIER_VAL_NM.Trim().ToLower())).Count() > 0;
            meetCompValidation.HasInvalidMeetComp = meetCompValidation.InValidCustomers.Count > 0
                || meetCompValidation.InValidProducts.Count > 0
                || meetCompValidation.IsEmptyCustomerAvailable
                || meetCompValidation.IsEmptyMeetCompPriceAvailable
                || meetCompValidation.IsEmptyMeetCompSkuAvailable
                || meetCompValidation.IsEmptyProductAvailable
                || meetCompValidation.IsInvalidIABenchAvailable
                || meetCompValidation.IsInvalidCompBenchAvailable;

            if (meetCompValidation.HasInvalidMeetComp)
            {
                //To show in UI with orders
                meetCompValidation.ValidatedMeetComps = new List<MeetComp>();
                if (meetCompValidation.IsEmptyCustomerAvailable)
                    meetCompValidation.ValidatedMeetComps.AddRange(lstMeetComp.Where(x => x.CUST_NM.Trim() == string.Empty));
                if (meetCompValidation.IsEmptyProductAvailable)
                    meetCompValidation.ValidatedMeetComps.AddRange(lstMeetComp.Where(x => x.HIER_VAL_NM.Trim() == string.Empty));
                if (meetCompValidation.IsEmptyMeetCompSkuAvailable)
                    meetCompValidation.ValidatedMeetComps.AddRange(lstMeetComp.Where(x => x.MEET_COMP_PRD.Trim() == string.Empty));
                if (meetCompValidation.IsEmptyMeetCompPriceAvailable)
                    meetCompValidation.ValidatedMeetComps.AddRange(lstMeetComp.Where(x => x.MEET_COMP_PRC <= 0));
                if (meetCompValidation.InValidCustomers.Count > 0)
                    meetCompValidation.ValidatedMeetComps.AddRange(lstMeetComp.Where(x => meetCompValidation.InValidCustomers.Contains(x.CUST_NM.Trim().ToLower())));
                if (meetCompValidation.InValidProducts.Count > 0)
                    meetCompValidation.ValidatedMeetComps.AddRange(lstMeetComp.Where(x => meetCompValidation.InValidProducts.Contains(x.HIER_VAL_NM.Trim().ToLower())));
                if (meetCompValidation.IsInvalidIABenchAvailable || meetCompValidation.IsInvalidCompBenchAvailable)
                    meetCompValidation.ValidatedMeetComps.AddRange(lstMeetComp.Where(x => (x.IA_BNCH <= 0 || x.COMP_BNCH <= 0) && meetCompValidation.ProductsRequiredBench.Contains(x.HIER_VAL_NM.Trim().ToLower())));

                meetCompValidation.ValidatedMeetComps.AddRange(lstMeetComp);
                meetCompValidation.ValidatedMeetComps = meetCompValidation.ValidatedMeetComps.Distinct(new DistinctItemComparerMeetComp()).ToList();
            }
            else
            {
                meetCompValidation.ValidatedMeetComps = lstMeetComp;
            }

            return meetCompValidation;
        }

        public bool UploadMeetComp(List<MeetComp> lstMeetComp)
        {
            return _meetCompCollectorLib.UploadMeetComp(lstMeetComp);
        }

        /// <summary>
        /// Activate/Deactivate Meet Comp Records.
        /// </summary>
        /// <param name="MEET_COMP_SID"></param>
        /// <param name="ACTV_IND"></param>
        /// <returns></returns>
        public List<MeetComp> ActivateDeactivateMeetComp(int MEET_COMP_SID, bool ACTV_IND)
        {
            // TODO :Later need to decide caching will be apply or not
            return _meetCompCollectorLib.ActivateDeactivateMeetComp(MEET_COMP_SID, ACTV_IND);
        }

        /// <summary>
        /// Manage Meet Comp TAB
        /// </summary>
        /// <param name="CNTRCT_OBJ_SID"></param>
        /// <returns></returns>
        public List<MeetCompResult> GetMeetCompProductDetails(int CNTRCT_OBJ_SID, string MODE, int OBJ_TYPE_ID)
        {
            // TODO :Later need to decide caching will be apply or not
            List<MeetCompResult> data = _meetCompCollectorLib.GetMeetCompProductDetails(CNTRCT_OBJ_SID, MODE, OBJ_TYPE_ID);
            dynamic[] dynData = data.Cast<dynamic>().ToArray();
            MyRulesConfiguration.ApplyRules(dynData, MyRulesTrigger.OnLoadMeetComp);
            List<MeetCompResult> retData = dynData.Cast<MeetCompResult>().ToList();
            return retData;
        }

        /// <summary>
        /// Manage Meet Comp TAB
        /// </summary>
        /// <param name="CNTRCT_OBJ_SID"></param>
        /// <returns></returns>
        public List<MeetCompResult> UpdateMeetCompProductDetails(int CNTRCT_OBJ_SID, int OBJ_TYPE_ID, List<MeetCompUpdate> mcu)
        {
            var data = _meetCompCollectorLib.UpdateMeetCompProductDetails(CNTRCT_OBJ_SID, OBJ_TYPE_ID, mcu);

            // Update also does a get operation, thus apply rules here
            dynamic[] dynData = data.Cast<dynamic>().ToArray();
            MyRulesConfiguration.ApplyRules(dynData, MyRulesTrigger.OnLoadMeetComp);
            List<MeetCompResult> retData = dynData.Cast<MeetCompResult>().ToList();
            return retData;
        }

        public List<DealDeatils> GetDealDetails(int DEAL_OBJ_SID, int GRP_PRD_SID, string DEAL_PRD_TYPE)
        {
            return _meetCompCollectorLib.GetDealDetails(DEAL_OBJ_SID, GRP_PRD_SID, DEAL_PRD_TYPE);
        }
    }
}