// SUMMARY:		Loading panel that fills the enitre parent's height and width.
// EXAMPLE USAGE:	 <loading-panel show="true" header="'TEST'" description="'hello'" msg-type="'Info'" is-show-fun-fact="false"></loading-panel>

angular
    .module('app.core')
    .directive('loadingPanel', loadingPanel);

loadingPanel.$inject = ['funfactService', 'logger'];

function loadingPanel(funfactService, logger) {
	return {
		scope: {
			show: '=',
			header: '=',
			description: '=',
			msgType: '=',
			isShowFunFact: '='
		},
		restrict: 'E',
		transclude: 'true',
		templateUrl: '/app/core/directives/loadingPanel/loadingPanel.directive.html',
		controller: ['$scope', function($scope) {

		    // Fun facts
		    $scope.funfactsList = [];
			$scope.funFactTitle = "";
			$scope.funFactDesc = "";
			$scope.funFactIcon = "";

            // Enable or Disable Fun Facts
			$scope.isFunFactEnabled = true;

			$scope.GetRandomFact = function () {
			    if ($scope.isFunFactEnabled == true) {
			        if ($scope.funfactsList == null || $scope.funfactsList.length == 0) {
			            funfactService.GetActiveFunfacts()
                                .then(function (response) {
                                    //if no facts are loaded disable fun facts. facts will remain disabled until a page refresh
                                    if (response.data.length == 0) {
                                        $scope.isFunFactEnabled = false;
                                    } else {
                                        for (var i = 0; i < response.data.length; i++) {
                                            $scope.funfactsList.push(
                                                {
                                                    "Title": response.data[i]["FACT_HDR"],
                                                    "Description": response.data[i]["FACT_TXT"],
                                                    "FontAwesomeIcon": "fa-" + response.data[i]["FACT_ICON"]
                                                }
                                            )
                                        }
                                        setFacts();
                                    }

                                }, function (response) {
                                    logger.error("Unable to get Funfact.", response, response.statusText);
                                });
			        } else {
			            setFacts()
			        }
			    }
			}

			var setFacts = function () {
			    //select a random fact from the pool of available facts
			    $scope.currFunFact = $scope.funfactsList[Math.floor(Math.random() * $scope.funfactsList.length)];

			    if (!$scope.currFunFact.Title) {
			        $scope.currFunFact.Title = "Fun Fact";
			    }
			    $scope.funFactTitle = $scope.currFunFact.Title;
			    $scope.funFactDesc = $scope.currFunFact.Description.replace(/<br>/g, "\n");
			    $scope.funFactIcon = $scope.currFunFact.FontAwesomeIcon;
			}

		}],
		link: function (scope, element, attrs) { }
	};
}