<?php

require_once("base.php");

function prepareDataTo($data) {
    $newData = [];
    $newData["country"] = htmlspecialchars(trim($data["country"]));
    $newData["page"] = (int)$data["page"];
    $newData["countOnPage"] = (int)$data["countOnPage"];
    return $newData;
}

function prepareData(array $data) {
    foreach($data as &$player) {
        $player["id"] = (int)$player["id"];
        $player["age"] = (int)$player["age"];
        $player["goals"] = (int)$player["goals"];
        $player["passes"] = (int)$player["passes"];
        $player["rating"] = (float)($player["rating"]/10);
        $player["positionId"] = (int)$player["positionId"];
        $player["clubId"] = (int)$player["clubId"];
    }
    return $data;
}

try {

    $data = prepareDataTo($_GET);
    if(!$data["country"] || !$data["page"] || !$data["countOnPage"] || $data["page"] <= 0 || $data["countOnPage"] <= 0) {
        Base::$status = 400;
        throw new Exception("You have to send 'country', 'page' and 'countOnPage' parameters");
    }
    else if($data["page"] <= 0 || $data["countOnPage"] <= 0) {
        Base::$status = 400;
        throw new Exception("'page' must be more than 0");
    }
    else {
        $db = Base::getDbConnection();
        $query = "SELECT id FROM countries WHERE name = '".$data["country"]."'";
        $sth = $db->query($query);
        if(!$sth) {
            Base::$status = 500;
            throw new Exception("Can not connect to database");
        }
        $result = $sth->fetchAll(PDO::FETCH_ASSOC);
        $countryId = $result[0]["id"];
        if(!$countryId) {
            Base::$status = 400;
            throw new Exception("There is no such country");
        }
        $query = "SELECT COUNT(players.id) as `count` FROM players INNER JOIN clubs ON players.club_id=clubs.id AND id_country = ".$countryId;
        $sth = $db->query($query);
        if(!$sth) {
            Base::$status = 500;
            throw new Exception("Can not connect to database");
        }
        $result = $sth->fetchAll(PDO::FETCH_ASSOC)[0]['count'];
        $limit = $data["countOnPage"];
        $lim = ($data["page"] - 1) * $data["countOnPage"];
        if($result < $lim + 1) {
            Base::$status = 400;
            throw new Exception("There is no page number ".$data["page"]);
        }
        $query = "SELECT players.id as id, players.name as name, age, goals, passes, rating, club_id as clubId, clubs.name as club, position as positionId, positions.name as position FROM players INNER JOIN positions ON players.position=positions.id INNER JOIN clubs ON players.club_id = clubs.id AND clubs.id_country = ".$countryId." ORDER BY rating DESC LIMIT ".$lim.",".$limit;
        $sth = $db->query($query);
        if(!$sth) {
            Base::$status = 500;
            throw new Exception("Can not connect to database");
        }
        $result2 = $sth->fetchAll(PDO::FETCH_ASSOC);
        if(!count($result2)) {
            Base::$status = 400;
            throw new Exception("There is no data");
        }
        Base::setStatus();
        $answer = [
            "message" => "The data was successfully found",
            "status" => Base::$status,
            "values" => prepareData($result2),
            "page" => (int)$data["page"],
            "pages" => ceil($result / $data["countOnPage"]),
        ];
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