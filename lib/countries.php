<?php

require_once("base.php");

function createDataToReturn($data) {
    foreach($data as &$value) {
        $value["id"] = (int)$value["id"];
    }
    return $data;
}

try {

    $db = Base::getDbConnection();

    $query = "SELECT `id`, `name` FROM countries ORDER BY `name`";
    $sth = $db->query($query);
    if(!$sth) {
        Base::$status = 500;
        throw new Exception("Can not connect to database");
    }
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
    if(count($result)) {
        $answer = [
            "message" => "There were ".count($result)." countries found",
            "status" => Base::$status,
            "values" => createDataToReturn($result),
        ];
        Base::setStatus();
        echo json_encode($answer);
    } else {
        Base::$status = 400;
        throw new Exception("There is no countries");
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