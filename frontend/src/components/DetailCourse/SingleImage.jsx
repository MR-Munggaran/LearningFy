import React from 'react'
import { getImageUrl } from "../getImageUrl";

const SingleImage = ({course}) => {
  return (
    <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:max-w-7xl lg:px-8">
        <img
        alt={course.title}
        src={getImageUrl(course.image)}
        className="rounded-lg object-cover w-full h-[400px]"
        />
    </div>
  )
}

export default SingleImage