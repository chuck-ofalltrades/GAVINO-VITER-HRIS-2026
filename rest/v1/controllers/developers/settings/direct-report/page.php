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

// store models into var
$val = new DirectReport($conn);

// get payload from frontend
$body = file_get_contents("php://input");
$data = json_decode($body, true);

if(isset($_SERVER['HTTP_AUTHORIZATION'])){

    if(array_key_exists('start',$_GET)){
        // check data if exist and data is required
        checkPayLoad($data);
        $val->start = $_GET['start'];
        $val->total = 10;
        $val->direct_report_is_active = $data['filterData'];
        $val->search = $data['searchValue'];
    
        // validation
        checkLimitId($val->start, $val->total);
    
        $query = checkReadLimit($val);
        $total_result = checkReadAll($val);
        
        http_response_code(200);
        
        // FIXED: Using the exact parameters your core functions expect!
        checkReadQuery(
            $query,
            $total_result,
            $val->total,
            $val->start
        );
    }
}

// return 404 if endpoint not available
checkEndpoint();