var express = require("express");
var cors = require("cors");
var multer = require('multer')
require("dotenv").config();

// Basic Config ------------------------------------------------------------------------------------
var app = express();
app.use(cors());
app.use("/public", express.static(process.cwd() + "/public"));
app.get("/", function (req, res) {
	res.sendFile(process.cwd() + "/views/index.html");
});

// Functions ---------------------------------------------------------------------------------------
const upload = multer({dest: 'uploads'});
const uploadFile = (file) => {

}
 
// Custom Routes -----------------------------------------------------------------------------------
app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
	// console.log(req.file);
	const file = req.file;
	res.json({
		name: file.originalname,
		type: file.mimetype,
		size: file.size,
	})
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log("Your app is listening on port " + port);
});
