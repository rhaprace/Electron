import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useState, useEffect } from "react";
import { auth, db } from "../../db/firebaseapp";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ArrowLongLeftIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

// Registering Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Meal = () => {
  const [exercises, setExercises] = useState<{ id: number; name: string }[]>(
    []
  );
  const [exerciseInput, setExerciseInput] = useState("");
  const [mealInput, setMealInput] = useState({
    name: "",
    grams: "",
    protein: 0,
    carbs: 0,
    fats: 0,
    calories: 0,
  });
  const [totalCaloriesConsumed, setTotalCaloriesConsumed] = useState<number>(0);
  const [showMacros, setShowMacros] = useState(false);
  const [mealHistory, setMealHistory] = useState<any[]>([]); // This will hold your meal history data
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setExercises(data.exercises || []);
          setTotalCaloriesConsumed(data.totalCaloriesConsumed || 0);
          setMealHistory(data.meals || []); // Assuming meals is an array in the user's data
        }
      }
    };
    fetchUserData();
  }, []);

  const mealHistoryChartData = {
    labels: mealHistory.map((entry: any) => entry.name),
    datasets: [
      {
        label: "Calories Consumed",
        data: mealHistory.map((entry: any) => entry.calories),
        borderColor: "#4A90E2",
        backgroundColor: "rgba(74, 144, 226, 0.2)",
        fill: true,
      },
    ],
  };

  const updateExercisesInFirestore = async (
    updatedExercises: { id: number; name: string }[]
  ) => {
    const user = auth.currentUser;
    if (!user) return;

    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, { exercises: updatedExercises });
  };

  const addExercise = async () => {
    if (!exerciseInput.trim()) {
      alert("Exercise name cannot be empty.");
      return;
    }

    const newExercise = { id: Date.now(), name: exerciseInput };
    const updatedExercises = [...exercises, newExercise];
    setExercises(updatedExercises);

    await updateExercisesInFirestore(updatedExercises);
    setExerciseInput("");
    alert("Exercise added!");
  };

  const handleMealInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMealInput({ ...mealInput, [name]: value });
  };

  const [lastMealMacros, setLastMealMacros] = useState({
    protein: 0,
    carbs: 0,
    fats: 0,
    calories: 0,
  });

  const addMeal = async () => {
    const { name, grams } = mealInput;

    if (
      !name.trim() ||
      !grams ||
      isNaN(parseFloat(grams)) ||
      parseFloat(grams) <= 0
    ) {
      alert(
        "Meal name cannot be empty, and grams must be a valid number greater than 0."
      );
      return;
    }

    const numericGrams = parseFloat(grams);
    const newProtein = numericGrams * 0.2;
    const newCarbs = numericGrams * 0.3;
    const newFats = numericGrams * 0.1;
    const newCalories = newProtein * 4 + newCarbs * 4 + newFats * 9;

    setLastMealMacros({
      protein: newProtein,
      carbs: newCarbs,
      fats: newFats,
      calories: newCalories,
    });

    setShowMacros(true);

    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();

        const newMeal = {
          name,
          grams: numericGrams,
          protein: newProtein,
          carbs: newCarbs,
          fats: newFats,
          calories: newCalories,
          createdAt: new Date().toISOString(),
        };

        const updatedMeals = [...(userData.meals || []), newMeal];

        const newTotalCalories =
          (userData.totalCaloriesConsumed || 0) + newCalories;

        await updateDoc(userDocRef, {
          meals: updatedMeals,
          totalCaloriesConsumed: newTotalCalories,
        });

        setTotalCaloriesConsumed(newTotalCalories);
        setMealHistory(updatedMeals);
      }
    }

    setMealInput({
      name: "",
      grams: "",
      protein: 0,
      carbs: 0,
      fats: 0,
      calories: 0,
    });
  };

  const handleResetCalories = async () => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        requiredCaloriesPerDay: 0,
        totalCaloriesConsumed: 0,
        meals: [],
      });

      setTotalCaloriesConsumed(0);
      setMealInput({
        name: "",
        grams: "",
        protein: 0,
        carbs: 0,
        fats: 0,
        calories: 0,
      });

      alert("Required calories per day and meals have been reset!");
    }
  };

  return (
    <>
      <ArrowLongLeftIcon
        onClick={() => navigate("/")}
        className="h-8 w-8 text-gray-50 hover:text-gray-300 transition duration-200 fixed left-0 ml-5 mt-5 block md:hidden z-50"
      />
      <section className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-[#1a1a4d] to-[#f0f0f0] px-6 pt-8 dark:from-[#0a0a23] dark:to-[#1a1a4d] text-black dark:text-white">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-center text-gray-800 mb-4 mt-14 dark:text-white">
          Meal & Exercise Planner
        </h2>
        <p className="text-center text-lg md:text-xl text-gray-800 mb-20 dark:text-white">
          Effortlessly track your meals and exercises while staying on top of
          your nutrition goals.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl mx-auto p-4 h-auto">
          <div className="bg-white shadow rounded-xl p-6 flex flex-col justify-between">
            <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
              Add a New Exercise
            </h3>
            <input
              type="text"
              value={exerciseInput}
              onChange={(e) => setExerciseInput(e.target.value)}
              className="w-full h-12 p-3 mb-4 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter exercise name"
            />
            <button
              onClick={addExercise}
              className="w-full bg-[#1a1a4d] text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-600 transition-all"
            >
              Add Exercise
            </button>
          </div>
          <div className="bg-white shadow rounded-xl p-6 flex flex-col justify-between">
            <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
              Add a New Meal
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                value={mealInput.name}
                onChange={handleMealInputChange}
                placeholder="Meal name"
                className="w-full h-12 p-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="grams"
                value={mealInput.grams}
                onChange={handleMealInputChange}
                placeholder="Grams"
                className="w-full h-12 p-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addMeal}
                className="w-full bg-[#D9D9D9] text-black px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-[#1a1a4d] hover:text-white transition-all"
              >
                Add Meal
              </button>
            </div>
          </div>
          <div className="bg-white shadow rounded-xl p-6 flex flex-col justify-between">
            <h4 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
              Total Calories Consumed
            </h4>
            <p className="text-4xl font-extrabold text-green-500 mb-4">
              {totalCaloriesConsumed} kcal
            </p>
            <button
              className="bg-[#1a1a4d] text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-600 transition-all"
              onClick={handleResetCalories}
            >
              Reset Calories
            </button>
          </div>

          <div className="bg-white shadow rounded-xl p-6 md:col-span-2 lg:col-span-3 mt-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Meal History
            </h3>
            <Line data={mealHistoryChartData} />
          </div>
        </div>
        {showMacros && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center relative">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">
                Macronutrient Breakdown
              </h3>
              <p className="text-lg text-gray-700 mb-2">
                <strong>Protein:</strong> {lastMealMacros.protein.toFixed(1)}g
              </p>
              <p className="text-lg text-gray-700 mb-2">
                <strong>Carbs:</strong> {lastMealMacros.carbs.toFixed(1)}g
              </p>
              <p className="text-lg text-gray-700 mb-2">
                <strong>Fats:</strong> {lastMealMacros.fats.toFixed(1)}g
              </p>
              <p className="text-lg text-green-600 font-semibold mb-4">
                <strong>Calories:</strong> {lastMealMacros.calories.toFixed(1)}{" "}
                kcal
              </p>
              <button
                onClick={() => setShowMacros(false)}
                className="mt-4 px-6 py-2 bg-[#1a1a4d] text-white rounded-lg hover:bg-blue-600 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default Meal;
