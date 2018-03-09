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
					"Title": "Random Fun Fact",
					"Description": "Cats and horses are highly susceptible to black widow venom, but dogs are relatively resistant. Sheep and rabbits are apparently immune.",
					"FontAwesomeIcon": "fa-flask"
				},
				{
					"Title": "Random Fun Fact",
					"Description": "Octopuses have eight arms and three hearts.",
					"FontAwesomeIcon": "fa-heart"
				},
				{
					"Title": "Random Fun Fact",
					"Description": "Owls don't have eyeballs. They have eye tubes.",
					"FontAwesomeIcon": "fa-eye-slash"
				},
				{
					"Title": "Random Fun Fact",
					"Description": "Dogs' sense of smell are about 100,000 times stronger than humans', but they have only one-sixth the number of taste buds.",
					"FontAwesomeIcon": "fa-paw"
				},
				{
					"Title": "Random Fun Fact",
					"Description": 'A supercolony of invasive Argentine ants, known as the "California large," covers 560 miles of the U.S. West Coast. The colony is currently engaged in a turf war with a nearby supercolony in Mexico.',
					"FontAwesomeIcon": "fa-bug"
				},
				{
					"Title": "Random Fun Fact",
					"Description": "A single strand of spider silk is thinner than a human hair, but also five times stronger than steel of the same width. A rope just 2 inches thick could reportedly stop a Boeing 747.",
					"FontAwesomeIcon": "fa-plane"
				},
				{
					"Title": "Random Fun Fact",
					"Description": "Warmer weather causes more turtles to be born female than male.",
					"FontAwesomeIcon": "fa-venus"
				},
				{
					"Title": "Random Fun Fact",
					"Description": 'Male gentoo and Adelie penguins "propose" to females by giving them a pebble.',
					"FontAwesomeIcon": "fa-diamond"
				},
				{
					"Title": "Random Fun Fact",
					"Description": "Less time separates the existence of humans and the tyrannosaurus rex than the T-rex and the stegosaurus.",
					"FontAwesomeIcon": "fa-hourglass"
				},
				{
					"Title": "Random Fun Fact",
					"Description": "In winter, a Reindeer's eyeballs will turn blue. This helps them see at lower light levels.",
					"FontAwesomeIcon": "fa-eye"
				},
				{
					"Title": "Random Fun Fact",
					"Description": "The toothfairy isn't real. She just isn't.",
					"FontAwesomeIcon": "fa-graduation-cap"
				},
				{
					"Title": "Random Fun Fact",
					"Description": "Sharks kill less than 10 people per year. Humans kill about 100 million sharks per year.",
					"FontAwesomeIcon": "fa-tint"
				},
				{
					"Title": "Random Fun Fact",
					"Description": "The saliva of a Komodo dragon harvests more than 50 types of bacteria. Animals bitten by the lizard typically die within 24 hours from blood poisoning — if they aren't eaten first.",
					"FontAwesomeIcon": "fa-flask"
				},
				{
					"Title": "Random Fun Fact",
					"Description": "Some Reindeer have knees that make a clicking sound when they walk. It helps them keep together in a blizzard.",
					//"FontAwesomeIcon": "fa-snowflake"
				},
				{
					"Title": "Random Fun Fact",
					"Description": "A giraffe's age can be calculated from its spots. The darker the spots, the older the giraffe."
				},
				{
					"Title": "Random Fun Fact",
					"Description": "If a Sun Bear is grabbed or bitten on its head, it can turn around using the wrinkly skin on its head to bite the predator back.",
					"FontAwesomeIcon": "fa-paw"
				},
				{
					"Title": "Random Fun Fact",
					"Description": "Over the winter the arctic fox has a heavy white coat, but in the summer their fur coat is shed for a thinner, two-tone brown pelage.",
					//"FontAwesomeIcon": "fa-snowflake"
				},
				{
					"Title": "Random Fun Fact",
					"Description": "The world’s most expensive coffee brands are made from the dung of Thai elephants.",
					"FontAwesomeIcon": "fa-coffee"
				},
				{
					"Title": "Random Fun Fact",
					"Description": "Hippopotamuses rest in water to keep their temperature down because they don’t have sweat glands.",
					"FontAwesomeIcon": "fa-tint"
				},
				{
					"Title": "Random Fun Fact",
					"Description": "A shark can see through in the cloudy water because of a particular membrane in its eye called tapetum lucidum. This membrane helps them hunt in murky water.",
					"FontAwesomeIcon": "fa-eye"
				},
				{
					"Title": "Random Fun Fact",
					"Description": "Sharks have very keen sense of hearing. They can hear low pitch sounds below the range of human hearing.",
					"FontAwesomeIcon": "fa-headphones"
				},
				{
					"Title": "Random Fun Fact",
					"Description": "Blue whales are the loudest mammals. They can produce low-frequency pulses that can be heard from more than 500 miles (800 km) away.",
					"FontAwesomeIcon": "fa-volume-up"
				},
				{
					"Title": "Random Fun Fact",
					"Description": "An adult panda typically spends 12 hours a day eating and must consume 28 pounds (13 kg) of bamboo daily to fulfill its dietary needs.",
					"FontAwesomeIcon": "fa-pagelines"
				},
				{
					"Title": "Random Fun Fact",
					"Description": "If there was a computer as powerful as the human brain, it would be able to do 38 thousand trillion operations per second and hold more than 3580 terabytes of memory.",
					"FontAwesomeIcon": "fa-desktop"
				},
				{
					"Title": "Random Fun Fact",
					"Description": "An average person normally blinks 20 times a minute, but when using a computer he/she blinks only 7 times a minute. Are you blinking now?",
					"FontAwesomeIcon": "fa-eye"
				},
				{
					"Title": "Random Fun Fact",
					"Description": "The first 1GB hard disk drive was announced in 1980 which weighed about 550 pounds, and had a price tag of $40,000.",
					"FontAwesomeIcon": "fa-money"
				},
				{
					"Title": "Random Fun Fact",
					"Description": "The first microprocessor created by Intel was the 4004. It was designed for a calculator, and in that time nobody imagined where it would lead.",
					"FontAwesomeIcon": "fa-calculator"
				},
				{
					"Title": "Random Fun Fact",
					"Description": "Genesis Device demonstration video in Star Trek II: The Wrath of Khan was the the first entirely computer generated movie sequence in the history of cinema. That studio later become Pixar.",
					"FontAwesomeIcon": "fa-film"
				},
				{
					"Title": "Random Fun Fact",
					"Description": "Mary Kenneth Keller was the first woman to earn a Ph.D. in Computer Science in the United States and also earned a Master’s degree in Mathematics and Physics. She helped develop computer programming languages and she was a Catholic nun.",
					"FontAwesomeIcon": "fa-trophy"
				},
				{
					"Title": "Random Fun Fact",
					"Description": "The first actual computer “bug” was a dead moth stuck in a Harvard Mark II computer in 1947.",
					"FontAwesomeIcon": "fa-bug"
				},
				{
					"Title": "Random Fun Fact",
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
				},
				{
				    "Title": "Did You Know",
				    "Description": "It took humanity approximately 4 times longer to switch from copper swords to steel swords than it took to switch from steel swords to nuclear bombs.",
				    "FontAwesomeIcon": "fa-bomb"
				},
				{
				    "Title": "Did You Know",
				    "Description": "Next to the US army, Disney World is the largest buyer and importer of explosives in the USA.",
				    "FontAwesomeIcon": "fa-bomb"
				},
				{
				    "Title": "Did You Know",
				    "Description": "Anne Frank and Martin Luther King Jr. were born in the same year.",
				    "FontAwesomeIcon": "fa-child"
				},
				{
				    "Title": "Did You Know",
				    "Description": "Vending machines have killed more people than sharks.",
				    "FontAwesomeIcon": "fa-calculator"
				},
				{
				    "Title": "Did You Know",
				    "Description": "Pineapples take 2 years to grow.",
				    "FontAwesomeIcon": "fa-utensils"
				},
				{
				    "Title": "Did You Know",
				    "Description": "There are more chickens in America than people on the planet.",
				    "FontAwesomeIcon": "fa-users"
				},
				{
				    "Title": "Did You Know",
				    "Description": "Bill Clinton, George W. Bush and Donald Trump were all born within a 66-day stretch.",
				    "FontAwesomeIcon": "fa-flag"
				},
				{
				    "Title": "Did You Know",
				    "Description": "Nearly the entire continent of South America is east of Florida.",
				    "FontAwesomeIcon": "fa-map"
				},
				{
				    "Title": "Did You Know",
				    "Description": "There are more atoms in a teaspoon of water than there are teaspoons of water in the Atlantic.",
				    "FontAwesomeIcon": "fa-tint"
				},
				{
				    "Title": "Did You Know",
				    "Description": "Giraffes and humans possess the same amount of neck bones.",
				    "FontAwesomeIcon": "fa-user"
				},
				{
				    "Title": "Did You Know",
				    "Description": "In the mid-1880s Aluminum was more valuable than gold, now we use it expendably to wrap food.",
				    "FontAwesomeIcon": "fa-dollar-sign"
				},
				{
				    "Title": "Did You Know",
				    "Description": "When you speak inside your mind small muscles in your throat mimic the formation of each word.  This is called subvocalisation.",
				    "FontAwesomeIcon": "fa-microphone-slash"
				},
				{
					"Title": "Did You Know",
					"Description": "There is more bacteria living inside a single person's digestive system than the number of human beings who have ever existed in history.",
					"FontAwesomeIcon": "fa-globe"
				},
				{
					"Title": "Did You Know",
					"Description": "If you compressed a 747 down into a black hole density, the radius would be far smaller then an atomic particle.  But a black hole that size \"evaporates\" and would have lifespan of less then a second.",
					"FontAwesomeIcon": "fa-plane"
				},
				{
					"Title": "Did You Know",
					"Description": "If we removed the free space between each particles inside the atom, all humankind would fit inside a berry.",
					"FontAwesomeIcon": "fa-user"
				},
			]

		}],
		link: function (scope, element, attrs) { }
	};
}