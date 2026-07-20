import {
    getAllPeriods,
    createPeriod,
    deletePeriod
} from "../../models/admin/period.model.js";


// Fetch Periods
export const fetchPeriods = async (req,res)=>{

    try{

        const periods = await getAllPeriods();

        return res.status(200).json({

            message:"Periods fetched successfully",

            periods

        });

    }
    catch(error){

        console.error(error);

        return res.status(500).json({

            message:"Internal Server Error"

        });

    }

};


// Add Period
export const addPeriod = async(req,res)=>{

    try{

        const {period_name}=req.body;

        if(!period_name){

            return res.status(400).json({

                message:"Period name required"

            });

        }

        const period=await createPeriod(period_name);

        return res.status(201).json({

            message:"Period created successfully",

            period

        });

    }
    catch(error){

        console.error(error);

        if(error.code==="23505"){

            return res.status(409).json({

                message:"Period already exists"

            });

        }

        return res.status(500).json({

            message:"Internal Server Error"

        });

    }

};


// Delete Period
export const removePeriod = async(req,res)=>{

    try{

        const {id}=req.params;

        const deleted=await deletePeriod(id);

        if(!deleted){

            return res.status(404).json({

                message:"Period not found"

            });

        }

        return res.status(200).json({

            message:"Period deleted successfully"

        });

    }
    catch(error){

        console.error(error);

        return res.status(500).json({

            message:"Internal Server Error"

        });

    }

};