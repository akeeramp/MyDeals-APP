/* 
 * General common javascript extensions that can be utilized in all js files
 */


// Check if an array contains the parameter
Array.prototype.contains = function (obj) {
	var i = this.length;
	while (i--) {
		if (this[i] === obj) {
			return true;
		}
	}
	return false;
}

// check if an element exists in array using a comparer function 
// comparer : function(currentElement)
Array.prototype.inArray = function (comparer) {
	for (var i = 0; i < this.length; i++) {
		if (comparer(this[i])) return true;
	}
	return false;
};

// adds an element to the array if it does not already exist using a comparer function
Array.prototype.pushIfNotExist = function (element, comparer) {
	if (!this.inArray(comparer)) {
		this.push(element);
	}
};