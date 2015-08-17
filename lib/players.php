<?php

require_once("base.php");

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

try{

    $data = $_GET;

    if(!$data['club'] || !$data['country']) {
        Base::$status = 400;
        throw new Exception("You have to send 'club' and 'country' parameters");
    } else {

        $db = Base::getDbConnection();
        $country = htmlspecialchars(trim($data['country']));
        $club = htmlspecialchars(trim($data['club']));

        if($club === "free" && $country === "no country") {
            $query = "SELECT players.id as id, players.name as name, age, goals, passes, rating, club_id as clubId, position as positionId, positions.name as position FROM players INNER JOIN positions ON players.position=positions.id WHERE players.club_id IS NULL";
            $sth = $db->query($query);
            if (!$sth) {
                Base::$status = 500;
                throw new Exception("Can not connect to database");
            }
            $result = $sth->fetchAll(PDO::FETCH_ASSOC);
            if (count($result)) {
                $answer = [
                    "message" => "The data was successfully found",
                    "status" => Base::$status,
                    "clubId" => -1,
                    "clubName" => '',
                    "values" => prepareData($result),
                ];
            } else {
                $answer = [
                    "message" => "There is no free players now",
                    "status" => Base::$status,
                    "clubId" => -1,
                    "clubName" => '',
                    "values" => [],
                ];
            }
        }
        else {
            $headers = getallheaders();

            $subQuery1 = "SELECT id FROM countries WHERE name='" . $country . "'";
            $query = "SELECT id, name FROM clubs WHERE name='" . $club . "' AND id_country=(" . $subQuery1 . ") LIMIT 1";
            $sth = $db->query($query);
            if (!$sth) {
                throw new Exception("Cannot connect to database");
            }
            $result = $sth->fetchAll(PDO::FETCH_ASSOC);
            if (!count($result)) {
                Base::$status = 400;
                throw new Exception("There is no such club");
            }
            $clubId = (int)$result[0]["id"];
            $clubName = $result[0]["name"];
            $query = "SELECT players.id as id, players.name as name, age, goals, passes, rating, club_id as clubId, position as positionId, positions.name as position FROM players INNER JOIN positions ON players.position=positions.id WHERE players.club_id IN (" . $clubId . ")";
            if ($headers["X-OrderBy"]) {
                $query .= " ORDER BY " . htmlspecialchars(trim($headers["X-OrderBy"]));
                if ($headers["X-OrderDirection"]) {
                    $query .= " DESC";
                }
            } else {
                $query .= "ORDER BY positionId";
            }
            if ($headers["X-Limit"]) {
                $query .= " LIMIT " . (int)$headers["X-Limit"];
            }

            $sth = $db->query($query);
            if (!$sth) {
                Base::$status = 500;
                throw new Exception("Can not connect to database");
            }
            $result = $sth->fetchAll(PDO::FETCH_ASSOC);
            if (count($result)) {
                $answer = [
                    "message" => "The data was successfully found",
                    "status" => Base::$status,
                    "clubId" => $clubId,
                    "clubName" => $clubName,
                    "values" => prepareData($result),
                ];
            } else {
                $answer = [
                    "message" => "There is no information about players of such club now",
                    "status" => Base::$status,
                    "clubId" => $clubId,
                    "clubName" => $clubName,
                    "values" => [],
                ];
            }
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