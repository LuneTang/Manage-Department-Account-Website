-- Drop the database if it already exists
DROP DATABASE IF EXISTS FinalTestingSystem;
-- Create database
CREATE DATABASE IF NOT EXISTS FinalTestingSystem;
USE FinalTestingSystem;

-- Create table: Department
DROP TABLE IF EXISTS `Department`;
CREATE TABLE IF NOT EXISTS `Department` (
	id 						INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	`name` 					NVARCHAR(50) NOT NULL UNIQUE KEY,
    total_member			INT	UNSIGNED,
    `type`					ENUM('Dev','Test','ScrumMaster','PM') NOT NULL,
    created_date			DATETIME DEFAULT NOW()
);

-- Create table: Account
DROP TABLE IF EXISTS `Account`;
CREATE TABLE `Account`(
	id						INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username				VARCHAR(50) NOT NULL UNIQUE KEY,
	`password` 				VARCHAR(800) NOT NULL,
    first_name				NVARCHAR(50) NOT NULL,
    last_name				NVARCHAR(50) NOT NULL,
    email					NVARCHAR(100) NOT NULL UNIQUE,
    `role` 					ENUM('ADMIN','EMPLOYEE','MANAGER') NOT NULL DEFAULT 'EMPLOYEE',
    department_id 			INT UNSIGNED,
    created_date			DATETIME DEFAULT NOW(),
    FOREIGN KEY(department_id) REFERENCES Department(id) ON DELETE SET NULL
);

-- Create table: PasswordResetToken
DROP TABLE IF EXISTS `PasswordResetToken`;
CREATE TABLE IF NOT EXISTS `PasswordResetToken` (
    id 						INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    token 					VARCHAR(255) NOT NULL UNIQUE,
    user_id 				INT UNSIGNED NOT NULL,
    expiry_date 			DATETIME NOT NULL,
    FOREIGN KEY(user_id) 	REFERENCES Account(id) ON DELETE CASCADE
);

