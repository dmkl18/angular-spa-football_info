<?php

require_once("base.php");

function createData() {
    return htmlspecialchars(trim($_GET['country']));
}

function createDataToReturn(array $data) {
    foreach($data as &$value) {
        $value["id"] = (int)$value["id"];
        $value["maxGames"] = (int)$value["maxGames"];
        $value["chL"] = (int)$value["chL"];
        $value["euL"] = (int)$value["euL"];
        $value["maxCountClubs"] = (int)$value["maxCountClubs"];
        $value["clubsToRemove"] = (int)$value["clubsToRemove"];
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

        $query = "SELECT id, name, max_games as maxGames, ch_league as chL, eu_league as euL, max_count_clubs as maxCountClubs, clubs_to_remove as clubsToRemove FROM countries WHERE name='".$country."'";
        $sth = $db->query($query);
        if(!$sth) {
            Base::$status = 500;
            throw new Exception("Can not connect to database");
        }
        $result = $sth->fetchAll(PDO::FETCH_ASSOC);
        if(!count($result)) {
            Base::$status = 400;
            throw new Exception("There is no such country");
        } else {
            $answer = [
                "message" => "Country was found successfully",
                "status" => Base::$status,
                "value" => createDataToReturn([$result[0]])[0],
            ];
            Base::setStatus();
            echo json_encode($answer);
        }
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