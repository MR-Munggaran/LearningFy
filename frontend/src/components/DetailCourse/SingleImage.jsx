// SingleImage.jsx
import React from "react";
import { getImageUrl } from "../getImageUrl";

const SingleImage = ({ course, loading }) => {
  if (loading || !course) {
    return (
      <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:max-w-7xl lg:px-8 animate-pulse">
        <div className="rounded-lg bg-gray-200 w-full h-[400px]" />
      </div>
    );
  }

  return (
    <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:max-w-7xl lg:px-8">
      <img
        alt={course.title}
        src={getImageUrl(course.image)}
        className="rounded-lg object-cover w-full h-[400px]"
      />
    </div>
  );
};

export default SingleImage;