exports.getLogin = (req, res, next) => {
	res.render("login.ejs", { error: null, values: null });
};

exports.postLogin = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	if (!email || !password) {
		const err = new Error("Email or Password is Incorrect!");
		err.statusCode = 401;
		err.page = "login.ejs";
		err.values = { email };
		throw err;
	}
};
