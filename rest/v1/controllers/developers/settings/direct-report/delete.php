<?php
require '../../../../core/header.php';
require '../../../../core/functions.php';
require '../../../../models/developers/settings/direct-report/DirectReport.php';

$conn = null;
$conn = checkDbConnection($conn);
$val = new DirectReport($conn);

if(isset($_SERVER['HTTP_AUTHORIZATION'])){
    checkId($_GET['id']);
    $val->direct_report_aid = $_GET['id'];

    // Get the subordinate ID to clear their record in employees table before deleting relation
    $record = checkReadById($val);
    if ($record->rowCount() > 0) {
        $reportData = $record->fetch(PDO::FETCH_ASSOC);
        $val->direct_report_subordinate_id = $reportData['direct_report_subordinate_id'];
        $val->clearEmployeeSupervisor(); 
    }

    $query = checkDelete($val);
    http_response_code(200);
    returnSuccess($val, "Direct Report Deleted", $query);
}

checkEndpoint();