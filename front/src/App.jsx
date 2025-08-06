import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "layouts/admin";
import DeanLayout from "layouts/dean";
import StudentLayout from "layouts/student";
import AuthLayout from "layouts/auth";
import Login from "./views/student/login/Login";
import LoginAdmin from "./config/login/Login";
import IconsAll from "./IconsAll";
import SuperAdminLayout from "layouts/superadmin";
import Rector from "layouts/rector";
import ErrorPage from "./404/404";
import StatusAppeal from "./views/student/appeals/StatusAppeal";
import AddNewSubCategory from "./views/superadmin/subCategories/AddNewSubCategory";
import StudentService from "./views/student/service/StudentService";
import EditNewSubCategory from "./views/superadmin/subCategories/EditNewSubCategory";
import AllAppealsSuperAdmin from "./views/superadmin/all-appeals/index";
const App = () => {
  return (
    <Routes>
      <Route path="superadmin/*" element={<SuperAdminLayout />} />
      <Route path="auth/*" element={<AuthLayout />} />
      <Route path="admin/*" element={<AdminLayout />} />
      <Route path="dean/*" element={<DeanLayout />} />
      <Route path="rector/*" element={<Rector />} />
      <Route
        path="superadmin/subcategories/new"
        element={<AddNewSubCategory />}
      />

      <Route
        path="superadmin/subcategories/edit/:id"
        element={<EditNewSubCategory />}
      />
      <Route path="admin/login" element={<LoginAdmin />} />
      <Route path="student/*" element={<StudentLayout />} />
      <Route
        path="student/service/:subCategoryId"
        element={<StudentService />}
      />
      <Route path="student/login" element={<Login />} />
      <Route path="icons" element={<IconsAll />} />
      <Route path="/" element={<Navigate to="/student" replace />} />

      <Route path="/404" element={<ErrorPage />} />

      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default App;
