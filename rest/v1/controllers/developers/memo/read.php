<?php

$conn = null;
$conn = checkDbConnection($conn);

$val = new Memo($conn);

// ADD THIS LINE: Explicitly tell the model to get active memos
$val->memo_is_active = 1; 

if (empty($_GET)) {
    $query = checkReadAll($val);
    http_response_code(200);
    getQueriedData($query);
}

checkEndpoint();