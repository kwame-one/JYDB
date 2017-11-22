let $ = require('jquery')
let fs = require('fs')
let filename = "./contacts.txt"
let no = 0

$("#add").on("click", () => {
	let name = $("#name").val()
	let email = $("#email").val()

	fs.appendFile("./contacts.txt", name + "," + email + "\n")

	addEntry(name, email)
})

function addEntry(name, email) {
	if(name && email) {
		no++
		let updateString = ""+no+ ""+ name+ ""+ email+ ""
		$("#contact-table").append(
				"<tr><td>"+no+"</td><td>"+name+"</td><td>"+email+"</td></tr>"
			)
	}
}

function loadAndDisplayContacts() {
	//check if file exits
	if(fs.exitsSync(filename)) {
		let data = fs.readFileSync(filename, 'utf-8').split("\n")
		data.forEach((contact, index) => {
			let name = contact.split(",")[0]
			let email = contact.split(",")[1]
			addEntry(name, email)
		})
	}else {
		console.log("File does not exist...creating new file")
		fs.writeFile(filename, "", (err) => {
			if(err) 
				console.log(err);
		})
	}
}

//loadAndDisplayContacts()