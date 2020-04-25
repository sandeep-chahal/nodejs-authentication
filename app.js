const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const authController = require("./controller/auth");
const dotenv = require("dotenv");
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
app.use(express.urlencoded({ extended: false }));
app.set("view-engine", "ejs");
app.use(express.static("public"));
const store = new MongoDBStore({
	uri: MONGO_URI,
	collection: "sessions",
});
app.use(
	session({
		store,
		secret: "gibrish",
		saveUninitialized: false,
		resave: false,
		cookie: {
			maxAge: 60000,
			sameSite: true,
		},
	})
);

app.get("/", (req, res, next) => {
	console.log(req.session.user);
	res.json({ msg: "woooohoooooooo" });
});

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
