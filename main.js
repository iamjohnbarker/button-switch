const electron = require("electron");
const { app, BrowserWindow, Menu, Tray } = require("electron");
const path = require("path");
const url = require("url");
const { ipcMain } = require("electron");
const { shell } = require("electron");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let mainWindow;
let winDocs;
let winControllerCustomisation;
let winStreamDeckCustomisation;
let winMIDICustomisation;
let tray = null;

// Set env
process.env.NODE_ENV = "production";

function createWindow() {
	// Create the browser window.
	mainWindow = new BrowserWindow({ width: 650, height: 675 });

	// and load the index.html of the app.
	mainWindow.loadURL(
		url.format({
			pathname: path.join(__dirname, "mainWindow.html"),
			protocol: "file:",
			slashes: true
		})
	);

	// Open the DevTools.
	//win.webContents.openDevTools()

	// Emitted when the window is closed.
	mainWindow.on("closed", () => {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null;
	});
}

// DOCS WINDOW
function createDocsWindow() {
	const modalPath = path.join(
		"file://",
		__dirname,
		"./assets/pages/docsWindow.html"
	);
	let win = new BrowserWindow({ width: 545, height: 630 });

	win.on("close", () => {
		win = null;
	});
	win.loadURL(modalPath);
	win.show();
}

// CONTROLLER CUSTOMISATION WINDOW
function createControllerCustomisationWindow() {
	const modalPath = path.join(
		"file://",
		__dirname,
		"./assets/customisation/controllerCustomisation.html"
	);
	let win = new BrowserWindow({ width: 545, height: 630 });

	win.on("close", () => {
		win = null;
	});
	win.loadURL(modalPath);
	win.show();
}

// STREAM DECK CUSTOMISATION WINDOW
function createStreamDeckCustomisationWindow() {
	const modalPath = path.join(
		"file://",
		__dirname,
		"./assets/customisation/streamDeckCustomisation.html"
	);
	let winStreamDeckCustomisation = new BrowserWindow({
		width: 770,
		height: 700
	});

	winStreamDeckCustomisation.on("close", () => {
		win = null;
	});
	winStreamDeckCustomisation.loadURL(modalPath);
	winStreamDeckCustomisation.show();
}

/*
// MIDI CUSTOMISATION WINDOW
function createMIDICustomisationWindow() {
	const modalPath = path.join(
		"file://",
		__dirname,
		"./assets/customisation/midiCustomisation.html"
	);
	let win = new BrowserWindow({ width: 500, height: 630 });

	win.on("close", () => {
		win = null;
	});
	win.loadURL(modalPath);
	win.show();
}
*/

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// // Create tray
//   app.on('ready', () => {
//     tray = new Tray('./assets/icons/tray/tray-icon.png')
//     const contextMenu = Menu.buildFromTemplate([
//       {label: 'Item1', type: 'radio', checked: true},
//       {label: 'Item2', type: 'radio'}
//     ])
//     tray.setToolTip('This is my application.')
//     tray.setContextMenu(contextMenu)
//   })

// Quit when all windows are closed.
app.on("window-all-closed", () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (win === null) {
		createWindow();
	}
});

// Listen for IP Address
ipcMain.on("asynchronous-message", (event, arg) => {
	console.log(arg); // prints "ip address"
	event.sender.send("asynchronous-reply", "pong1");
});

ipcMain.on("gamepad-configure", (event, arg) => {
	createControllerCustomisationWindow();
});

ipcMain.on("streamdeck-configure", (event, arg) => {
	createStreamDeckCustomisationWindow();
});

ipcMain.on("streamdeck-save", (event, arg) => {
	console.log(arg);
	mainWindow.webContents.send("streamdeck-reboot", "streamdeck reboot needed");
});

