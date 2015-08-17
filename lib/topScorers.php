<?php

require_once("base.php");

function createData() {
    return htmlspecialchars(trim($_GET['country']));
}

function createDataToReturn(array $data) {
    foreach($data as &$value) {
        $value["id"] = (int)$value["id"];
        $value["clubId"] = (int)$value["clubId"];
        $value["age"] = (int)$value["age"];
        $value["goals"] = (int)$value["goals"];
    }
    return $data;
}

try{

    if(!$_GET['country']) {
        Base::$status = 400;
        throw new Exception("You must specify query parameter 'country'");
    } else {
        $db = Base::getDbConnection();
        $country = createData();

        $query = "SELECT id FROM countries WHERE name='".$country."'";
        $sth = $db->query($query);
        if(!$sth) {
            Base::$status = 500;
            throw new Exception("Can not connect to database");
        }
        $result = $sth->fetchAll(PDO::FETCH_ASSOC);
        if(!count($result)) {
            Base::$status = 400;
            throw new Exception("There is no such country");
        }
        $idCountry = (int)$result[0]["id"];

        $subQuery1 = "SELECT id FROM clubs WHERE id_country=".$idCountry;
        $query = "SELECT players.id as id, players.name as `name`, players.club_id as clubId, clubs.name as clubName, age, goals FROM players INNER JOIN clubs ON players.club_id=clubs.id AND players.club_id IN (".$subQuery1.") AND goals > 0 ORDER BY goals DESC";
        if($_GET["limit"]) {
            $limit = (int)htmlspecialchars(trim($_GET["limit"]));
            $query .= " LIMIT ".$limit;
        }
        $sth = $db->query($query);
        if(!$sth) {
            Base::$status = 500;
            throw new Exception("Can not connect to database");
        }
        $result = $sth->fetchAll(PDO::FETCH_ASSOC);
        $countResult = count($result);

        if($countResult) {
            $data = createDataToReturn($result);
            $answer = [
                "message" => "There were ".$countResult." found",
                "status" => Base::$status,
                "values" => $data,
            ];
        } else {
            $answer = [
                "message" => "There is no clubs in the country",
                "status" => Base::$status,
                "values" => [],
            ];
        }
        Base::setStatus();
        echo json_encode($answer);
    }

}
catch(Exception $e) {
    Base::setStatus();
    echo json_encode([
        "mistake" => $e->getMessage(),
        "status" => Base::$status,
    ]);
}

?>