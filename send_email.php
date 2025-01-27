<?php
// Allow from any origin
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: POST, OPTIONS");         

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}

header('Content-Type: application/json');

// Get the form data
$inputData = file_get_contents('php://input');
$data = json_decode($inputData, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
    exit;
}

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
$adminTo = "saltukgogebakan@gmail.com";
$adminBcc = ""; // Add a BCC if needed
$siteEmail = "info@psikolog.com";
$siteName = "Psk. Tuğçe Gündöner";

// Admin notification email
$adminSubject = "✨ Yeni Randevu Talebi - $service";

// Create HTML email body for admin
$adminHtmlMessage = "
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

// Client confirmation email
$clientSubject = "🌸 Randevu Talebiniz Alındı - Psk. Tuğçe Gündöner";

// Create HTML email body for client
$clientHtmlMessage = "
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
        .thank-you {
            text-align: center;
            font-size: 1.2em;
            color: #FFB6C1;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>🌸 Randevu Talebiniz Alındı</h2>
        </div>
        <div class='content'>
            <div class='thank-you'>
                Sayın $name, randevu talebiniz için teşekkür ederiz.
            </div>
            <div class='info-item'>
                <p>Randevu talebiniz başarıyla alınmıştır. En kısa sürede sizinle iletişime geçeceğiz.</p>
            </div>
            <div class='info-item'>
                <span class='label'>💝 Talep Ettiğiniz Hizmet:</span><br>
                $service
            </div>
            <div class='info-item'>
                <span class='label'>📞 İletişim Bilgileriniz:</span><br>
                Telefon: $phone<br>
                E-posta: $email
            </div>
        </div>
        <div class='footer'>
            <p>Psk. Tuğçe Gündöner</p>
            <p>📍 Atatürk Cad. No:123 Kadıköy/İstanbul</p>
            <p>📱 +90 (212) 555 55 55</p>
            <p>© " . date('Y') . " Tüm hakları saklıdır.</p>
        </div>
    </div>
</body>
</html>
";

// Email headers with better formatting for Gmail
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: =?UTF-8?B?".base64_encode($siteName)."?= <{$siteEmail}>\r\n";
$headers .= "Reply-To: =?UTF-8?B?".base64_encode($siteName)."?= <{$siteEmail}>\r\n";
$headers .= "Return-Path: {$siteEmail}\r\n";
$headers .= "Organization: =?UTF-8?B?".base64_encode($siteName)."?=\r\n";
$headers .= "X-Priority: 3\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Client headers
$clientHeaders = "MIME-Version: 1.0\r\n";
$clientHeaders .= "Content-Type: text/html; charset=UTF-8\r\n";
$clientHeaders .= "From: =?UTF-8?B?".base64_encode($siteName)."?= <{$siteEmail}>\r\n";
$clientHeaders .= "Reply-To: =?UTF-8?B?".base64_encode($siteName)."?= <{$siteEmail}>\r\n";
$clientHeaders .= "Return-Path: {$siteEmail}\r\n";
$clientHeaders .= "Organization: =?UTF-8?B?".base64_encode($siteName)."?=\r\n";
$clientHeaders .= "X-Priority: 3\r\n";
$clientHeaders .= "X-Mailer: PHP/" . phpversion();

try {
    // Log attempt
    error_log("Attempting to send emails for appointment request from: {$email}");
    
    // Send email to admin
    $adminMailSent = mail($adminTo, $adminSubject, $adminHtmlMessage, $headers);
    if (!$adminMailSent) {
        error_log("Failed to send admin notification email to: {$adminTo}");
    }
    
    // Send confirmation email to client
    $clientMailSent = mail($email, $clientSubject, $clientHtmlMessage, $clientHeaders);
    if (!$clientMailSent) {
        error_log("Failed to send client confirmation email to: {$email}");
    }

    if ($adminMailSent && $clientMailSent) {
        error_log("Successfully sent both emails for appointment request from: {$email}");
        echo json_encode([
            'success' => true, 
            'message' => 'Randevu talebiniz başarıyla alındı. Onay e-postası gönderildi.'
        ]);
    } else {
        throw new Exception('Email sending failed. Admin: ' . ($adminMailSent ? 'OK' : 'FAILED') . 
                          ', Client: ' . ($clientMailSent ? 'OK' : 'FAILED'));
    }
} catch (Exception $e) {
    error_log("Error sending emails: " . $e->getMessage());
    echo json_encode([
        'success' => false, 
        'message' => 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
    ]);
}
?> 