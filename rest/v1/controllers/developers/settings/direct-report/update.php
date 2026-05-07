<?php
$conn = null;
$conn = checkDbConnection($conn);
$val = new DirectReport($conn);

$val->direct_report_aid = $_GET['id'];
$val->direct_report_subordinate_id = trim($data['direct_report_subordinate_id']);
$val->direct_report_supervisor_id = trim($data['direct_report_supervisor_id']);
$val->direct_report_updated = date("Y-m-d H:i:s");

// Validations
if ($val->direct_report_subordinate_id === $val->direct_report_supervisor_id) {
    returnError("A person cannot be their own supervisor.");
}
$checkCircular = $val->checkCircularReference();
if ($checkCircular->rowCount() > 0) {
    returnError("Invalid request, the supervisor cannot be assigned to the selected subordinate.");
}

$query = checkUpdate($val);

// Update Employee Table
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
returnSuccess($val, "Direct Report Updated", $query);