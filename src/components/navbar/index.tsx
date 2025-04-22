import { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon, UserIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { LogOut, User } from "lucide-react";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const Navbar = ({
  darkMode,
  setDarkMode,
}: {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isGuest, setIsGuest] = useState(true);
  const [profilePic, setProfilePic] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const guest = localStorage.getItem("isGuest") === "true";
      setIsGuest(guest || !user);

      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setProfilePic(userDoc.data()?.photoURL || null);
        }
      }
    });
    return () => unsubscribe();
  }, [auth, db]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      localStorage.removeItem("isGuest");
      await signOut(auth);
      console.log("Logged out");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 w-full z-50 bg-[#000059] dark:from-gray-800 dark:to-gray-900"
    >
      <div className="flex items-center justify-between w-5/6 mx-auto py-4">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center justify-center gap-2 p-1 bg-white text-blue-800 rounded-full shadow-md hover:bg-gray-100 transition"
          >
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <UserIcon className="w-10 h-10 text-blue-800" />
            )}
          </button>
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute left-1/2 transform -translate-x-1/2 mt-2 min-w-[12rem] bg-white shadow-lg rounded-lg overflow-hidden z-50 dark:bg-gray-800 dark:text-white"
              >
                <button
                  disabled={isGuest}
                  className={`flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-100 dark:hover:text-gray-900 ${
                    isGuest ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => navigate("/profile")}
                >
                  <User className="w-5 h-5" /> Edit Profile
                </button>

                <button
                  className="flex items-center gap-2 w-full px-4 py-3 text-red-600 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  {loading ? (
                    "Logging out..."
                  ) : (
                    <>
                      <LogOut className="w-5 h-5" /> Logout
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="hidden md:flex space-x-10 text-white text-lg font-semibold">
          <button onClick={() => navigate("/meal")} className="hover:underline">
            Meal
          </button>
          <button
            onClick={() => navigate("/workout")}
            className="hover:underline"
          >
            Workout
          </button>
          <button
            onClick={() => navigate("/progress")}
            className="hover:underline"
          >
            Progress
          </button>
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-3 py-1 rounded bg-white text-black dark:bg-gray-800 dark:text-white border"
        >
          {darkMode ? "☀ Light" : "🌙 Dark"}
        </button>
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Bars3Icon className="h-8 w-8" />
        </button>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            transition={{ duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-64 bg-white shadow-lg z-40"
          >
            <div className="flex justify-end p-4">
              <button onClick={() => setMenuOpen(false)}>
                <XMarkIcon className="h-6 w-6 text-gray-800" />
              </button>
            </div>
            <div className="flex flex-col items-center space-y-6 text-gray-800 text-lg font-medium">
              <button
                onClick={() => navigate("/meal")}
                className="hover:text-blue-600"
              >
                Meal
              </button>
              <button
                onClick={() => navigate("/workout")}
                className="hover:text-blue-600"
              >
                Workout
              </button>
              <button
                onClick={() => navigate("/progress")}
                className="hover:text-blue-600"
              >
                Progress
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
