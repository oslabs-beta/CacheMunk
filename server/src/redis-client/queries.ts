// Select all people in database with homeworld and species name
export const SELECT_ALL_PEOPLE = `SELECT people.*, 
	planets.name as homeworld,
	species.name as species
	FROM people 
	INNER JOIN planets
	ON planets._id = people.homeworld_id
	INNER JOIN species
	ON species._id = people.species_id`;

// select cities and join with countries
export const SELECT_CITIES = `SELECT cities.*, countries.name as country_name
FROM countries
INNER JOIN cities 
ON cities.country_id = countries.id
WHERE countries.name LIKE '%United States%'`;

export const SELECT_CITIES_COMPLEX = `SELECT cities.*, 
countries.name as country_name,
states.name as state
FROM countries
INNER JOIN cities 
ON cities.country_id = countries.id
INNER JOIN states
on states.id = cities.state_id
WHERE countries.name LIKE '%ted Stat%'
AND states.name LIKE '%alif%' OR cities.state_code = 'NY'
ORDER BY latitude desc, longitude desc;`;

export const SELECT_CITIES_NY = `SELECT cities.*, 
countries.name as country_name,
states.name as state
FROM countries
INNER JOIN cities 
ON cities.country_id = countries.id
INNER JOIN states
on states.id = cities.state_id
WHERE countries.name = 'United States'
AND cities.state_code = 'NY'
ORDER BY name asc;`;
