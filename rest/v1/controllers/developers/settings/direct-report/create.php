<?php
// set http header
require '../../../../core/header.php';
// use needed functions
require '../../../../core/functions.php';
// use models
require '../../../../models/developers/settings/direct-report/DirectReport.php';

// check database connection
$conn = null;
$conn = checkDbConnection($conn);

// store model into var
$val = new DirectReport($conn);

// get payload from frontend
$body = file_get_contents("php://input");
$data = json_decode($body, true);

if(isset($_SERVER['HTTP_AUTHORIZATION'])){
    // check payload
    checkPayload($data);

    $val->direct_report_is_active = 1;
    $val->direct_report_subordinate_id = trim($data['direct_report_subordinate_id']);
    $val->direct_report_supervisor_id = trim($data['direct_report_supervisor_id']);
    $val->direct_report_created = date("Y-m-d H:i:s");
    $val->direct_report_updated = date("Y-m-d H:i:s");

    // VALIDATION 1: Same Person Check
    if ($val->direct_report_subordinate_id === $val->direct_report_supervisor_id) {
        returnError("A person cannot be their own supervisor.");
    }

    // VALIDATION 2: Instructor Circular Validation
    $checkCircular = $val->checkCircularReference();
    if ($checkCircular->rowCount() > 0) {
        returnError("Invalid request, the supervisor cannot be assigned to the selected subordinate.");
    }

    // CREATE RECORD
    $query = checkCreate($val);

    // FETCH SUPERVISOR DETAILS FOR EMPLOYEE TABLE SYNC
    $supervisorData = $val->getSupervisorDetails();
    if ($supervisorData->rowCount() > 0) {
        $sup = $supervisorData->fetch(PDO::FETCH_ASSOC);
        
        $val->updateEmployeeRecord(
            $sup['employee_first_name'],
            $sup['employee_last_name'],
            $sup['employee_email']
        );
    }

    http_response_code(200);
    returnSuccess($val, "Direct Report Create", $query);
}

checkEndpoint();