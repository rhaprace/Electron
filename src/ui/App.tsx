import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Home from "../components/home";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  // Apply class to <html> element
  useEffect(() => {
    const root = document.documentElement; // this is <html>
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300t">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <Home />
    </div>
  );
}

export default App;
