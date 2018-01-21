using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.BusinessLogic
{
    public class UserPreferencesLib : IUserPreferencesLib
    {
        private readonly IUserPreferencesDataLib _userPreferencesDataLib;
        
        public UserPreferencesLib()
        {
            _userPreferencesDataLib = new UserPreferencesDataLib();
        }

        public UserPreferencesLib(IUserPreferencesDataLib userPreferencesDataLib)
        {
            _userPreferencesDataLib = userPreferencesDataLib;
        }

        /// <summary>
        /// Get all user preferences for the current user
        /// </summary>
        /// <returns>list of UserPreferences</returns>
        public List<UserPreferences> GetUserPreferences(string category, string subCategory)
        {
            return _userPreferencesDataLib.GetUserPreferences(category, subCategory).ToList();
        }

        /// <summary>
        /// Get user preference by key for the current user
        /// </summary>
        /// <returns>Instance of UserPreferences</returns>
        public UserPreferences GetUserPreference(string category, string subCategory, string key)
        {
            return _userPreferencesDataLib.GetUserPreferences(category, subCategory).FirstOrDefault(k => k.PRFR_KEY == key);
        }

        /// <summary>
        /// Add/Update a single user preference (key-value pair) for the current user
        /// </summary>
        /// <returns>list of UserPreferences</returns>
        public List<UserPreferences> UpdateUserPreferences(string category, string subCategory, string key, string value)
        {
            return _userPreferencesDataLib.UpdateUserPreferences(category, subCategory, key, value).ToList();
        }
    }
}
