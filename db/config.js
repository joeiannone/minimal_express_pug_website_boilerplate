const dbName = 'test';
const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017';

mongoose.connect(`${url}/${dbName}`, {useNewUrlParser: true});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

var user_schema = new mongoose.Schema({
	username: {type: String, required: true, unique: true, index: true,},
	password: { type:String, required: true},
	email: {type: String, required: true},
	admin: Boolean,
}, {
	timestamps: true
});

var perisistent_site_data_schema = new mongoose.Schema({
  site_version: {type: Number, required: true, unique: true, index: true,},
	// fill in other datas here
  active: Boolean,
}, {
	timestamps: true
});


const UserModel = mongoose.model('User', user_schema);
const SiteDataModel = mongoose.model('SiteData', perisistent_site_data_schema);

module.exports = { UserModel, SiteDataModel, mongoose };
