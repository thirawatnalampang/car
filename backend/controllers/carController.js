const pool = require("../config/db");



// GET รถทั้งหมด
const getCars = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM cars ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST เพิ่มรถ
const addCar = async (req, res) => {
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
    res.status(500).json({ error: err.message });
  }
};
// PUT แก้ไขข้อมูลรถ
const updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    const { license_plate, brand, model, note } = req.body;

    const result = await pool.query(
      `UPDATE cars
       SET license_plate = $1,
           brand = $2,
           model = $3,
           note = $4,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [license_plate, brand, model, note, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "ไม่พบข้อมูลรถ"
      });
    }

    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};
// DELETE ลบข้อมูลรถ
const deleteCar = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM cars WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "ไม่พบข้อมูลรถ"
      });
    }

    res.json({
      message: "ลบข้อมูลรถสำเร็จ",
      data: result.rows[0]
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};
module.exports = {
  getCars,
  addCar,
  updateCar,
  deleteCar
};