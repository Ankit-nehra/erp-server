import jwt from "jsonwebtoken";


 export const verifyStudentToken = (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;


        if (!authHeader) {

            return res.status(401).json({
                message: "Token required"
            });

        }


        const token = authHeader.split(" ")[1];


        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        if (decoded.role !== "student") {

            return res.status(403).json({
                message: "Access denied"
            });

        }


        req.user = decoded;


        next();


    } catch(error) {

        return res.status(401).json({
            message: "Invalid or expired token"
        });

    }

};
