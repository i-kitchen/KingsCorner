<?php
class DB
{
    private $connection;

    function __construct()
    {
        require_once("../../../dbinfo.php");

        // Connect to db server
        $this->connection = new mysqli($host, $user, $password, $db);

        // Check connection
        if($this->connection->connect_error)
        {
            echo "Connect failed: ".mysqli_connect_error();
            die();
        }
    }

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