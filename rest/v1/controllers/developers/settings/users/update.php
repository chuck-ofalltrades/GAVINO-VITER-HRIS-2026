<?php
// check database connection
$conn = null;
$conn = checkDbConnection($conn);
// make use of classes for 
$val = new Users($conn);

if(array_key_exists("id", $_GET)){
$val->users_aid = $_GET['id'];
$val->users_name = $data['users_name'];
$val->users_description = $data['users_description'];
$val->users_updated = date("Y-m-d H:i:s");

$users_name_old = $data['users_name_old'];

// validation
checkId($val->users_aid);
compareName(
    $val, //
    $users_name_old,
    $val->users_name
    );

$query = checkUpdate($val);
http_response_code(200);
returnSuccess($val, "Roles Update", $query);

}

checkEndpoint();
