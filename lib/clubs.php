<?php

require_once("base.php");

function createData() {
    return htmlspecialchars(trim($_GET['country']));
}

function createDataToReturn(array $data) {
    foreach($data as &$value) {
        $value["id"] = (int)$value["id"];
        $value["games"] = (int)$value["games"];
        $value["wins"] = (int)$value["wins"];
        $value["draws"] = (int)$value["draws"];
        $value["gs"] = (int)$value["gs"];
        $value["ga"] = (int)$value["ga"];
        $value["countryId"] = (int)$value["id_country"];
        unset($value["id_country"]);
        $value["defeats"] = $value["games"] - $value["wins"] - $value["draws"];
        $value["points"] = $value["wins"]*3 + $value["draws"];
    }
    return $data;
}

try{

    if(!$_GET['country']) {
        Base::$status = 400;
        throw new Exception("You must specify query parameter 'country'");
    } else {
        $db = Base::getDbConnection();
        $country = createData();

        $query = "SELECT id FROM countries WHERE name='".$country."'";
        $sth = $db->query($query);
        if(!$sth) {
            Base::$status = 500;
            throw new Exception("Can not connect to database");
        }
        $result = $sth->fetchAll(PDO::FETCH_ASSOC);
        if(!count($result)) {
            Base::$status = 400;
            throw new Exception("There is no such country");
        }
        $idCountry = (int)$result[0]["id"];

        $query = "SELECT * FROM clubs WHERE id_country=".$idCountry." ORDER BY wins*3+draws DESC";
        $sth = $db->query($query);
        if(!$sth) {
            Base::$status = 500;
            throw new Exception("Can not connect to database");
        }
        $result = $sth->fetchAll(PDO::FETCH_ASSOC);
        $countResult = count($result);

        if($countResult) {
            $data = createDataToReturn($result);
            $answer = [
                "message" => "There were ".$countResult." found",
                "status" => Base::$status,
                "values" => $data,
            ];
        } else {
            $answer = [
                "message" => "There is no clubs in the country",
                "status" => Base::$status,
                "values" => [],
            ];
        }
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