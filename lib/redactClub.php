<?php

require_once("base.php");

function createData($teamData) {
    $data = [];
    $data['id'] = (int)htmlspecialchars(trim($teamData['id']));
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
        $query = "UPDATE `clubs` SET `name`=".$data["name"].",`games`=".$data["games"].",`wins`=".$data["wins"].",`draws`=".$data["draws"].",`gs`=".$data["gs"].",`ga`=".$data["ga"]." WHERE `id`=".$data["id"];
        $sth = $db->query($query);
        if(!$sth) {
            Base::$status = 500;
            throw new Exception("Can not connect to database");
        }
        else {
            $rowsUpdated = $sth->rowCount();
            if(!$rowsUpdated) {
                Base::$status = 400;
                throw new Exception("There is no such club");
            }
            Base::setStatus();
            $answer = [
                "message" => "The data was successfully updated",
                "status" => Base::$status,
            ];
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