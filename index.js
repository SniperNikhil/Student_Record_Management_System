//Import All used Packages
const express = require("express")
const http = require("http")
const app = express()
const path = require("path")
const socketIo = require("socket.io")
const hbs = require("hbs");

//below code will help access .env file data
require("dotenv").config()

//BElow code to call the database file 
require("./database/database")

//Below code is to use the student Schema in this file for writing queries
const students = require("./model/studentSchema")

//Server will run on this port number
port = 4001

//As we are making use of socket.io create server using http module
const server = http.createServer(app)

//Initailize SocketIo to our server
const io = socketIo(server)

//Below Code is to access public file like css or javascript
const public = path.join(__dirname, "public")
app.use(express.static(public))

//Set the view engine to hbs(We are not making use of html but both are same)
app.set("view engine", "hbs")

//Running index.hbs on / route on browser through our server
app.get("/", async (req, res) => {

    //Below code contains all students data that will be displayed on table
    const allstudents = await students.find()

    //Render the page and send all student data
    res.render("index", {
        allstudents
    })
})

//Below is Socket.io code to connct with the client
io.on('connection', (socket) => {

    //Below Code is to add Student to database
    socket.on('add', async (data) => {
        
        try {
            //Check weather email or stduentid alerdy exist
            const oldstudent1 = await students.findOne({ studentid: data.studentid })
            const oldstudent = await students.findOne({ email: data.email })

            if (oldstudent || oldstudent1) {
                //If exist display below message 
                socket.emit('addsuccess', "Student Already Exist please add unique studentid and email")
            } else {
                //if dont exist add student to database
                const newStudent = new students(data)
                const savedStudent = await newStudent.save()

                //After adding display all students in table so that added student is also visible
                const allstudents = await students.find()

                //Emit the success message along with student data to client
                socket.emit('addsuccess', "Student added Successfully", allstudents)
            }
        } catch (error) {
            //Any error occurs below message will be displayed 
            socket.emit('addsuccess', "Error in adding student please add unique studentid and email")
            // console.error("Error saving the student:", error);
        }
    })

    //Below Code is to reset the table data to default
    socket.on('reset', async () => {
        try {
            //Fetch all students and send it to client
            const allstudents = await students.find()
            socket.emit('resettable', allstudents)
        } catch (error) {
            //Any error occurs below message will be displayed
            socket.emit('addsuccess', "Error reseting the table: please refresh and retry")
        }
    })

    //Below Code is to delete a student data from database using the email 
    socket.on('deletestudent', async (data) => {
        try {
            //Check weather student exist or not
            const oldstudent = await students.findOne({ email: data })
            if (oldstudent) {
                const deletestudent = await students.deleteOne({ email: data })

                //After deleting student update the table will students data
                const allstudents = await students.find()

                //If deletion is success display below message and reset the table data
                socket.emit('addsuccess', "Student Deleted Successfully")
                socket.emit('resettable', allstudents)
            } else {
                //If student does not exist dispaly below message
                socket.emit('addsuccess', "Student Does not Exist")
            }
        } catch (error) {
            //Any error occurs below message will be displayed
            socket.emit('addsuccess', "Error in Deleteing the student: please retry")
        }
    })

    //Below Code is to update the student data
    socket.on('updatestudent', async (data) => {
        try {
            //Check weather student exist or not
            const oldstudent = await students.findOne({ email: data.email })
            if (oldstudent) {
                const updatestudent = await students.updateOne(
                    { email: data.email },
                    {
                        $set: {
                            name: data.name,
                            dob: data.dob,
                            gender: data.gender,
                            phone: data.phone,
                            age: data.age,
                            address: data.address
                        }
                    }
                )
                //After deleting student update the table will students data
                const allstudents = await students.find()

                //If Updation is success display below message and reset the table data
                socket.emit('addsuccess', "Student Updated Successfully")
                socket.emit('resettable', allstudents)
            } else {
                //If student does not exist dispaly below message
                socket.emit('addsuccess', "Student Does not Exist")
            }
        } catch (error) {
            // console.error(error)
            socket.emit('addsuccess', "Error in Updating the student: please retry")
        }
    })

    //Below code is to search a student and display it in the table
    socket.on('searchstudent', async (selectedoption, searchtext) => {
        try {
            //As there are multiple options for search make search query dynamic
            let query = {};
            query[selectedoption] = searchtext;
            let searchedstudents = await students.find(query)
            //If Searched student is found then length will be > than 0
            if(searchedstudents.length>0){
                socket.emit('resettable', searchedstudents)
            }else{
                //If Student not found below message is displayed
                socket.emit('addsuccess', "Student Does not Exist")
            }   
        } catch (error) {
            //Any error occurs below message will be displayed
            socket.emit('addsuccess', "Error in Searching the student: please retry")
        }
    })
})


//Rinning the Server on the specified port number and displaying success message
server.listen(port, () => {
    console.log(`Server Running on the port ${port}`)
})