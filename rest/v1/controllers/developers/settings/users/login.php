<?php

// set http header
require '../../../../core/header.php';
// use needed functions
require '../../../../core/functions.php';
// use models
require '../../../../models/developers/settings/users/Users.php';
// database
$conn = null;
$conn = checkDbConnection();
// models
$val = new Users($conn);
// get payload
$body = file_get_contents("php://input");
$data = json_decode($body, true);

if(isset($_SERVER['HTTP_AUTHORIZATION'])) {
    // // validate data
    checkPayload($data);
    
    $val->users_email = $data['user_other_email'];
    $password = $data['password'];

    $key = "jwt_admin_ko_ito";
    $result = checkLogin($val);
    $row = $result->fetch(PDO::FETCH_ASSOC);

    extract($row);

    loginAccess($password, $users_password, $users_email, $row, $result, $key);

    checkEndpoint();
}

http_response_code(200);
checkAccess();

// <?php

// // set http header
// require '../../../../core/header.php';
// // use needed functions
// require '../../../../core/functions.php';
// // use models
// require '../../../../models/developers/settings/users/Users.php';

// // database
// $conn = null;
// $conn = checkDbConnection();
// // models
// $val = new Users($conn);
// // get payload
// $body = file_get_contents("php://input");
// $data = json_decode($body, true);

// // REMOVED HTTP_AUTHORIZATION CHECK: Login is a public endpoint!
// checkPayload($data);

// $val->users_email = trim($data['user_other_email']);
// $password = trim($data['password']);

// $key = "jwt_admin_ko_ito";

// // Safely call the model's login query
// $result = $val->readLogin();

// // FIXED: We MUST verify the email exists in the database before trying to read the data
// if ($result->rowCount() > 0) {
//     $row = $result->fetch(PDO::FETCH_ASSOC);
//     extract($row);

//     // This handles the password_verify() and JWT token generation
//     loginAccess($password, $users_password, $users_email, $row, $result, $key);
// } else {
//     // If the email is not found, return a clean error to React
//     returnError("Invalid email or password.");
// }