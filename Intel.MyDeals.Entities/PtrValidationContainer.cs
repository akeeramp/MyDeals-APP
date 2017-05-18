using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.Entities
{
	public class PtrValidationContainer
	{
		public Dictionary<int, Dictionary<string, List<string>>> ColumnErrors { get; set; } // Key: Column name, Value: list of errors associated with the key
		public ProductLookup ProductLookup { get; set; }
	}
}
