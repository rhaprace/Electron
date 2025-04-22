import { useState, useEffect } from "react";
import { auth, db } from "../../db/firebaseapp";
import { doc, getDoc } from "firebase/firestore";
import { ArrowLongLeftIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface Exercise {
  id: string;
  name: string;
  target: string;
  equipment: string;
  bodyPart: string;
  gifUrl: string;
  instructions: string[];
}

const Workout = () => {
  const [search, setSearch] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          recommendExercises(userDoc.data());
        }
      }
    };

    fetchUserData();
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await fetch(
        `https://exercisedb.p.rapidapi.com/exercises`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-key":
              "796dd51d6cmsh71c75ec0f2a5a8fp1c0598jsn8ce9292c6daf",
            "x-rapidapi-host": "exercisedb.p.rapidapi.com",
          },
        }
      );
      const data = await response.json();
      const formattedExercises = data.map((exercise: any) => ({
        id: exercise.id,
        name: exercise.name,
        target: exercise.target,
        equipment: exercise.equipment,
        bodyPart: exercise.bodyPart,
        gifUrl: exercise.gifUrl,
        instructions: exercise.instructions,
      }));

      console.log("Fetched exercises:", formattedExercises);

      setExercises(formattedExercises);
    } catch (error) {
      console.error("Failed to fetch exercises", error);
      setExercises([]);
    }
  };

  useEffect(() => {
    if (!search) {
      fetchExercises();
    }
  }, [search]);

  const handleSearch = () => {
    console.log("Search term:", search);
    const normalizedSearch = search.toLowerCase().trim();

    const filtered = exercises.filter((exercise) =>
      exercise.name.toLowerCase().includes(normalizedSearch)
    );
    console.log("Filtered exercises:", filtered);

    setExercises(filtered);
  };
  const recommendExercises = (user: any) => {
    const { goal } = user;

    let recommended = exercises;
    if (goal === "Weight Loss") {
      recommended = exercises.filter((ex) => ex.bodyPart !== "Arms");
    } else if (goal === "Gain Weight") {
      recommended = exercises.filter((ex) => ex.bodyPart !== "Core");
    }
    setExercises(recommended);
  };

  return (
    <motion.div
      className="flex flex-col items-center min-h-screen p-5 h-auto bg-gradient-to-br from-[#1a1a4d] to-[#f0f0f0] dark:from-[#0a0a23] dark:to-[#1a1a4d] text-black dark:text-white"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2 }}
    >
      <ArrowLongLeftIcon
        onClick={() => navigate("/")}
        className="h-8 w-8 text-gray-50 hover:text-gray-300 transition duration-200 fixed left-0 ml-5 mt-5 block md:hidden z-50"
      />
      <h1 className="text-3xl md:text-5xl font-bold text-center mb-10 pt-8 text-gray-800 dark:text-white">
        Workout Recommendations
      </h1>
      <div className="relative w-full max-w-4xl mb-10">
        <input
          className="w-full h-16 text-lg font-bold px-6 rounded-full border border-gradient-to-br from-[#000059] to-[#D9D9D9] shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white/30 backdrop-blur-md dark:text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Exercises"
          type="text"
        />
        <button
          className="absolute right-0 top-0 h-16 w-32 bg-blue-500 px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-600 transition-all text-white rounded-r-full text-lg"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {exercises.length > 0 ? (
          exercises.map((exercise) => (
            <div
              key={exercise.id}
              className="group relative p-5 bg-white/20 backdrop-blur-md rounded-xl shadow-lg flex flex-col items-center text-center hover:bg-white/40 transition duration-300 dark:text-white"
            >
              <img
                src={exercise.gifUrl}
                alt={exercise.name}
                className="w-full h-48 object-contain mb-4 rounded-lg shadow-md"
              />
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {exercise.name}
              </h2>
              <p className="text-gray-600 dark:text-white">{exercise.target}</p>
              <p className="text-gray-600 dark:text-white">
                {exercise.equipment}
              </p>

              <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center p-4 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300">
                <h3 className="text-lg font-bold text-white mb-2">
                  How to Do It:
                </h3>
                <ul className="text-sm space-y-1 text-gray-300">
                  {exercise.instructions.map((step, index) => (
                    <li key={index} className="text-center">
                      {index + 1}. {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-300">No exercises found.</p>
        )}
      </div>
    </motion.div>
  );
};

export default Workout;
