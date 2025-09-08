import { useState, useEffect } from "react";

export default function CategoryModal({ isOpen, onClose, onSave, selectedCategory }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (selectedCategory) {
      setFormData({
        name: selectedCategory.name,
        description: selectedCategory.description,
      });
    } else {
      setFormData({ name: "", description: "" });
    }
  }, [selectedCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">
          {selectedCategory ? "Edit Category" : "Add Category"}
        </h2>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Name"
            className="px-3 py-2 rounded text-black"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <textarea
            placeholder="Description"
            className="px-3 py-2 rounded text-black"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({ ...selectedCategory, ...formData })}
            className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
