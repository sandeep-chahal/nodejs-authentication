const User = require("../model/User");
const bcrypt = require("bcrypt");

exports.getLogin = (req, res, next) => {
	res.render("login.ejs", { error: null, values: null });
};

exports.postLogin = async (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	if (!email || !password) {
		const err = throwError(
			"login.ejs",
			"Email or Password is Incorrect!",
			401,
			{
				values: { email },
			}
		);
		return next(err);
	}
	try {
		const user = await User.findOne({ email });
		if (!user) {
			const err = throwError(
				"login.ejs",
				"Couldn't find an account on this email",
				401,
				{
					values: { email },
				}
			);
			return next(err);
		}
		const isCorrect = await bcrypt.compare(password, user.password);
		if (isCorrect) res.redirect("/");
		else {
			const err = throwError("login.ejs", "Invalid Password", 401, {
				values: { email },
			});
			return next(err);
		}
	} catch (error) {
		const err = throwError(
			"login.ejs",
			"Something went wrong on our side! please try again.",
			500,
			{
				values: { email },
			}
		);
		next(err);
	}
};

exports.getSingup = (req, res, next) => {
	res.render("signup.ejs", { error: null, values: null });
};

exports.postSignup = async (req, res, next) => {
	const name = req.body.name.trim();
	const email = req.body.email.trim();
	const password = req.body.password.trim();
	console.log(name, email);
	if (!email || !password || !name) {
		const err = throwError("signup.ejs", "Please Fill all the feilds!", 401, {
			values: { email, name, password: "" },
		});
		return next(err);
	}
	try {
		const userDoc = await User.findOne({ email });
		if (userDoc) {
			const err = throwError(
				"signup.ejs",
				"An account on this email already exist!",
				401,
				{
					values: { email, name, password: "" },
				}
			);
			return next(err);
		}
		const hashedPwd = await bcrypt.hash(password, 10);
		const user = new User({ email, name, password: hashedPwd });
		await user.save();
		res.redirect("/login");
	} catch (error) {
		console.log(error);
		const err = throwError(
			"signup.ejs",
			"Something went wrong on our side! please try again.",
			500,
			{
				values: { email, name, password: "" },
			}
		);
		next(err);
	}
};

function throwError(page, msg, code, options) {
	const err = new Error(msg);
	err.statusCode = code;
	err.page = page;
	err.options = options;
	return err;
}
