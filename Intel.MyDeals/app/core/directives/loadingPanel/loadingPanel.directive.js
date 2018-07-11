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

            // Enable or Disable Fun Facts
			$scope.isFunFactEnabled = true;

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
					"Description": "Most black widow spider bites do not require medical treatment.  While some bites are serious, no human deaths have been reported for decades.",
					"FontAwesomeIcon": "fa-bug"
				},
				//{
				//	"Title": "Random Fun Fact",
				//	"Description": "Cats and horses are highly susceptible to black widow venom, but dogs are relatively resistant. Sheep and rabbits are apparently immune.",
				//	"FontAwesomeIcon": "fa-flask"
				//},
				{
					"Title": "Random Fun Fact",
					"Description": "Octopuses have eight arms and three hearts.  One heart for the main body and two hearts for circulation around their gills.",
					"FontAwesomeIcon": "fa-heart"
				},
				{
					"Title": "Random Fun Fact",
					"Description": "Owls have eye tubes instead of eye balls. That is why owls rotate their heads to look around - because their eyes cannot rotate!",
					"FontAwesomeIcon": "fa-eye-slash"
				},
				{
					"Title": "Random Fun Fact",
					"Description": "A dog's sense of smell is about 40 times more sensative than a humans', but they only have about 1/6 the number of taste buds.",
					"FontAwesomeIcon": "fa-paw"
				},
				{
					"Title": "Random Fun Fact",
					"Description": 'A supercolony of invasive Argentine ants, known as the "California large" colony covers 560 miles along the coast of California. Research shows this colony may be genetically related to another two super ant colonies in Europe and Japan.',
					"FontAwesomeIcon": "fa-bug"
				},
				{
					"Title": "Random Fun Fact",
					"Description": "Given the same amount of weight, spider silk's tensile strength is stronger than steel though not as strong as Kevlar.  It is, however, tougher than both.",
					"FontAwesomeIcon": "fa-plane"
				},
				{
					"Title": "Random Fun Fact",
					"Description": "Temperature can influence whether a turtle is born male or female. Warmer sand tends to result in a higher ratio of female turtles.",
					"FontAwesomeIcon": "fa-venus"
				},
				{
					"Title": "Random Fun Fact",
					"Description": 'Male Gentoo penguins "can gain a female penguins favor by giving them a nice stone. These penguins breed monogamously, and infidelity can be punished via banishment from the Penguin colony.',
					"FontAwesomeIcon": "fa-diamond"
				},
				{
					"Title": "Random Fun Fact",
					"Description": "Less time separates the existence of humans and the Tyrannosaurus Rex (65 million years ago) than the T-rex and the Stegosaurus (150 million years ago).",
					"FontAwesomeIcon": "fa-hourglass"
				},
				{
					"Title": "Random Fun Fact",
					"Description": "A reindeer's eye color will change color throughout the seasons from gold to blue to help them better see predators at different light levels.",
					"FontAwesomeIcon": "fa-eye"
				},
				{
					"Title": "Random Fun Fact",
					"Description": "The toothfairy isn't real. She just isn't.",
					"FontAwesomeIcon": "fa-graduation-cap"
				},
				{
					"Title": "Random Fun Fact",
					"Description": "Sharks kill less than 10 people per year, whereas humans kill an estimated 100 million sharks per year.",
					"FontAwesomeIcon": "fa-tint"
				},
				//{
				//	"Title": "Random Fun Fact",
				//	"Description": "The saliva of a Komodo dragon harvests more than 50 types of bacteria. Animals bitten by the lizard typically die within 24 hours from blood poisoning — if they aren't eaten first.",
				//	"FontAwesomeIcon": "fa-flask"
				//},
				{
					"Title": "Random Fun Fact",
					"Description": "Some Reindeer have knees that make a clicking sound when they walk. that can be heard from up to 10 meters away.",
					//"FontAwesomeIcon": "fa-snowflake"
				},
				{
					"Title": "Random Fun Fact",
					"Description": "Each giraffe has a unique coat pattern. The spots are used for camoflage when a giraffe is still young - adult giraffes rely more on their size and ability to defend themselves than their coloration."
				},
				//{
				//	"Title": "Random Fun Fact",
				//	"Description": "If a Sun Bear is grabbed or bitten on its head, it can turn around using the wrinkly skin on its head to bite the predator back.",
				//	"FontAwesomeIcon": "fa-paw"
				//},
				{
					"Title": "Random Fun Fact",
					"Description": "Over the winter the arctic fox has a heavy white coat, but in the summer their fur coat morphs to a brown-grey color.",
					//"FontAwesomeIcon": "fa-snowflake"
				},
				{
					"Title": "Random Fun Fact",
					"Description": "Some of the world's most expensive coffees are created from coffee beans that have been digested and are collected from the dung of certain animals",
					"FontAwesomeIcon": "fa-coffee"
				},
				{
					"Title": "Random Fun Fact",
					"Description": "Hippopotamuses have skin that can create a natural substance that acts as a sunscreen.  When secreted it is initially red but eventually changes to a dark brown.",
					"FontAwesomeIcon": "fa-tint"
				},
				{
					"Title": "Random Fun Fact",
					"Description": "A shark can see well in cloudy water because of a particular tissue in its eye called tapetum lucidum. This membrane helps them hunt in murky water by reflecting light back into the retina.",
					"FontAwesomeIcon": "fa-eye"
				},
				{
					"Title": "Random Fun Fact",
					"Description": "Sharks have very sharp sense of hearing. They can hear prey from miles away.",
					"FontAwesomeIcon": "fa-headphones"
				},
				{
					"Title": "Random Fun Fact",
					"Description": "Blue whales are one of the loudest mammals. They can produce low-frequency whistles that can be heard from hundreds of miles away.",
					"FontAwesomeIcon": "fa-volume-up"
				},
				{
					"Title": "Random Fun Fact",
					"Description": "An adult panda typically needs to eat 20 to 30 lbs of of bamboo daily to fulfill its dietary needs.  Due to this very low energy diet the Panda must also limit its activity each day to preserve energy.",
					"FontAwesomeIcon": "fa-pagelines"
				},
				//{
				//	"Title": "Random Fun Fact",
				//	"Description": "If there was a computer as powerful as the human brain, it would be able to do 38 thousand trillion operations per second and hold more than 3580 terabytes of memory.",
				//	"FontAwesomeIcon": "fa-desktop"
				//},
				{
					"Title": "Random Fun Fact",
					"Description": "An average person normally blinks 15-20 times a minute, but when using a computer he/she blinks only 3-7 times a minute. Are you blinking now?",
					"FontAwesomeIcon": "fa-eye"
				},
                {
					"Title": "Random Fun Fact",
					"Description": "An average person subconsciously blinks 15-20 times a minute, so often that we probably spend about 10% of our waking hours with our eyes closed. Are you blinking now?",
					"FontAwesomeIcon": "fa-eye"
				},
				//{
				//	"Title": "Random Fun Fact",
				//	"Description": "The first 1GB hard disk drive was announced in 1980 which weighed about 550 pounds, and had a price tag of $40,000.",
				//	"FontAwesomeIcon": "fa-money"
				//},
				{
					"Title": "Random Fun Fact",
					"Description": "The first microprocessor created by Intel was the 4004. It was designed for a calculator, and in that time nobody imagined where it would lead.",
					"FontAwesomeIcon": "fa-calculator"
				},
				//{
				//	"Title": "Random Fun Fact",
				//	"Description": "Genesis Effect demonstration video in Star Trek II: The Wrath of Khan was the the first entirely computer generated movie sequence in the history of cinema. That studio later become Pixar.",
				//	"FontAwesomeIcon": "fa-film"
				//},
				{
					"Title": "Random Fun Fact",
					"Description": "Mary Kenneth Keller was the first woman to earn a Ph.D. in Computer Science in the United States and also earned a Masters degree in Mathematics and Physics.",
					"FontAwesomeIcon": "fa-trophy"
				},
				{
					"Title": "Random Fun Fact",
					"Description": "The first 'computer bug' was a dead moth stuck in a Harvard Mark II computer in 1947.",
					"FontAwesomeIcon": "fa-bug"
				},
				//{
				//	"Title": "Random Fun Fact",
				//	"Description": "The Apple 1 was the first computer developed by Apple and was nothing more than a bag of parts. The Apple II was the first finished product sold by the company.",
				//	"FontAwesomeIcon": "fa-apple"
				//},
                {
                    "Title": "Random Fun Fact",
                    "Description": "There are more airplanes in the oceans than submarines in the sky.",
                    "FontAwesomeIcon": "fa-plane"
                },
                {
                    "Title": "Random Fun Fact",
                    "Description": "Each day we breathe about 20,000 times.",
                    "FontAwesomeIcon": "fa-sun"
                },
                {
                    "Title": "Random Fun Fact",
                    "Description": "You are now aware that you are breathing manually.  Sorry.",
                    "FontAwesomeIcon": "fa-sun"
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
				    "Description": "Next to the US army, Walt Disney World is the largest purchaser of explosives in the USA.",
				    "FontAwesomeIcon": "fa-bomb"
				},
				{
				    "Title": "Did You Know",
				    "Description": "Anne Frank and Martin Luther King Jr. were born in the same year.",
				    "FontAwesomeIcon": "fa-child"
				},
				{
				    "Title": "Did You Know",
				    "Description": "You are more likely to be killed by a vending machine than a shark.",
				    "FontAwesomeIcon": "fa-calculator"
				},
				{
				    "Title": "Did You Know",
				    "Description": "Pineapples take 2 years to grow.  How long does it take you to go to the store to buy one?",
				    "FontAwesomeIcon": "fa-utensils"
				},
				{
				    "Title": "Did You Know",
				    "Description": "There are more chickens in America than there are people on the planet.",
				    "FontAwesomeIcon": "fa-users"
				},
				{
				    "Title": "Did You Know",
				    "Description": "Bill Clinton, George W. Bush, and Donald Trump were all born within a 66-day stretch.",
				    "FontAwesomeIcon": "fa-flag"
				},
				{
				    "Title": "Did You Know",
				    "Description": "Nearly the entire continent of South America is east of Florida.",
				    "FontAwesomeIcon": "fa-map"
				},
				//{
				//    "Title": "Did You Know",
				//    "Description": "There are more atoms in a teaspoon of water than there are teaspoons of water in the Atlantic.",
				//    "FontAwesomeIcon": "fa-tint"
				//},
				{
				    "Title": "Did You Know",
				    "Description": "Giraffes and humans possess the same amount of neck bones. Theirs are just much larger!",
				    "FontAwesomeIcon": "fa-user"
				},
				{
				    "Title": "Did You Know",
				    "Description": "Until the mid-1880s Aluminum was much rarer than gold and its value far exceeded it, but now we use it expendably to wrap food.",
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
                {
                    "Title": "Did You Know",
                    "Description": "Otters hold hands while they sleep so they don't drift away from each other.",
                    "FontAwesomeIcon": "fa-handshake"
                },
                {
                    "Title": "Knowledge Is Power",
                    "Description": "How do snakes hear if they don't have ears? Snakes do not have eardrums, but their skins, muscles, and bones carry the sound waves to the inner ear.",
                    "FontAwesomeIcon": "fa-headphones"
                },
                {
                    "Title": "Knowledge Is Power",
                    "Description": "The Great Pyramid of Giza is the only one of the Seven Wonders of the Ancient World still standing today.",
                    "FontAwesomeIcon": "fa-building"
                },
                {
                    "Title": "Knowledge Is Power",
                    "Description": "At one time New York served as the capital of the United States.  It has been the country's largest city since 1790.",
                    "FontAwesomeIcon": "fa-building"
                },
                {
                    "Title": "Knowledge Is Power",
                    "Description": "By the time he was five years old, Mozart had complete mastery of keyboards and violin, and had written his first five musical compositions. At six, he toured Europe as a child prodigy.  By the time he was 16, he'd already written several symphonies.",
                    "FontAwesomeIcon": "fa-music"
                },
                {
                    "Title": "Knowledge Is Power",
                    "Description": "The wonderful smell you get while cutting grass is actually a chemical distress signal. As herbivores eat the grass, predators catch a whiff of the smell and eventually associate the smell with food.",
                    "FontAwesomeIcon": "fa-pagelines"
                },
                {
                    "Title": "Knowledge Is Power",
                    "Description": "Roughly 30% of food produced in the United States is never eaten and goes to waste.",
                    "FontAwesomeIcon": "fa-utensils"
                },
                {
                    "Title": "Knowledge Is Power",
                    "Description": "There are more trees on Earth than there are stars in the Milky Way.",
                    "FontAwesomeIcon": "fa-tree"
                },
                {
                    "Title": "Knowledge Is Power",
                    "Description": "From when it was discovered to when it was declassified as a planet, Pluto did not make a full orbit around the sun. It takes Pluto about 248 years to make a full orbit.",
                    "FontAwesomeIcon": "fa-space-shuttle"
                },
                {
                    "Title": "Knowledge Is Power",
                    "Description": "There are more permutations of a standard deck of 52 cards than there are seconds since the Big Bang. If you thoroughly shuffle a deck of cards, there is an exceptionally strong chance nobody has ever had a deck of cards in that particular order.",
                    "FontAwesomeIcon": "fa-clock"
                },
                {
                    "Title": "Knowledge Is Power",
                    "Description": "X% of Y = Y% of X. This means it might be easier to do mental math by flipping things around.  Example: 2% of 50 is the same thing as 50% of 2.",
                    "FontAwesomeIcon": "fa-calculator"
                },
                {
                    "Title": "Knowledge Is Power",
                    "Description": "The dot over the 'i' and 'j' is called a tittle.",
                    "FontAwesomeIcon": "fa-info"
                },
                {
                    "Title": "Knowledge Is Power",
                    "Description": "The word 'typewriter' can be typed just using the top rows of keys.  It's possible the QWERTY layout was designed so early salesman of typewriters could demonstrate by typing this word fast without full training in how to type.",
                    "FontAwesomeIcon": "fa-file-word"
                },
                //{
                //    "Title": "Knowledge Is Power",
                //    "Description": "One of the most successful military campaigns in history was Liectenstein during the Austro-Prussian War. They didn't kill anybody, and sent 80 men. They returned with 81: as they befriended one of the people from the opposition.",
                //    "FontAwesomeIcon": "fa-utensils"
                //},
                {
                    "Title": "Knowledge Is Power",
                    "Description": "We know more about the surface of the moon than we do the ocean floor.",
                    "FontAwesomeIcon": "fa-moon"
                },
                {
                    "Title": "Did You Know",
                    "Description": "After refusing and being dragged to Rome, a hermit was elected as Pope Celestine V.  He spent the majority of his papacy writing the rule that popes were allowed to resign.  When he finished writing it, he resigned.",
                    "FontAwesomeIcon": "fa-pencil"
                },
                {
                    "Title": "Did You Know",
                    "Description": "The reason vampires can't be seen in mirrors is because mirrors used to be made with a layer of silver inside. However modern mirrors aren't - meaning that modern vampires would appear in mirrors now.",
                    "FontAwesomeIcon": "fa-desktop"
                },
                {
                    "Title": "Did You Know",
                    "Description": "The line between the two numbers in a fraction is called the vinculum.",
                    "FontAwesomeIcon": "fa-percent"
                },
                {
                    "Title": "Did You Know",
                    "Description": "Bumblebees are the only kind of bees that can pollinate a potato.",
                    "FontAwesomeIcon": "fa-leaf"
                },
                {
                    "Title": "Did You Know",
                    "Description": "In 2009, a British submarine and a French submarine, both carrying nuclear missiles, collided with each other because they couldn’t detect one another.",
                    "FontAwesomeIcon": "fa-ship"
                },
                {
                    "Title": "Did You Know",
                    "Description": "More of the London Underground runs above ground than in tunnels below ground.",
                    "FontAwesomeIcon": "fa-subway"
                },
                {
                    "Title": "Did You Know",
                    "Description": "Puppies sneeze at each other to let them know that they're fighting for play, not for real.",
                    "FontAwesomeIcon": "fa-paw"
                },
                {
                    "Title": "Did You Know",
                    "Description": "The national animal of Scotland is the unicorn.  The national animal of Wales is a dragon.",
                    "FontAwesomeIcon": "fa-paw"
                },
                {
                    "Title": "Did You Know",
                    "Description": "Lollipop is the longest word in the English language that can be typed using just the right side of a keyboard.",
                    "FontAwesomeIcon": "fa-keyboard"
                },
                {
                    "Title": "Did You Know",
                    "Description": "Dolphins will poke a puffer fish until it puffs up. Once it does, it will secrete their poison. The dolphins will lick it until they get high.",
                    "FontAwesomeIcon": "fa-smoking"
                },
                {
                    "Title": "Did You Know",
                    "Description": "Most people know about Amazon Prime, but they don't know Amazon's went public in '97, which is a prime number. Write out the full year as 1997, and it's still a prime number. Specifically, the IPO was on May 15, 1997. 5,151,997 (5/15/1997) is also prime. For you non-Americans, 15/5/1997 and 15/05/1997 create two more prime numbers 1,551,997 and 15,051,997.",
                    "FontAwesomeIcon": "fa-percent"
                },
                {
                    "Title": "Did You Know",
                    "Description": "There was a British submarine in WW2 named the HMS Trident. The crew was gifted a reindeer by the Russians which they named Pollyanna and kept it on board the sub for 6 weeks. It eventually made it back to land to live in a zoo.",
                    "FontAwesomeIcon": "fa-ship"
                },
                {
                    "Title": "Did You Know",
                    "Description": "At rest, some people keep their tongues at the top of their mouths and others keep it at the bottom. Where do you keep yours?",
                    "FontAwesomeIcon": "fa-question"
                },
                {
                    "Title": "Did You Know",
                    "Description": "Sometimes sloths mistake their own arms for tree branches and fall.",
                    "FontAwesomeIcon": "fa-tree"
                },
                {
                    "Title": "Intel Inside",
                    "Description": "Intel Corp was founded on July 18, 1968 by Robert Noyce and Gordon Moore.",
                    "FontAwesomeIcon": "fa-calendar-alt"
                },
                {
                    "Title": "Intel Inside",
                    "Description": "Intel's name was conceived as a combination of the words INTegrated and ELectroncs.",
                    "FontAwesomeIcon": "fa-bolt"
                },
                {
                    "Title": "Intel Inside",
                    "Description": "Intel's third employee was a chemical engineer named Andy Grove who would go on to lead the company through much of the 1980s and 1990s.",
                    "FontAwesomeIcon": "fa-vial"
                },
                {
                    "Title": "Intel Inside",
                    "Description": "In 1991, Intel undertook a successful advertsing and branding campaign known as 'Intel Inside' which became widely known and has since become synonymous with Intel itself.",
                    "FontAwesomeIcon": "fa-tv"
                },
                {
                    "Title": "Intel Inside",
                    "Description": "My Deals.  Your Deals.  Our Deals.",
                    "FontAwesomeIcon": "fa-file-contract"
                },
                {
                    "Title": "Intel Inside",
                    "Description": "My Deals was a tool built to replace DCS (Deal Compliance Solution). The goal of My Deals was to provide a user friendly, fast, and compliant way to create and manage deals at Intel.",
                    "FontAwesomeIcon": "fa-file-signature"
                },
                {
                    "Title": "Did You Know",
                    "Description": "Right before you vomit your mouth will produce a lot more saliva to protect your mouth from your stomach acids. Noticing the excessive saliva and nausea can be taken as a preemptive warning sign.",
                    "FontAwesomeIcon": "fa-tint"
                },
                {
                    "Title": "Did You Know",
                    "Description": "The femur is the longest and strongest bone in the human body",
                    "FontAwesomeIcon": "fa-skull"
                },
                {
                    "Title": "Did You Know",
                    "Description": "Sunburns are your skin cells killing themselves in an attempt to prevent themselves from turning into cancer cells due to the DNA damage the sun does to cells",
                    "FontAwesomeIcon": "fa-sun"
                },
                {
                    "Title": "Did You Know",
                    "Description": "When your face is submerged underwater, your heart rate will slow. This is called the mammalian dive reflex.",
                    "FontAwesomeIcon": "fa-swimmer"
                },
                {
                    "Title": "Did You Know",
                    "Description": "The small intestine is longer than the large intestine...",
                    "FontAwesomeIcon": "fa-ruler"
                },
                {
                    "Title": "Did You Know",
                    "Description": "We all know people have different speaking accents depending on their native language. However did you know people can also have 'handwriting accents' depending on what language they grew up writing?",
                    "FontAwesomeIcon": "fa-pen"
                },
                {
                    "Title": "Did You Know",
                    "Description": "Bananas are classified as a berry",
                    "FontAwesomeIcon": "fa-lemon"
                },
			]

		}],
		link: function (scope, element, attrs) { }
	};
}