<?php
set_time_limit(0);
header("Content-Type: text/event-stream");
header("Cache-Control: no-cache");
header("Connection: keep-alive");
ob_end_flush();

while( true ){
    echo "event: message\n";
    echo "data: " . date("H:i:s") . "\n\n";
    flush(); //Flush partial messages 

    if( connection_aborted ()) break; //if the user eliminates the web, stop sending data 

    sleep( 1 );
}