// Main menu
let template = [
	{
		label: "File",
		submenu: [
			{
				label: "menu item"
			}
		]
	},
	{
		label: "Edit",
		submenu: [
			{ role: "undo" },
			{ role: "redo" },
			{ type: "separator" },
			{ role: "cut" },
			{ role: "copy" },
			{ role: "paste" },
			{ role: "pasteandmatchstyle" },
			{ role: "delete" },
			{ role: "selectall" }
		]
	},
	{
		label: "Controllers",
		submenu: [
			{
				label: "Gamepad",
				accelerator: "CmdOrCtrl+G",
				click: () => {
					createControllerCustomisationWindow();
				}
			},
			{
				label: "Stream Deck",
				accelerator: "CmdOrCtrl+S",
				click: () => {
					createStreamDeckCustomisationWindow();
				}
			}
		]
	},
	{
		label: "View",
		submenu: [
			{
				label: "Reload",
				accelerator: "CmdOrCtrl+R",
				click: (item, focusedWindow) => {
					if (focusedWindow) {
						// on reload, start fresh and close any old
						// open secondary windows
						if (focusedWindow.id === 1) {
							BrowserWindow.getAllWindows().forEach(win => {
								if (win.id > 1) win.close();
							});
						}
						focusedWindow.reload();
					}
				}
			},
			{
				label: "Toggle Full Screen",
				accelerator: (() => {
					if (process.platform === "darwin") {
						return "Ctrl+Command+F";
					} else {
						return "F11";
					}
				})(),
				click: (item, focusedWindow) => {
					if (focusedWindow) {
						focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
					}
				}
			},
			{
				label: "Toggle Developer Tools",
				accelerator: (() => {
					if (process.platform === "darwin") {
						return "Alt+Command+I";
					} else {
						return "Ctrl+Shift+I";
					}
				})(),
				click: (item, focusedWindow) => {
					if (focusedWindow) {
						focusedWindow.toggleDevTools();
					}
				}
			}
		]
	},
	{
		label: "Window",
		role: "window",
		submenu: [
			{
				label: "Minimize",
				accelerator: "CmdOrCtrl+M",
				role: "minimize"
			},
			{
				label: "Close",
				accelerator: "CmdOrCtrl+W",
				role: "close"
			},
			{
				type: "separator"
			},
			{
				label: "Reopen Window",
				accelerator: "CmdOrCtrl+Shift+T",
				enabled: false,
				key: "reopenMenuItem",
				click: () => {
					app.emit("activate");
				}
			}
		]
	},
	{
		label: "Help",
		role: "help",
		submenu: [
			{
				label: "Learn More",
				click: () => {
					shell.openExternal("https://heretorecord.com/button-switch");
				}
			},
			{
				label: "Docs",
				accelerator: "CmdOrCtrl+D",
				click: () => {
					createDocsWindow();
				}
			}
		]
	}
];

function addUpdateMenuItems(items, position) {
	if (process.mas) return;

	const version = app.getVersion();
	let updateItems = [
		{
			label: `Version ${version}`,
			enabled: false
		},
		{
			label: "Checking for Update",
			enabled: false,
			key: "checkingForUpdate"
		},
		{
			label: "Check for Update",
			visible: false,
			key: "checkForUpdate",
			click: () => {
				require("electron").autoUpdater.checkForUpdates();
			}
		},
		{
			label: "Restart and Install Update",
			enabled: true,
			visible: false,
			key: "restartToUpdate",
			click: () => {
				require("electron").autoUpdater.quitAndInstall();
			}
		}
	];

	items.splice.apply(items, [position, 0].concat(updateItems));
}

function findReopenMenuItem() {
	const menu = Menu.getApplicationMenu();
	if (!menu) return;

	let reopenMenuItem;
	menu.items.forEach(item => {
		if (item.submenu) {
			item.submenu.items.forEach(item => {
				if (item.key === "reopenMenuItem") {
					reopenMenuItem = item;
				}
			});
		}
	});
	return reopenMenuItem;
}

if (process.platform === "darwin") {
	const name = app.getName();
	template.unshift({
		label: name,
		submenu: [
			{
				label: `About ${name}`,
				role: "about"
			},
			{
				type: "separator"
			},
			{
				label: "Services",
				role: "services",
				submenu: []
			},
			{
				type: "separator"
			},
			{
				label: `Hide ${name}`,
				accelerator: "Command+H",
				role: "hide"
			},
			{
				label: "Hide Others",
				accelerator: "Command+Alt+H",
				role: "hideothers"
			},
			{
				label: "Show All",
				role: "unhide"
			},
			{
				type: "separator"
			},
			{
				label: "Quit",
				accelerator: "Command+Q",
				click: () => {
					app.quit();
				}
			}
		]
	});

	// Window menu.
	template[3].submenu.push(
		{
			type: "separator"
		},
		{
			label: "Bring All to Front",
			role: "front"
		}
	);

	addUpdateMenuItems(template[0].submenu, 1);
}

if (process.platform === "win32") {
	const helpMenu = template[template.length - 1].submenu;
	addUpdateMenuItems(helpMenu, 0);
}

app.on("ready", () => {
	const menu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(menu);
});

app.on("browser-window-created", () => {
	let reopenMenuItem = findReopenMenuItem();
	if (reopenMenuItem) reopenMenuItem.enabled = false;
});

app.on("window-all-closed", () => {
	let reopenMenuItem = findReopenMenuItem();
	if (reopenMenuItem) reopenMenuItem.enabled = true;
});

// add developer tools item if not in production
if (process.env.NODE_ENV !== "production") {
	template.push({
		label: "Developer Tools",
		submenu: [
			{
				label: "Toggle DevTools",
				accelerator: process.platform == "darwin" ? "Command+I" : "Ctrl+I",
				click(item, focusedWindow) {
					focusedWindow.toggleDevTools();
				}
			},
			{
				role: "reload"
			}
		]
	});
}
