// Stats:
// 	-Average sentiment over last 100 texts
// 	-tweets/day (search last 500 tweets, look at the date of the oldest then do some math)
// 	-Top related concepts (maybe also pulling up an image of each concept)



var app = {};
var cityName;

app.citySelect = function(){
	$('.city').on('click', function(evnt){
		evnt.preventDefault();
		$city = $(this).data('geo');
		cityName=$(this).data('city');
		app.getTweets();


	});
};

app.getTweets = function(){
	$.ajax({
		url : 'http://localhost/twitterApp/tweets_json.php',
		type: 'GET',
		dataType: 'jsonp',
		data: {
			twitter_path: '1.1/search/tweets.json',		
			// q:'"chinese food"',
			lang: 'en',
			// geocode: $city,
			// result_type: 'recent',
			count: 75
		},
		success : function(tweet){
			console.log(tweet);
			app.compileTweets(tweet);
		}
	})
};

app.compileTweets = function(tweets){
	var compiledTweet = '';
	$.each(tweets, function(i, tweetData){
		$.each(tweetData, function(j, tweet){
			if (tweet.text) {
				compiledTweet = compiledTweet + " "+ tweet.text;
			}
		})
	})

	// Remove all twitter handles, urls and dashes. 
	compiledTweet = compiledTweet.replace(/\@\S+/g,"").replace(/\http\S+/g,"").replace(/\-\S+/g,"");
	console.log(compiledTweet);
	app.analyzeSentiment(compiledTweet);
	app.analyzeConcepts(compiledTweet);
};

app.analyzeSentiment = function(tweetText){
	$.ajax({
		url: 'http://access.alchemyapi.com/calls/text/TextGetTextSentiment',
		type: 'GET',
		dataType: 'json',
		data: {
			apikey: '5f798feb1fb9ee663aa54a9e10a5d9ff179408c0',
			outputMode: 'json',
			text:tweetText
		},
		success: function(response){
			var $sentimentResponse = $('<div>');
			var $sentimentText = $('<p>');
			$sentimentText.text("The current Nickelback sentiment is "+ response.docSentiment.type + " with a score of " + response.docSentiment.score);
			$sentimentResponse.append($sentimentText);
			$('body').append($sentimentResponse);
		}
	})
};

app.analyzeConcepts = function(tweetText){
	$.ajax({
		url: 'http://access.alchemyapi.com/calls/text/TextGetRankedConcepts',
		type: 'GET',
		dataType: 'json',
		data: {
			apikey: '5f798feb1fb9ee663aa54a9e10a5d9ff179408c0',
			outputMode: 'json',
			text:tweetText
		},
		success: function(response){
			var $conceptResponse = $('<div>');
			var conceptList = 'The current top related concepts include:';
			for (var i=0; i < response.concepts.length; i++) {
				// console.log(response.concepts[i].text);
				conceptList = conceptList + " " + response.concepts[i].text + ",";
			}
			var $conceptText = $('<p>');
			$conceptText.text(conceptList);
			$conceptResponse.append($conceptText);
			$('body').append($conceptResponse);
			
		}

	})
};



app.init = function (){
	app.citySelect();
};

$(function(){
	app.init();
});