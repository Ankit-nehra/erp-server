import jwt from "jsonwebtoken";


export const verifyTeacherToken = (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;


        if (!authHeader) {

            return res.status(401).json({
                message: "Token required"
            });

        }


        const parts = authHeader.split(" ");

if(
    parts.length !== 2 ||
    parts[0] !== "Bearer"
){

    return res.status(401).json({
        message:"Invalid authorization format"
    });

}

const token = parts[1];


        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log(
"Teacher JWT:",
decoded
);



        if (decoded.role !== "teacher") {

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