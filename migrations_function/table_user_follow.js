
exports.up = function(schema, fn) {
	const query = `
		CREATE TABLE \`user_follow\` (
		  \`user_id\` INT UNSIGNED NOT NULL,
		  \`follow_id\` INT UNSIGNED NOT NULL,
		  \`created\` DATETIME DEFAULT CURRENT_TIMESTAMP,
		  PRIMARY KEY (\`user_id\`, \`follow_id\`),
		  UNIQUE INDEX \`user_id_UNIQUE\` (\`user_id\` ASC),
		  UNIQUE INDEX \`follow_id_UNIQUE\` (\`follow_id\` ASC),
		  CONSTRAINT \`user_id_fk\`
		    FOREIGN KEY (\`user_id\`)
		    REFERENCES \`users\` (\`id\`)
		    ON DELETE CASCADE
		    ON UPDATE CASCADE,
		  CONSTRAINT \`follow_id_fk\`
		    FOREIGN KEY (\`follow_id\`)
		    REFERENCES \`users\` (\`id\`)
		    ON DELETE CASCADE
		    ON UPDATE NO ACTION);
	`
	return schema.raw(query)
};

exports.down = function(schema, fn) {
	return schema.dropTableIfExists('user_follow')
};
