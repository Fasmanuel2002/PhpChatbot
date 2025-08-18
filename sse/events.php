<?php
header( "Content-type: text/event-stream" );
header( "Cache-Control: no-cache" );
ob_end_flush();

while( true ){
    echo "event: message \n";
    echo "data: dadada \n\n";
    flush(); //Flush partial messages 

    if( connection_aborted ()) break; //if the user eliminates the web, stop sending data 

    sleep( 1 );
}


