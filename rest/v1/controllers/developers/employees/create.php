<?php
// check database connection
$conn = null;
$conn = checkDbConnection($conn);
// make use of classes for 
$val = new Employees($conn);

$val->employee_is_active = 1;
$val->employee_first_name = trim($data['employee_first_name']);
$val->employee_email = $data['employee_email'];
$val->employee_created = date("Y-m-d H:i:s");
$val->employee_updated = date("Y-m-d H:i:s");

// VALIDATIONS
isNameExist($val, $val->employee_first_name);

$query = checkCreate($val);
http_response_code(200);
returnSuccess($val, "Employees Create", $query);