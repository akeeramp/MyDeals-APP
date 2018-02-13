// SUMMARY:		Loading panel that fills the enitre parent's height and width. 
// EXAMPLE USAGE:	 <loading-panel show="true" header="'TEST'" description="'hello'" msg-type="'Info'" is-show-fun-fact="false"></loading-panel>

angular
    .module('app.core')
    .directive('loadingPanel', loadingPanel);

loadingPanel.$inject = [];

function loadingPanel() {
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
			console.log("TEST: " + ($scope.msgType));

			// Fun facts
			$scope.funFactTitle = "";
			$scope.funFactDesc = "";
			$scope.funFactIcon = "";

			$scope.GetRandomFact = function () {

				// Get a random number between min (inclusive) and max (exclusive)
				var min = 0;
				var index = Math.floor(Math.random() * (($scope.funfactsList.length) - min)) + min;
				$scope.currFunFact = $scope.funfactsList[index];


				if (!$scope.currFunFact.Title) {
					$scope.currFunFact.Title = "Random Fun Fact";
				}
				$scope.funFactTitle = $scope.currFunFact.Title;
				$scope.funFactDesc = $scope.currFunFact.Description;
				$scope.funFactIcon = $scope.currFunFact.FontAwesomeIcon;
			}

			$scope.funfactsList = [
				{
					"Title": "Random Fun Fact",
					"Description": "There is an average of 50,000 spiders per acre in green areas.",
					"FontAwesomeIcon": "fa-bug"
				},
				{
					"Description": "Cats and horses are highly susceptible to black widow venom, but dogs are relatively resistant. Sheep and rabbits are apparently immune.",
					"FontAwesomeIcon": "fa-flask"
				},
				{
					"Description": "Octopuses have eight arms and three hearts.",
					"FontAwesomeIcon": "fa-heart"
				},
				{
					"Description": "Owls don't have eyeballs. They have eye tubes.",
					"FontAwesomeIcon": "fa-eye-slash"
				},
				{
					"Description": "Dogs' sense of smell are about 100,000 times stronger than humans', but they have only one-sixth the number of taste buds.",
					"FontAwesomeIcon": "fa-paw"
				},
				{
					"Description": 'A supercolony of invasive Argentine ants, known as the "California large," covers 560 miles of the U.S. West Coast. The colony is currently engaged in a turf war with a nearby supercolony in Mexico.',
					"FontAwesomeIcon": "fa-bug"
				},
				{
					"Description": "A single strand of spider silk is thinner than a human hair, but also five times stronger than steel of the same width. A rope just 2 inches thick could reportedly stop a Boeing 747.",
					"FontAwesomeIcon": "fa-plane"
				},
				{
					"Description": "Warmer weather causes more turtles to be born female than male.",
					"FontAwesomeIcon": "fa-venus"
				},
				{
					"Description": 'Male gentoo and Adelie penguins "propose" to females by giving them a pebble.',
					"FontAwesomeIcon": "fa-diamond"
				},
				{
					"Description": "Less time separates the existence of humans and the tyrannosaurus rex than the T-rex and the stegosaurus.",
					"FontAwesomeIcon": "fa-hourglass"
				},
				{
					"Description": "In winter, a Reindeer's eyeballs will turn blue. This helps them see at lower light levels.",
					"FontAwesomeIcon": "fa-eye"
				},
				{
					"Description": "The toothfairy isn't real. She just isn't.",
					"FontAwesomeIcon": "fa-graduation-cap"
				},
				{
					"Description": "Sharks kill less than 10 people per year. Humans kill about 100 million sharks per year.",
					"FontAwesomeIcon": "fa-tint"
				},
				{
					"Description": "The saliva of a Komodo dragon harvests more than 50 types of bacteria. Animals bitten by the lizard typically die within 24 hours from blood poisoning — if they aren't eaten first.",
					"FontAwesomeIcon": "fa-flask"
				},
				{
					"Description": "Some Reindeer have knees that make a clicking sound when they walk. It helps them keep together in a blizzard.",
					//"FontAwesomeIcon": "fa-snowflake"
				},
				{
					"Description": "A giraffe's age can be calculated from its spots. The darker the spots, the older the giraffe."
				},
				{
					"Description": "If a Sun Bear is grabbed or bitten on its head, it can turn around using the wrinkly skin on its head to bite the predator back.",
					"FontAwesomeIcon": "fa-paw"
				},
				{
					"Description": "Over the winter the arctic fox has a heavy white coat, but in the summer their fur coat is shed for a thinner, two-tone brown pelage.",
					//"FontAwesomeIcon": "fa-snowflake"
				},
				{
					"Description": "The world’s most expensive coffee brands are made from the dung of Thai elephants.",
					"FontAwesomeIcon": "fa-coffee"
				},
				{
					"Description": "Hippopotamuses rest in water to keep their temperature down because they don’t have sweat glands.",
					"FontAwesomeIcon": "fa-tint"
				},
				{
					"Description": "A shark can see through in the cloudy water because of a particular membrane in its eye called tapetum lucidum. This membrane helps them hunt in murky water.",
					"FontAwesomeIcon": "fa-eye"
				},
				{
					"Description": "Sharks have very keen sense of hearing. They can hear low pitch sounds below the range of human hearing.",
					"FontAwesomeIcon": "fa-headphones"
				},
				{
					"Description": "Blue whales are the loudest mammals. They can produce low-frequency pulses that can be heard from more than 500 miles (800 km) away.",
					"FontAwesomeIcon": "fa-volume-up"
				},
				{
					"Description": "An adult panda typically spends 12 hours a day eating and must consume 28 pounds (13 kg) of bamboo daily to fulfill its dietary needs.",
					"FontAwesomeIcon": "fa-pagelines"
				},
				{
					"Description": "If there was a computer as powerful as the human brain, it would be able to do 38 thousand trillion operations per second and hold more than 3580 terabytes of memory.",
					"FontAwesomeIcon": "fa-desktop"
				},
				{
					"Description": "An average person normally blinks 20 times a minute, but when using a computer he/she blinks only 7 times a minute. Are you blinking now?",
					"FontAwesomeIcon": "fa-eye"
				},
				{
					"Description": "The first 1GB hard disk drive was announced in 1980 which weighed about 550 pounds, and had a price tag of $40,000.",
					"FontAwesomeIcon": "fa-money"
				},
				{
					"Description": "The first microprocessor created by Intel was the 4004. It was designed for a calculator, and in that time nobody imagined where it would lead.",
					"FontAwesomeIcon": "fa-calculator"
				},
				{
					"Description": "Genesis Device demonstration video in Star Trek II: The Wrath of Khan was the the first entirely computer generated movie sequence in the history of cinema. That studio later become Pixar.",
					"FontAwesomeIcon": "fa-film"
				},
				{
					"Description": "Mary Kenneth Keller was the first woman to earn a Ph.D. in Computer Science in the United States and also earned a Master’s degree in Mathematics and Physics. She helped develop computer programming languages and she was a Catholic nun.",
					"FontAwesomeIcon": "fa-trophy"
				},
				{
					"Description": "The first actual computer “bug” was a dead moth stuck in a Harvard Mark II computer in 1947.",
					"FontAwesomeIcon": "fa-bug"
				},
				{
					"Description": "The Apple 1 was the first computer developed by Apple and was nothing more than a bag of parts. The Apple II was the first finished product sold by the company.",
					"FontAwesomeIcon": "fa-apple"
				},
				{
					"Title": "Pro Tip",
					"Description": "Fart when people hug you. It makes them feel stronger.",
					"FontAwesomeIcon": "fa-trophy"
				},
				{
					"Title": "Pro Tip",
					"Description": "Gordon Moore's original office is in Santa Clara on the 2nd floor of RNB. No one sits there anymore, but Intel staff continuously cleans and changes its decor. Go visit it when/if you're in Santa Clara!",
					"FontAwesomeIcon": "fa-comment"
				}
			]

		}],
		link: function (scope, element, attrs) { }
	};
}