-- Insert data into Department
-- Insert additional data into Department
INSERT INTO Department(`name`, total_member, `type`, created_date) 
VALUES
    (N'Waiting', 0, 'Dev', '2016-01-09'),
    (N'Marketing', 2, 'Dev', '2016-03-05'),
    (N'Sale', 0, 'Test', '2016-03-05'),
    (N'Bảo vệ', 0, 'ScrumMaster', '2016-03-07'),
    (N'Nhân sự', 1, 'PM', '2016-03-08'),
    (N'Kỹ thuật', 5, 'Dev', '2016-03-10'),
    (N'Tài chính', 6, 'ScrumMaster', '2016-04-09'),
    (N'Phó giám đốc', 1, 'PM', '2016-04-09'),
    (N'Giám đốc', 1, 'Test', '2016-04-07'),
    (N'Thư kí', 1, 'PM', '2016-04-07'),
    -- Updated department names (without duplicates)
    (N'Design Team', 4, 'Dev', '2016-08-15'),
    (N'HR Department', 3, 'PM', '2017-05-22'),
    (N'Operations Team', 6, 'ScrumMaster', '2017-07-10'),
    (N'Research Division', 7, 'Dev', '2017-09-04'),
    (N'Customer Support', 2, 'Test', '2017-12-12'),
    (N'Security Unit', 5, 'ScrumMaster', '2017-02-14'),
    (N'Sales Group A', 3, 'Dev', '2018-08-19'),
    (N'Sales Group B', 4, 'Test', '2018-01-05'),
    (N'Marketing Team A', 3, 'PM', '2018-03-25'),
    (N'Marketing Team B', 5, 'ScrumMaster', '2018-06-19'),
    (N'IT Support', 4, 'Dev', '2018-07-20'),
    (N'Finance Group A', 3, 'ScrumMaster', '2018-01-09'),
    (N'Finance Group B', 6, 'Test', '2018-03-22'),
    (N'Product Development A', 2, 'Dev', '2018-04-11'),
    (N'Product Development B', 3, 'PM', '2018-05-25'),
    (N'Admin Unit', 1, 'ScrumMaster', '2019-06-30'),
    (N'Quality Assurance A', 4, 'Test', '2019-08-12'),
    (N'Quality Assurance B', 2, 'PM', '2019-10-15'),
    (N'Tech Support A', 3, 'Dev', '2019-01-10'),
    (N'Tech Support B', 5, 'ScrumMaster', '2019-02-14'),
    (N'Creative Team', 2, 'Dev', '2019-03-25'),
    (N'Content Creation A', 3, 'PM', '2019-04-19'),
    (N'Content Creation B', 6, 'Test', '2019-05-10'),
    (N'Digital Marketing A', 4, 'ScrumMaster', '2019-06-11'),
    (N'Strategy Division', 3, 'Dev', '2020-07-20'),
    (N'Business Analysis A', 2, 'Test', '2020-08-22'),
    (N'Public Relations A', 5, 'PM', '2020-09-12'),
    (N'Legal Department', 2, 'ScrumMaster', '2020-10-18'),
    (N'Recruitment Division', 4, 'Dev', '2020-11-09'),
    (N'Onboarding Team', 3, 'PM', '2020-12-01'),
    (N'Community Outreach', 1, 'ScrumMaster', '2020-12-10'),
    (N'Compliance Group', 2, 'Test', '2021-01-04'),
    (N'Procurement Team A', 3, 'PM', '2021-02-08'),
    (N'Inventory Management A', 4, 'Dev', '2021-03-14'),
    (N'Engineering A', 5, 'ScrumMaster', '2021-04-16'),
    (N'Product Development C', 6, 'Dev', '2021-05-20'),
    (N'Solutions A', 2, 'PM', '2021-06-10'),
    (N'Innovation A', 4, 'Test', '2021-07-12'),
    (N'Corporate Affairs A', 3, 'ScrumMaster', '2021-08-09'),
    (N'Environmental Protection A', 2, 'Dev', '2021-09-11'),
    (N'Research & Development A', 5, 'PM', '2021-10-19'),
    (N'Knowledge Management A', 4, 'Test', '2021-11-20'),
    (N'Governance A', 2, 'ScrumMaster', '2022-01-04'),
    (N'Creative Team A', 3, 'Dev', '2022-01-10'),
    (N'Content Creation C', 5, 'ScrumMaster', '2022-02-14'),
    (N'Digital Marketing B', 4, 'PM', '2022-03-25'),
    (N'Strategy Division A', 3, 'Test', '2022-04-19'),
    (N'Public Relations B', 5, 'ScrumMaster', '2022-05-10'),
    (N'Recruitment A', 4, 'Dev', '2022-06-11'),
    (N'Onboarding Team A', 3, 'PM', '2022-07-20'),
    (N'Compliance Team', 2, 'Test', '2022-08-22'),
    (N'Procurement A', 3, 'PM', '2022-09-12'),
    (N'Engineering Group A', 5, 'ScrumMaster', '2022-10-18'),
    (N'Product Development D', 6, 'Dev', '2022-11-09'),
    (N'Solutions Group B', 2, 'PM', '2022-12-01'),
    (N'Innovation B', 4, 'Test', '2023-01-04'),
    (N'Corporate Affairs B', 3, 'ScrumMaster', '2023-02-08'),
    (N'Environmental Protection B', 2, 'Dev', '2023-03-14'),
    (N'Research & Development B', 5, 'PM', '2023-04-16'),
    (N'Knowledge Management B', 4, 'Test', '2023-05-20'),
    (N'Governance B', 2, 'ScrumMaster', '2023-06-11');


