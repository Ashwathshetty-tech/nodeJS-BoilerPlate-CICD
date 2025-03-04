import pool from '../config/postgres.js';
import { logger } from '../config/logger.js';
import { fetchAllActors } from '../service/actorService.js';

// Create Actor
export const createActor = async (req, res) => {
  const { firstName, lastName } = req.body;
  try {
    const query = `INSERT INTO actor (first_name, last_name) VALUES ($1, $2) RETURNING *`;
    const result = await pool.query(query, [firstName, lastName]);
    logger.info(`Actor Created: ${firstName} ${lastName}`);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    logger.error(`Create Actor Failed: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

// Get All Actors
export const getAllActors = async (req, res) => {
  try {
    const result = await fetchAllActors(req);
    logger.info('Fetched All Actors', result);
    if(result) return res.status(200).json(result.data);
  } catch (error) {
    logger.error(`Fetch Actors Failed: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

// Get Actor by ID
export const getActorById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`SELECT * FROM actor WHERE actor_id = $1`, [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Actor Not Found' });
      logger.warn(`Actor with ID ${id} not found`);
      return;
    }
    res.json(result.rows[0]);
    logger.info(`Fetched Actor ID: ${id}`);
  } catch (error) {
    logger.error(`Fetch Actor by ID Failed: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

// Update Actor
export const updateActor = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name } = req.body;
  try {
    const result = await pool.query(
      `UPDATE actor SET first_name = $1, last_name = $2, last_update = NOW() WHERE actor_id = $3 RETURNING *`,
      [first_name, last_name, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Actor Not Found' });
      return;
    }
    res.json(result.rows[0]);
    logger.info(`Updated Actor ID: ${id}`);
  } catch (error) {
    logger.error(`Update Actor Failed: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

// Delete Actor
export const deleteActor = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`DELETE FROM actor WHERE actor_id = $1 RETURNING *`, [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Actor Not Found' });
      return;
    }
    res.json({ message: 'Actor Deleted Successfully' });
    logger.info(`Deleted Actor ID: ${id}`);
  } catch (error) {
    logger.error(`Delete Actor Failed: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
