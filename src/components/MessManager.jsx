import { useEffect, useState } from "react";
import api from "../services/api";

function MessManager() {
  const [messes, setMesses] = useState([]);
  const [form, setForm] = useState({
    name: "",
    location: "",
    price: "",
    rating: "",
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMesses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/messes");
      setMesses(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchMesses();
    };
    loadData();
  }, []);

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
      await fetchMesses();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/messes/${id}`);
      await fetchMesses();
    } catch (error) {
      console.log(error);
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

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold text-center mb-8">
          Mess Management Panel
        </h1>

        <div className="bg-white p-6 rounded-xl shadow-md mb-10">
          <form onSubmit={handleSubmit} className="grid md:grid-cols-4 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Mess Name"
              value={form.name}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 w-full"
              required
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 w-full"
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 w-full"
              required
            />
            <input
              type="number"
              name="rating"
              placeholder="Rating"
              value={form.rating}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 w-full"
              required
            />

            <div className="md:col-span-4 text-right">
              <button
                type="submit"
                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition">
                {editId ? "Update Mess" : "Add Mess"}
              </button>
            </div>
          </form>
        </div>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {messes.map((mess) => (
              <div key={mess._id} className="bg-white p-5 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold mb-2">{mess.name}</h2>
                <p className="text-gray-600 mb-1">{mess.location}</p>
                <p className="mb-1">₹ {mess.price}</p>
                <p className="mb-4">Rating: {mess.rating}</p>

                <div className="flex justify-between">
                  <button
                    onClick={() => handleEdit(mess)}
                    className="px-4 py-1 border rounded-lg">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(mess._id)}
                    className="px-4 py-1 bg-red-500 text-white rounded-lg">
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
