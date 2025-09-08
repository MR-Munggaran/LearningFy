import { useState, useEffect } from "react";

export default function LessonModal({ isOpen, onClose, onSave, selectedLesson }) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    content_type: "text",
    resource_url: "",
    position: 1,
  });

  useEffect(() => {
    if (selectedLesson) {
      setFormData({
        title: selectedLesson.title,
        content: selectedLesson.content,
        content_type: selectedLesson.content_type,
        resource_url: selectedLesson.resource_url,
        position: selectedLesson.position,
      });
    } else {
      setFormData({
        title: "",
        content: "",
        content_type: "text",
        resource_url: "",
        position: 1,
      });
    }
  }, [selectedLesson]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, id: selectedLesson?.id });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          {selectedLesson ? "Edit Lesson" : "Add Lesson"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Content Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Content Type</label>
            <select
              name="content_type"
              value={formData.content_type}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="text">Text</option>
              <option value="video">Video</option>
              <option value="pdf">PDF</option>
            </select>
          </div>

          {/* Resource URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Resource URL</label>
            <input
              type="text"
              name="resource_url"
              value={formData.resource_url}
              onChange={handleChange}
              placeholder="https://example.com/resource"
              className="w-full px-3 py-2 border rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Position</label>
            <input
              type="number"
              name="position"
              value={formData.position}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              {selectedLesson ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
