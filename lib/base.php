<?php

class Base {

    const HOST = 'localhost';
    const DATABASE = 'clubs';
    const LOGIN = 'root';
    const PASSWORD = '';

    public static $statuses = [
        200 => "HTTP/1.1 200 OK",
        201 => "HTTP/1.1 201 Created",
        204 => "HTTP/1.1 204 No Content",
        304 => "HTTP/1.1 304 Not Modified",
        400 => "HTTP/1.1 400 Bad Request",
        401 => "HTTP/1.1 401 Unauthorized",
        403 => "HTTP/1.1 403 Forbidden",
        404 => "HTTP/1.1 404 Not Found",
        409 => "HTTP/1.1 409 Conflict",
        500 => "HTTP/1.1 500 Internal Server Error",
    ];

    public static $status = 200;

    public static function getDbConnection() {
        $hostAndBaseName = 'mysql:host='.self::HOST.';dbname='.self::DATABASE;
        $db = new PDO($hostAndBaseName, self::LOGIN, self::PASSWORD);
        if(!$db->query('SET NAMES utf8')) {
            Base::$status = 500;
            throw new Exception("Can not connect to database");
        }
        return $db;
    }

    public static function setStatus() {
        header(self::$statuses[self::$status]);
    }

}

?>