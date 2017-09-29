<?php
    /*Template program that can set an request a url;
    then it will parse the recived html for player stats data
    This is specifically for espn.com nfl QB stats
    Made as general purpose as possible, So far can only handle top 40 in any position*/
    //header('Content-type: text/plain');
    libxml_use_internal_errors(true);
    
    $OFFstats=array('PLAYER','TEAM','TD','YDS/G');
    $statsURL = array('passing','rushing','receiving');
    $baseurl = "http://www.espn.com/nfl/statistics/player/_/stat/";
    $MySQLi = MySQLiConnection();
    foreach ($statsURL as $type){
        //echo $type, "<br>";
        switch ($type){
            case "passing": $tableName='QB';
                            break;
            case "rushing": $tableName='RB';
                            break;
            case "receiving": $tableName='WR';
                              break;
        }
        $url = $baseurl . $type;
        $DOMobj = requestHTML($url);
        $statTypesforParse = indexStatType($DOMobj);
        $displayStats = ParseforStats($DOMobj, $statTypesforParse);
        InsertDB($displayStats, $MySQLi);
        //$checkResult = CheckNullTable($MySQLi);
        //UpdateDBtables($displayStats, $MySQLi, $checkResult);
    }
    MySQLiClose($MySQLi);
    
/////////////////////////FUNCTION DEFINITIONS//////////////////////////////
    function requestHTML ($src){
        //echo "Called:function requestHTML";
        $request = file_get_contents($src);
        if($request){
            $html = new DOMDocument();
            $html->loadHTML($request);
            $html->validateOnParse = true;
            return $html;
        }else {
            echo "Request failed";
        }
    }//returns a value
    
    function indexStatType($parseObj){
        //echo "Called:function indexStatType";
        $statsIndex = array();
        global $OFFstats;
        $getTable=$parseObj->getElementsByTagName("table");
        $table=$getTable->item(0);
        $statTypes=$table->firstChild->getElementsByTagName('td');
        
        for($i=0;$i<count($OFFstats);$i++){
            for($j=0; $j<$statTypes->length; $j++){
             if($OFFstats[$i]==($statTypes->item($j)->nodeValue)){
                 $statsIndex[]=$j;
             }   
            }
        }
        return $statsIndex;
    }//returns a value
    
    function ParseforStats($doc, $STP){
        $col=0;
        $statsArray=array();
        $accesstable = $doc->getElementsByTagName("table");//find table elements
        
        foreach ($accesstable as $rows){//interate through table elements
            $rowdata = $rows->getElementsByTagName("tr");//get row elements
            foreach ($rowdata as $rowdatanodes){//interate through row elements
                //var_dump($rowdatanodes->firstChild);
                if($rowdatanodes->firstChild->nodeValue != "RK"){//if not a col_head row do this
                    $statsArray[]=array(count($STP));
                    $data = $rowdatanodes->getElementsByTagName("td");//get data elements
                    //var_dump($data);
                    for ($i=0; $i<count($STP); $i++){//iterate through data elements    
                        $statsArray[$col][$i] = $i>1?(int)$data->item($STP[$i])->nodeValue:$data->item($STP[$i])->nodeValue;
                    } 
                    $col++;
                }   
            }
        }
        return $statsArray;
    }//returns a value

    function MySQLiConnection(){    
        //Create connection to database with Object Oriented MySQLi debugged an working properly
        //Might turn it into a function later for modularity
            $servername = getenv('IP');
            $username = getenv('C9_USER');
            $password = "";
            $database = "NFLSTATS";
            $dbport = 3306;
            
            // Create connection
            $db = new mysqli($servername, $username, $password, $database, $dbport);
        
            // Check connection
            if ($db->connect_error) {
                die("Connection failed: " . $db->connect_error);
            } 
            echo "Connected successfully (".$db->host_info.")";
            return $db;
    }//returns a value 
    
    function CheckNullTable($dbConn){
        $MySQLiCheckTable = "SELECT Player FROM ";
        global $tableName;
        $t = $tableName . " LIMIT 1";
        $MySQLiCheckTable = $MySQLiCheckTable . $t;
        
        $result=$dbConn->query($MySQLiCheckTable);
        if ($result) {
                echo "Check accomplished table has value(s)<br>";
                //var_dump($result);
        } else {
                echo "Error: " . $MySQLiCheckTable . "<br>" . $dbConn->error;
        }
        echo "<br>";
        return $result->lengths;
    }//returns a value
    
    function InsertDB($DBstats, $MySQLiObj){
            global $tableName;
            echo $tableName, "<br>";
            $SEG2 = "VALUES";
            $r=0;
            foreach ($DBstats as $inner){
                $c=0;
                foreach ($inner as $output){
                    switch($c){
                        case 0:$player=$MySQLiObj->real_escape_string($output);
                                break;
                        case 1:$team=$MySQLiObj->real_escape_string($output);
                                break;
                        case 2:$td=$output;
                                break;
                        case 3:$ydsg=$output;
                                break;
                    }
                    if($r==39){
                        $SEG3 = " ('$player','$team',$td,$ydsg)";
                    }else{
                        $SEG3 = " ('$player','$team',$td,$ydsg),";
                    }
                    $c++;
                }
                //echo $SEG3;
                $SEG2 .= $SEG3;
                $r++;
            }
            //echo $SEG2;
            $SEG1 = "INSERT INTO " . $tableName . " (PLAYER,TEAM,TD,YDSPERGAME) ";
            $sqlINSERTdata = $SEG1 . $SEG2;
            echo $sqlINSERTdata;
        
            if ($MySQLiObj->query($sqlINSERTdata) === TRUE) {
                echo "New record created successfully";
            } else {
                echo "Error: " . $sqlINSERTdata . "<br>" . $MySQLiObj->error;
            }
            echo "<br>";
        }
    
    /*function UpdateDBtables($DBstats, $MySQLiObj, $tableExists){
        //foreach loops iterating through a 2d array of player stats
        //    $DBstats= 40 arrays with 5 elements
        //    switch statement used to differentiate stat type for later sql INSERT statement
        
        //global $tableName;
        
        function UpdateDB(){
                foreach ($DBstats as $inner){
                    $c=0;
                    foreach ($inner as $output){
                        switch($c){
                            case 0:$player=$output;
                                    break;
                            case 1:$team=$output;
                                    break;
                            case 2:$td=$output;
                                    break;
                            case 3:$ydsg=$output;
                                    break;
                        }
                        $c++;
                    }
                }  
            $sqlUPDATEdata = "UPDATE " . $tableName . " SET PLAYER='$player', TEAM='$team', TD=$td, YDSPERGAME=$ydsg";
            if ($MySQLiObj->query($sqlUPDATEdata) === TRUE) {
                echo "New record created successfully";
            } else {
                echo "Error: " . $sqlUPDATEdata . "<br>" . $MySQLiObj->error;
            }
            echo "<br>";
        }
    }
    */
    function MySQLiClose($EndConnection){
       //close connection
       $EndConnection->close();
    }

?>