const emailTemplate = (recipientName, emailOTP) =>{
    const htmlContent =  `
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                margin: auto;
                background: white;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                padding: 20px;
            }
            .header {
                text-align: center;
                padding: 10px 0;
                border-bottom: 1px solid #ddd;
            }
            .otp {
                font-size: 24px;
                font-weight: bold;
                color: #4CAF50;
                margin: 20px 0;
                text-align: center;
            }
            .footer {
                text-align: center;
                color: #777;
                font-size: 14px;
                margin-top: 20px;
            }
            .button {
                display: inline-block;
                background-color: #4CAF50;
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                text-decoration: none;
                margin-top: 20px;
                text-align: center;
            }
        </style>
    </head>
    <body>
    <div class="container">
        <div class="header">
            <h2>Your OTP Verification Code</h2>
        </div>
        <p>Dear <strong>${recipientName}</strong>,</p>
        <p>Thank you for signing up with us! Your One-Time Password (OTP) is:</p>
        <div class="otp">
            ${emailOTP}
        </div>
        <p>Please enter this code on our website to complete your verification process. This OTP is valid for <strong>10 minutes</strong>.</p>
        <p>For your security, do not share this code with anyone. If you did not request this code, please ignore this email.</p>
        <a href="[Your Website URL]" class="button">Visit Our Website</a>
        <div class="footer">
            <p>Thank you for choosing [Your Company Name]!</p>
            <p>[Your Company Contact Information]</p>
        </div>
    </div>
    </body>
    </html>
    `;

    return htmlContent;
}

export default emailTemplate;
