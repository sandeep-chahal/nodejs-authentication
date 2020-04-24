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
		next(err);
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
			next(err);
		}
		const isCorrect = await bcrypt.compare(password, user.password);
		if (isCorrect) res.redirect("/");
		else {
			const err = throwError("login.ejs", "Invalid Password", 401, {
				values: { email },
			});
			next(err);
		}
	} catch (err) {
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

function throwError(page, msg, code, options) {
	const err = new Error(msg);
	err.statusCode = code;
	err.page = page;
	err.options = { ...options };
	return err;
}
