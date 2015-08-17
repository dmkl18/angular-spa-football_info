<?php

require_once("base.php");

try{

    $teamData = json_decode(file_get_contents('php://input'), true);
    $id = (int)htmlspecialchars(trim($teamData["player"]));
    if(!$id) {
        Base::$status = 400;
        throw new Exception("You must specify query parameter 'player' and it must be an id of the player");
    }
    $db = Base::getDbConnection();
    $query = "UPDATE players SET goals=0 WHERE `id`='".$id."'";
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
            "message" => "The data was successfully deleted",
            "status" => Base::$status,
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