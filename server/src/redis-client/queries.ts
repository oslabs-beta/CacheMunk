// Select all people in database with homeworld and species name
export const SELECT_ALL_PEOPLE = `SELECT people.*, 
	planets.name as homeworld,
	species.name as species
	FROM people 
	INNER JOIN planets
	ON planets._id = people.homeworld_id
	INNER JOIN species
	ON species._id = people.species_id`;
