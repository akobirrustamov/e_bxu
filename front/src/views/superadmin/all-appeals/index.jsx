import React, { useEffect, useState } from "react";
import ApiCall from "../../../config"; // bu sizning API call helperingiz
import { useParams } from "react-router-dom";

const Duty = () => {
  const { groupId } = useParams(); // URL'dan groupId olamiz
  const [students, setStudents] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // 1. Guruh ID orqali guruh nomini olish
        const groupResponse = await ApiCall(`/api/v1/groups/${groupId}`, "GET");
        const name = groupResponse.data.name;
        setGroupName(name);

        // 2. Guruh nomi orqali talabalarni olish
        const studentsResponse = await ApiCall(
          `/api/v1/student/group/${name}`,
          "GET"
        );
        setStudents(studentsResponse.data);
      } catch (err) {
        console.error("Xatolik:", err);
      } finally {
        setLoading(false);
      }
    };

    if (groupId) fetchStudents();
  }, [groupId]);

  return (
    <div className="mx-auto max-w-7xl p-6">
      <h1 className="mb-6 text-center text-3xl font-bold text-blue-600">
        {groupName
          ? `${groupName} guruhi talabalar ro'yxati`
          : "Yuklanmoqda..."}
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Yuklanmoqda...</p>
      ) : students.length === 0 ? (
        <p className="text-center text-red-500">Talabalar topilmadi</p>
      ) : (
        <table className="min-w-full overflow-hidden rounded-lg border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border py-2 px-4">#</th>
              <th className="border py-2 px-4">Ismi</th>
              <th className="border py-2 px-4">Familiyasi</th>
              <th className="border py-2 px-4">Telefon</th>
              <th className="border py-2 px-4">Rasm</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index} className="border-t">
                <td className="border py-2 px-4">{index + 1}</td>
                <td className="border py-2 px-4">{student.first_name}</td>
                <td className="border py-2 px-4">{student.second_name}</td>
                <td className="border py-2 px-4">{student.phone || "-"}</td>
                <td className="border py-2 px-4">
                  {student.image ? (
                    <img
                      src={student.image}
                      alt="student"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Duty;
