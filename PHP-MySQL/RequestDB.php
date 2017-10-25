<?php
    $MySQLi = MySQLiConnection();
    RequestTable($MySQLi);
    MySQLiClose($MySQLi);
    
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
        //echo "Connected successfully (".$db->host_info.")";
        return $db;
    }//returns a value 
        
    function RequestTable($MySQLiObj){
        $table = $MySQLiObj->real_escape_string($_GET['q']);
        $sqlRequest = "SELECT * FROM " . $table;
        $result = $MySQLiObj->query($sqlRequest);
        /*if ($result == TRUE) {
                echo "New record created successfully";
            } else {
                echo "Error: " . $sqlRequest . "<br>" . $MySQLiObj->error;
            }
        */
        echo "<table id='CurrStats'>
        <tr>
        <th>ID</th>
        <th>PLAYER</th>
        <th>TEAM</th>
        <th>TD</th>
        <th>YDSPERGAME</th>
        </tr>";
        while($row = mysqli_fetch_array($result)) {
            $player = $row['PLAYER'];

            echo "<tr class='playerBtn' name='$player'>";
            echo "<td>" . $row['ID'] . "</td>";
            echo "<td>" . $row['PLAYER'] . "</td>";
            echo "<td>" . $row['TEAM'] . "</td>";
            echo "<td>" . $row['TD'] . "</td>";
            echo "<td>" . $row['YDSPERGAME'] . "</td>";
            echo "</tr>";
        }
        echo "</table>";
        //return $result;
    }
    
    function MySQLiClose($EndConnection){
       //close connection
       $EndConnection->close();
    }
?>