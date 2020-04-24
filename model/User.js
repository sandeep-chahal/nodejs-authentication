const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
	email: {
		type: String,
		requried: true,
	},
	password: {
		type: String,
		requried: true,
	},
	name: {
		type: String,
		requried: true,
	},
});

module.exports = mongoose.model("User", userSchema);
