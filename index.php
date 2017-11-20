<?php
    //include all template files
    //foreach (glob("./templates/*.php") as $filename){
    //    include $filename;
    //}
?>
<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset="utf-8">
    <link rel="shortcut icon" type="image/x-icon" href="img/favicon.ico" />
    <title>King's Corner</title>

    <!-- Styling -->
    <link rel="stylesheet" type="text/css" href="styles/styles.css">

</head>
<body>

    <div id="login" class="vcenter">
        <div class="header">
            <h2>Kings Corners</h2>
        </div>
        <form class="login" onsubmit="return validateLogin(this);">

            <div class="container">
                <label><b>Who is playing?</b></label>
                <input type="text" placeholder="Enter Username" name="uname" required>

                <button type="submit" class="loginBtn">Join</button>
            </div>

        </form>
    </div>

    <!-- Scripts -->
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script type="text/javascript" src="js/Socket.js"></script>
    <script type="text/javascript" src="js/main.js"></script>
</body>
</html>