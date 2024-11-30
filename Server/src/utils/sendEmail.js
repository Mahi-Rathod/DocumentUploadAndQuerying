import nodemailer from "nodemailer";

const sendEmail = async(htmlContent, email, subject) =>{
    try {
        let transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASS,
            }
        });
    
        const mailOptions = {
            from : process.env.EMAIL_USER,
            to   : email,
            subject: subject || "Email Verification OTP",
            html: htmlContent
        }
    
        transporter.sendMail(mailOptions);
        
        return true;

    } catch (err) {
        return false;
    };
}


export default sendEmail;