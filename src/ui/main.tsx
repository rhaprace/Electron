import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import LogIn from "../components/Login/index.tsx";
import Register from "../components/register/index.tsx";
import AuthRoute from "./AuthRoute.tsx";
import Chatbot from "../components/chatbot/index.tsx";
import Meal from "../components/meal/index.tsx";
import Workout from "../components/workout/index.tsx";
import LandingPage from "../components/landingpage/index.tsx";
import Progress from "../components/progress/index.tsx";
import EditProfile from "../components/editprofile/index.tsx";
import ContactUs from "../components/contactus/index.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/landingpage" element={<LandingPage />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <AuthRoute guestAllowed={true}>
              <App />
            </AuthRoute>
          }
        />
        <Route
          path="/meal"
          element={
            <AuthRoute>
              <Meal />
            </AuthRoute>
          }
        />
        <Route
          path="/workout"
          element={
            <AuthRoute>
              <Workout />
            </AuthRoute>
          }
        />
        <Route
          path="/progress"
          element={
            <AuthRoute>
              <Progress />
            </AuthRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <AuthRoute>
              <EditProfile />
            </AuthRoute>
          }
        />
        <Route
          path="/chatbot"
          element={
            <AuthRoute guestAllowed={true}>
              <Chatbot />
            </AuthRoute>
          }
        />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  </StrictMode>
);
