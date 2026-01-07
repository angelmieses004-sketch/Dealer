// Favorites routes
const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { verifyToken } = require('./auth');

// Get user favorites
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      'SELECT vehicle_id FROM favorites WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    const favorites = result.rows.map(row => row.vehicle_id);

    res.json({ favorites });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: 'Error al obtener favoritos' });
  }
});

// Add favorite
router.post('/:vehicleId', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const vehicleId = parseInt(req.params.vehicleId);

    if (isNaN(vehicleId)) {
      return res.status(400).json({ error: 'ID de vehículo inválido' });
    }

    // Check if already favorited
    const existing = await pool.query(
      'SELECT id FROM favorites WHERE user_id = $1 AND vehicle_id = $2',
      [userId, vehicleId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Ya está en favoritos' });
    }

    // Add to favorites
    await pool.query(
      'INSERT INTO favorites (user_id, vehicle_id) VALUES ($1, $2)',
      [userId, vehicleId]
    );

    res.json({ message: 'Añadido a favoritos', vehicleId });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ error: 'Error al añadir a favoritos' });
  }
});

// Remove favorite
router.delete('/:vehicleId', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const vehicleId = parseInt(req.params.vehicleId);

    if (isNaN(vehicleId)) {
      return res.status(400).json({ error: 'ID de vehículo inválido' });
    }

    const result = await pool.query(
      'DELETE FROM favorites WHERE user_id = $1 AND vehicle_id = $2 RETURNING id',
      [userId, vehicleId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No se encontró en favoritos' });
    }

    res.json({ message: 'Eliminado de favoritos', vehicleId });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ error: 'Error al eliminar de favoritos' });
  }
});

// Toggle favorite (add if not exists, remove if exists)
router.post('/toggle/:vehicleId', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const vehicleId = parseInt(req.params.vehicleId);

    if (isNaN(vehicleId)) {
      return res.status(400).json({ error: 'ID de vehículo inválido' });
    }

    // Check if exists
    const existing = await pool.query(
      'SELECT id FROM favorites WHERE user_id = $1 AND vehicle_id = $2',
      [userId, vehicleId]
    );

    if (existing.rows.length > 0) {
      // Remove
      await pool.query(
        'DELETE FROM favorites WHERE user_id = $1 AND vehicle_id = $2',
        [userId, vehicleId]
      );
      res.json({ message: 'Eliminado de favoritos', isFavorite: false, vehicleId });
    } else {
      // Add
      await pool.query(
        'INSERT INTO favorites (user_id, vehicle_id) VALUES ($1, $2)',
        [userId, vehicleId]
      );
      res.json({ message: 'Añadido a favoritos', isFavorite: true, vehicleId });
    }
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({ error: 'Error al actualizar favoritos' });
  }
});

module.exports = router;

