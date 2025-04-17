<?php
$connection = new mysqli("localhost", "root", "", "fleetdb");
$id = $_GET['id'];
$connection->query("DELETE FROM vehicles WHERE id=$id");
header("Location: http://localhost/tailwindcssproject/vehicle_list.php");
exit;
?>
