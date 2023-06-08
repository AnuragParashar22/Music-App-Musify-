const nodemailer = require("nodemailer");
const googleApis = require("googleapis");
const dotenv = require("dotenv").config();


var C_id = process.env.CLIENT_ID;
var C_secret = process.env.CLIENT_SECRET;
var R_token =process.env.REFRESH_TOKEN ;
var useremail = process.env.useremail ;
const REDIRECT_URI = `https://developers.google.com/oauthplayground`;
const CLIENT_ID = `${C_id}`;
const CLIENT_SECRET = `${C_secret}`;
const REFRESH_TOKEN = `${R_token}`;

const authClient = new googleApis.google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
authClient.setCredentials({refresh_token: REFRESH_TOKEN});
async function sendMail(email,otp,userid){
 try{
 const ACCESS_TOKEN = await authClient.getAccessToken();
 const transport = nodemailer.createTransport({
 service: "gmail",
 auth: {
 type: "OAuth2",
 user: `${useremail}`,
 clientId: CLIENT_ID,
 clientSecret: CLIENT_SECRET,
 refreshToken: REFRESH_TOKEN,
 accessToken: ACCESS_TOKEN
 }
 })
 const details = {
 from: `${useremail}`,
 to: `${email}`,
 subject: "OTP to Reset Password",
 text: "This is an OTP link ",
 html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
 <div style="margin:50px auto;width:70%;padding:20px 0">
   <div style="border-bottom:1px solid #eee">
     <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Musify</a>
   </div>
   <p style="font-size:1.1em">Hi,</p>
   <p>Thank you for choosing Musify. Use the following link to reset Your password procedures. OTP is valid for 10 minutes</p>
   <a href=http://localhost:3000/forgot/password/${userid}/otp/${otp} style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">Click here to reset</a>
   <p style="font-size:0.9em;">Regards,<br />Musify</p>
   <hr style="border:none;border-top:1px solid #eee" />
   <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
     <p>Musify</p>
     <p>India.</p>
   </div>
 </div>
</div>
`
 }
 const result = await transport.sendMail(details);
 return result;
 }
 catch(err){
 return err;
 }
}


module.exports = sendMail;