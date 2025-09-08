import React from 'react'
import { getImageUrl } from "../getImageUrl";
import { Link } from 'react-router-dom';


const SimilarCourse = ({similarCourses}) => {
  return (
    <div className="mx-auto max-w-7xl px-4 mt-16">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
        Similar Courses
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {similarCourses.map((sc) => (
            <div
            key={sc.id}
            className=" rounded-lg p-4 hover:shadow-xl transition"
            >
            <Link to={`/course/${sc.id}`}>
            <img
                src={getImageUrl(sc.image)}
                alt={sc.title}
                className="h-40 w-full object-cover rounded-md"
                />
            </Link>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {sc.title}
            </h3>
            <p className="text-gray-600">{sc.price ? `Rp ${(sc.price.toLocaleString("id-ID"))}` : "Free"}</p>
            </div>
        ))}
        </div>
    </div>
  )
}

export default SimilarCourse