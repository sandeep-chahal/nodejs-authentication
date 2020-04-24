const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const dotenv = require("dotenv");
const authController = require("./controller/auth");
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
app.use(express.urlencoded({ extended: false }));
app.set("view-engine", "ejs");
app.use(express.static("public"));

app.get("/login", authController.getLogin);
app.get("/signup", authController.getSingup);

app.post("/login", authController.postLogin);
app.post("/signup", authController.postSignup);

app.use((err, req, res, next) => {
	res.render(err.page, {
		error: { statusCode: err.statusCode, msg: err.message },
		values: err.options.values || null,
	});
});

mongoose
	.connect(MONGO_URI)
	.then(() => {
		app.listen(3000);
	})
	.catch((err) => {
		console.log(err);
	});
