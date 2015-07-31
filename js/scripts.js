// Function:
// 1. Choose city from drop down menu
// 2. Query twitter for top 3 trending topics
// 3. Query image api to find related image for each
// 4. On click of a topic, query twitter api for most recent
// tweets on that topic and compile together
 // 5. Query the alchemy api for sentiment and related concepts




var app = {};
var cityName;
var cityTrends= [];

app.citySelect = function(){
	$('.city').on('click', function(evnt){
		evnt.preventDefault();
		$cityID = $(this).data('id');
		$cityGeo = $(this).data('geo');
		cityName=$(this).data('city');
		app.getTrends();


	});
};

// Get the top 3 current trending topics for the city
app.getTrends = function(){
	cityTrends=[];
	$.ajax({
		url: 'http://localhost/twitterApp/trends_json.php',
		type: 'GET',
		dataType: 'jsonp',
		data: {
			twitter_path: 'https://api.twitter.com/1.1/trends/place.json',
			id: $cityID,
		},
		success: function(response){
			for(var i=0;i<3;i++){
				cityTrends[i]=response[0].trends[i].name;
			};
			console.log(cityTrends);
			app.showTrends(cityTrends);
		}
	})
};

app.showTrends = function(trends){
	$('#trendsContainer').empty();
	$.each(trends, function(index, trend){
		var $trendContainer = $('<div>');
		$trendContainer.addClass('trend');
		var $trendName = $('<h3>');
		$trendName.text(trend);
		$trendContainer.append($trendName);
		$('#trendsContainer').append($trendContainer);
	});
};


app.getTweets = function(){
	$.ajax({
		url : 'http://localhost/twitterApp/tweets_json.php',
		type: 'GET',
		dataType: 'jsonp',
		data: {
			twitter_path: '1.1/search/tweets.json',		
			q:'"chinese food"',
			lang: 'en',
			id: $city,
			result_type: 'recent',
			count: 75
		},
		success : function(response){
			// console.log(response);
			app.compileTweets(response);
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
	// console.log(compiledTweet);
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