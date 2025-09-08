import { useEffect, useState } from "react";
import { useEnrollment } from "../../hooks/useEnrollment";
import { getImageUrl } from "../../components/getImageUrl";
import { Link } from "react-router-dom";
import usePayment from "../../hooks/usePayment";

export default function MyCourses() {
  const [myCourse, setMyCourse] = useState([]);
  const { fetchMyEnrollments } = useEnrollment();
  const { checkoutPayment, sendPaymentNotification } = usePayment();

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    };

    const loadMyCourse = async () => {
      try {
        const data = await fetchMyEnrollments();
        setMyCourse(data.enrollments || []);
      } catch (err) {
        console.error("Failed to fetch all courses", err);
      }
    };

    loadMyCourse();
    scrollToTop();
  }, []);

  useEffect(()=> {
    const snapJS = 'https://app.sandbox.midtrans.com/snap/snap.js'
    const clientKey = 'Mid-client-8uPSP1kgFPv4rfvH'
    const script = document.createElement('script')
    script.src = snapJS
    script.setAttribute('data-client-key', clientKey)
    script.async = true

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  },[])

const handlePayment = async (enrollmentId, amount) => {
  try {
    const res = await checkoutPayment(enrollmentId, amount);

    // Ambil token dari backend
    const token = res?.token;
    if (!token) throw new Error("Payment token not found");

    window.snap.pay(token, {
      onSuccess: async (result) => {
        console.log("✅ Payment success:", result);
        await sendPaymentNotification(result)
        // refresh data setelah notifikasi Midtrans masuk ke backend
        // setTimeout(() => {
        //   fetchMyEnrollments().then((data) => {
        //     setMyCourse(data.enrollments || []);
        //   });
        // }, 2000); // kasih delay biar backend sempat update
      },
      onPending: (result) => {
        console.log("⌛ Payment pending:", result);
      },
      onError: (error) => {
        console.error("❌ Payment error:", error);
      },
      onClose: () => {
        console.log("⚠️ Payment popup closed without finishing payment");
      },
    });
  } catch (error) {
    console.error("Payment failed", error);
  }
};

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-10 sm:py-16 lg:max-w-none lg:py-20">
          <h2 className="text-2xl font-bold text-gray-900">📚 My Courses</h2>

          <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {myCourse.map((course) => (
              <div
                key={course.id}
                className="group relative bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
              >
                <img
                  alt={course.course_title}
                  src={getImageUrl(course.image)}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {course.course_title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {course.status}
                  </p>

                  {/* Info modules & teacher */}
                  <div className="mt-4 flex justify-between text-sm text-gray-700">
                    <span>Rp. {course.price}</span>
                    <span>👨‍🏫 {course.instructor_name}</span>
                  </div>

                  <div className="mt-4">
                    {course.status === "pending" ? (
                      <button
                        onClick={() => handlePayment(course.id, course.price)}
                        className="inline-block w-full text-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                      >
                        Pay
                      </button>
                    ) : (
                      <Link
                        to={`/dashboard/student/modules/${course.course_id}`}
                        state={{ enrollmentId: course.id }}
                        className="inline-block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                      >
                        Continue
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
