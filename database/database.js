/** This is the Database Connection code file */

const mongoose = require("mongoose")

//We are fetching MONGO_URL from .env file
const MONGO_URL = process.env.MONGO_URL

//BElow is the arrow function to connect to database  
const database= async ()=>{
    try {
        //below code will connect to database and display success message
        await mongoose.connect(MONGO_URL)
        console.log("Successfuly connected to database")
    } catch (error) {
        //If Connection failed below error will be shown
        console.log("Error in connecting the database",error)
    }
} 

//Call the database function
database()

//Exporting the mongoose so that it can be accessed from other files also
module.exports = mongoose