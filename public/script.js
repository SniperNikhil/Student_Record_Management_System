//To make use of Socket IO Write below code 
//make sure you have added socket.io link in .hbs file
const socket = io()

//We are creating variables to access each id item in .hbs(html) file
const studentid = document.getElementById("studentid")
const sname = document.getElementById("name")
const dob = document.getElementById("dob")
const gender = document.getElementById("gender")
const phone = document.getElementById("phone")
const age = document.getElementById("age")
const email = document.getElementById("email")
const address = document.getElementById("address")
const add = document.getElementById("add")
const clear = document.getElementById("clear")
const updatebtn = document.getElementById("update")
const deletebtn = document.getElementById("delete")
const searchbtn = document.getElementById("search")
const searchoption = document.getElementById('searchoption');
const searchinput = document.getElementById('searchinput');

// Below code is for click event on table row which will change background
// color of the row and display the data in input fields of Student enrollment
function setUpTableRowListeners() {
    const tableRows = document.querySelectorAll('.recordstable tbody tr');
    //AS there are multiple row run foreach loop
    tableRows.forEach(row => {
        row.addEventListener('click', function () {
            // Remove the highlight class from all rows
            tableRows.forEach(r => r.classList.remove('highlight'));

            // Add the highlight class to the clicked row
            row.classList.add('highlight');

            //This code will add data to Student Enrollment input fields
            const cells = row.querySelectorAll('td');
            studentid.value = cells[0].textContent;
            studentid.disabled = true
            sname.value = cells[1].textContent;
            email.value = cells[2].textContent;
            email.disabled = true
            dob.value = new Date(cells[3].textContent).toISOString().split('T')[0];
            gender.value = cells[4].textContent;
            phone.value = cells[5].textContent;
            age.value = cells[6].textContent;
            address.value = cells[7].textContent;
        });
    });
}

//Initially when the page is reloaded we are setting the click event on table 
document.addEventListener('DOMContentLoaded', function () {
    setUpTableRowListeners();
});


//Below Code will is for adding student on click of add button
add.addEventListener('click', () => {
    //below condtion will check for empty fields while adding a student
    if (studentid.value != "" &&
        sname.value != "" &&
        dob.value != "" &&
        gender.value != "" &&
        phone.value != "" &&
        age.value != "" &&
        email.value != "" &&
        address.value != ""
    ) {
        //We are storing the students all data in data variable
        const data = {
            studentid: studentid.value,
            name: sname.value,
            dob: dob.value,
            gender: gender.value,
            phone: phone.value,
            age: age.value,
            email: email.value,
            address: address.value
        }

        //This data will be emitted to Server for Adding the Stduent
        socket.emit('add', data)
    } else {
        //if there are empty fields below message will be dispalyed
        alert("Please Enter All Details")
    }
})

//Below Function will add the data in table as rows
function settabledata(data) {
    const tbody = document.getElementById("studentsTableBody")

    //Initaially clear all rows
    tbody.innerHTML = ""

    //As there are many rows data run a for loop
    data.forEach(student => {
        //create a tr element in tbody tag
        const row = document.createElement('tr')

        //Add td to tr element
        row.innerHTML = `
            <td>${student.studentid}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.dob}</td>
            <td>${student.gender}</td>
            <td>${student.phone}</td>
            <td>${student.age}</td>
            <td>${student.address}</td>
        `
        //Append the created tr to tbody tag
        tbody.appendChild(row)
    })
}

//BElow code is to show success or failure message to user n any condition
//Note WE have  reused this code many times check server file
socket.on('addsuccess', (message, data) => {
    //Displat the message as aleart
    alert(message)

    //if we have received data from server dislay it in table
    if (data) {
        settabledata(data)
    }
    //Reset the Click event for table as it will be remove after performing any operations
    setUpTableRowListeners();
})


//Below Code is to clear or reset the complete page to default 
clear.addEventListener('click', () => {
    email.disabled = false
    studentid.disabled = false
    studentid.value = "",
        sname.value = "",
        dob.value = "",
        gender.value = "Male",
        phone.value = "",
        age.value = "",
        email.value = "",
        address.value = "",
        searchoption.value = "Select",
        searchinput.value = ""

    // Remove the highlight class from all rows
    const tableRows = document.querySelectorAll('.recordstable tbody tr');
    tableRows.forEach(row => row.classList.remove('highlight'));

    //This will tell server to send the table data 
    socket.emit('reset')
})

//BElow code is to reset the table data to default
socket.on('resettable', (data) => {
    settabledata(data)
    setUpTableRowListeners();
})

//Below code to delete student 
deletebtn.addEventListener('click', () => {
    //To delete a student we are making use of email 
    if (email.value != "") {
        //Send email to server so it will delete the complete record of particular email
        socket.emit('deletestudent', email.value)
    } else {
        //if email field is empty display beloow message
        alert("Please Select a student from table")
    }
})

//BElow code is for Update button to update student data
updatebtn.addEventListener('click', () => {
    //Check weather all fileds are added by user
    if (studentid.value != "" &&
        sname.value != "" &&
        dob.value != "" &&
        gender.value != "" &&
        phone.value != "" &&
        age.value != "" &&
        email.value != "" &&
        address.value != ""
    ) {
        //Collect all data and send it to server
        const data = {
            studentid: studentid.value,
            name: sname.value,
            dob: dob.value,
            gender: gender.value,
            phone: phone.value,
            age: age.value,
            email: email.value,
            address: address.value
        }
        //Emitting the data to server so the it update the student data 
        socket.emit('updatestudent', data)
    } else {
        //If there is any empty field below message will be displayed
        alert("Please Select student from the table")
    }
})


//Below Code is for Search button on table
searchbtn.addEventListener('click', () => {
    //Check weather the student have selected the search dropdown
    if (searchoption.value != "Select") {
        let selectedoption = searchoption.value
        let searchtext = searchinput.value
        socket.emit('searchstudent', selectedoption, searchtext)
    } else {
        //if not selected below message will be displayed
        alert("Please Select an option from the dropdown")
    }
})