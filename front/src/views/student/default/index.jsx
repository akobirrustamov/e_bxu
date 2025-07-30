import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ApiCall from "../../../config/index";
import Banner from "./components/Banner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [subject, setSubject] = useState();
  const [student, setStudent] = useState();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    sendData(token)
  }, [navigate]);

  const sendData = async (token) => {
    try {
      console.log(token)
      const response = await ApiCall('/api/v1/student/account/'+token, "GET");
      setStudent(response.data)
    } catch (error) {
      navigate("/student/login")
      console.error('Error fetching student data or posting to server:', error);
    }
  };
  async function getStudentVote(passportPin) {
    try {
      const response = await ApiCall(`/api/v1/votesubject/student/${passportPin}`, "GET", null);
      setSubject(response.data);
    } catch (error) {
      console.error("Error fetching subject:", error);
    }
  }

  async function changeVote(id, status) {
    try {
      await ApiCall(`/api/v1/votesubject/${id}/${status}`, "PUT");
      await getStudentVote(student?.passport_pin);
    } catch (error) {
      console.error("Error updating vote status:", error);
    }
  }

  return (
      <div>
        {/* Card widget */}
        <div className="pt-0 grid grid-cols-1 gap-5 md:pt-0 lg:pt-0">
          {student && (
              <Banner name={`${student.first_name} ${student.second_name}`} />
          )}
        </div>

        {/* Tables & Charts */}
        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
          <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
            {/*<TaskCard />*/}
            <div className="grid grid-cols-1 rounded-[20px]">
              {/*<MiniCalendar />*/}
            </div>
          </div>
        </div>
      </div>
  );
};

export default Dashboard;
