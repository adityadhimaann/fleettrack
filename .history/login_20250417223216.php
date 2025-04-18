<?php
session_start();

// DB connection
$servername = "localhost";
$username = "root";
$password = ""; // Your MySQL password
$dbname = "fleetmaster";

$conn = new mysqli($servername, $username, $password, $dbname);

// Connection check
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Check form submission
if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $email = $_POST['email'];
  $password = $_POST['password'];

  // Prepare & execute query
  $stmt = $conn->prepare("SELECT id, full_name, password FROM users WHERE email = ?");
  $stmt->bind_param("s", $email);
  $stmt->execute();
  $result = $stmt->get_result();

  // Check user
  if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();

    // Verify password
    if (password_verify($password, $user['password'])) {
      // Set session
      $_SESSION['user_id'] = $user['id'];
      $_SESSION['user_name'] = $user['full_name'];

      // Redirect to dashboard or home
      header("Location: dashboard.php");
      exit();
    } else {
      $error = "Invalid email or password.";
    }
  } else {
    $error = "Invalid email or password.";
  }

  $stmt->close();
}

$conn->close();
?>
