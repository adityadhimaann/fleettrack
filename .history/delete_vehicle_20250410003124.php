<?php
$connection = new mysqli("localhost", "root", "", "your_database");
$id = $_GET['id'];
$connection->query("DELETE FROM vehicles WHERE id=$id");
header("Location: http://localhost/tailwindcssproject/vehicle_list.php");
exit;
?>
