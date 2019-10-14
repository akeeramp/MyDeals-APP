(function () {
	'use strict';

	angular
        .module('app.admin')
        .controller('ManualsController', ManualsController)
        .run(SetRequestVerificationToken);

	SetRequestVerificationToken.$inject = ['$http'];

	ManualsController.$inject = ['MyDealsManualService', '$scope', 'logger', '$location', 'gridConstants'];

	function ManualsController(MyDealsManualService, $scope, logger, $location, gridConstants) {
		var vm = this;

		$scope.arrayOfTopics = [];

		var testme = MyDealsManualService.GetNavigationItems()
                        .then(function (response) {
                        	var arrayOfTopics = response.data;

                        	var page = "";
                        	var currTopic = "";
                        	for (var i = 0; i < arrayOfTopics.length; i++) {
                        		var object = arrayOfTopics[i];
                        		if (object.Parent == 0) {
                        			if (currTopic != "") {
                        				page += "</ul>";
                        			}
                        			currTopic = object.Link;
                        			page += "<li><a data-toggle='collapse' href='javascript:;' id='#" + currTopic + "' data-target='#" + currTopic + "'>" + object.Title + "<i class='fa expansion-indicator pull-right fa-chevron-down'></i></a></li>";
                        			page += "<ul id='" + currTopic + "' class='panel-collapse collapse' style='list-style: none; font-size: 12px; margin-left: -25px'>";
                        		}
                        		else {
                        			page += "<li><a class='handbook-link' id='" + object.Link + "' href='Admin#/MyDealsManual?topic=intro#" + object.Link + "' onclick='javascript:loadContent(" + "\"" + object.Title + "\"" + ");'>" + object.Title + "</a></li>";
                        		}
                        	}
                        	page += "</ul>";

                        	$("#myList").html(page);

                        	$('a[data-toggle]').click(function (event) {
                        		var clickedLink = $(this);
                        		if ($(clickedLink).find('i').hasClass('fa-chevron-down')) {
                        			$(clickedLink).find('i').addClass('fa-chevron-up').removeClass('fa-chevron-down');
                        		}
                        		else {
                        			$(clickedLink).find('i').addClass('fa-chevron-down').removeClass('fa-chevron-up');
                        		}
                        	});

                        	// When a sub menu item is selected, add class that will allow the style to be changed. (.handbook-link.selected-link)
                        	$('.handbook-link').click(function (event) {
                        		var clickedLink = $(this);
                        		$(".handbook-link").removeClass('selected-link');
                        		clickedLink.addClass('selected-link');
                        	});

                        	var myURL = document.location.href.substring(document.location.href.indexOf('MyDealsManual'));
                        	// If the page is called from some other location, expand the selected content and pre-load it.
                        	if (myURL.indexOf("#") >= 0 && myURL.indexOf("?topic") >= 0) {
                        		var target = myURL.indexOf('#') > 0 ? myURL.substring(myURL.indexOf('#')) : "";
                        		if (target.length > 0) // Target if passed will be "#tagname"
                        		{
                        			// Pre-load the selected content
                        			var matchStr = 'a[href$="' + target + '"]'; // HREF based search of DOM
                        			if ($(matchStr).length > 0) // See if the matchstring is located in DOM
                        			{
                        				$(matchStr).trigger('click');

                        				// Expand the contents to show the correct selected item
                        				var divId = $(matchStr).closest('.panel-collapse').attr('id');
                        				var matchStr = 'a[id$="#' + divId + '"]'; // ID based search of DOM
                        				$(matchStr).trigger('click');
                        			}
                        			else {
                        				alert('Specified help topic ' + target + ' not found.');
                        			}
                        		}
                        	}
                        	else {
                        		//alert("Bypass it");
                        	}


                        	//console.log("test2", $scope.arrayOfTopics)
                        	e.success(response.data);
                        }, function (response) {
                        	logger.error("Unable to get Manual Navigation Items.", response, response.statusText);
                        });
		$scope.blahme = "Hello";
		vm.tester = "There:";
	}
})();