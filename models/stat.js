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
		likeCount: DataTypes.INTEGER,
		playCount: DataTypes.INTEGER,
		commentCount: DataTypes.INTEGER,
		shareCount: DataTypes.INTEGER,
		username: DataTypes.STRING,
		create: DataTypes.DATE,
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