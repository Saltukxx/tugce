<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Get the form data
$data = json_decode(file_get_contents('php://input'), true);

// Validate required fields
if (empty($data['name']) || empty($data['email']) || empty($data['phone']) || empty($data['service'])) {
    echo json_encode(['success' => false, 'message' => 'Lütfen tüm alanları doldurun.']);
    exit;
}

// Sanitize input data
$name = filter_var($data['name'], FILTER_SANITIZE_STRING);
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$phone = filter_var($data['phone'], FILTER_SANITIZE_STRING);
$service = filter_var($data['service'], FILTER_SANITIZE_STRING);

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Geçerli bir e-posta adresi girin.']);
    exit;
}

// Email configuration
$to = "saltukgogebakan@gmail.com"; // Replace with your email address
$subject = "Yeni Randevu Talebi - $service";

// Create email body
$message = "Yeni bir randevu talebi alındı:\n\n";
$message .= "Ad Soyad: $name\n";
$message .= "E-posta: $email\n";
$message .= "Telefon: $phone\n";
$message .= "Hizmet: $service\n";

// Email headers
$headers = "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Send email
try {
    if (mail($to, $subject, $message, $headers)) {
        // Store in database (optional)
        // You can add database storage logic here

        // Send success response
        echo json_encode([
            'success' => true, 
            'message' => 'Randevu talebiniz başarıyla alındı. En kısa sürede size dönüş yapacağız.'
        ]);
    } else {
        throw new Exception('Email sending failed');
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false, 
        'message' => 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
    ]);
}
?> 