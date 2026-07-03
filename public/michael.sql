CREATE DATABASE IF NOT EXISTS Renata;
USE Renata;

CREATE TABLE IF NOT EXISTS michael_jackson (
    id INT NOT NULL AUTO_INCREMENT,
    album VARCHAR(100),
    cancion VARCHAR(100),
    anio INT,
    duracion VARCHAR(10),
    PRIMARY KEY (id)
);

INSERT INTO michael_jackson (album, cancion, anio, duracion) VALUES
('Thriller', 'Billie Jean', 1982, '4:54'),
('Thriller', 'Beat It', 1982, '4:18'),
('Bad', 'Smooth Criminal', 1987, '4:17'),
('Dangerous', 'Black or White', 1991, '3:22'),
('HIStory', 'Earth Song', 1995, '6:45')