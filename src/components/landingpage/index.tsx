import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.png";
import { motion } from "framer-motion";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const disableBackNavigation = () => {
      window.history.pushState(null, "", window.location.href);
    };
    disableBackNavigation();
    window.onpopstate = disableBackNavigation;

    const handleContextMenu = (e: Event) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && ["u", "U", "i", "I", "j", "J"].includes(e.key)) ||
        e.key === "F12"
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <section
      id="home"
      className="h-screen bg-gradient-to-b from-[#000059] to-[#D9D9D9] flex flex-col justify-center items-center text-white"
    >
      <motion.div
        className="absolute top-5 left-5 flex items-center"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <img
          src={Logo}
          alt="AthleTech Logo"
          className="w-16 h-16 rounded-full"
        />
        <p className="text-3xl font-bold ml-4">ATLETECH</p>
      </motion.div>
      <motion.div
        className="text-center max-w-2xl px-6"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
      >
        <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight">
          UNLOCK YOUR <span className="text-[#000059]">BODY GOALS</span>
        </h1>
        <p className="mt-4 text-lg sm:text-xl font-medium">
          AthleTech is your AI-powered fitness & diet companion. Get customized
          plans, track progress, and stay on top of your health with our smart
          assistant.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <motion.button
            className="bg-[#000059] text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-white hover:text-black transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/login")}
          >
            Get Started
          </motion.button>

          <motion.button
            className="bg-transparent border-2 border-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-[#000059] hover:text-white transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              localStorage.setItem("isGuest", "true");
              navigate("/");
            }}
          >
            Continue as Guest
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
};

export default LandingPage;
