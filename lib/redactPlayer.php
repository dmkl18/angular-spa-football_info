<?php

require_once("base.php");

function createData($teamData) {
    $data = [];
    $data['id'] = (int)htmlspecialchars(trim($teamData['id']));
    $data['name'] = "'".htmlspecialchars(trim($teamData['name']))."'";
    $data['age'] = (int)htmlspecialchars(trim($teamData['age']));
    $data['goals'] = (int)htmlspecialchars(trim($teamData['goals']));
    $data['passes'] = (int)htmlspecialchars(trim($teamData['passes']));
    $data['rating'] = (int)((float)$teamData['rating'] * 10);
    $data['position'] = (int)htmlspecialchars(trim($teamData['positionId']));
    $data['club_id'] = (int)htmlspecialchars(trim($teamData['clubId']));
    return $data;
}

try {

    $data = json_decode(file_get_contents('php://input'), true);

    if(!$data['player']) {
        Base::$status = 400;
        throw new Exception("You must enter an information about player");
    }
    else {
        $db = Base::getDbConnection();

        $data = createData($data["player"]);
        $query = "SELECT id FROM players WHERE name=".$data["name"]." AND age='".$data["age"]."' AND id != '".$data["id"]."'";
        $sth = $db->query($query);
        if(!$sth) {
            Base::$status = 500;
            throw new Exception("Cannot connect to database");
        }
        $result = $sth->fetchAll(PDO::FETCH_ASSOC);
        if(count($result)) {
            Base::$status = 400;
            throw new Exception("Sorry, but player with such name and age is already exists");
        }

        $id = $data["id"];
        unset($data["id"]);
        $strData = "";
        foreach($data as $key => $value) {
            $strData .= "`".$key."`=".$value.",";
        }
        $strData = substr($strData, 0, -1);
        $query = "UPDATE `players` SET ".$strData." WHERE id=".$id;

        $sth = $db->query($query);
        if(!$sth) {
            Base::$status = 500;
            throw new Exception("Cannot connect to database");
        }
        if($sth->rowCount() === 0) {
            Base::$status = 400;
            throw new Exception("Sorry, but there is no player with such id");
        }
        $answer = [
            "message" => "The data was successfully updated",
            "status" => Base::$status,
            "id" => $id,
        ];
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