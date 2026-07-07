const express = require("express");
const pool = require("./config/db");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const BASE = "/api/cars";

app.get(BASE, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM cars ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});


app.post(BASE, async (req, res) => {
  try {
    const { license_plate, brand, model, note } = req.body;

    const result = await pool.query(
      `INSERT INTO cars (license_plate, brand, model, note)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [license_plate, brand, model, note]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});


app.put(`${BASE}/:id`, async (req, res) => {
  try {
    const { id } = req.params;
    const { license_plate, brand, model, note } = req.body;

    const result = await pool.query(
      `UPDATE cars
       SET license_plate=$1, brand=$2, model=$3, note=$4, updated_at=CURRENT_TIMESTAMP
       WHERE id=$5
       RETURNING *`,
      [license_plate, brand, model, note, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูลรถ" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});


app.delete(`${BASE}/:id`, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM cars WHERE id=$1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูลรถ" });
    }

    res.json({ message: "ลบสำเร็จ", data: result.rows[0] });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});