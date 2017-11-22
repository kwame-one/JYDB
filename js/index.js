const {ipcRenderer} = require("electron")
let $ = require("jquery")
let fs = require("fs")
let notifier = require('node-notifier')
const path = require("path")
const url = require("url")
let updateIndex

ipcRenderer.on("interface", function(event, arg) {
	update()
})

ipcRenderer.on("deleteConfirmed", function(event, arg) {
	deleteMember(arg)
})


ipcRenderer.on("new_member", function(event, arg) {
		fs.readFile("./database/members.json", function(err, data) {
		if(err) throw err

		let allMembersObject = JSON.parse(data)
		console.log(arg);
		let id = arg-1

		console.log(allMembersObject.members[id]['id']);

		for(var i=0; i<allMembersObject.length; i++) {
			if(allMembersObject.members[i]['id'] == id) {
				$("#table-body").append(
					"<tr id='"+i+"'>\
						<td id='name"+i+"'>"+allMembersObject.members[i].surname+" "+allMembersObject.members[i].otherNames +"</td>\
					    <td><button class='btn btn-default' id='view"+i+"' onclick='viewId("+i+")'>View</button></td>\
						<td><button class='btn btn-primary' id='update"+i+"' onclick='updateId("+i+")'>Update</button></td>\
						<td><button class='btn btn-danger' id='delete"+i+"' onclick='deleteId("+i+")'>Delete</button></td>\
					</tr>"
				)
				break;
			}
			// $(".table").show()
		}
	})
			
})


function update() {
	$("#table-body").empty();
	findAll()
}

function findMember() {
	$(".table").hide()
	$("#table-body").empty()
	var count = 0;
	var member = document.getElementById("surname").value

	var data = fs.readFileSync("./database/members.json") 
	var memberObject = JSON.parse(data)

	 for(var i=0; i<memberObject.members.length; i++) {
		  if(memberObject.members[i].surname.toLowerCase() == member.toLowerCase()) {
			$("tbody").append(
				"<tr id='"+i+"'>\
				<td id='name"+i+"'>"+memberObject.members[i].surname+" "+memberObject.members[i].otherNames +"</td>\
				<td><button class='btn btn-default' id='view"+i+"' onclick='viewId("+i+")'>View</button></td>\
				<td><button class='btn btn-primary' id='update"+i+"' onclick='updateId("+i+")'>Update</button></td>\
				<td><button class='btn btn-danger' id='delete"+i+"' onclick='deleteId("+i+")'>Delete</button></td>\
				</tr>"
				)
			$(".table").show()
			count = count + 1
		 }
		 
	 }

	 if(count == 0) {
		notifier.notify({
			title: "JY Database",
			message: "Record not found",
			sound: true,
			wait: true,
			icon: path.join(__dirname, "log.jpg")
		}, function(err, response) {

		})
	}
	
}

function findAll() {
	let allMembersObject
	let data = fs.readFileSync("./database/members.json")
	
		allMembersObject = JSON.parse(data)
		
		// display all members in a table
		for(var k=0; k<allMembersObject.members.length; k++) {
			$("#table-body").append(
				"<tr id='"+k+"'>\
				<td id='name"+k+"'>"+allMembersObject.members[k].surname+" "+allMembersObject.members[k].otherNames +"</td>\
				<td><button class='btn btn-default' id='view"+k+"' onclick='viewId("+k+")'>View</button></td>\
				<td><button class='btn btn-primary' id='update"+k+"' onclick='updateId("+k+")'>Update</button></td>\
				<td><button class='btn btn-danger' id='delete"+k+"' onclick='deleteId("+k+")'>Delete</button></td>\
				</tr>"
				)
				// $(".table").show()
		}
}
	

function updateId(index) {
	ipcRenderer.send("update", index)
}

function viewId(index) {
	ipcRenderer.send("view", index)
}

function deleteId(index) {
	ipcRenderer.send("delete", index)
}


function deleteMember(index) {

	var data = fs.readFileSync("./database/members.json")
	var object = JSON.parse(data)

	object.members.splice(index, 1)
	$("#"+index+"").remove()
	$("#"+index+"").hide()

	var rows = $(".table tr").length	
	console.log(rows)
	if(rows == 2) {
		$(".table").hide()
	}	

	fs.writeFile("./database/members.json", JSON.stringify(object), (err) => {
		if (err) {
			throw err
		}

	})
}

function findByYearGroup() {
	$("#table-body").empty()

	var yearGroup = document.getElementById("surname").value
	var count = 0

	fs.readFile("./database/members.json", "utf-8", function(err, data) {
		if (err) {
			throw err
		}
		var yearGroupObject = JSON.parse(data)

		for(var i=0; i<yearGroupObject.members.length; i++) {
			var date = yearGroupObject.members[i].graduationDate
			var year = date.split("-")[0]
			if(yearGroup == year) {
				console.log(year)
				count++
			}
		}
		if(count == 0) {
			console.log("year not found")
		}
	})

	
}

function filterList() {

    var input, tr, td;
    input = document.getElementById("surname").value;
    console.log(input)
    tr = $("tbody#table-body");
    
    for (var i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        console.log(td);
        if (td) {
	      if (td.innerHTML.indexOf(input) > -1 ) {
	        tr[i].style.display = "";
	      } else {
	        tr[i].style.display = "none";
	      }
	    }
    }
}

findAll()