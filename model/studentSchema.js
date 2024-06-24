//This is the Schema File Which defines the structure of data stored in collection
const mongoose = require("mongoose")

//Below us Student Schema which contains student data as attributes
const student = new mongoose.Schema({
    studentid:{type:String,unique:true},
    name:{type:String},
    dob:{type:String},
    gender:{type:String},
    phone:{type:String},
    age:{type:String},
    email:{type:String,unique:true},
    address:{type:String}
})

//After defining Schema we must model which will help us to write quries 
const students = mongoose.model("students",student)

//Exporting the students which will help us to write quries in other files also
module.exports = students