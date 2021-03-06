<?php
/**
 * Copyright (c) 2019 TopLiner, Scheme of constructs
 * 6.12.2019 22:51 Volkhin Nikolay
 */

use Topliner\Scheme\ImportConstruction;

$isObtain = require_once 'local.php';
$isSuccess = false;
if ($isObtain) {
    /**
     * @global CUser $USER
     */
    global $USER;
    $isSuccess = $USER->Authorize(1);

    if ($isSuccess) {
        $import = new ImportConstruction($DBType, $DBHost, $DBName,
            $DBLogin, $DBPassword);
        $import->run();
    }
}

