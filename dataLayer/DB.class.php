<?php
class DB
{
    private $connection;

    function __construct()
    {
        require_once("../../../../dbinfo.php");

        // Connect to db server
        $this->connection = new mysqli($host, $user, $password, $db);

        // Check connection
        if($this->connection->connect_error)
        {
            echo "Connect failed: ".mysqli_connect_error();
            die();
        }
    }

    /**
     * [validateLogin description]
     * @param  [type] $user [description]
     * @param  [type] $pass [description]
     * @return [type]       [description]
     */
    function validateLogin($user, $pass) {
        $success = false;

        if($stmt = $this->connection->prepare("select id,username,pass from kings_user where username=? AND pass=?"))
        {
            $stmt->bind_param("ss", $user, $pass);
            $stmt->execute();
            $stmt->store_result();
            $stmt->bind_result($id, $username, $pass);

            if($stmt->num_rows > 0)
            {
                // Fetch the results and return the user id
                $stmt->fetch();
                $success = array('user' => $username, 'id' => $id);
            }
        }

        return $success;
    }

    /**
     * [createUser description]
     * @param  [type] $uname [description]
     * @param  [type] $pass  [description]
     * @return [type]        [description]
     */
    function createUser($uname, $pass) {
        $queryString = "insert into kings_user (username, pass) values (?,?)";
        $insertId = "-1";

        if($stmt = $this->connection->prepare($queryString))
        {
            $initialPlayer = 0;
            $stmt->bind_param("ss", $socketId, $pass);
            $stmt->execute();
            $stmt->store_result();
            $insertId = $stmt->insert_id;
        }

        return $insertId;
    }

    /**
     * [createGame description]
     * @param  [type] $player1 [description]
     * @param  [type] $deck    [description]
     * @param  [type] $p1hand  [description]
     * @param  [type] $p2hand  [description]
     * @param  [type] $n       [description]
     * @param  [type] $s       [description]
     * @param  [type] $e       [description]
     * @param  [type] $w       [description]
     * @return [type]          [description]
     */
    function createGame($player1, $deck, $p1hand, $p2hand, $n, $s, $e, $w) {
        $queryString = "insert into kings_game (deck, northPile, southPile, westPile, eastPile, whosturn, player1, player1_hand, player2_hand) values (?,?,?,?,?,?,?,?,?)";
        $insertId = "-1";

        if($stmt = $this->connection->prepare($queryString))
        {
            $initialPlayer = 0;
            $stmt->bind_param("sssssisss", $deck, $n, $s, $e, $w, $initialPlayer, $player1, $p1hand, $p2hand);
            $stmt->execute();
            $stmt->store_result();
            $insertId = $stmt->insert_id;
        }

        return $insertId;
    }// END createGame

    /**
     * [updateUser description]
     * @param  [type] $userId [description]
     * @param  [type] $wsId   [description]
     * @param  [type] $gameId [description]
     * @return [type]         [description]
     */
    function updateUser($userId, $wsId, $gameId) {
        $queryString = "update kings_user set websocket=?,gameId=? where id=?";
        $numRows = 0;

        if($stmt = $this->connection->prepare($queryString)) {
            $stmt->bind_param("sii", $wsId, $gameId, $userId);
            $stmt->execute();
            $stmt->store_result();
            $numRows = $stmt->affected_rows;
        }
        return $numRows;
    }// END updateUser

    function getAllPeople()
    {
        $data = array();

        if($stmt = $this->connection->prepare("select * from people"))
        {
            $stmt->execute();
            $stmt->store_result();
            $stmt->bind_result($id, $last, $first, $nickname);

            if($stmt->num_rows > 0)
            {
                while($stmt->fetch())
                {
                    $data[] = array(
                        'id'       => $id,
                        'last'     => $last,
                        'first'    => $first,
                        'nickname' => $nickname
                    );
                }
            }
        }

        return $data;
    }

    function getAllPeopleAsTable()
    {
        $data = $this->getAllPeople();

        if(count($data)>0)
        {
            $bigString = "<table border='1'>
                            <tr>
                              <th>ID</th>
                              <th>First</th>
                              <th>Last</th>
                              <th>Nick</th>
                            </tr>";

            foreach($data as $row)
            {
                $bigString .= "<tr>
                                   <td><a href='phones.php?id={$row['id']}'>{$row['id']}</a></td>
                                   <td>{$row['first']}</td>
                                   <td>{$row['last']}</td>
                                   <td>{$row['nickname']}</td>
                               </tr>";
            }
            $bigString .= "</table>";
        }
        else
        {
            $bigString = "<h2>No people exist</h2>";
        }

        return $bigString;
    }

    function insert($last, $first, $nick)
    {
        $queryString = "insert into people (LastName,FirstName,NickName) values (?,?,?)";
        $insertId = "-1";

        if($stmt = $this->connection->prepare($queryString))
        {
            $stmt->bind_param("sss", $last, $first, $nick);
            $stmt->execute();
            $stmt->store_result();
            $insertId = $stmt->insert_id;
        }

        return $insertId;
    }

    function update($field)
    {
        $queryString = "update people set ";
        $insertId = 0;
        $numRows = 0;
        $items = array();
        $types = "";

        foreach($field as $key => $value)
        {
            switch($key)
            {
                case "nick":
                    $queryString .= "NickName = ?,";
                    $items[] = &$value;
                    $types .= "s";
                    break;
                case "first":
                    $queryString .= "FirstName = ?,";
                    $items[] = &$value;
                    $types .= "s";
                    break;
                case "last":
                    $queryString .= "LastName = ?,";
                    $items[] = &$value;
                    $types .= "s";
                    break;
                case "id":
                    $insertId = $value;
                    break;
            }
        }
        $queryString = trim($queryString, ",");
        $queryString .= " where PersonID = ?";
        $types .= "i";
        $items[] = &$insertId;

        if($stmt = $this->connection->prepare($queryString))
        {
            $refArr = array_merge(array($types), $items);
            $ref = new ReflectionClass("mysqli_stmt");
            $method = $ref->getMethod("bind_param");
            $method->invokeArgs($stmt, $refArr);

            $stmt->execute();
            $stmt->store_result();
            $numRows = $stmt->affected_rows;
        }
        return $numRows;
    }

    function delete($id)
    {
        $queryString = "delete from people where PersonID = ?";
        $numRows = 0;

        if($stmt = $this->connection->prepare($queryString))
        {
            $stmt->bind_params("i", intval($id));
            $stmt->execute();
            $stmt->store_result();
            $numRows = $stmt->affected_rows();
        }
        return $numRows;
    }
}