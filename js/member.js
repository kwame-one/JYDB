let $ = require('jquery')
const {ipcRenderer} = require("electron")
const notifier = require("node-notifier")
let fs = require("fs")
const path = require("path")
const url = require("url")
let remote = require("electron").remote

if(localStorage.getItem("index") == null || localStorage.getItem("index") == 0) {
	localStorage.setItem("index", 0);
}

$('input[name="level"]').click(function() {
if($(this).val() == "SHS") {
	$(".res").show()
	if($('input[name="schoolres"]:checked').val() == "Boarding")
		$(".visit").show()
}else {
	$(".res").hide()
	$(".visit").hide()
}
})


$('input[name="schoolres"]').click(function() {
	if($(this).val() == "Boarding" ) {
		$(".visit").show()
	}else {
		$(".visit").hide()
	}
})

$("#butt").click(validate)


// personal information variables
let surname, firstAndOther, gender, DOB, email, phoneNumber, residence

//education details variables
let school, level, schoolResidence, visitDay, time

//variable to hold error msg
let error = ""

//jy details variables
let dateOfGraduation, bibleStudyGroup, JYGroup


// validate inputs
function validate() {
	//get the value of surname of member
	surname = document.getElementById("surname").value;

	//get the value of the first and other names of member
	firstAndOther = document.getElementById("foanames").value

	//get the value of gender of member
	if(document.getElementById("sexM").checked) {
		gender = document.getElementById("sexM").value
	}else if(document.getElementById("sexF").checked){
		gender = document.getElementById("sexF").value
	}else {
		gender = null
	}

	//get the value of the date of birth of member
	DOB = document.getElementById("birth").value

	//get the email of email address of member
	email = document.getElementById("email").value
	if(email == "") {
		email = null
	}

	//get the phone number of member
	phoneNumber = document.getElementById("contact").value
	if(phoneNumber == "") {
		phoneNumber = null
	}

	//get the residence of member
	residence = document.getElementById("residence").value

	//get the school of member
	school = document.getElementById("school").value

	//get the level of education of member
	if(document.getElementById("levelP").checked) {
		level = document.getElementById("levelP").value
	}else if(document.getElementById("levelJ").checked) {
		level = document.getElementById("levelJ").value
	}else if(document.getElementById("levelS").checked) {
		level = document.getElementById("levelS").value
	}else {
		level = null
	}

	//get the school residence of member
	if(document.getElementById("schoolday").checked) {
		schoolResidence = document.getElementById("schoolday").value
	}else if(document.getElementById("schoolboard").checked) {
		schoolResidence = document.getElementById("schoolboard").value
	}else {
		schoolResidence = null
	}


	//get the visiting days of member
	var noVisit = false
	var visitElement = document.getElementById("visitDays")
	visitDay = visitElement.options[visitElement.options.selectedIndex].text
	if (visitDay == "choose your option") {
		visitDay = null
		noVisit = true
	}

	//get the time of visiting hours of member
	var noTime = false
	time = document.getElementById("time").value
	if(time == "") {
		time = null
		noTime = true
	}

	//get the date of graduation of member
	dateOfGraduation = document.getElementById("graduation").value

	//get the bible study group of member
	var studyGroup = document.getElementById("studyGroup")
	bibleStudyGroup = studyGroup.options[studyGroup.options.selectedIndex].text

	//get the jy group of member
	var group = document.getElementById("jygroup")
	JYGroup = group.options[group.options.selectedIndex].text

	//temporal variable
	var sex = false
	var checkedLevel = false

	//validate gender 
	if(document.getElementById("sexM").checked || document.getElementById("sexF").checked) {
		sex = true //return true is either male or female is checked
	}

	//validate level and school residence
	if((document.getElementById("levelJ").checked || document.getElementById("levelP").checked) ||
		(document.getElementById("levelS").checked && (document.getElementById("schoolday").checked)) || 
		(document.getElementById("levelS").checked && document.getElementById("schoolboard").checked && noTime == false && noVisit == false)) {
		checkedLevel = true // return true if everything is ok
	}



	if(surname=="" || firstAndOther=="" || DOB==""|| residence=="" || school=="" || sex == false || checkedLevel == false 
		|| dateOfGraduation == "" || bibleStudyGroup == "choose your option" || JYGroup == "choose your option" ) {
		error = "Please fill all required files"
	}

	//check whether there are no errors
	if(error != "") { 
		//notify user when error is found
		notifier.notify({
			title: "JY Database",
			message: "Please fill all required fileds",
			wait: true,
			icon: path.join(__dirname, "log.jpg"),
			sound: true
		}, function(err, response) {
			
		})
	}
	else {	

		add()
		
	}

	error = ""
	sex = false
	checkedLevel = false
	noTime = false
	noVisit = false
	
}

// add to members.json file
function add() { 

	let id = localStorage.getItem("index")

	fs.readFile("./database/members.json", "utf-8", function(err, data) {
		if(err) throw err
		
		var memberObject = JSON.parse(data)
		memberObject.members.push({
			id: id,
			surname: surname, 
			otherNames: firstAndOther, 
			gender: gender, 
			DOB: DOB, 
			email: email, 
			contact: phoneNumber, 
			residence: residence, 
			school: school, 
			level: level, 
			day_boarding:schoolResidence,
			visitingDays: visitDay, 
			time: time, 
			graduationDate: dateOfGraduation, 
			BSGroup: bibleStudyGroup, 
			JYGroup: JYGroup
		})

		fs.writeFile("./database/members.json", JSON.stringify(memberObject), "utf-8", function(err) {
			if(err) 
				throw err
			else {
				console.log("done")
				// notify user that member has been added
				notifier.notify({
				title: "JY Database",
				message: "New member added successfully",
				wait: true,
				sound: true,
				icon: path.join(__dirname, "log.jpg")
				}, function(err, response) {
					
				})
				setTimeout(function() {
					var window = remote.getCurrentWindow()
					window.close()
				}, 100)
			}
		})
	})

	ipcRenderer.send("add", id);
	localStorage.setItem("index", ++id)
	
}



