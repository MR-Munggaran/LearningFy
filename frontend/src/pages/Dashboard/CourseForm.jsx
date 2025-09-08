import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCourses } from "../../hooks/useCourses";
import useCategory from "../../hooks/useCategory";
import { motion } from "framer-motion";

export default function CourseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchCourseDetail, createCourse, updateCourse } = useCourses();
  const [categories, setCategories] = useState([]);
  const { categoryList } = useCategory();

  const user = JSON.parse(localStorage.getItem("learning_token"));
  const instructor_id = user?.id;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    price: "",
    image: null,
    instructor_id: instructor_id || "",
  });

  useEffect(() => {
    const loadCategory = async () => {
      try {
        const catData = await categoryList();
        setCategories(catData.category || []);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    loadCategory();
  }, []);

  useEffect(() => {
    if (!id) return;
    const loadCourse = async () => {
      try {
        const data = await fetchCourseDetail(id);
        setFormData({
          title: data.course.title || "",
          description: data.course.description || "",
          category_id: data.course.category_name || "",
          price: data.course.price || "",
          image: null,
          instructor_id: instructor_id || "",
        });
      } catch (err) {
        console.error("Failed to fetch course detail", err);
      }
    };
    loadCourse();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.category_id.trim() ||
      !formData.price.toString().trim()
    ) {
      alert("Title, description, category, dan price wajib diisi.");
      return;
    }

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("category_id", formData.category_id);
      payload.append("price", formData.price);
      payload.append("instructor_id", instructor_id);
      if (formData.image instanceof File) {
        payload.append("image", formData.image);
      }

      if (id) {
        await updateCourse(id, payload);
      } else {
        await createCourse(payload);
      }
      navigate("/dashboard/instructor/courses");
    } catch (err) {
      console.error("Save failed", err);
      alert("Gagal menyimpan course, cek console.");
    }
  };

  // Variants animasi untuk setiap field
  const fieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.4 },
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {id ? "✏️ Edit Course" : "➕ Create Course"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {[
          {
            label: "Judul Course",
            name: "title",
            type: "text",
            value: formData.title,
          },
          {
            label: "Deskripsi",
            name: "description",
            type: "textarea",
            value: formData.description,
          },
          {
            label: `Kategori Before: ${formData.category_id} `,
            name: "category_id",
            type: "select",
            value: formData.category_id,
          },
          { label: "Harga", name: "price", type: "number", value: formData.price },
          { label: "Gambar Course", name: "image", type: "file", value: null },
        ].map((field, i) => (
          <motion.div
            key={field.name}
            custom={i}
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
            </label>
            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                rows={4}
                value={field.value}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            ) : field.type === "select" ? (
              <select
                name="category_id"
                value={formData.category_id || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              >
                <option value="">-- Pilih Kategori --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={field.type !== "file" ? field.value : undefined}
                accept={field.type === "file" ? "image/*" : undefined}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required={field.type !== "file"}
              />
            )}
          </motion.div>
        ))}

        <motion.div
          className="flex justify-end gap-3 pt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <motion.button
            type="button"
            onClick={() => navigate("/dashboard/instructor/courses")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2 bg-gray-500 text-white rounded-xl shadow hover:bg-gray-600 transition"
          >
            Batal
          </motion.button>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2 bg-indigo-600 text-white font-medium rounded-xl shadow hover:bg-indigo-700 transition"
          >
            Simpan
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
}
