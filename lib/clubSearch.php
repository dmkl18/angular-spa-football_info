<?php

require_once("base.php");

function prepareData(array $data) {
    foreach($data as &$position) {
        $position["id"] = (int)$position["id"];
    }
    return $data;
}

try{
    if(!$_GET["club"]) {
        Base::$status = 400;
        throw new Exception("You did not enter the name (or part of name) of club");
    }
    $club = htmlspecialchars(trim($_GET["club"]));
    $db = Base::getDbConnection();

    $query = "SELECT clubs.id as id, clubs.name as name, countries.name as country FROM clubs INNER JOIN countries ON clubs.id_country=countries.id AND clubs.name LIKE '%".$club."%' ORDER BY clubs.name";
    $sth = $db->query($query);
    if(!$sth) {
        Base::$status = 500;
        throw new Exception("Cannot connect to database");
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