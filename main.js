const {app, BrowserWindow, Menu, MenuItem} = require("electron")
const url = require("url")
const path = require("path")
const {ipcMain} = require("electron")


//keep a global reference of the window object, if you dont the window will
// be closed automatically when the javascript object is garbage collected
let mainWindow
let childWindow
let aboutWin
let detailsWin
let updateWin


// create the add member window
function addMemberWindow() {
	childWindow = new BrowserWindow({width: 1025, height: 700, parent: mainWindow, modal: true, icon: path.join(__dirname, "log.jpg")})
	childWindow.loadURL(url.format({
		pathname: path.join(__dirname, "addMember.html"),
		protocol: "file",
		slashes: true
	}))
	childWindow.setMenu(null)
}

//create the about window
function aboutWindow() {
	aboutWin = new BrowserWindow({width: 600, height: 400, parent: mainWindow, modal: true, resizable: false, icon: path.join(__dirname, "log.jpg")})
	aboutWin.loadURL(url.format({
		pathname: path.join(__dirname, "about.html"),
		protocol: "file",
		slashes: true
	}))
	aboutWin.setMenu(null)
}

//create the viewDetails window
function detailsWindow(index) {
	detailsWin = new BrowserWindow({width: 1000, height: 690, parent: mainWindow, modal: true, icon: path.join(__dirname, "log.jpg")})
	detailsWin.loadURL(url.format({
		pathname: path.join(__dirname, "details.html"),
		protocol: "file",
		slashes: true
	}))
	
	detailsWin.webContents.on("did-finish-load", function() {
		detailsWin.webContents.send("index", index)
	})
	detailsWin.setMenu(null)
}

//create update member window
function updateWindow(index) {
	updateWin = new BrowserWindow({width: 1025, height:700, parent: mainWindow, modal:true, icon: path.join(__dirname, "log.jpg")})
	updateWin.loadURL(url.format({
		pathname: path.join(__dirname, "update.html"),
		protocol: "file",
		slashes: true
	}))
	updateWin.webContents.on("did-finish-load", function() {
		updateWin.webContents.send("updateIndex", index)
	})
	updateWin.setMenu(null)
}

// create the main window of the application
function createWindow() {
	mainWindow = new BrowserWindow({width: 1075, height: 700, icon: path.join(__dirname, "log.jpg")})
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, "index.html"),
		protocol: "file",
		slashes: true
	}))
	mainWindow.webContents.openDevTools()

	mainWindow.webContents.on("did-finish-load", function() {
		mainWindow.webContents.send("done")
	})

//menu for the application
	const template = [
	{
		label: "File",
		submenu: [
			{
				label: "New Member",
				click() {
					addMemberWindow()
				}
			},
			{
				label: "Exit",
				click() {
					app.quit()
				}
			}
		]			
	},
	{
		label: "Help",
		submenu: [
			{
				label: "About",
				click() {
					aboutWindow()
				}
			}
		]		
	}
]

	const menu = Menu.buildFromTemplate(template)
	mainWindow.setMenu(menu)

	//launch the add member window upon receiving 'launch' event 
	ipcMain.on("launch", function() {
		addMemberWindow()
	})

	//launch details window upon receiving view event
	ipcMain.on("view", function(event, arg) {
		var index = arg
		detailsWindow(index)
	})

	//launch update member window upon receiving update event
	ipcMain.on("update", function(event, arg) {
		var index = arg
		updateWindow(index)
	})

	//emitted when the main window is closed
	mainWindow.on("closed", function() {
		mainWindow = null
	})

	//update interface upon receiving change event
	ipcMain.on("change", function(event, arg) {
		mainWindow.webContents.send("interface", arg)
		console.log("update event sent")
	})

	ipcMain.on("add", function(event, arg) {
		mainWindow.send("new_member", arg);
	})

	//delete member upon receiving delete event
	ipcMain.on("delete", function(event, arg) {
		const {dialog} = require("electron")
		 var ans = dialog.showMessageBox(mainWindow, {
		 	type: "info",
		 	buttons: ['Yes', "No"],
		 	title: "Delete Member",
		 	message: "Are you sure?"
		 })
		 console.log(arg)

		 if(ans == 0) {
		 	mainWindow.webContents.send("deleteConfirmed", arg)
		 }else {
		 	
		 }
	})

	ipcMain.on("updateConfirmed", function() {
		const {dialog} = require("electron")
		var ans = dialog.showMessageBox(updateWin, {
			type: "info",
			buttons: ["Yes", "No"],
			title: "Update Member",
			message: "Save changes?",
			cancelId: 3
		})
		if (ans == 0) {
			updateWin.webContents.send("confirmed")
		}else if(ans == 1) {
			updateWin.close()
		}else {

		}
	})

}
//end of createWindow() function

//this method will be called when electron has finished
//initialization and  is ready to create browser windows
app.on("ready", createWindow);

