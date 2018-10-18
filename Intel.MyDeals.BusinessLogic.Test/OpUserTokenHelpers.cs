using Intel.MyDeals.DataLibrary.Test;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;

namespace Intel.MyDeals.BusinessLogic.Test

{
    [TestClass]
    public class OpUserTokenHelpers
    {
        private readonly OpUserToken _opUserToken = null;

        public OpUserTokenHelpers()
        {
            // UnitTester is NOT SA/Developer or Tester
            OpUserStack.EmulateUnitTester();
            _opUserToken = OpUserStack.MyOpUserToken;
            UnitTestHelpers.SetDbConnection();
        }

        [TestMethod]
        public void OpUserToken_UserHasExtendedAttributes()
        {
            Assert.IsFalse(_opUserToken.IsSuper());
            Assert.IsFalse(_opUserToken.IsDeveloper());
            Assert.IsFalse(_opUserToken.IsTester());
        }

        [TestMethod]
        public void AccountsLib_SetUserAccessLevel()
        {
            // TO DO: Once AccountsLib is fleshed out, put meaningful test cases in place here
            // Check GetCustomerDivisions returns as expected
            new AccountsLib().SetUserAccessLevel(_opUserToken);
            Assert.IsTrue(1 == 1);
        }


        [TestMethod]
        public void CacheLib_UserHasExtendedAttributes()
        {
            // Check CheckCache returns as expected
            IEnumerable<CacheItem> cacheReturn = new CacheLib().CheckCache();
            Assert.IsNotNull(cacheReturn);

            // Very expensive call, 2 minutes plus...
            //bool cacheLoaded = new CacheLib().LoadCache();
            //Assert.IsTrue(cacheLoaded);

            //bool cacheCleared = new CacheLib().ClearCache();
            //Assert.IsTrue(cacheCleared);

            // Check loading a specific cache, _getAtrbMstrs
            string cacheName = "_getAtrbMstrs";
            bool cacheLoaded = new CacheLib().LoadCache(cacheName);
            Assert.IsTrue(cacheLoaded);

            object cacheView = new CacheLib().ViewCache(cacheName);
            Assert.IsNotNull(cacheView);

            // Check clearing a specific cache
            bool cacheCleared = new CacheLib().ClearCache(cacheName);
            Assert.IsTrue(cacheCleared);

            cacheView = new CacheLib().ViewCache(cacheName);
            Assert.IsNull(cacheView);


            // TO DO: Test to be completed once we figure out how to load MyCustomers for Test User token - Call blows up on token not like it is set up in UI
            //new CacheLib().ClearMyCustomerCache();
            //Assert.IsTrue(1 == 1);


            // Check GetSessionComparisonHash function
            int returnVal = new CacheLib().GetSessionComparisonHash();
            Assert.IsTrue(returnVal != 0);
        }

    }
}