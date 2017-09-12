using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{
	public interface IUserPreferencesLib
	{
        List<UserPreferences> GetUserPreferences(string category, string subCategory);
        List<UserPreferences> UpdateUserPreferences(string category, string subCategory, string key, string value);
    }
}