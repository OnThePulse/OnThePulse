// Function:
// 1. Choose city from drop down menu
// 2. Query twitter for top 3 trending topics
// 3. On click of a topic, query twitter api for most recent
// tweets on that topic and compile together
 // 4. Query the alchemy api for sentiment and related concepts
 // 5. Search/display news articles relating to the trend


google.load("search", "1");

var app = {};
var cityName;
var cityTrends= [];
var flickrResponse = [];
var trendImages = [];
var testArray= ['Pizza', 'Ballon', 'Chess'];

// 1. Give the city selections functionality
app.citySelect = function(){
	$('.city').on('click', function(evnt){
		evnt.preventDefault();
		$cityID = $(this).data('id');
		$cityGeo = $(this).data('geo');
		cityName=$(this).data('city');
		app.getTrends();
	});
};

// 2. Get the top 3 current trending topics for the city
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
			// app.getImages(cityTrends);
			app.showTrends(cityTrends);
		}
	})
};


// Show the trends on the page
app.showTrends = function(trends){
	$('#trendsContainer').empty();
	$.each(trends, function(index, trend){
		var $trendContainer = $('<div>');
		$trendContainer.addClass('trend').addClass('trend'+index).addClass('col-sm-4').addClass('text-center');
		var $trendImg = $('<img>');
		$trendImg.addClass('trendImg'+index);
		var $trendName = $('<h3>');
		$trendName.text(trend);
		$trendContainer.append($trendImg, $trendName);
		$('#trendsContainer').append($trendContainer);
	});
	app.trend0Select();
	app.trend1Select();
	app.trend2Select();
};


// 3. On click of a topic, query twitter api for most recent
// tweets on that topic and compile together
app.trend0Select = function(){
	$('.trend0').on('click', function(){
		$('.trend1, .trend2').hide(1000);
		$('.trend0').removeClass('col-sm-4').addClass('col-sm-12');
		app.getTweets(cityTrends[0]);
		app.newsSearch(cityTrends[0]);
	});
};

app.trend1Select = function(){
	$('.trend1').on('click', function(){
		$('.trend0, .trend2').hide(1000);
		$('.trend1').removeClass('col-sm-4').addClass('col-sm-12');
		app.getTweets(cityTrends[1]);
		app.newsSearch(cityTrends[1]);
	});
};

app.trend2Select = function(){
	$('.trend2').on('click', function(){
		$('.trend1, .trend0').hide(1000);
		$('.trend2').removeClass('col-sm-4').addClass('col-sm-12');
		app.getTweets(cityTrends[2]);
		app.newsSearch(cityTrends[2]);
	});
};

//  getTweet + compileTweet + Alchemy api train *********CHOO CHOO!*********
app.getTweets = function(trend){
	$.ajax({
		url : 'http://localhost/twitterApp/tweets_json.php',
		type: 'GET',
		dataType: 'jsonp',
		data: {
			twitter_path: '1.1/search/tweets.json',		
			q: trend,
			lang: 'en',
			geocode: $cityGeo,
			result_type: 'mixed',
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
			$sentimentText.text("The current sentiment about this topic is "+ response.docSentiment.type + " with a score of " + response.docSentiment.score);
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
};  // End of tweet/alchemy train *******CHOO CHOO!!*****

app.newsSearch = function() {

};



app.init = function (){
	app.citySelect();
};

$(function(){
	app.init();
});





// // Do a Flickr image search for each trend
// app.getImages = function(trends) {
// 	flickrResponse = [];
// 	for (var i = 0; i < trends.length; i++){
// 		console.log(trends[i]);
// 		$.ajax({
// 			url: 'https://api.flickr.com/services/rest',
// 			type: 'GET',
// 			dataType: 'jsonp',
// 			jsonp: 'jsoncallback',
// 			data: {
// 				api_key: '7f330be3ad01149a9f99f92363a3b84b',
// 				method: 'flickr.photos.search',
// 				format: 'json',
// 				tags: trends[i],
// 				sort: 'relevance'
// 			},
// 			success: function(response){
// 				console.log(response);
// 				flickrResponse[i] = response;
// 				// console.log(flickrResponse);
// 				console.log(i);
// 				if (i===2) {
// 					console.log(flickrResponse);
// 					app.displayImages(flickrResponse);
// 				};
// 			}
// 		});
// 	};
// 	// console.log(flickrResponse);
// };




// // Display the first image response on the page
// app.displayImages = function(images){
// 	console.log(images);
// 	// https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg
// 	$.each(images, function(index, item){
// 		var farmId = item.photos.photo[0].farm;
// 		// console.log(farmId);
// 		var serverId = item.photos.photo[0].server;
// 		var imgId = item.photos.photo[0].id;
// 		var secret = item.photos.photo[0].secret;
// 		var imgUrl = "https://farm"+farmId+".staticflickr.com/"+serverId+"/"+imgId+"_"+secret+".jpg";
// 		console.log(umgUrl);
// 		$('.trendImg'+ index).attr('src', imgUrl);
// 	});
// };






