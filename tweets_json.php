<?php
require_once('TwitterAPIExchange.php');


$settings = array(
    'oauth_access_token' => "37882786-A5geJylvQiDqbDGfMZbLfID8eAkEU0v4HjJNheV0U",
    'oauth_access_token_secret' => "NAFCUtNjE5ra2uzRK6NvsFyGoU8HpWieIEdZh64y4uCFG",
    'consumer_key' => "JNMDHTj7LA8Dk0h6ejIKq1XfV",
    'consumer_secret' => "JLnObZL7OWlgRkRT6eTQ4vCdqYDfEKHChYYF1tsqgAGEORxsIn"
);



$url = "https://api.twitter.com/1.1/search/tweets.json";
$requestMethod = "GET";

if (isset($_GET['count'])) {$count = $_GET['count'];} else {$count = 20;}

if (isset($_GET['q'])) {$q = $_GET['q'];} else {$q = pizza;}

if (isset($_GET['geocode'])) {$geocode = $_GET['geocode'];} else {$geocode = "43.7182713,-79.3777061,300mi";}

if (isset($_GET['result_type'])) {$result_type = $_GET['result_type'];} else {$result_type = mixed;}




$getfield = "?count=$count&q=$q&geocode=$geocode&result_type=$result_type";
$twitter = new TwitterAPIExchange($settings);
echo $twitter->setGetfield($getfield)
             ->buildOauth($url, $requestMethod)
             ->performRequest();









