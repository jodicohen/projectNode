import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {//פונקציה שבודקת האם המשתשמש רשום

    let token = req.headers["x-access-token"];
    if (!token)
        return res.status(401).json({ type: "not authorized", message: "missing token" })
    try {

        let user = jwt.verify(token, process.env.SECRET_JWT);
        req.user = user;
        next();
    }
    catch (err) {
        return res.status(401).json({ type: "not authorized", message: "invalid token / token expired" })

    }

}

export const authAdmin = (req, res, next) => {//פונקציה שבודקת האם המשתמש הוא מנהל

    let token = req.headers["x-access-token"];
    if (!token)
        return res.status(401).json({ type: "not authorized", message: "missing token" })
    try {

        let user = jwt.verify(token, process.env.SECRET_JWT);
        if (user.role != "ADMIN")
            res.status(403).json({ type: "not allowed", message: "this opration only manager" })
        req.user = user;
        next();
    }
    catch (err) {
        return res.status(401).json({ type: "not authorized", message: "invalid token / token expired" })

    }

}
