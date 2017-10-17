using System.Collections.Generic;

namespace Intel.MyDeals.Entities
{
    public class ProductLookup
    {
        /// <summary>
        /// Translated key value pair for single row
        /// </summary>
        public Dictionary<string, Dictionary<string, List<string>>> ProdctTransformResults { get; set; }

        //public Dictionary<string, List<string>> ProdctTransformResults { get; set; }

        /// <summary>
        /// e.g. Dictionary<userinput, Dictionary<singleProduct, List<singleProductDuplicates>>>
        /// </summary>
        public Dictionary<string, Dictionary<string, List<PRD_TRANSLATION_RESULTS>>> DuplicateProducts { get; set; }

        /// <summary>
        /// Valid products for each row, where key(string) is row input
        /// </summary>
        public Dictionary<string, Dictionary<string, List<PRD_TRANSLATION_RESULTS>>> ValidProducts { get; set; }

        /// <summary>
        /// InValid products for each row, where key(string) is row input
        /// </summary>
        public Dictionary<string, Dictionary<string, List<string>>> InValidProducts { get; set; }
		//public Dictionary<string, List<string>> InValidProducts { get; set; }

		/// <summary>
		/// InValid columns that the product selector is dependant on
		/// </summary>
		public Dictionary<string, List<string>> InvalidDependancyColumns { get; set; }
	}
}