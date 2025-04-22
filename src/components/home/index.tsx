import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../db/firebaseapp";
import { doc, getDoc } from "firebase/firestore";
import Vid from "../../assets/vid.mp4";
const Home: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Guest");
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserName(userDoc.data().name);
        }
      } else {
        setUserName("Guest");
      }
      setLoading(false);
    });

    const quotes = [
      "Push yourself, because no one else is going to do it for you.",
      "Success is the sum of small efforts, repeated day in and day out.",
      "Don't stop when you're tired, stop when you're done.",
      "The only bad workout is the one that didn't happen.",
      "Hard work beats talent when talent doesn't work hard.",
    ];

    const interval = setInterval(() => {
      setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, 5000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  return (
    <section
      id="home"
      className="min-h-screen flex flex-col justify-center overflow-hidden transition-colors duration-300
             bg-[#D9D9D9] text-black dark:bg-gradient-to-br dark:from-[#0a0a23] dark:to-[#1a1a4d] dark:text-white"
    >
      <motion.div
        className="flex flex-col md:flex-row mx-auto w-5/6 items-center justify-between md:h-5/6 "
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-5xl font-bold text-black dark:text-white leading-tight">
            {loading ? "Loading..." : `Welcome, ${userName || "Athlete"}!`}
          </h1>

          <p className="mt-4 text-lg text-black dark:text-white max-w-md">
            Your fitness journey starts here. Build habits. Track progress. Stay
            consistent.
          </p>

          <div className="border-t border-black my-6 w-24 mx-auto md:mx-0 dark:border-white" />

          <p className="text-sm text-black uppercase tracking-widest dark:text-white">
            Let’s get moving.
          </p>
          <div className="mt-6 flex justify-center md:justify-start space-x-4">
            <motion.button
              className="w-48 bg-[#000059] text-white font-semibold rounded-md p-3 hover:bg-white hover:text-black transition-all"
              onClick={() => navigate("/chatbot")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              AI Coach
            </motion.button>
            <motion.button
              className="w-48 bg-[#000059] text-white font-semibold rounded-md p-3 hover:bg-white hover:text-black transition-all"
              onClick={() => navigate("/contactus")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
          </div>
        </div>

        <motion.div
          className="md:w-1/2 flex justify-center mt-10 md:mt-0"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <video
            src={Vid}
            className="w-72 md:w-96 rounded-xl shadow-2xl object-cover h-72 md:h-96"
            autoPlay
            loop
            muted
          />
        </motion.div>
      </motion.div>
      <div className="fixed bottom-0 w-full z-50">
        <motion.div
          className="w-full text-center text-base sm:text-lg text-gray-200 font-semibold py-2 bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <p className="italic px-2">"{quote}"</p>
        </motion.div>
        <div className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <motion.div
            className="flex flex-col sm:flex-row justify-center items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="w-full sm:w-1/3 h-2 bg-gray-400 rounded-full overflow-hidden">
              <motion.div
                className="h-2 bg-blue-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "80%" }}
                transition={{ duration: 2 }}
              />
            </div>
            <span className="text-sm sm:text-base">
              80% of your daily goal achieved!
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Home;
