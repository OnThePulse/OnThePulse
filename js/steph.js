var twitterApp = {};
twitterApp.numPosTerms = 0;
twitterApp.numNegTerms = 0;
twitterApp.numUserPosTerms = 0;
twitterApp.numUserNegTerms=0;
twitterApp.resultsPage = $('#resultsPage');
var cityName;

twitterApp.init = function(){
	$('.city').on('click', function(event){
		event.preventDefault();
		$city = $(this).data('geo');
		cityName = $(this).data('city');
		twitterApp.getTweets();
		$('.container').fadeOut(400);
		$('#circleG').delay(400).show();
		
	});

	$('.icon-arrow-down').on('click', function(event){
		event.preventDefault();
		$('.info').slideDown();
		$(this).hide();
		$('.icon-arrow-up').show();
	});

	$('.icon-arrow-up').on('click', function(event){
		event.preventDefault();
		$('.info').slideUp();
		$(this).hide();
		$('.icon-arrow-down').show();
	});

	$('#form').submit(function(event){
		var username = $('.userId').val();
		event.preventDefault();
		twitterApp.getUserTweets(username);
		$('#circleG').show();
	});
};

//GLOBAL TWITTER SEARCH

twitterApp.getTweets = function(){
	$.ajax({
		url: 'http://stessy.co/stessyapp/tweets_json.php',
		type: 'GET',
		dataType: 'jsonp',
		data: {
			twitter_path: '1.1/search/tweets.json',		
			q: 'yay OR fun OR happy OR glad OR stoked OR jazzed OR excited OR awesome OR wicked OR cool OR amazing OR perfect OR best -RT',
			geocode: $city,
			result_type: 'recent',
			count: 100
		},
		success: function(posResult){
			$.ajax({
				url: 'http://stessy.co/stessyapp/tweets_json.php',
				type: 'GET',
				dataType: 'jsonp',
				data: {
					twitter_path: '1.1/search/tweets.json',		
					q: 'bullshit OR sad OR sucks OR awful OR terrible OR depressed OR hate OR haters OR fml OR worst OR fail -RT',
					geocode: $city,
					result_type: 'recent',
					count: 100
				},
				success: function(negResult){
					twitterApp.displayTweets(posResult, negResult);
					twitterApp.compare();
					$('#circleG').hide();
				}
			});
		}
	});
}

twitterApp.displayTweets = function(dataPos, dataNeg){
	
	$.each(dataPos, function(i, tweetData){
		
		$.each(tweetData, function(j, tweet) {

			// Checks if there's actually text in the tweet
			if (tweet.text) {

				// Find matches of all our terms
				var matches = tweet.text.match(/yay|fun|happy|glad|stoked|jazzed|excited|awesome|wicked|cool|amazing|perfect|best/gi);

				// If there's matches lets add them to our totals
				if (matches) {
					twitterApp.numPosTerms += matches.length;
				}
			}
		})
	});
	$.each(dataNeg, function(i, tweetData){

		$.each(tweetData, function(j, tweet) {

			if (tweet.text) {

				var matches = tweet.text.match(/bullshit|sad|sucks|awful|terrible|depressed|hate|haters|fml|worst|fail/gi);

				if (matches) {
					twitterApp.numNegTerms += matches.length;
				}
			}	
		})
	});
};

