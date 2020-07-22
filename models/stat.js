'use strict';

const { Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Stat = sequelize.define('stat', {
        id: {
			primaryKey: true,
			type: DataTypes.STRING,
		},
		likes: DataTypes.INTEGER,
		play: DataTypes.INTEGER,
		username: DataTypes.STRING,
		date: DataTypes.BIGINT,
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