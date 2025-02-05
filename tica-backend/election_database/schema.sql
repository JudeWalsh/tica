-- Create the PresidentialElections table
CREATE TABLE IF NOT EXISTS PresidentialElections (
    year INTEGER NOT NULL,
    winner TEXT NOT NULL,
    runnerUp TEXT NOT NULL
);

-- Create the SenateElections table
CREATE TABLE IF NOT EXISTS SenateElections (
    year INTEGER NOT NULL,
    democrats INTEGER NOT NULL,
    republicans INTEGER NOT NULL,
    independents INTEGER NOT NULL
);

-- Create the HouseElections table
CREATE TABLE IF NOT EXISTS HouseElections (
    year INTEGER NOT NULL,
    democrats INTEGER NOT NULL,
    republicans INTEGER NOT NULL,
    independents INTEGER NOT NULL
);
