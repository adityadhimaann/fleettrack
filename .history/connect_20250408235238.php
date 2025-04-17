<?php
<form action="connect.php" method="POST">

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $firstName = $_POST['firstName'];
    $lastName  = $_POST['lastName'];
    $gender    = $_POST['gender'];
    $email     = $_POST['email'];
    $password  = $_POST['password'];
    $number    = $_POST['number'];

    $conn = new mysqli('localhost', 'root', '', 'test');
    if ($conn->connect_error) {
        die("Connection Failed: " . $conn->connect_error);
    } else {
        $stmt = $conn->prepare("INSERT INTO registration(firstName, lastName, gender, email, password, number) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssssi", $firstName, $lastName, $gender, $email, $password, $number);
        $stmt->execute();
        echo "Registration successfully...";
        $stmt->close();
        $conn->close();
    }
} else {
    http_response_code(405); // method not allowed
    echo "Method Not Allowed";
}
?>
