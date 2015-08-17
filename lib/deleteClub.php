<?php

require_once("base.php");

try{

    $teamData = json_decode(file_get_contents('php://input'), true);
    $id = (int)htmlspecialchars(trim($teamData["club"]));

    if(!$id) {
        Base::$status = 400;
        throw new Exception("You must specify query parameter 'club' which will be id of the club");
    }

    $db = Base::getDbConnection();
    $query = "DELETE FROM `clubs` WHERE `id`='".$id."'";
    $sth = $db->query($query);
    if(!$sth) {
        Base::$status = 500;
        throw new Exception("Can not connect to database");
    }
    else {
        if(!$sth->rowCount()) {
            Base::$status = 400;
            throw new Exception("There is no such club");
        }
        Base::setStatus();
        $answer = [
            "message" => "The data was successfully deleted",
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