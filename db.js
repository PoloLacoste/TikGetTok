'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const db = {};

let sequelize = new Sequelize(process.env.DATABASE_URL, {
	dialect: 'postgres',
	protocol: "postgres",
	ssl: true,
	dialectOptions: {
		ssl: {
			require: true,
			rejectUnauthorized: false
		}
	},
	define: {
		timestamps: false
	},
	timezone: '+02:00'
});

let dir = __dirname + "/models";

fs.readdirSync(dir)
	.filter(file => {
		return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
	})
	.forEach(file => {
		const model = require(path.join(dir, file))(sequelize, Sequelize.DataTypes);
		db[model.name] = model;
	});

Object.values(db).forEach(model => {
	if (model.associate) {
		model.associate(db);
	}
});

Object.values(db).forEach(model => {
	model.sync();
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
