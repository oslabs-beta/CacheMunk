// select cities and join with countries
export const SELECT_CITIES = `SELECT cities.*, 
countries.name as country_name,
states.name as state
FROM countries
INNER JOIN cities 
ON cities.country_id = countries.id
INNER JOIN states
on states.id = cities.state_id
WHERE countries.name LIKE '%ted Stat%'
AND states.name LIKE '%York%'
ORDER BY name asc, latitude desc, longitude desc
LIMIT 20;`;
