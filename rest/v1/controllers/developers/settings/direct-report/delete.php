<?php
$conn = null;
$conn = checkDbConnection($conn);
$val = new DirectReport($conn);

$val->direct_report_aid = $_GET['id'];

// Get the subordinate ID before deleting so we can clear their supervisor in the employees table
$record = checkReadById($val);
if ($record->rowCount() > 0) {
    $reportData = $record->fetch(PDO::FETCH_ASSOC);
    $val->direct_report_subordinate_id = $reportData['direct_report_subordinate_id'];
    // Clear the supervisor from the employee table
    $val->clearEmployeeSupervisor(); 
}

$query = checkDelete($val);
http_response_code(200);
returnSuccess($val, "Direct Report Deleted", $query);