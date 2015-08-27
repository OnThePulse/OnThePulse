var app = {};
var cityName;
var cityTrends= [];
var flickrResponse = [];
var trendImages = [];
var currentTrend;
var newsObject;


app.infoMenu = function(){
	$('.infoBtn').on('click', function(evnt){
		evnt.preventDefault();
		$('.infoBtn i').toggleClass('fa-chevron-down').toggleClass('fa-chevron-up');
		$('.info').slideToggle();
	});
	$('.refreshBtn').on('click', function(evnt) {
		evnt.preventDefault();
		document.location.reload(true);
		// $('#onthe').animate({
		// 	fontSize: '80px',

		// }, 1000);
		// $('#pulse').animate({
		// 	fontSize: '130px',

		// }, 1000);
		// $('#menu').show();
		// $('h1').show();
		// $('h2').hide();
		// $('h4').text('Find out what cities are talking about and how they feel in real time.');
		// $('#trendsContainer').empty();
	})
};


// 1. Give the city selections functionality
app.citySelect = function(){
	$('.city').on('click', function(evnt){
		evnt.preventDefault();
		$cityID = $(this).data('id');
		$cityGeo = $(this).data('geo');
		cityName=$(this).data('city');
		$('.container h2').text(cityName).addClass('city-name');
		$('.menu-container').hide();
		$('#onthe').animate({
			fontSize: '40px',

		}, 1000);
		$('#pulse').animate({
			fontSize: '80px',

		}, 1000, function() {
			$('h1').hide();
		$('h2').show();
		$('h4').text('SELECT A TREND');
		});
		app.getTrends();
	});
};

// 2. Get the top 3 current trending topics for the city
app.getTrends = function(){
	cityTrends=[];
	$.ajax({
		url: 'http://adamkendal.ca/twitterApp/trends_json.php',
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
		$trendContainer.addClass('trend').addClass('trend'+index).addClass('col-md-4').addClass('text-center');
		var $trendImg = $('<img>');
		$trendImg.addClass('trendImg'+index);
		var $trendName = $('<h3>');
		$trendName.addClass('trend-name')
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
		$('.trend1, .trend2, .responseContainer, .googleContainer').toggle(1000);
		$('.trend0').toggleClass('col-md-4').toggleClass('col-sm-12');
		currentTrend = cityTrends[0];
		app.getTweets(currentTrend);
		// app.newsSearch(currentTrend);
		app.nytSearch(currentTrend);
		app.googleSearch(currentTrend);
		$('.responseContainer').empty()
	});
};

app.trend1Select = function(){
	$('.trend1').on('click', function(){
		$('.trend0, .trend2, .responseContainer, .googleContainer').toggle(1000);
		$('.trend1').toggleClass('col-md-4').toggleClass('col-sm-12');
		currentTrend = cityTrends[1];
		app.getTweets(currentTrend);
		// app.newsSearch(currentTrend);
		app.nytSearch(currentTrend);
		app.googleSearch(currentTrend);
		$('.responseContainer').empty()
	});
};

app.trend2Select = function(){
	$('.trend2').on('click', function(){
		$('.trend1, .trend0, .responseContainer, .googleContainer').toggle(1000);
		$('.trend2').toggleClass('col-md-4').toggleClass('col-sm-12');
		currentTrend = cityTrends[2];
		app.getTweets(currentTrend);
		// app.newsSearch(currentTrend);
		app.nytSearch(currentTrend);
		app.googleSearch(currentTrend);
		$('.responseContainer').empty()
	});
};

