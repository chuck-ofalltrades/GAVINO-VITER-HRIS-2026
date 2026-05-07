<?php
require '../../../../core/header.php';
require '../../../../core/functions.php';
require '../../../../models/developers/settings/direct-report/DirectReport.php';

$conn = null;
$conn = checkDbConnection($conn);
$val = new DirectReport($conn);

// Re-added CORS block for POST preflight requests
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
}
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    exit(0);
}

$body = file_get_contents("php://input");
$data = json_decode($body, true);

if (isset($_GET['start'])) {
    $val->start = $_GET['start'];
    $val->total = 10; 
    
    // FIXED: Using isset() prevents the PHP 500 crash if $data is null
    $val->search = isset($data['searchValue']) ? $data['searchValue'] : "";
    $val->direct_report_is_active = isset($data['filterData']) ? $data['filterData'] : "";

    $query = checkReadLimit($val);
    $total = checkReadAll($val);

    http_response_code(200);
    checkReadQuery(
        $query,
        $total,
        $val->direct_report_is_active,
        $val->search
    );
}

checkEndpoint();