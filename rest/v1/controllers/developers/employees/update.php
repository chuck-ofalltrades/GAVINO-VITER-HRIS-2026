<?php
// check database connection
$conn = null;
$conn = checkDbConnection($conn);
// make use of classes for 
$val = new Employees($conn);

if(array_key_exists("id", $_GET)){
$val->employee_aid = $_GET['id'];
$val->employee_first_name = $data['employee_first_name'];
$val->employee_email = $data['employee_email'];
$val->role_updated = date("Y-m-d H:i:s");

$employee_first_name_old = $data['employee_first_name_old'];

// validation
checkId($val->employee_aid);
compareName(
    $val, //
    $employee_first_name_old,
    $val->employee_first_name
    );

$query = checkUpdate($val);
http_response_code(200);
returnSuccess($val, "Employees Update", $query);

}

checkEndpoint();