//  getTweet + compileTweet + Alchemy api train *********CHOO CHOO!*********
app.getTweets = function(trend){
	$.ajax({
		url : 'http://adamkendal.ca/twitterApp/tweets_json.php',
		type: 'GET',
		dataType: 'jsonp',
		data: {
			twitter_path: '1.1/search/tweets.json',		
			q: trend,
			// lang: 'en',
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

// Compile the most recent tweets about the topic into a single string for AlchemyAPI analysis
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
};

//First call to the AlchemyAPI -> Sentiment
app.analyzeSentiment = function(tweetText){
	$.ajax({
		url: 'http://access.alchemyapi.com/calls/text/TextGetTextSentiment',
		type: 'GET',
		dataType: 'json',
		data: {
			apikey: '2688b4b8ad81aea6d5c68644263b685f56bb0a12',
			outputMode: 'json',
			text:tweetText
		},
		success: function(response){
			var $sentimentResponse = $('<div>');
			var $sentimentTitle = $('<h5>');
			$sentimentTitle.text('Current mood:')
			$sentimentResponse.append($sentimentTitle);
			var $sentimentText = $('<p>');
			var score = Number(response.docSentiment.score).toFixed(2);
			var scorePercent = Math.abs((score*100)) + "%";
			$sentimentText.text(response.docSentiment.type + "  -  " + scorePercent);
			$sentimentResponse.append($sentimentText);
			$('.responseContainer').prepend($sentimentResponse);
			app.analyzeConcepts(tweetText);
		}
	})
};

 // Second call to the AlchemyAPI -> Concepts
app.analyzeConcepts = function(tweetText){
	$.ajax({
		url: 'http://access.alchemyapi.com/calls/text/TextGetRankedConcepts',
		type: 'GET',
		dataType: 'json',
		data: {
			apikey: '056e4cd044bcbf354af17edddb4539c7bf5a2593',
			outputMode: 'json',
			text:tweetText
		},
		success: function(response){
			var $conceptResponse = $('<div>');
			var $conceptTitle = $('<h5>');
			$conceptTitle.text('Related topics:')
			$conceptResponse.append($conceptTitle);
			for (var i=0; i < response.concepts.length; i++) {

				$conceptSingle = $('<span>');
				$conceptSingle.text(response.concepts[i].text);
				$conceptResponse.append($conceptSingle);
			}
			$('.responseContainer p').after($conceptResponse);
			
		}

	})
};  // End of tweet/alchemy train *******CHOO CHOO!!*****


// Alchemy News search, not included in current version
app.newsSearch = function(trend) {
	var trendClean = trend.replace(/#/g,'');
	trendClean = trendClean.replace(/([a-z])([A-Z])/g, '$1 $2');
	$.ajax({
		url: 'https://access.alchemyapi.com/calls/data/GetNews',
		type: 'GET',
		dataType: 'json',
		data: {
			apikey: '5f798feb1fb9ee663aa54a9e10a5d9ff179408c0',
			// apikey: '683e36423c68028f35d179e24943f3e8ab0e43d4',
			outputMode: 'json',
			start: 'now-30d',
			end: 'now',
			maxResults: '3',
			'q.enriched.url.enrichedTitle.keywords.keyword.text': trendClean,
			return: 'enriched.url.url,enriched.url.title'
		},
		success: function(response){
			console.log(response);
			var $newsResponse = $('<div>');
			for (var i=0; i < response.result.docs.length;i++) {
				var $newsItem = $('<a>');
				$newsItem.text(response.result.docs[i].source.enriched.url.title).attr('href', response.result.docs[i].source.enriched.url.url);
				$newsResponse.append($newsItem);
			};
			$('.alchemyNews').append($newsResponse);
			
		}
	})
};

// Call to the New York Times API for news articles
app.nytSearch = function(trend) {
	var trendClean = trend.replace(/#/g,'');
	trendClean = trendClean.replace(/([a-z])([A-Z])/g, '$1 $2');
	trendClean = '"'+trendClean+'"';
	console.log(trendClean);
	$.ajax({
		url:'http://api.nytimes.com/svc/search/v2/articlesearch.json',
		type: 'GET',
		dataType: 'json',
		data: {
			'api-key': '508b7350bc5f2988e72a8006250c508c:6:72641991',
			'response-format': 'json',
			'q': trendClean
		},
		success: function (response) {
			console.log(response);
			var $newsResponse = $('<div>');
			var $newsHeader = $('<h5>');
			$newsHeader.text('New York Times Articles');
			$newsResponse.append($newsHeader);
			for (var i=0; i < 3;i++) {
				var $newsBox = $('<div>');
				var $newsItem = $('<a>');
				$newsItem.text(response.response.docs[i].headline.main).attr('href', response.response.docs[i].web_url).attr('target','_blank');
				$newsBox.append($newsItem);
				$newsResponse.append($newsBox);
			};
			$('.responseContainer').append($newsResponse);
		}
	});
}

// Google search button for trend (hashtag removed)
app.googleSearch = function(trend) {
	var trendClean = trend.replace(/#/g,'');
	var googleUrl = 'https://www.google.ca/search?q='+trendClean+'&oq=create&aqs=chrome.0.69i59l2j69i60j69i65l2j69i61.741j0j9&sourceid=chrome&es_sm=91&ie=UTF-8';
	$('.googleSearch').attr('href',googleUrl);
}


app.init = function (){
	app.infoMenu();
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






