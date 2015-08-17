<?php

require_once("base.php");

function createData($player) {
    $data = [];
    $data["id"] = (int)htmlspecialchars(trim($player["id"]));
    $data["club_id"] = (int)htmlspecialchars(trim($player["clubId"]));
    $data["goals"] = (int)htmlspecialchars(trim($player["goals"]));
    return $data;
}

try {

    $data = json_decode(file_get_contents("php://input"), true);
    if(!$data["player"]) {
        Base::$status = 400;
        throw new Exception("You must specify query parameter 'player'");
    } else {
        $db = Base::getDbConnection();
        $data = createData($data["player"]);

        $query = "UPDATE `players` SET goals='".$data["goals"]."', club_id=".$data["club_id"]." WHERE id='".$data["id"]."'";
        $sth = $db->query($query);

        if(!$sth) {
            Base::$status = 500;
            throw new Exception("Can not connect to database");
        }
        else {
            $rowsUpdated = $sth->rowCount();
            if(!$rowsUpdated) {
                Base::$status = 400;
                throw new Exception("There is no such player");
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