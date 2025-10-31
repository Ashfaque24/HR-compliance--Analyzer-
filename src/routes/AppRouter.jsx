
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing";
import AdminLogin from "../pages/AdminLogin";
import AdminDashboard from "../pages/AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "../sections/landing/Navbar";
import AssessmentFlow from "../pages/assessment/AssessmentFlow";
import AssessmentSummary from "../pages/assessment/AssessmentSummary";
import ReportPage from "../pages/ReportPage";  
import ReportView from "../pages/ReportView";
import EditReportPage from "../pages/EditReportPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/assessment" element={<AssessmentFlow />} />
        <Route path="/assessment/summary" element={<AssessmentSummary />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        {/* Protected admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/report"
          element={
            <ProtectedRoute>
              <ReportPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/report/:id"
          element={
            <ProtectedRoute>
              <ReportView />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/report/edit/:id"
          element={
            <ProtectedRoute>
              <EditReportPage />
            </ProtectedRoute>
          }
        />



      </Routes>
    </BrowserRouter>
  );
}
