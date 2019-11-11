<?php


namespace Topliner\Routines;


use DateTimeImmutable;
use Exception;

class Utility
{
    public static function toUnixTime($date): int
    {
        $hasDot = strpos($date, '.') !== false;
        $format = 'm/d/Y H:i:s O';
        if ($hasDot) {
            $format = 'd.m.Y H:i:s O';
        }
        try {
            $unixTime = DateTimeImmutable::createFromFormat($format,
                "$date 00:00:00 +00:00")->getTimestamp();
        } catch (Exception $e) {
            $unixTime = 0;
        }

        return $unixTime;
    }
}