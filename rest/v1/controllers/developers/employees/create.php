<?php
// set http header
require '../../../core/header.php';
// use needed functions
require '../../../core/functions.php';
// use models
require '../../../models/developers/employees/Employees.php';

// check database connection
$conn = null;
$conn = checkDbConnection($conn);

// make use of classes
$val = new Employees($conn);

// get payload from frontend
$body = file_get_contents("php://input");
$data = json_decode($body, true);

$val->employee_is_active = 1;

// FIXED: Using isset() to prevent PHP Fatal TypeErrors if a field is empty
$val->employee_first_name = isset($data['employee_first_name']) ? trim($data['employee_first_name']) : "";
$val->employee_middle_name = isset($data['employee_middle_name']) ? trim($data['employee_middle_name']) : "";
$val->employee_last_name = isset($data['employee_last_name']) ? trim($data['employee_last_name']) : "";
$val->employee_email = isset($data['employee_email']) ? trim($data['employee_email']) : "";
$val->employee_department_id = isset($data['employee_department_id']) ? trim($data['employee_department_id']) : "";
$val->employee_start_work_date = isset($data['employee_start_work_date']) ? trim($data['employee_start_work_date']) : "";
$val->employee_birthday = isset($data['employee_birthday']) ? trim($data['employee_birthday']) : "";

$val->employee_created = date("Y-m-d H:i:s");
$val->employee_updated = date("Y-m-d H:i:s");

// VALIDATIONS
$query = $val->checkEmail();
if ($query->rowCount() > 0) {
    returnError("Email already exists.");
}

$query = checkCreate($val);
http_response_code(200);
returnSuccess($val, "Employees Create", $query);