<?php

require_once("base.php");

function createData($teamData) {
    $data = [];
    $data['name'] = "'".htmlspecialchars(trim($teamData['name']))."'";
    $data['games'] = (int)htmlspecialchars(trim($teamData['games']));
    $data['wins'] = (int)htmlspecialchars(trim($teamData['wins']));
    $data['draws'] = (int)htmlspecialchars(trim($teamData['draws']));
    $data['ga'] = (int)htmlspecialchars(trim($teamData['ga']));
    $data['gs'] = (int)htmlspecialchars(trim($teamData['gs']));
    $data['id_country'] = (int)htmlspecialchars(trim($teamData['countryId']));
    return $data;
}

try{

    $teamData = json_decode(file_get_contents('php://input'), true);

    if(!$teamData["club"]) {
        Base::$status = 400;
        throw new Exception("You must specify query parameter 'club'");
    } else {
        $db = Base::getDbConnection();
        $data = createData($teamData["club"]);
        $keys = implode(',', array_keys($data));
        $values = implode(',', array_values($data));
        $query1 = "INSERT INTO `clubs` (".$keys.") VALUES (".$values.")";
        $query2 = "SELECT LAST_INSERT_ID() as `id` FROM `clubs` LIMIT 1";
        try {
            if(!$db->beginTransaction()) {
                throw new Exception("Can not connect to database");
            }
            $sth1 = $db->query($query1);
            if(!$sth1) {
                throw new Exception("Can not connect to database");
            }
            $sth2 = $db->query($query2);
            if(!$sth2) {
                throw new Exception("Can not connect to database");
            }
            $result = $sth2->fetchAll(PDO::FETCH_ASSOC);
            if(!count($result)) {
                throw new Exception("Can not add data to database. Try again later.");
            }
            $db->commit();
        }
        catch(Exception $e) {
            $db->rollBack();
            Base::$status = 500;
            throw new Exception($e->getMessage());
        }

        Base::setStatus();
        $answer = [
            "message" => "The data was successfully added",
            "status" => Base::$status,
            "value" => (int)$result[0]["id"],
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