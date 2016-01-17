<?php
require 'tmhOAuth.php'; // Get it from: https://github.com/themattharris/tmhOAuth

$connection = new tmhOAuth(array(
  'consumer_key' => 'JNMDHTj7LA8Dk0h6ejIKq1XfV',
	'consumer_secret' => 'JLnObZL7OWlgRkRT6eTQ4vCdqYDfEKHChYYF1tsqgAGEORxsIn',
	'user_token' => '37882786-A5geJylvQiDqbDGfMZbLfID8eAkEU0v4HjJNheV0U', //access token
	'user_secret' => 'NAFCUtNjE5ra2uzRK6NvsFyGoU8HpWieIEdZh64y4uCFG' //access token secret
));

// set up parameters to pass
$parameters = array();

if ($_GET['id']) {
	$parameters['id'] = strip_tags($_GET['id']);
}

if ($_GET['twitter_path']) { $twitter_path = $_GET['twitter_path']; }  else {
	$twitter_path = '1.1/statuses/user_timeline.json';
}


$http_code = $connection->request('GET', $connection->url($twitter_path), $parameters );


if ($http_code === 200) { // if everything's good
	$response = strip_tags($connection->response['response']);

	if ($_GET['callback']) { // if we ask for a jsonp callback function
		echo $_GET['callback'],'(', $response,');';
	} else {
		echo $response;	
	}
} else {
	echo "Error ID: ",$http_code, "<br>\n";
	echo "Error: ",$connection->response['error'], "<br>\n";
}

// You may have to download and copy http://curl.haxx.se/ca/cacert.pem




















