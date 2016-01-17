<?php
session_start();
require_once("twitteroauth/twitteroauth/twitteroauth.php"); //Path to twitteroauth library
 
$twitteruser = "abkendal";
$notweets = 2;
$consumerkey = "JNMDHTj7LA8Dk0h6ejIKq1XfV";
$consumersecret = "JLnObZL7OWlgRkRT6eTQ4vCdqYDfEKHChYYF1tsqgAGEORxsIn";
$accesstoken = "37882786-A5geJylvQiDqbDGfMZbLfID8eAkEU0v4HjJNheV0U";
$accesstokensecret = "NAFCUtNjE5ra2uzRK6NvsFyGoU8HpWieIEdZh64y4uCFG";
 
function getConnectionWithAccessToken($cons_key, $cons_secret, $oauth_token, $oauth_token_secret) {
  $connection = new TwitterOAuth($cons_key, $cons_secret, $oauth_token, $oauth_token_secret);
  return $connection;
}
 
$connection = getConnectionWithAccessToken($consumerkey, $consumersecret, $accesstoken, $accesstokensecret);
 
// $tweets = $connection->get("https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=".$twitteruser."&count=".$notweets);
 
// echo json_encode($tweets);


// set up parameters to pass
$parameters = array();

if ($_GET['q']) {
	$parameters['q'] = strip_tags($_GET['q']);
}

if ($_GET['twitter_path']) { $twitter_path = $_GET['twitter_path']; }  else {
	$twitter_path = '1.1/statuses/user_timeline.json';
}

$followers = $connection->get("https://api.twitter.com/1.1/trends/place.json?id=4118");
// $search = $connection->request('GET', $connection->url($twitter_path), $parameters);

echo json_encode($followers);


?>