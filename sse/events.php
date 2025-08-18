<?php
set_time_limit(0);
header("Content-Type: text/event-stream");
header("Cache-Control: no-cache");
header("Connection: keep-alive");
ob_end_flush();

$message = "Hello! I am your assistant. How Can I help you today";
foreach(str_split($message) as $letter ){
    echo "event: message\n";
    echo "data: ".$letter."\n\n\n";
    flush(); //Flush partial messages 

    if( connection_aborted ()) break; //if the user eliminates the web, stop sending data 

    usleep( 1000 * 50 );
}

echo "event: stop\n";
echo "data: stopped\n\n"; 