using Intel.Opaque;
using System;

namespace Intel.MyDeals.Entities.Logging
{
	/// <summary>
	/// Web Api Paths. This is a workaround so that the Entities layer can send data to the DataLibrary. 
	/// </summary>
	public static class MyDealsWebApiUrl
	{

		public static Func<string> RootURLResolver { set; get; }

		public static string ROOT_URL
		{
			set
			{
				_ROOT_URL = value;
			}
			get
			{
				if (String.IsNullOrEmpty(_ROOT_URL))
				{
					if (RootURLResolver != null)
					{
						_ROOT_URL = RootURLResolver();
					}
				}
				return _ROOT_URL;
			}
		}
		private static string _ROOT_URL;
		
		public static OpAsyncWait WebApi
		{
			get
			{
				return new OpAsyncWait(ROOT_URL);
			}
		}

		private const string ROOT_SUB_PATH = "/api/";
		

		// API paths
		public const string UploadLogPrefLogs = ROOT_SUB_PATH + @"Logging/UploadLogPrefLogs";




	}
}
