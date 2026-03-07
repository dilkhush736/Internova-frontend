import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Internships from "./pages/Internships";
import InternshipDetails from "./pages/InternshipDetails";
import MyPurchases from "./pages/MyPurchases";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/internships"
          element={
            <ProtectedRoute>
              <Internships />
            </ProtectedRoute>
          }
        />
        <Route
          path="/internships/:id"
          element={
            <ProtectedRoute>
              <InternshipDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-purchases"
          element={
            <ProtectedRoute>
              <MyPurchases />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;