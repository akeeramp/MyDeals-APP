(function () {
	'use strict';

	angular
        .module('app.admin')
        .controller('ManualsController', ManualsController)
        .run(SetRequestVerificationToken);

	SetRequestVerificationToken.$inject = ['$http'];

	ManualsController.$inject = ['MyDealsManualService', '$scope', 'logger', '$location', 'gridConstants', '$compile', '$sce'];

	function ManualsController(MyDealsManualService, $scope, logger, $location, gridConstants, $compile, $sce) {
		//var vm = this; // VM is a cross page thing, scope is page by page
		// This is Angular SPA Client side controller - .js = client side
		//vm.loadContent = loadContent;

		$scope.arrayOfTopics = [];
		$scope.myPageContent = "Loading"; // put some pretty gif here
		$scope.currTopic = "";
		$scope.blah = "";
		$scope.currTopicId = 0;

		MyDealsManualService.GetNavigationItems() // This is async call - then is run after round trip, client is still processing - after 21
            .then(function (response) {
                LoadMyNavigationPanelData(response);
            }, function (response) {
                logger.error("Unable to get Manual Navigation Items.", response, response.statusText);
            });

		$scope.to_trusted = function () {
			return $sce.trustAsHtml($scope.myPageContent);
		}

		$scope.loadContent = function (topic) {
			//console.log("loadContent ", topic)
			$scope.currTopic = topic;

			//public string GetManualPageData(string pageLabel)
			MyDealsManualService.GetManualPageData(topic) // This is async call - then is run after round trip, client is still processing - after 21
            .then(function (response) {
            	$scope.myPageContent = response.data;
            }, function (response) {
            	logger.error("Unable to get Manual Navigation Items.", response, response.statusText);
            });
		}

		function LoadMyNavigationPanelData(response)
		{
			var arrayOfTopics = response.data;
			var page = "";
			var currTopic = "";
			for (var i = 0; i < arrayOfTopics.length; i++) {
				var object = arrayOfTopics[i];
				if (object.PARNT == 0) {
					if (currTopic != "") {
						page += "</ul>";
					}
					currTopic = object.REF_LNK;
					page += "<li><a data-toggle='collapse' href='javascript:;' id='#" + currTopic + "' data-target='#" + currTopic + "' ng-click='loadContent(\"" + object.REF_LNK + "\");'>" + object.REF_TTL + "<i class='fa expansion-indicator pull-right fa-chevron-down'></i></a></li>";
					page += "<ul id='" + currTopic + "' class='panel-collapse collapse' style='list-style: none; font-size: 12px; margin-left: -25px'>";
				}
				else {
					page += "<li><a class='handbook-link' ng-class='currTopic==\"" + object.REF_LNK + "\"? \"selected-link\": \"\"' id='" + object.REF_LNK + "' href='Admin#/MyDealsManual?topic=intro#" + object.REF_LNK + "' ng-click='loadContent(\"" + object.REF_LNK + "\");'>" + object.REF_TTL + "</a></li>";
				}
			}
			page += "</ul>";

			//console.log("page ", page)
			//$("#myList").html(page); // Old code - We added HTML to the DOM, now bind scope to DOM (new code below)
			var angularElementMyList = angular.element(page); // Add new HTML to angular elements list
			var linkFunction = $compile(angularElementMyList); // Compile any embedded JS
			var el = linkFunction($scope); // Add it all to the current scope
			angular.element('#myList').append(angularElementMyList); // Append all of the new HTML we added to nav panel here

			$('a[data-toggle]').click(function (event) {
				var clickedLink = $(this);
				if ($(clickedLink).find('i').hasClass('fa-chevron-down')) {
					$(clickedLink).find('i').addClass('fa-chevron-up').removeClass('fa-chevron-down');
				}
				else {
					$(clickedLink).find('i').addClass('fa-chevron-down').removeClass('fa-chevron-up');
				}
			});
		}


		//	var matchStr = 'a[href$="' + target + '"]'; // HREF based search of DOM
		//	if ($(matchStr).length > 0) // See if the matchstring is located in DOM
		//	{
		//		$(matchStr).trigger('click');

		//		// Expand the contents to show the correct selected item
		//		var divId = $(matchStr).closest('.panel-collapse').attr('id');
		//		var matchStr = 'a[id$="#' + divId + '"]'; // ID based search of DOM
		//		$(matchStr).trigger('click');

		// If topic ensits in URL, set it, otherwise, set to Default, then load content panel
		var myURL = $location.url();
		console.log("URL = ", myURL);
		var target = myURL.indexOf('#') > 0 ? myURL.substring(myURL.indexOf('#') + 1) : "";
		if (target.length > 0) // Target if passed will be "#tagname"
		{
			$scope.currTopic = target;
		}
		else
		{
			$scope.currTopic = "Default";
			//console.log("No Target = ", target);
        }
		$scope.loadContent($scope.currTopic);

	}
})();