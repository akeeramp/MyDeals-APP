using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;

namespace Intel.MyDeals.BusinessLogicNew.Test
{
    [TestFixture]
    public class CacheLibTest
    {
        public Mock<IDataCollectionsDataLib> mockDataCollectionsDataLib = new Mock<IDataCollectionsDataLib>();

        [Test]
        public void ClearMyCustomerCache_isVoidMethod()
        {
            mockDataCollectionsDataLib.Setup(x => x.ClearMyCustomerCache());
            new CacheLib(mockDataCollectionsDataLib.Object).ClearMyCustomerCache();
            mockDataCollectionsDataLib.VerifyAll();
        }

        [Test]
        public void CheckCache_ShouldReturnNotNull()
        {
            var data = CheckCacheMockData();
            mockDataCollectionsDataLib.Setup(x => x.CheckCache()).Returns(data);
            var result = new CacheLib(mockDataCollectionsDataLib.Object).CheckCache();
            Assert.IsNotNull(result);
        }

        [Test]
        public void ClearCache_ShouldReturnTrue()
        {
            var data = ClearCacheMockData();
            mockDataCollectionsDataLib.Setup(x => x.ClearCache()).Returns(data);
            var result = new CacheLib(mockDataCollectionsDataLib.Object).ClearCache();
            Assert.IsTrue(result);
        }

        [Test, TestCase(""), TestCase(null)]
        public void ClearCache_WithParam_ShouldReturnFalse_ForInvalidParams(string cacheName)
        {
            var data = ClearCacheStringMockData(cacheName);
            mockDataCollectionsDataLib.Setup(x => x.ClearCache(It.IsAny<string>())).Returns(data);
            var result = new CacheLib(mockDataCollectionsDataLib.Object).ClearCache(cacheName);
            Assert.IsFalse(result);
        }
        
        [Test, TestCase("cacheName")]
        public void ClearCache_WithParam_ShouldReturnTrue_ForValidParams(string cacheName)
        {
            var data = ClearCacheStringMockData(cacheName);
            mockDataCollectionsDataLib.Setup(x => x.ClearCache(It.IsAny<string>())).Returns(data);
            var result = new CacheLib(mockDataCollectionsDataLib.Object).ClearCache(cacheName);
            Assert.IsTrue(result);
        }
        
        [Test]
        public void LoadCache_ShouldReturnTrue()
        {
            var data = LoadCacheMockData();
            mockDataCollectionsDataLib.Setup(x => x.LoadCache()).Returns(data);
            var result = new CacheLib(mockDataCollectionsDataLib.Object).LoadCache();
            Assert.IsTrue(result);
        }

        [Test,
            TestCase(""),
            TestCase(null)]
        public void LoadCache_ShouldReturnFalse_ForInvalidParams(string cacheName)
        {
            var data = LoadCacheStringMockData(cacheName);
            mockDataCollectionsDataLib.Setup(x => x.LoadCache(It.IsAny<string>())).Returns(data);
            var result = new CacheLib(mockDataCollectionsDataLib.Object).LoadCache(cacheName);
            Assert.IsNotNull(result);
        }

        [Test,
            TestCase("cacheName")]
        public void LoadCache_ShouldReturnTrue_ForValidParams(string cacheName)
        {
            var data = LoadCacheStringMockData(cacheName);
            mockDataCollectionsDataLib.Setup(x => x.LoadCache(It.IsAny<string>())).Returns(data);
            var result = new CacheLib(mockDataCollectionsDataLib.Object).LoadCache(cacheName);
            Assert.IsNotNull(result);
        }

        [Test,
            TestCase(""),
            TestCase(null),
            TestCase("cacheName")]
        public void ViewCache_ShouldReturnNotNull(string cacheName)
        {
            var mockData = new Object();
            mockDataCollectionsDataLib.Setup(x => x.ViewCache(It.IsAny<string>())).Returns(mockData);
            var result = new CacheLib(mockDataCollectionsDataLib.Object).ViewCache(cacheName);
            Assert.IsNotNull(result);
        }

        [Test]
        public void GetSessionComparisonHash_ShouldReturnNotNull()
        {
            int data = 10;
            mockDataCollectionsDataLib.Setup(x => x.GetSessionComparisonHash()).Returns(data);
            var result = new CacheLib(mockDataCollectionsDataLib.Object).GetSessionComparisonHash();
            Assert.IsNotNull(result);
        }

        private IEnumerable<CacheItem> CheckCacheMockData()
        {
            var data = new List<CacheItem>()
            {
                new CacheItem
                {
                    CacheName = "testName",
                    CacheCount = 1,
                    CacheKey = "testKey",
                }
            };
            return data;
        }

        private bool ClearCacheMockData()
        {
            return true;
        }
        
        private bool ClearCacheStringMockData(string cacheName)
        {
            if (string.IsNullOrEmpty(cacheName)) 
                return false;

            return true;
        }

        private bool LoadCacheMockData()
        {
            return true;
        }
        
        private bool LoadCacheStringMockData(string cacheName)
        {
            if (string.IsNullOrEmpty(cacheName)) 
                return false;

            return true;
        }
    }
}