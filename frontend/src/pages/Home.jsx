import { useEffect, useState } from "react";
import api from "../services/api";

function Home() {
  const [cars, setCars] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    license_plate: "",
    brand: "",
    model: "",
    note: "",
  });

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    const res = await api.get("/cars");
    setCars(res.data);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submitForm = async (e) => {
    e.preventDefault();

    if (
      !form.license_plate ||
      !form.brand ||
      !form.model
    ) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    if (editingId) {
      await api.put(`/cars/${editingId}`, form);
      alert("แก้ไขข้อมูลสำเร็จ");
    } else {
      await api.post("/cars", form);
      alert("เพิ่มข้อมูลสำเร็จ");
    }

    setForm({
      license_plate: "",
      brand: "",
      model: "",
      note: "",
    });

    setEditingId(null);
    fetchCars();
  };

  const editCar = (car) => {
    setEditingId(car.id);

    setForm({
      license_plate: car.license_plate,
      brand: car.brand,
      model: car.model,
      note: car.note,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteCar = async (id) => {
    if (!window.confirm("ต้องการลบข้อมูลนี้ใช่ไหม?")) return;

    await api.delete(`/cars/${id}`);

    alert("ลบข้อมูลสำเร็จ");

    fetchCars();
  };

  const filteredCars = cars.filter(
    (car) =>
      car.license_plate
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      car.brand
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <>
      <nav className="navbar navbar-dark bg-dark shadow">
        <div className="container">
          <span className="navbar-brand fs-3">
            🚗 Car Management System
          </span>
        </div>
      </nav>

      <div className="container mt-4">

        <div className="card shadow">

          <div className="card-header bg-primary text-white">
            <h3 className="mb-0">
              ระบบจัดการข้อมูลรถยนต์
            </h3>
          </div>

          <div className="card-body">

            <form onSubmit={submitForm}>

              <div className="row">

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    ทะเบียนรถ
                  </label>

                  <input
                    className="form-control"
                    name="license_plate"
                    value={form.license_plate}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    ยี่ห้อ
                  </label>

                  <input
                    className="form-control"
                    name="brand"
                    value={form.brand}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    รุ่น
                  </label>

                  <input
                    className="form-control"
                    name="model"
                    value={form.model}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    หมายเหตุ
                  </label>

                  <input
                    className="form-control"
                    name="note"
                    value={form.note}
                    onChange={handleChange}
                  />
                </div>

              </div>

              <button
                className={`btn ${
                  editingId ? "btn-warning" : "btn-success"
                }`}
              >
                {editingId ? "อัปเดตข้อมูล" : "เพิ่มข้อมูล"}
              </button>

            </form>

            <hr />

            <div className="alert alert-info">
              🚙 จำนวนรถทั้งหมด <strong>{cars.length}</strong> คัน
            </div>

            <input
              type="text"
              className="form-control mb-3"
              placeholder="🔍 ค้นหาทะเบียนรถ หรือ ยี่ห้อ"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <table className="table table-bordered table-hover">

              <thead className="table-dark">

                <tr>
                  <th>ID</th>
                  <th>ทะเบียน</th>
                  <th>ยี่ห้อ</th>
                  <th>รุ่น</th>
                  <th>หมายเหตุ</th>
                  <th width="180">จัดการ</th>
                </tr>

              </thead>

              <tbody>

                {filteredCars.length === 0 ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="text-center"
                    >
                      ไม่มีข้อมูลรถ
                    </td>

                  </tr>

                ) : (

                  filteredCars.map((car) => (

                    <tr key={car.id}>

                      <td>{car.id}</td>
                      <td>{car.license_plate}</td>
                      <td>{car.brand}</td>
                      <td>{car.model}</td>
                      <td>{car.note}</td>

                      <td>

                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => editCar(car)}
                        >
                          ✏️ แก้ไข
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteCar(car.id)}
                        >
                          🗑️ ลบ
                        </button>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

        <footer className="text-center mt-4 text-secondary">
          <hr />
          <p>
            Car Management System © 2026
          </p>
        </footer>

      </div>
    </>
  );
}

export default Home;