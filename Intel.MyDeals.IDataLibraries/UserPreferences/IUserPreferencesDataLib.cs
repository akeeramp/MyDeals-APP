using Intel.MyDeals.Entities;
using System.Collections.Generic;
using System;

namespace Intel.MyDeals.IDataLibrary
{
    public interface IUserPreferencesDataLib
    {
        List<UserPreferences> GetUserPreferences(string category, string subCategory);
        List<UserPreferences> UpdateUserPreferences(string category, string subCategory, string key, string value);
    }
}
