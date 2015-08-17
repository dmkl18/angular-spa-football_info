<?php

require_once("base.php");

function createData($id) {
    $id = (int)htmlspecialchars(trim($id));
    return $id;
}

try{

    $data = json_decode(file_get_contents('php://input'), true);

    if(!$data['player']) {
        Base::$status = 400;
        throw new Exception("You must enter an information about player to delete");
    }
    else {
        $db = Base::getDbConnection();
        $id = createData($data["player"]);
        if(!$id) {
            Base::$status = 400;
            throw new Exception("Sorry, but you must add an id of the player");
        }
        $query = "DELETE FROM `players` WHERE `id`='".$id."'";
        $sth = $db->query($query);
        if(!$sth) {
            Base::$status = 500;
            throw new Exception("Cannot connect to database");
        }
        else {
            if($sth->rowCount() === 0) {
                Base::$status = 400;
                throw new Exception("Sorry, but there is no player with such id");
            }
            Base::setStatus();
            echo json_encode([
                "message" => "The data was successfully deleted",
                "status" => Base::$status,
                "id" => $id,
            ]);
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