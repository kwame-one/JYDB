const {ipcRenderer} = require("electron")
let fs = require("fs")
let index

let data = fs.readFileSync("./database/members.json")
let memberObject = JSON.parse(data)

ipcRenderer.on("index", function(event, arg) {
	// display full name
	var name = document.getElementById("name")
	var surname = memberObject.members[arg].surname
	var otherNames = memberObject.members[arg].otherNames
	name.innerHTML = surname+" "+otherNames

	//display date of birth
	var dob = document.getElementById("dob")
	dob.innerHTML = memberObject.members[arg].DOB

	//display gender
	var gender = document.getElementById("gender")
	gender.innerHTML = memberObject.members[arg].gender

	//display email address
	var email = document.getElementById("email")
	if(memberObject.members[arg].email == null) {
		email.innerHTML = "none"
	}else {	
		email.innerHTML = memberObject.members[arg].email
	}

	//display phone number
	var contact = document.getElementById("number")
	if(memberObject.members[arg].contact == null) {
		contact.innerHTML = "none"
	}else {	
		contact.innerHTML = memberObject.members[arg].contact
	}
	

	//display residence
	var residence = document.getElementById("residence")
	residence.innerHTML = memberObject.members[arg].residence

	//display school
	var school = document.getElementById("school")
	school.innerHTML = memberObject.members[arg].school

	//display level
	var level = document.getElementById("level")
	level.innerHTML = memberObject.members[arg].level

	//display school residence
	if(memberObject.members[arg].day_boarding == null) {
		document.getElementById("db").style.display = 'none'
	}else {
		var sr = document.getElementById("sr")
		sr.innerHTML = memberObject.members[arg].day_boarding
	}

	//display visiting days
	if(memberObject.members[arg].visitingDays == null) {
		document.getElementById("vd").style.display = 'none'
	}else {
		var visit = document.getElementById("visiting")
		visit.innerHTML = memberObject.members[arg].visitingDays
	}
	
	//display time
	if(memberObject.members[arg].time == null) {
		document.getElementById("t").style.display = 'none'
	}else {
		var time = document.getElementById("time")
		time.innerHTML = memberObject.members[arg].time
	}

	//display graduation date
	var gd = document.getElementById("dog")
	gd.innerHTML = memberObject.members[arg].graduationDate

	//display bible study group
	var bsg = document.getElementById("bsgroup")
	bsg.innerHTML = memberObject.members[arg].BSGroup

	//display jygroup
	var jyg = document.getElementById("jygroup")
	jyg.innerHTML = memberObject.members[arg].JYGroup
})

