import {remove_token_cookie} from "../../utilities/jwt.js";
import {with_auth} from "../../middleware/auth.js";
export function logout(req, res) {
    switch (req.method) {
        case "POST": {
            remove_token_cookie(res);
            return res.status(200).json({message: "You have successfully logged out"});
        }
        default:
            return res.status(405).json({message: "Method not allowed"});
    }
}

export default with_auth(logout);
