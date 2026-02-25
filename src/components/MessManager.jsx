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

  // Check token on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      fetchMesses();
    }
  }, [navigate]);

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
    setForm(mess);
    setEditId(mess._id);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Mess Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded">
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">
            {editId ? "Edit Mess" : "Add New Mess"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={form.location}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              <input
                type="number"
                name="rating"
                placeholder="Rating"
                value={form.rating}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded">
                {editId ? "Update" : "Add"}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditId(null);
                    setForm({ name: "", location: "", price: "", rating: "" });
                  }}
                  className="ml-2 bg-gray-500 text-white px-6 py-2 rounded">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Mess List */}
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {messes.map((mess) => (
              <div key={mess._id} className="bg-white rounded-lg shadow p-4">
                <h3 className="font-bold text-lg">{mess.name}</h3>
                <p className="text-gray-600">{mess.location}</p>
                <p className="text-blue-600 font-bold">₹{mess.price}</p>
                <p className="text-yellow-600">Rating: {mess.rating}/5</p>
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(mess)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(mess._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm">
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
