import { useState, useEffect } from "react";

export default function ModuleModal({ isOpen, onClose, onSave, selectedModule }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    position: 1,
  });

  // Reset form saat modal dibuka/ditutup atau saat selectedModule berubah
  useEffect(() => {
    if (selectedModule) {
      setFormData({
        title: selectedModule.title || "",
        description: selectedModule.description || "",
        position: selectedModule.position || 1,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        position: 1,
      });
    }
  }, [selectedModule, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "position" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      alert("Please fill all fields!");
      return;
    }
    onSave({ ...formData, id: selectedModule?.id || Date.now() });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">
          {selectedModule ? "Edit Module" : "Add Module"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              placeholder="Enter module title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              placeholder="Enter module description"
            />
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-medium mb-1">Position</label>
            <input
              type="number"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              min="1"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {selectedModule ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
