<?php
$connection = new mysqli("localhost", "root", "", "your_database");
$id = $_GET['id'];
$connection->query("DELETE FROM vehicles WHERE id=$id");
header("Location: vehicle_list.php");
exit;
?>
