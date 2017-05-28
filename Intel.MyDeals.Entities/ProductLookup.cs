using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.Entities
{
    public class ProductLookup
    {
        /// <summary>
        /// Translated key value pair for single row
        /// </summary>
        public Dictionary<string, List<string>> ProdctTransformResults { get; set; }

        /// <summary>
        /// e.g. Dictionary<userinput, Dictionary<singleProduct, List<singleProductDuplicates>>>
        /// </summary>
        public Dictionary<string, Dictionary<string, List<PRD_LOOKUP_RESULTS>>> DuplicateProducts { get; set; }

        /// <summary>
        /// Valid products for each row, where key(string) is row input
        /// </summary>
        public Dictionary<string, Dictionary<string, List<PRD_LOOKUP_RESULTS>>> ValidProducts { get; set; }

        /// <summary>
        /// InValid products for each row, where key(string) is row input
        /// </summary>
        public Dictionary<string, List<string>> InValidProducts { get; set; }
    }

	/// TODO: Note for Mahesh/Kaurav - Please replace and remove this when the model is finished
	public class ProductLookup_tempWithCAP
	{
		/// <summary>
		/// Translated key value pair for single row
		/// </summary>
		public Dictionary<string, List<string>> ProdctTransformResults { get; set; }

		/// <summary>
		/// e.g. Dictionary<userinput, Dictionary<singleProduct, List<singleProductDuplicates>>>
		/// </summary>
		public Dictionary<string, Dictionary<string, List<PRD_LOOKUP_RESULTS>>> DuplicateProducts { get; set; }

		/// <summary>
		/// Valid products for each row, where key(string) is row input
		/// </summary>
		public Dictionary<string, List<PRD_LOOKUP_RESULTS_tempWithCAP>> ValidProducts { get; set; }

		/// <summary>
		/// InValid products for each row, where key(string) is row input
		/// </summary>
		public Dictionary<string, List<string>> InValidProducts { get; set; }
	}

}