<?php

session_start();

require_once('../dataLayer/DB.class.php');
$db = new DB();

// Set the cookie variables and the expire time to an hour
$expire = time() + (60 * 60);
$path = "/~igk2718/";
$domain = "serenity.ist.rit.edu";
$secure = false;

if(!isset($_SESSION['loggedIn'])) {
    // Get the username and password
    if(!empty($_GET['command'])) {
        if($_GET['command'] == 'login') {
            $username = filter_var($_GET['user']);
            $password = md5($_GET['password']);

            // Validate login
            $valid = $db->validateLogin($username, $password);

            if($valid) {
                $_SESSION['loggedIn'] = time();
                setcookie("uname", $valid['id'], $expire, $path, $domain, $secure);

                echo json_encode($valid);
                die;
            }
            else {
                echo '{"user":"error","reason":"Invalid login credentials!"}';
                die;
            }
        }
        else if($_GET['command'] == 'logout') {
            // Destroy the session
            session_destroy();
            setcookie('uname', '', 1);
            echo '{"user":"error","reason":"Successfully logged out"}';
            die;
        }
    }
    else {
        // error no command
    }
}
else {
    // echo the user that's logged in
    echo '{"user":"'.$_COOKIE['user'].'"}';
    die;
}