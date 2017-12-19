<?php
require_once('../templates/TemplateEngine.php');

if(!empty($_GET['template'])) {
    $template = new Template($_GET['template']);

    echo $template->output();
    die;
}