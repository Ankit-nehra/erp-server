import {
    getAllSessions,
    getSessionById,
    createSession,
    deleteSession,
} from "../../models/admin/sessons.model.js";


// Get All Sessions
export const fetchAllSessions = async (req, res) => {
    try {

        const sessions = await getAllSessions();

        return res.status(200).json({
            message: "Sessions fetched successfully",
            sessions,
        });

    } catch (error) {

        console.error("Get Sessions Error:", error.message);

        return res.status(500).json({
            message: "Internal Server Error",
        });

    }
};


// Get Session By ID
export const fetchSessionById = async (req, res) => {
    try {

        const { id } = req.params;

        const session = await getSessionById(id);

        if (!session) {

            return res.status(404).json({
                message: "Session not found",
            });

        }

        return res.status(200).json({
            message: "Session fetched successfully",
            session,
        });

    } catch (error) {

        console.error("Get Session Error:", error.message);

        return res.status(500).json({
            message: "Internal Server Error",
        });

    }
};


// Create Session
export const addSession = async (req, res) => {
    try {

        const {
            session_name,
            start_date,
            end_date,
            is_active,
        } = req.body;

        if (
            !session_name ||
            !start_date ||
            !end_date
        ) {

            return res.status(400).json({
                message: "All fields are required",
            });

        }

        const session = await createSession({
            session_name,
            start_date,
            end_date,
            is_active,
        });

        return res.status(201).json({
            message: "Session created successfully",
            session,
        });

    } catch (error) {

        console.error("Create Session Error:", error.message);

        // Duplicate session name
        if (error.code === "23505") {
            return res.status(409).json({
                message: "Session already exists",
            });
        }

        return res.status(500).json({
            message: "Internal Server Error",
        });

    }
};


// Delete Session
export const removeSession = async (req, res) => {
    try {

        const { id } = req.params;

        const session = await deleteSession(id);

        if (!session) {

            return res.status(404).json({
                message: "Session not found",
            });

        }

        return res.status(200).json({
            message: "Session deleted successfully",
        });

    } catch (error) {

        console.error("Delete Session Error:", error.message);

        return res.status(500).json({
            message: "Internal Server Error",
        });

    }
};