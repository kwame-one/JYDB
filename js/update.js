const {ipcRenderer} = require("electron")
let fs = require("fs")
let $ = require("jquery")
let notifier = require("node-notifier")
const path = require("path")
const url = require("url")
let remote = require("electron").remote

// personal information variables
let surname, firstAndOther, gender, DOB, email, phoneNumber, residence

//education details variables
let school, level, schoolResidence, visitDay, time

//variable to hold error msg
let error = ""

//jy details variables
let dateOfGraduation, bibleStudyGroup, JYGroup, index


let data = fs.readFileSync("./database/members.json")
let memberObject = JSON.parse(data) 

function confirmUpdate() {
	ipcRenderer.send("updateConfirmed")
}

ipcRenderer.on("confirmed", function() {
	validate()
})

ipcRenderer.on("updateIndex", function(event, arg) {
	index = arg

	//display surname for changes
	var sname = memberObject.members[arg].surname
	document.getElementById("surname").value = sname

	//display other names for changes
	var onames = memberObject.members[arg].otherNames
	document.getElementById("foanames").value = onames

	//display the gender for changes
	var gen = memberObject.members[arg].gender
	if(gen == 'Male') {
		document.getElementById("sexM").checked = true
	}else {
		document.getElementById("sexF").checked = true
	}

	//display date of birth for changes
	var dob = memberObject.members[arg].DOB
	document.getElementById("birth").value = dob

	//display email address for changes
	var mail = memberObject.members[arg].email
	document.getElementById("email").value = mail

	//display contact for changes
	var phone = memberObject.members[arg].contact
	document.getElementById("contact").value = phone

	//display residence for changes
	var location = memberObject.members[arg].residence
	document.getElementById("residence").value = location

	//display school for changes
	var edu = memberObject.members[arg].school
	document.getElementById("school").value = edu

	//display level of education for changes
	var lev = memberObject.members[arg].level
	if(lev == "Primary") {
		document.getElementById("levelP").checked = true
	}else if(lev == "JHS") {
		document.getElementById("levelJ").checked = true
	}else {
		document.getElementById("levelS").checked = true
		$(".res").show()
	}

	//display school residence for changes
	var eduResidence = memberObject.members[arg].day_boarding
	if(eduResidence == "Day") {
		document.getElementById("schoolday").checked = true
	}else if(eduResidence == "Boarding") {
		document.getElementById("schoolboard").checked = true
		$(".visit").show()
	}

	//display visiting days for changes
	var visitingDays = memberObject.members[arg].visitingDays
	if(visitingDays == "First Sunday of every Month") {
		document.getElementById("fsun").selected = true		
	}else if(visitingDays == "Second Sunday of every Month") {
		document.getElementById("ssun").selected = true
	}else if(visitingDays == "First Saturday of every Month") {
		document.getElementById("fsat").selected = true
	}else if(visitingDays == "Second Saturday of every Month") {
		document.getElementById("ssat").selected = true
	}else if(visitingDays == "First and Last Sunday of every Month") {
		document.getElementById("flsun").selected = true
	}else if(visitingDays == "First and Last Saturday of every Month") {
		document.getElementById("flsat").selected = true		
	}

	//display time for changes
	var vtime = memberObject.members[arg].time
	document.getElementById("time").value = vtime

	//display graduation date for changes
	var graduationDate = memberObject.members[arg].graduationDate
	document.getElementById("graduation").value = graduationDate

	//display bible study group for changes
	var BSGroup = memberObject.members[arg].BSGroup
	if(BSGroup == "Esther") {
		document.getElementById("esther").selected = true
	}else if(BSGroup == "Peter") {
		document.getElementById("peter").selected = true
	}else if(BSGroup == "John") {
		document.getElementById("john").selected = true
	}else if(BSGroup == "Ipsum") {
		document.getElementById("ipsum").selected = true
	}else {
		document.getElementById("lorem").selected = true		
	}

	//display jygroup for changes
	var JYGroup  = memberObject.members[arg].JYGroup
	if(JYGroup == "Esther") {
		document.getElementById("gesther").selected = true
	}else if(JYGroup == "Peter") {
		document.getElementById("gpeter").selected = true
	}else if(JYGroup == "John") {
		document.getElementById("jgohn").selected = true
	}else if(JYGroup == "Ipsum") {
		document.getElementById("gipsum").selected = true
	}else {
		document.getElementById("glorem").selected = true		
	}

})


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


function validate() {
	//get the value of surname of member
	surname = document.getElementById("surname").value

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

	//get the level of member
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



	if(surname=="" || firstAndOther=="" || DOB=="" || residence=="" || school=="" || sex == false || checkedLevel == false 
		|| dateOfGraduation == "" ) {
		error = "Please fill all required files"
	}

	//check whether there are no errors
	if(error != "") { 
		//notify user when error is found
		notifier.notify({
			title: "JY Database",
			message: "Please fill all required fileds",
			wait: true,
			sound: true,
			icon: path.join(__dirname, "log.jpg")
		}, function(err, response) {
			
		})
	}
	else {	
		//update user details
		update()
	}

	error = ""
	sex = false
	checkedLevel = false
	noTime = false
	noVisit = false
	
}

// update member and save to members.json file
function update() { 
		
	var membersObject = JSON.parse(data)
	membersObject.members[index].surname = surname, 
	membersObject.members[index].otherNames = firstAndOther, 
	membersObject.members[index].gender = gender, 
	membersObject.members[index].DOB = DOB, 
	membersObject.members[index].email = email, 
	membersObject.members[index].contact = phoneNumber, 
	membersObject.members[index].residence = residence, 
	membersObject.members[index].school = school, 
	membersObject.members[index].level = level, 
	membersObject.members[index].day_boarding = schoolResidence,
	membersObject.members[index].visitingDays = visitDay, 
	membersObject.members[index].time = time, 
	membersObject.members[index].graduationDate = dateOfGraduation, 
	membersObject.members[index].BSGroup = bibleStudyGroup, 
	membersObject.members[index].JYGroup = JYGroup
	

	fs.writeFile("./database/members.json", JSON.stringify(membersObject), "utf-8", function(err) {
		if(err) 
			throw err
		else {
			console.log("done")
			// notify user that member has been added
			notifier.notify({
			title: "JY Database",
			message: "Member updated successfully",
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

	ipcRenderer.send("change", index);

}