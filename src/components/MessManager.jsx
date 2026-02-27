import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function MessManager() {
  const navigate = useNavigate();
  const [messes, setMesses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    location: "",
    price: "",
    rating: "",
  });

  const [editId, setEditId] = useState(null);

  // ✅ Only fetch data
  useEffect(() => {
    fetchMesses();
  }, []);

  const fetchMesses = async () => {
    try {
      const response = await api.get("/messes");
      setMesses(response.data.data || response.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await api.put(`/messes/${editId}`, form);
        setEditId(null);
      } else {
        await api.post("/messes", form);
      }

      setForm({ name: "", location: "", price: "", rating: "" });
      fetchMesses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this mess?")) {
      await api.delete(`/messes/${id}`);
      fetchMesses();
    }
  };

  const handleEdit = (mess) => {
    setForm({
      name: mess.name,
      location: mess.location,
      price: mess.price,
      rating: mess.rating,
    });
    setEditId(mess._id);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between">
          <h1 className="text-2xl font-bold">Mess Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded">
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Form */}
        <div className="bg-white p-6 rounded shadow mb-8">
          <h2 className="font-semibold mb-4">
            {editId ? "Edit Mess" : "Add Mess"}
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              className="border p-2 rounded"
              required
            />
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Location"
              className="border p-2 rounded"
              required
            />
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              className="border p-2 rounded"
              required
            />
            <input
              name="rating"
              type="number"
              value={form.rating}
              onChange={handleChange}
              placeholder="Rating"
              className="border p-2 rounded"
              required
            />

            <button className="col-span-2 bg-blue-600 text-white py-2 rounded">
              {editId ? "Update" : "Add"}
            </button>
          </form>
        </div>

        {/* List */}
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {messes.map((mess) => (
              <div key={mess._id} className="bg-white p-4 rounded shadow">
                <h3 className="font-bold">{mess.name}</h3>
                <p>{mess.location}</p>
                <p>₹{mess.price}</p>
                <p>Rating: {mess.rating}</p>

                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(mess)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(mess._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MessManager;
