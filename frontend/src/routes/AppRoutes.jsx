import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";

import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import Farms from "../pages/Farms";
import Crops from "../pages/Crops";
import Reports from "../pages/Reports";
import Profile from "../pages/Profile";
import DiseaseDetection from "../pages/DiseaseDetection";
import AddFarm from "../pages/AddFarm";
import EditFarm from "../pages/EditFarm";
import AddCrop from "../pages/AddCrop";
import EditCrop from "../pages/EditCrop";
import DiseaseHistory from "../pages/DiseaseHistory";
import Marketplace from "../pages/Marketplace";
import TaskCalendar from "../pages/TaskCalendar";
import WeatherForecast from "../pages/WeatherForecast";
import FertilizerCalculator from "../pages/FertilizerCalculator";
import AIFarmingAssistant from "../pages/AIFarmingAssistant";
import Notifications from "../pages/Notifications";
import CropRecommendation from "../pages/CropRecommendation";
import YieldPrediction from "../pages/YieldPrediction";
import Expenses from "../pages/Expenses";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ai-assistant" element={<AIFarmingAssistant />} />
          <Route path="/farms" element={<Farms />} />
          <Route path="/farms/add" element={<AddFarm />} />
          <Route path="/farms/edit/:id" element={<EditFarm />} />
          <Route path="/crops" element={<Crops />} />
          <Route path="/crops/add" element={<AddCrop />} />
          <Route path="/crops/edit/:id" element={<EditCrop />} />
          <Route path="/disease" element={<DiseaseDetection />} />
          <Route path="/disease-history" element={<DiseaseHistory />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/tasks" element={<TaskCalendar />} />
          <Route path="/weather" element={<WeatherForecast />} />
          <Route path="/calculator" element={<FertilizerCalculator />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/crop-recommendation" element={<CropRecommendation />} />
          <Route path="/yield-prediction" element={<YieldPrediction />} />
          <Route path="/expenses" element={<Expenses />} />
        </Route>

        {/* Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
