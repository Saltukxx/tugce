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
$to = "saltukgogebakan@gmail.com"; // Your email address
$subject = "✨ Yeni Randevu Talebi - $service";

// Create HTML email body
$htmlMessage = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
        }
        .container {
            background-color: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #FFD1DC, #FFB6C1);
            color: #fff;
            padding: 20px;
            border-radius: 10px 10px 0 0;
            text-align: center;
        }
        .content {
            padding: 20px;
        }
        .info-item {
            margin-bottom: 15px;
            padding: 10px;
            background-color: #f9f9f9;
            border-radius: 5px;
        }
        .label {
            font-weight: bold;
            color: #FFB6C1;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
        }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>🌸 Yeni Randevu Talebi</h2>
        </div>
        <div class='content'>
            <div class='info-item'>
                <span class='label'>👤 Ad Soyad:</span><br>
                $name
            </div>
            <div class='info-item'>
                <span class='label'>📧 E-posta:</span><br>
                $email
            </div>
            <div class='info-item'>
                <span class='label'>📱 Telefon:</span><br>
                $phone
            </div>
            <div class='info-item'>
                <span class='label'>💝 Talep Edilen Hizmet:</span><br>
                $service
            </div>
        </div>
        <div class='footer'>
            <p>Bu e-posta randevu sistemi tarafından otomatik olarak gönderilmiştir.</p>
            <p>© " . date('Y') . " Psk. Tuğçe Gündöner</p>
        </div>
    </div>
</body>
</html>
";

// Create plain text version for email clients that don't support HTML
$plainMessage = "Yeni Randevu Talebi\n\n" .
               "Ad Soyad: $name\n" .
               "E-posta: $email\n" .
               "Telefon: $phone\n" .
               "Hizmet: $service\n\n" .
               "Bu e-posta randevu sistemi tarafından otomatik olarak gönderilmiştir.";

// Email headers for HTML email
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: Randevu Sistemi <$email>\r\n";
$headers .= "Reply-To: $name <$email>\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Send email
try {
    if (mail($to, $subject, $htmlMessage, $headers)) {
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