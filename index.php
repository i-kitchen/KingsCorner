<?php
    session_start();

    require_once('./templates/TemplateEngine.php');

    $html;
    $onScreen;

    if(isset($_SESSION["loggedIn"])) {
        $template = new Template('./templates/gameArea.tpl');
        $html = $template->output();
        $onScreen = 'board';
    }
    else {
        // Display login template
        $template = new Template('./templates/login.tpl');
        $html = $template->output();
        $onScreen = 'login';
    }
?>
<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset="utf-8">
    <link rel="shortcut icon" type="image/x-icon" href="img/favicon.ico" />
    <title>King's Corner</title>

    <!-- Styling -->
    <link rel="stylesheet" type="text/css" href="styles/styles.css">
    <script type="text/javascript">
        var onScreen = '<?php echo $onScreen; ?>';
    </script>

</head>
<body>

    <?php echo $html; ?>

    <!-- Scripts -->
    <script type="text/javascript" src="vendor/jquery-3.2.1.min.js"></script>
    <script type="text/javascript" src="vendor/snap.svg-min.js"></script>
    <script type="text/javascript" src="js/Socket.js"></script>
    <script type="text/javascript" src="js/main.js"></script>
    <script type="text/javascript" src="js/gameFunctions.js"></script>
    <script type="text/javascript" src="js/objects/gameControls.js"></script>
    <script type="text/javascript" src="js/objects/foundations.js"></script>
    <script type="text/javascript" src="js/objects/card.js"></script>
</body>
</html>