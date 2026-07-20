import { 
        findPrincipalProfileByNumber
} from "../../models/principal/principalProfile.model.js"


export const getPrincipalProfile = async (req, res) => {

    try {

        // JWT middleware se aayega
        const principalNumber = req.user.principalNumber;


        if (!principalNumber) {

            return res.status(400).json({
                message: "Principal number missing in token"
            });

        }


        const principalProfile =
            await findPrincipalProfileByNumber(
                principalNumber
            );


        if (!principalProfile) {

            return res.status(404).json({
                message: "principal profile not found"
            });

        }


        return res.status(200).json({

            message: "principal profile fetched successfully",

            profile: principalProfile

        });


    } catch (error) {


        console.error(
            "principal Profile Error:",
            error.message
        );


        return res.status(500).json({

            message: "Internal Server Error"

        });

    }

};