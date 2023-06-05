using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.BusinessLogicNew.Test
{
    [TestFixture]
    public class UserPreferencesLibTest
    {
        public Mock<IUserPreferencesDataLib> mockUserPreferencesDataLib = new Mock<IUserPreferencesDataLib> ();

        [Test,
            TestCase("ctg","subCtg")]
        public void GetUserPreferences_Returns_NotNull(string category, string subCategory)
        {
            var mockData = getUserPreferenceMockData();
            mockUserPreferencesDataLib.Setup(x=>x.GetUserPreferences(It.IsAny<string>(), It.IsAny<string>())).Returns(mockData);
            var result = new UserPreferencesLib(mockUserPreferencesDataLib.Object).GetUserPreferences(category, subCategory);
            Assert.IsNotNull(result);
            Assert.Greater(result.Count, 0);
        }

        [Test,
            TestCase("ctg","sub","key","val")]
        public void UpdateUserPreferences_Returns_NotNull(string category, string subCategory,string key, string value)
        {
            var mockData = getUserPreferenceMockData();
            mockUserPreferencesDataLib.Setup(x => x.UpdateUserPreferences(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>())).Returns(mockData);
            var result = new UserPreferencesLib(mockUserPreferencesDataLib.Object).UpdateUserPreferences(category, subCategory,key,value);
            Assert.IsNotNull(result);
            Assert.Greater(result.Count, 0);
        }

        [Test,
            TestCase("clr","ctg","sub-cat")]
        public void ClearUserPreferences_Returns_NotNull(string clearMode, string category, string subCategory)
        {
            var mockData = getUserPreferenceMockData();
            mockUserPreferencesDataLib.Setup(x => x.ClearUserPreferences( It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>())).Returns(mockData);
            var result = new UserPreferencesLib(mockUserPreferencesDataLib.Object).ClearUserPreferences(clearMode,category, subCategory);
            Assert.IsNotNull(result);
            Assert.Greater(result.Count, 0);
        }

        [Test,
            TestCase("abc","xyz","prfr_key")]
        public void GetUserPreference_Returns_NotNull_forMatchingKey(string category, string subCategory, string key)
        {
            var mockData = getMatchingUserPreference(key);
            mockUserPreferencesDataLib.Setup(x => x.GetUserPreferences(It.IsAny<string>(), It.IsAny<string>())).Returns(mockData);
            var result = new UserPreferencesLib(mockUserPreferencesDataLib.Object).GetUserPreference(category, subCategory, key);
            Assert.IsNotNull(result);
        }

        [Test,
            TestCase("abc", "xyz", "nonMatchingKey")]
        public void GetUserPreference_Returns_EmptyList_forNonMatchingKey(string category, string subCategory, string key)
        {
            var mockData = getMatchingUserPreference(key);
            mockUserPreferencesDataLib.Setup(x => x.GetUserPreferences(It.IsAny<string>(), It.IsAny<string>())).Returns(mockData);
            var result = new UserPreferencesLib(mockUserPreferencesDataLib.Object).GetUserPreference(category, subCategory, key);
            var resultList = new List<UserPreferences>();
            if(result!= null)
            {
                resultList.Add(result);
            }
            Assert.IsEmpty(resultList);
        }

        public List<UserPreferences> getMatchingUserPreference(string key)
        {
            var mockData = getUserPreferenceMockData();
            var result = mockData.FirstOrDefault(k => k.PRFR_KEY == key);
            if(result == null)
            {
                return new List<UserPreferences>();
            }
            return mockData;
        }

        public List<UserPreferences> getUserPreferenceMockData()
        {
            var mockData = new List<UserPreferences> { new UserPreferences
            {
                CHG_DTM =  new DateTime(2023, 01, 23, 20, 15, 00, 277),
                CHG_EMP_WWID = 23,
                CRE_DTM =  new DateTime(2023, 01, 23, 20, 15, 00, 277),
                CRE_EMP_WWID = 36,
                EMP_WWID = 567,
                PRFR_CAT = "prfr_cat",
                PRFR_KEY = "prfr_key",
                PRFR_SUB_CAT = "prfr_sub_cat",
                PRFR_VAL = "prfr_val"
            } };
            return mockData;
        }
    }
}
