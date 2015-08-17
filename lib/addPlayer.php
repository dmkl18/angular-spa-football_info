<?php

require_once("base.php");

function createData($teamData) {
    $data = [];
    $data['name'] = "'".htmlspecialchars(trim($teamData['name']))."'";
    $data['age'] = (int)htmlspecialchars(trim($teamData['age']));
    $data['goals'] = (int)htmlspecialchars(trim($teamData['goals']));
    $data['passes'] = (int)htmlspecialchars(trim($teamData['passes']));
    $data['rating'] = (int)((float)$teamData['rating'] * 10);
    $data['position'] = (int)htmlspecialchars(trim($teamData['positionId']));
    $data['club_id'] = (int)htmlspecialchars(trim($teamData['clubId']));
    return $data;
}

try{

    $data = json_decode(file_get_contents('php://input'), true);

    if(!$data['player']) {
        Base::$status = 400;
        throw new Exception("You must enter an information about player");
    } else {
        $db = Base::getDbConnection();

        $data = createData($data["player"]);
        $query = "SELECT id FROM players WHERE name=".$data["name"]." AND age='".$data["age"]."'";
        $sth1 = $db->query($query);
        if(!$sth1) {
            Base::$status = 500;
            throw new Exception("Cannot connect to database");
        }
        $result = $sth1->fetchAll(PDO::FETCH_ASSOC);
        if(count($result)) {
            Base::$status = 400;
            throw new Exception("Sorry, but player with such name and age is already exists");
        }

        $keys = implode(',', array_keys($data));
        $values = implode(',', array_values($data));
        $query1 = "INSERT INTO `players` (".$keys.") VALUES (".$values.")";
        $query2 = "SELECT LAST_INSERT_ID() as `id` FROM `players` LIMIT 1";
        try {
            if(!$db->beginTransaction()) {
                Base::$status = 500;
                throw new Exception("Cannot connect to database");
            }
            $sth = $db->query($query1);
            if(!$sth || $sth->rowCount() === 0) {
                Base::$status = 500;
                throw new Exception("Cannot connect to database");
            }
            $sth = $db->query($query2);
            if(!$sth) {
                Base::$status = 500;
                throw new Exception("Cannot connect to database");
            }
            $db->commit();
        }
        catch(Exception $e) {
            $db->rollBack();
            Base::$status = 500;
            throw new Exception("Cannot add player. Please try again later");
        }
        $id = (int)$sth->fetchAll(PDO::FETCH_ASSOC)[0]["id"];
        Base::setStatus();
        $answer = [
            "message" => "The data was successfully added",
            "status" => Base::$status,
            "id" => $id,
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