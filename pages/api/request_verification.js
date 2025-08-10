import axios from "axios";
import { with_auth } from "../../middleware/auth.js";

async function handler(req, res) {
    switch(req.method) {
        case "POST" : {
            const encoded_payload = req.cookies.token.split(".")[1];
            const email = JSON.parse(Buffer.from(encoded_payload, 'base64').toString('utf-8')).email;
            const encoded_email = encodeURIComponent(email.replace("+", "%20"));
            try {
                const response = await axios({
                    url:"http://localhost:5000/send_verification_code?email=" + encoded_email,
                    method:"GET",
                })
                if (response.status==200) {
                    res.status(200).json({message:"Verification code sent successfully!"});
                }
                else {
                    res.status(500).json({message:"Failed to send verification code."});
                }
            } catch (error) {
                console.error("Error sending verification code:", error);
                res.status(500).json({message:"Internal server error."});
            };
            return;
        }
        case "GET":{
            const encoded_payload = req.cookies.token.split(".")[1];
            const email = JSON.parse(Buffer.from(encoded_payload, 'base64').toString('utf-8')).email;
            try {
                const response = await axios({
                    url:"http://localhost:5000/verify_ID",
                    method:"POST",
                    data: {
                        email: email,
                        code: req.query.code
                    }
                })
                if (response.status==200) {
                   return res.status(200).json({message:"Verification code sent successfully!",verified:true});
                }
                else {
                   return res.status(500).json({message:"Failed to send verification code.", verified:false});
                }
            } catch (error) {
                console.error("Error sending verification code:", error);
               return res.status(500).json({message:"Internal server error."});
            };
            return;
        }
    };
}

export default with_auth(handler);