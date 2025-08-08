import React, { useEffect, useState } from "react";
import ApiCall from "../../../config";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingOverlay from "../../../components/loading/LoadingOverlay";

const Duty = () => {
  const { groupId } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await ApiCall(
        `/api/v1/groups/students/${groupId}`,
        "GET"
      );
      console.log(response);

      if (response && Array.isArray(response.data)) {
        setStudents(response.data);
      } else {
        setStudents([]);
      }

      console.log("Talabalar ro'yxati:", response.data);
    } catch (err) {
      console.error("Xatolik:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStudent = async () => {
    setUpdating(true);
    try {
      await getStudentFromHemis();
      await fetchStudents();
    } catch (err) {
      console.error("Xatolik:", err);
    } finally {
      setUpdating(false);
    }
  };
  const getStudentFromHemis = async () => {
    try {
      const response = await ApiCall(
        `/api/v1/groups/update-students/${groupId}`,
        "GET"
      );
      console.log("update", response);
      if (response?.error) {
        toast.error("Avtorizatsiya xatosi: Token topilmadi yoki noto‘g‘ri.");
        console.log(response.data);
      } else {
        toast.success("Muvaffaqiyatli yangilandi");
      }
    } catch (error) {
      console.error("Xatolik (yangilash):", error);
    }
  };

  useEffect(() => {
    if (groupId) {
      fetchStudents();
    }
  }, [groupId]);

  return (
    <div className="mx-auto max-w-7xl p-6">
      <ToastContainer />
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-blue-600 sm:text-3xl">
          {students[0]?.groupName} Guruh talabalari ro'yxati
        </h1>
        <button
          onClick={updateStudent}
          disabled={loading || updating}
          className={`rounded-md px-4 py-2 font-medium text-white transition-colors ${
            loading || updating
              ? "cursor-not-allowed bg-gray-400"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading || updating ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Yuklanmoqda...
            </span>
          ) : (
            "Talabalarni yangilash"
          )}
        </button>
      </div>
      {(loading || updating) && (
        <>
          {console.log("Rendering loading overlay")}
          <LoadingOverlay text="Yuklanmoqda..." />
        </>
      )}

      {!loading && students.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-gray-500">
            Talabalar ro'yxati bo'sh. Yangilash tugmasini bosing.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Ismi Familiyasi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Talaba ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Semestr
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    GPA
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Rasm
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {students.map((student, index) => (
                  <tr key={student.id || index} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {student?.fullName || "-"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {student?.studentIdNumber || "-"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {student?.semester - 10 || "-"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {student?.avgGpa || "-"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {student?.image ? (
                        <img
                          src={student.image}
                          alt={`${student.first_name} ${student.second_name}`}
                          className="h-10 w-10 rounded-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/40";
                          }}
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-xs text-gray-500">
                          Rasm yo'q
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Duty;
