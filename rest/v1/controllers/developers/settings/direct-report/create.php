<?php
// check database connection
$conn = null;
$conn = checkDbConnection($conn);

// make use of classes
$val = new DirectReport($conn);

$val->direct_report_is_active = 1;
$val->direct_report_subordinate_id = trim($data['direct_report_subordinate_id']);
$val->direct_report_supervisor_id = trim($data['direct_report_supervisor_id']);
$val->direct_report_created = date("Y-m-d H:i:s");
$val->direct_report_updated = date("Y-m-d H:i:s");

// VALIDATION 1: Same Person Check (Already handled in React via Yup, but good to have backend protection)
if ($val->direct_report_subordinate_id === $val->direct_report_supervisor_id) {
    returnError("A person cannot be their own supervisor.");
}

// VALIDATION 2: The Instructor's Bonus "Circular" Validation
$checkCircular = $val->checkCircularReference();
if ($checkCircular->rowCount() > 0) {
    returnError("Invalid request, the supervisor cannot be assigned to the selected subordinate.");
}

// CREATE RECORD IN DIRECT REPORT TABLE
$query = checkCreate($val);

// FETCH SUPERVISOR DETAILS
$supervisorData = $val->getSupervisorDetails();
if ($supervisorData->rowCount() > 0) {
    $sup = $supervisorData->fetch(PDO::FETCH_ASSOC);
    
    // UPDATE EMPLOYEE TABLE (Instructor requirement)
    $val->updateEmployeeRecord(
        $sup['employee_first_name'],
        $sup['employee_last_name'],
        $sup['employee_email']
    );
}

http_response_code(200);
returnSuccess($val, "Direct Report Create", $query);