-- Insert data into Account
-- Passwords are bcrypt hashed (e.g., '123456')
INSERT INTO `Account`(username, `password`, first_name, last_name, `role`, department_id, email, created_date)
VALUES
    ('johnsmith', '$2y$12$vSRJJ9mHfSWEzTSyFBfjJO0cxHz.ujjNoImWK0RqHNq8N/fciIxi.', 'John', 'Smith', 'ADMIN', 3, 'johnsmith@example.com', '2024-12-15'),
    ('alicejones', '$2y$12$3rJ.yWIRy3ulfX35y38.HuI/Hs2WGxN2uzcC/h2qUPLcvA2pM2sPO', 'Alice', 'Jones', 'MANAGER', 2, 'alicejones@example.com', '2024-10-20'),
    ('bobjames', '$2y$12$/NG4I07cU6/jAW7GEy0Fy.TlQ4IDMK8FDeQWSKa0udsXbnngQuX66', 'Bob', 'James', 'EMPLOYEE', 4, 'bobjames@example.com', '2024-11-02'),
    ('charlesgreen', '$2y$12$oNYPS/tmAGVtr8JcZTHWZekgAnp0L2Q/xNLMLGhD7L8pQc51HSXa6', 'Charles', 'Green', 'MANAGER', 1, 'charlesgreen@example.com', '2024-01-09'),
    ('emilywhite', '$2y$12$pjc9f3vZEZ2GzJRrEN9snOvuQgNvYhOUdyPLXPjQpd/eN6s3wmctO', 'Emily', 'White', 'EMPLOYEE', 5, 'emilywhite@example.com', '2024-07-22'),

    ('michaelbrown', '$2y$12$bH4tkLzs40oNhbqbQckvwO9xte70ArfLRZ33Kbe0wT6r2k01k8vP2', 'Michael', 'Brown', 'ADMIN', 6, 'michaelbrown@example.com', '2023-09-18'),
    ('susanlee', '$2y$12$2voP0gPusZI6NiAxa3H8IePHxT95dt4dxa3KUVZ8zNVaPbZTxcyvO', 'Susan', 'Lee', 'MANAGER', 3, 'susanlee@example.com', '2023-12-05'),
    ('davidturner', '$2y$12$Ec20foY70kjBRkVtHDh3T..QFwQ9gLOxe7.kfMl.hcnakSoh/9qfu', 'David', 'Turner', 'EMPLOYEE', 7, 'davidturner@example.com', '2023-05-13'),
    ('oliviamartin', '$2y$12$AQUWCu03I4F9rAkigJshkOAGmRO/ziPZhwcN3fEq.CFjQa/8Uz85.', 'Olivia', 'Martin', 'MANAGER', 8, 'oliviamartin@example.com', '2023-02-10'),
    ('ryanscott', '$2y$12$Eq9HwxuHpBpkBc.Tsj92qOMh8yiIhAU1Qn0aq/VwNde/mwembaO9q', 'Ryan', 'Scott', 'EMPLOYEE', 9, 'ryanscott@example.com', '2023-11-30'),

    ('sophiasmith', '$2y$12$/Q9sdX5iIYkBrw.DfGKHOes/uddY60wxefmDkqS0Z7UodhjHR2Qoa', 'Sophia', 'Smith', 'ADMIN', 2, 'sophiasmith@example.com', '2022-06-12'),
    ('noahjames', '$2y$12$Q7ms0LIk8QV6lJp5imMPP.znviVBQ4Sr5OeTTAl2TVlh3xLYnE0mm', 'Noah', 'James', 'MANAGER', 1, 'noahjames@example.com', '2022-08-24'),
    ('lilybrown', '$2y$12$hmULTF5OOIQSrDRQ1VtAgOI0zdD6Xe.HdsAYx6Uv4Eb2E7BPySLMy', 'Lily', 'Brown', 'EMPLOYEE', 4, 'lilybrown@example.com', '2022-11-17'),
    ('jacobjohnson', '$2y$12$AquL5ftRltiXzcCvHh9B9./3N6BLxAjd8BFoiQGtEAtqPNJgGkiJq', 'Jacob', 'Johnson', 'MANAGER', 6, 'jacobjohnson@example.com', '2022-02-08'),
    ('masonmartin', '$2y$12$zWuOGxcYRhItwl9BJgQsnecJi6hwJ6lWXxI8C6qbXntWIS/4y7thO', 'Mason', 'Martin', 'EMPLOYEE', 5, 'masonmartin@example.com', '2022-03-30'),

    ('avawilson', '$2y$12$pz3P/JwPzJbXPFb1dVJr2eXVEm.d091KPNrU8W8/8kqmHz0Ge4z.W', 'Ava', 'Wilson', 'ADMIN', 5, 'avawilson@example.com', '2021-04-06'),
    ('liammoore', '$2y$12$MnZ6B591I1RPp.KLSzUS7uJJn9V8RCmw7FtfcfwRdU0ta1TC1iNCe', 'Liam', 'Moore', 'MANAGER', 7, 'liammoore@example.com', '2021-07-19'),
    ('ellaanderson', '$2y$12$nOWwEnCRA6kqP7cDBOumMe3PD4wOxDc.7H6hcGLW3hFcFAUbJjeJy', 'Ella', 'Anderson', 'EMPLOYEE', 8, 'ellaanderson@example.com', '2021-10-25'),
    ('jackmiller', '$2y$12$Nh6L3QecES4HDZNH/8Ky/uO32yqz8OXa/SNHX3PWeqQ1BIfrq9ohS', 'Jack', 'Miller', 'MANAGER', 9, 'jackmiller@example.com', '2021-02-15'),
    ('lucyparker', '$2y$12$4y2zYHJ8qW8wwXUXxgWgFOWur6bDIuMQ.OwfpeaWvv49n61ikHWaa', 'Lucy', 'Parker', 'EMPLOYEE', 10, 'lucyparker@example.com', '2021-05-21'),

    ('danielharris', '$2y$12$h0z9bS95A/Mbc/Hk6TIFZe5z77.IKoDDJxgSq/aOutouYMlhSTGsq', 'Daniel', 'Harris', 'ADMIN', 4, 'danielharris@example.com', '2020-09-15'),
    ('mathewwilson', '$2y$12$wmnDeVhysz3y9QvoZXByvOuVTIjUzca4TBfjfucODUW4ngLNHWAti', 'Mathew', 'Wilson', 'MANAGER', 2, 'mathewwilson@example.com', '2020-12-22'),
    ('oliviarichards', '$2y$12$Iqghjv1gxn/8K.f4as0Cb.cHv.VcQxqcQ9GWJesbc2MPY35ZtBqta', 'Olivia', 'Richards', 'EMPLOYEE', 1, 'oliviarichards@example.com', '2020-04-11'),
    ('alexroberts', '$2y$12$75g13JH8eGIgBbiXw4D6JukbF8COIBTK0z7y3dNYOeFbmrCYOlN1G', 'Alex', 'Roberts', 'MANAGER', 5, 'alexroberts@example.com', '2020-01-30'),
    ('emilythompson', '$2y$12$0rB8Ccr20sYv132EBCqgr.gdKgz/p3xFdjQEvtbY2euUG20AGLesW', 'Emily', 'Thompson', 'EMPLOYEE', 6, 'emilythompson@example.com', '2020-07-02'),

    ('williamgonzalez', '$2y$12$0K43wCpyTgWDEYr2JS/DvuoiuHUNoQDYofmGK0Z5F9p3tYeoJk1xm', 'William', 'Gonzalez', 'ADMIN', 3, 'williamgonzalez@example.com', '2019-10-01'),
    ('chloebrown', '$2y$12$ZE4MbNhhNvhKQDZ2UNWkU.U5otmzwEI6J0VAaJesPUj0nXmAt5RJq', 'Chloe', 'Brown', 'MANAGER', 4, 'chloebrown@example.com', '2019-08-22'),
    ('jacobcarter', '$2y$12$KACzmu3CmicowDDur2YhJuvVc6o1JmwbZTkuWya9AgyUf3iZfO7sW', 'Jacob', 'Carter', 'EMPLOYEE', 6, 'jacobcarter@example.com', '2019-02-19'),
    ('nathanwalker', '$2y$12$Hkf9MSr4.hKLlgMQ8XM/ie/bYlPvUa8LSIvKO8atf3jq2tFi0Tq0C', 'Nathan', 'Walker', 'MANAGER', 2, 'nathanwalker@example.com', '2019-05-15'),
    ('harperlewis', '$2y$12$2T016qEcJe1CTHD/WZb1OeEWGNa776zepHfYd2y/TVGXhSKQLxXl.', 'Harper', 'Lewis', 'EMPLOYEE', 5, 'harperlewis@example.com', '2019-04-03'),

    ('isabellaadams', '$2y$12$SCS6Om3i2wpy5tSkZZUdj.h2pwN83BkDTwrYnbZW8FnKJw0SkBCMi', 'Isabella', 'Adams', 'ADMIN', 5, 'isabellaadams@example.com', '2018-01-11'),
    ('oliviamorris', '$2y$12$FFAiTSZXDRHUw56eLsA.9e8YlX01a22wuQTlP3u7jxRiX.0fqZpm.', 'Olivia', 'Morris', 'MANAGER', 7, 'oliviamorris@example.com', '2018-03-04'),
    ('liamdavis', '$2y$12$HvvdSK/1DuiFNK/1g3tmv.zHQg4eTuFijorEvg1FarBiAAUcu6cqC', 'Liam', 'Davis', 'EMPLOYEE', 3, 'liamdavis@example.com', '2018-05-27'),
    ('ethanwright', '$2y$12$3whTM0u12E4mafGInTGcyeeEuxYggR4xtnNoA5k79VRKXxqg0ZVCa', 'Ethan', 'Wright', 'MANAGER', 9, 'ethanwright@example.com', '2018-06-15'),
    ('graceperez', '$2y$12$UYvbfxvOf3fMkKMmbGOArO6OQKKYLSsNaBCmvrUSLtA/eLvMpytTC', 'Grace', 'Perez', 'EMPLOYEE', 8, 'graceperez@example.com', '2018-02-10'),

    ('oliviascott', '$2y$12$5iHpK2J54avH/Sp7Z/4tJOMTZAHVPAaaxT4IJ6MvTKWN5pDmKWHJO', 'Olivia', 'Scott', 'ADMIN', 2, 'oliviascott@example.com', '2017-07-29'),
    ('matthewwilson', '$2y$12$GMK4/V1dSDfGx.pENOTXjumhqUz48keTPQSH3fl0ZfGYT955.Abjy', 'Matthew', 'Wilson', 'MANAGER', 1, 'matthewwilson@example.com', '2017-06-17'),
    ('emilyharris', '$2y$12$/mM.Eph.0yZ7kWriNhMEtutyH0pPcJ8WciVmgwCjtfrJqD2nKh1Uq', 'Emily', 'Harris', 'EMPLOYEE', 6, 'emilyharris@example.com', '2017-05-09'),
    ('elizabethbaker', '$2y$12$wrqRYtwVyMITS2o8ALpY3O05rMP1Thmt.1neihtm7XxbD8a/1nmkS', 'Elizabeth', 'Baker', 'MANAGER', 3, 'elizabethbaker@example.com', '2017-09-05'),
    ('jamesclark', '$2y$12$aXHZu.9mBgzGs.DM17wdhuerv1hdFpP5B6X8Gg2XBYjoUdLE6iH4q', 'James', 'Clark', 'EMPLOYEE', 4, 'jamesclark@example.com', '2017-04-12'),

    ('michaelparker', '$2y$12$osAFRPi1Euf8Cj/CVLzP9egMh4PsGXH.fysWViUS4Uu6awMLVZ0Um', 'Michael', 'Parker', 'ADMIN', 8, 'michaelparker@example.com', '2016-12-25'),
    ('sophiaanderson', '$2y$12$gjE2mfav4Gj7mreOSwtwGOf3wdSwXxAyOYsjyw/p./Q3u0ErILUCS', 'Sophia', 'Anderson', 'MANAGER', 9, 'sophiaanderson@example.com', '2016-06-20'),
    ('elizabethjones', '$2y$12$d9OmaajtXZYlodyiUJOe7e1b6LIcU9Ler6jPRoWGntshDvq17YDOC', 'Elizabeth', 'Jones', 'EMPLOYEE', 7, 'elizabethjones@example.com', '2016-11-14'),
    ('jacksonmartin', '$2y$12$3eIZe8rzae0MjBItj7kgtevRrPy/O7d5f9eCQdROs1Ldth6HHL01K', 'Jackson', 'Martin', 'MANAGER', 2, 'jacksonmartin@example.com', '2016-08-30'),
    ('hannahjohnson', '$2y$12$ycJTfJDw.6zfzQIG51XI0OXKivf0glTcGwCcJ5jIvxM2LGEiCOWWC', 'Hannah', 'Johnson', 'EMPLOYEE', 5, 'hannahjohnson@example.com', '2016-05-03');

