import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing";
import AdminLogin from "../pages/AdminLogin";
import AdminDashboard from "../pages/AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "../sections/landing/Navbar";

import AssessmentFlow from "../pages/assessment/AssessmentFlow";
import AssessmentSummary from "../pages/assessment/AssessmentSummary";

export default function AppRouter() {
  const progress = 0; // progress can be calculated inside AssessmentFlow now
  return (
    <BrowserRouter>
      <Navbar /> {/* Navbar rendered globally once here */}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/assessment" element={<AssessmentFlow />} />
        <Route path="/assessment/summary" element={<AssessmentSummary />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}


