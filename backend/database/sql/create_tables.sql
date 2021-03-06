
CREATE TABLE  IF NOT EXISTS users (
	id INT AUTO_INCREMENT PRIMARY KEY,
	email VARCHAR(255) unique NOT NULL,
	username VARCHAR(255) unique NOT NULL,
	lastName VARCHAR(255),
	firstName VARCHAR(255),
	password VARCHAR(255),
    gender VARCHAR(255),
    sexualPreference VARCHAR(255),
	biography VARCHAR(255),
	birthdate VARCHAR(255),
	profilePicture VARCHAR(255),
	locationLat VARCHAR(255),
	locationLng VARCHAR(255),
	rating VARCHAR(255),
	complete INT DEFAULT(0),
	token VARCHAR(255),
	verified INT DEFAULT(0)
);

CREATE TABLE  IF NOT EXISTS images (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(255),
	user_id INT,
	FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE  IF NOT EXISTS tags (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(255),
	user_id INT,
	FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE  IF NOT EXISTS password_resets (
	id INT AUTO_INCREMENT PRIMARY KEY,
	email VARCHAR(255),
	token VARCHAR(255),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE  IF NOT EXISTS likes (
	id INT AUTO_INCREMENT PRIMARY KEY,
	user_id1 INT,
	user_id2 INT,
	state INT,
	FOREIGN KEY (user_id1) REFERENCES users(id),
	FOREIGN KEY (user_id2) REFERENCES users(id)
);

CREATE TABLE  IF NOT EXISTS messages (
	id INT AUTO_INCREMENT PRIMARY KEY,
	user_id1 INT,
	user_id2 INT,
	msg VARCHAR(255),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (user_id1) REFERENCES users(id),
	FOREIGN KEY (user_id2) REFERENCES users(id)
);