twitterApp.compare = function(){

	if(twitterApp.numPosTerms>twitterApp.numNegTerms+10){
		var message="Feeling amazing!";
		var caption="Recent tweets sent from " + cityName + " express a considerable amount more positivity than negativity. You go, " + cityName + "!";
		var bgColor = "#f9f49b";

	} else if(twitterApp.numPosTerms>twitterApp.numNegTerms+5){
		var message= "Feeling great!";
		var caption="Recent tweets sent from " + cityName + " express more positivity than negativity. Way to go, " + cityName + "!";
		var bgColor = "#f9ce8f";

	} else if(twitterApp.numPosTerms>twitterApp.numNegTerms){
		var message = "Feeling okay, but not by much.";
		var caption="Our search in " + cityName + " returns an almost equal amount of positive and negative tweets. Hang in there, " + cityName + "!";
		var bgColor = "#f4b19d";

	}else if(twitterApp.numNegTerms>twitterApp.numPosTerms+10){
		var message = "Feeling terrible.";
		var caption="It looks like we caught " + cityName + " at a bad time. There were a considerable amount more negative tweets than positive ones."
		var bgColor = "#586d75";

	}else if(twitterApp.numNegTerms>twitterApp.numPosTerms+5){
		var message = "Not feeling so hot.";
		var caption="Recent tweets sent from " + cityName + " are a lot more negative than positive. Snap out of it, " + cityName + "!";
		var bgColor = "#7a97a5";

	} else{
		var message = "A little cranky.";
		var caption="It looks like " + cityName + " is in a bit of a bad mood. Our search returned more negative tweets than positive ones."
		var bgColor = "#b9d8ea";
	}
	twitterApp.displayResults = function(){
		var date = moment().format('MMMM Do YYYY, h:mm:ss a');
		twitterApp.resultsPage.html("<h1>" + cityName + "</h1>" + "<span>" + date + "</span>" + "<p>" + message + "</p>" + "<p>" + caption + "</p>");
		$('body').css('background', bgColor);
	};
	twitterApp.displayResults();
	twitterApp.resultsPage.show();
	$('.results').show();
};








// USER-INPUT TWITTER SEARCH

twitterApp.getUserTweets = function(username){
	$.ajax({
		url: 'http://stessy.co/stessyapp/tweets_json.php',
		type: 'GET',
		dataType: 'jsonp',
		data: {
			twitter_path: '1.1/search/tweets.json',		
			q: 'from:' + username + '+ yay OR fun OR happy OR glad OR stoked OR jazzed OR excited OR awesome OR wicked OR cool OR amazing OR perfect OR best -RT',
			result_type: 'recent',
			count: 100
		},
		success: function(posUserResult){
			// twitterApp.displayTweets(result);
			$.ajax({
				url: 'http://stessy.co/stessyapp/tweets_json.php',
				type: 'GET',
				dataType: 'jsonp',
				data: {
						twitter_path: '1.1/search/tweets.json',		
						q: 'from:' + username + '+ bullshit OR sad OR bad OR awful OR terrible OR depressed OR hate OR haters OR fml OR worst OR fail -RT',
						result_type: 'recent',
						count: 100
				},
				success: function(negUserResult){
					twitterApp.displayUserTweets(posUserResult, negUserResult);
					twitterApp.userCompare();
				}
			});
		}
	});
}

twitterApp.displayUserTweets = function(dataPos, dataNeg){
	
	$.each(dataPos, function(i, tweetData){
		
		$.each(tweetData, function(j, tweet) {

			// Checks if there's actually text in the tweet
			if (tweet.text) {

				// Find matches of all our terms
				var matches = tweet.text.match(/yay|fun|happy|glad|stoked|jazzed|excited|awesome|wicked|cool|amazing|perfect|best/gi);

				// If there's matches lets add them to our totals
				if (matches) {
					twitterApp.numUserPosTerms += matches.length;
				}				
			}
		})
	});
	$.each(dataNeg, function(i, tweetData){

		$.each(tweetData, function(j, tweet) {

			if (tweet.text) {

				var matches = tweet.text.match(/bullshit|sad|disappointed|bad|awful|terrible|hate|haters|worst|fail/gi);

				if (matches) {
					twitterApp.numUserNegTerms += matches.length;
				}
			}	
		})
	});
};

twitterApp.userCompare = function(){
	if(twitterApp.numUserPosTerms>twitterApp.numUserNegTerms){
		sweetAlert("Keep being awesome!", "Your recent tweets are mostly positive. Rock on!");
	}else{
		sweetAlert("Cheer up!", "It looks like you haven't tweeted many happy thoughts lately.");
	}
	$('#circleG').hide();
	$('#form').children('.userId').val('');
};

$(function(){
	twitterApp.init();
});