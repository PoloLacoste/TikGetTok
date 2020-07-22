'use strict';

const { Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Stat = sequelize.define('stat', {
        id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		postId: DataTypes.STRING,
		likes: DataTypes.INTEGER,
		play: DataTypes.INTEGER,
		username: DataTypes.STRING,
		date: DataTypes.DATE,
    }, {
		tableName: 'stats',
		indexes:[
			{
				unique: false,
				fields:['username']
			}
		]
	});

	Stat.associate = models => {};

    return Stat;
};