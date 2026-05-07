<?php

// Adjust the path to your core files based on your folder structure
require '../../../../core/header.php';
require '../../../../core/functions.php';
require '../../../../models/developers/settings/direct-report/DirectReport.php';

$conn = null;
$conn = checkDbConnection($conn);

$val = new DirectReport($conn);

$body = file_get_contents("php://input");
$data = json_decode($body, true);

// This switch statement routes the request to the correct file
switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST':
        require 'create.php';
        break;
    case 'GET':
        // We will need a read.php later to populate the table!
        require 'read.php'; 
        break;
    case 'OPTIONS':
        // This explicitly handles the "preflight" CORS check your browser is failing on
        http_response_code(200);
        exit();
    default:
        checkEndpoint();
}