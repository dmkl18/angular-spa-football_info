<?php

require_once("base.php");

function prepareDataToRedact(array $data) {
    foreach($data as &$club) {
        $club["id"] = (int)$club["id"];
        $club["games"] = (int)$club["games"];
        $club["wins"] = (int)$club["wins"];
        $club["draws"] = (int)$club["draws"];
        $club["defeats"] = $club["games"] - $club["wins"] - $club["draws"];
        $club["gs"] = (int)$club["gs"];
        $club["ga"] = (int)$club["ga"];
        $club["points"] = $club["wins"] * 3 + $club["draws"];
        $club["countryId"] = (int)$club["id_country"];
        unset($club["id_country"]);
    }
    return $data;
}

try{

    if(!$_GET['club'] || !$_GET['country'] || ($_GET["priorityChecking"] && $_GET["priorityChecking"] != 1) || ($_GET['uniqueCheck'] && $_GET['uniqueCheck'] != 1)) {
        Base::$status = 400;
        throw new Exception("You must specify at least query parameter 'country' and 'club'");
    } else {
        $db = Base::getDbConnection();
        $club = htmlspecialchars(trim($_GET['club']));
        $country = htmlspecialchars(trim($_GET['country']));
        if(!$_GET["priorityChecking"]) {
            $query = "SELECT clubs.*, countries.name as country FROM clubs INNER JOIN countries ON clubs.id_country=countries.id WHERE clubs.name='".$club."' AND countries.name='".$country."' LIMIT 1";
        }
        else {
            $query = "SELECT clubs.*, countries.name as country FROM clubs INNER JOIN countries ON clubs.id_country=countries.id WHERE clubs.name='".$club."'";
        }
        $sth = $db->query($query);
        if(!$sth) {
            Base::$status = 500;
            throw new Exception("Can not connect to database");
        }
        $result = $sth->fetchAll(PDO::FETCH_ASSOC);
        if(count($result)) {
            if(!$_GET["priorityChecking"]) {
                $result = prepareDataToRedact($result)[0];
            }
            else {
                $num = 0;
                for($i = 0, $lh = count($result); $i < $lh; $i++) {
                    if($result[$i]["country"] == $country) {
                        $num = $i;
                        break;
                    }
                }
                $result = prepareDataToRedact($result)[$num];
            }
            Base::setStatus();
            $answer = [
                "message" => "The data was successfully found",
                "status" => Base::$status,
                "values" => $result,
            ];
            echo json_encode($answer);
        }
        else {
            Base::$status = (int)$_GET['uniqueCheck'] === 1 || (int)$_GET["priorityChecking"] === 1 ? 200 : 400;
            throw new Exception("There is no club ".$club);
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