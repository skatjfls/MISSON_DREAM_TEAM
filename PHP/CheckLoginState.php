<?php
require_once 'dbConfig.php';
require_once 'DefaultSetting.php';

if(!session_id()){
    session_start();
}

if (!isset($_SESSION['id'])){
    // Redirect to login page
    echo json_encode(false);
    exit;
}else{
    echo json_encode(true);
    exit;
}

?>