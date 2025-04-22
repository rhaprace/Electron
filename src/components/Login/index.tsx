import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../db/firebaseapp";
import { ArrowLongLeftIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

export default function LogIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [authing, setAuthing] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login", { replace: true });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const signInWithEmail = async () => {
    setAuthing(true);
    setError("");

    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response.user.uid);
      window.history.replaceState(null, "", "/");

      navigate("/", { replace: true });
    } catch (error: any) {
      console.error(error);
      setError(error.message);
      setAuthing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#000059] to-[#D9D9D9] flex justify-center items-center z-50">
      <motion.div
        className="relative w-full max-w-md p-8 rounded-lg bg-white bg-opacity-10 backdrop-blur-lg shadow-2xl border border-white border-opacity-30"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <button
          onClick={() => navigate("/landingpage")}
          className="absolute top-4 left-4 text-white"
        >
          <ArrowLongLeftIcon className="h-6 w-6 text-gray-50 hover:text-gray-300 transition duration-200" />
        </button>
        <h3 className="text-4xl font-bold mb-2 text-white text-center">
          Log In
        </h3>
        <p className="text-lg mb-6 text-gray-200 text-center">Welcome Back!</p>
        <div className="mb-6">
          <input
            type="email"
            placeholder="Email"
            className="w-full text-white py-3 px-4 mb-4 bg-transparent border border-gray-400 rounded-md focus:outline-none focus:border-blue-400 transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full text-white py-3 px-4 mb-4 bg-transparent border border-gray-400 rounded-md focus:outline-none focus:border-blue-400 transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <motion.button
            className="w-full bg-[#000059] text-white font-semibold rounded-md p-3 hover:bg-white hover:text-black transition-all"
            onClick={signInWithEmail}
            disabled={authing}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {authing ? "Logging in..." : "Log In"}
          </motion.button>
          {error && (
            <div className="text-red-500 text-center mt-4">{error}</div>
          )}
        </div>
        <div className="flex justify-center mt-6 items-center flex-col">
          <button
            onClick={() => navigate("/register")}
            className="text-white text-sm"
          >
            Don't have an account?{" "}
            <span className="text-[#000059]">Register now</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
