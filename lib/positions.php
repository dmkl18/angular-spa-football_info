<?php

require_once("base.php");

function prepareData(array $data) {
    foreach($data as &$position) {
        $position["id"] = (int)$position["id"];
    }
    return $data;
}

try{
    $db = Base::getDbConnection();

    $query = "SELECT * FROM positions";
    $sth = $db->query($query);
    if(!$sth) {
        Base::$status = 500;
        throw new Exception("Can not connect to database");
    }
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
    if(count($result)) {
        $answer = [
            "message" => "The data was successfully found",
            "status" => Base::$status,
            "values" => prepareData($result),
        ];
    } else {
        $answer = [
            "message" => "There is no data here",
            "status" => Base::$status,
            "values" => [],
        ];
    }
    Base::setStatus();
    echo json_encode($answer);
}
catch(Exception $e) {
    Base::setStatus();
    echo json_encode([
        "mistake" => $e->getMessage(),
        "status" => Base::$status,
    ]);
}

?>