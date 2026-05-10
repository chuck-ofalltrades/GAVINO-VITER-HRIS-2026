<?php

// set http header
require '../../../../core/header.php';
// use needed functions
require '../../../../core/functions.php';
// use models
require '../../../../models/developers/settings/users/Users.php';
// database
$conn = null;
$conn = checkDbConnection();
// models
$val = new Users($conn);
// get payload
$body = file_get_contents("php://input");
$data = json_decode($body, true);

if(isset($_SERVER['HTTP_AUTHORIZATION'])) {
    // // validate data
    checkPayload($data);
    
    $val->users_email = $data['user_other_email'];
    $password = $data['password'];

    $key = "jwt_admin_ko_ito";
    $result = checkLogin($val);
    $row = $result->fetch(PDO::FETCH_ASSOC);
    extract($row);

    loginAccess($password, $users_password, $users_email, $row, $result, $key);

    checkEndpoint();
}

http_response_code(200);
checkAccess();