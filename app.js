const express = require("express");
const mongoose = require("mongoose");
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
			// maxAge: 1000 * 60 * 60 * 24 * 30,
			maxAge: 1000 * 60 * 5,
			sameSite: true,
		},
	})
);

const isAuth = (req, res, next) => {
	if (req.session.user) {
		res.redirect("/");
	} else {
		next();
	}
};

app.get("/", (req, res, next) => {
	if (!req.session.user) return res.redirect("/login");
	res.render("index.ejs", {
		expiresIn: parseInt(
			(new Date(req.session.cookie._expires) - new Date()) / 1000
		),
	});
});

app.get("/check", (req, res, next) => {
	if (req.session.user) res.json({ msg: "success" });
	else res.json({ msg: "unauth" });
});

app.get("/login", isAuth, authController.getLogin);
app.get("/signup", isAuth, authController.getSingup);

app.post("/login", isAuth, authController.postLogin);
app.post("/signup", isAuth, authController.postSignup);

app.use((err, req, res, next) => {
	res.render(err.page || "/login", {
		error: { statusCode: err.statusCode, msg: err.message },
		values: err.options ? err.options.values || null : null,
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
