import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { auth, db } from "../../db/firebaseapp";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { ArrowLongLeftIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

interface Exercise {
  id: string;
  name: string;
  date: string;
}

interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  date: string;
}

const Progress = () => {
  const [exerciseList, setExerciseList] = useState<Exercise[]>([]);
  const [mealList, setMealList] = useState<Meal[]>([]);
  const [weightHistory, setWeightHistory] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [weight, setWeight] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [age, setAge] = useState<number | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [goal, setGoal] = useState<string | null>(null);
  const [caloriesNeeded, setCaloriesNeeded] = useState("Calculating...");
  const [nutritionNeeds, setNutritionNeeds] = useState("Calculating...");
  const [bmiCategory, setBmiCategory] = useState<string | null>(null);
  const [healthRecommendation, setHealthRecommendation] =
    useState("Calculating...");
  const [totalCalories, setTotalCalories] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const userDocRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userDocRef, (userDoc) => {
      if (userDoc.exists()) {
        const data = userDoc.data();
        setExerciseList(
          Array.isArray(data?.exercises)
            ? data.exercises.map((exercise) => ({
                id: exercise.id,
                name: exercise.name,
                date: exercise.date,
              }))
            : []
        );
        setMealList(Array.isArray(data?.meals) ? data.meals : []);
        setWeightHistory(data?.weightHistory || []);
        setWeight(data.weight || null);
        setHeight(data.height || null);
        setAge(data.age || null);
        setGender(data.gender || null);
        setGoal(data.goal || null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (weight && height && age && gender && goal) {
      calculateCaloriesAndNutrition();
      calculateBMI();
    }
  }, [weight, height, age, gender, goal, totalCalories]);

  useEffect(() => {
    if (mealList.length > 0) {
      const totalCaloriesConsumed = mealList.reduce(
        (acc, meal) => acc + meal.calories,
        0
      );
      setTotalCalories(totalCaloriesConsumed);
    }
  }, [mealList]);

  const calculateCaloriesAndNutrition = useCallback(async () => {
    if (!weight || !height || !age || !gender || !goal) return;

    let BMR: number;
    if (gender === "Male") {
      BMR = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      BMR = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const activityFactor = 1.55;
    const TDEE = BMR * activityFactor;

    let adjustedCalories: number;
    let nutritionRecommendation: string;

    if (goal === "Weight Loss") {
      adjustedCalories = TDEE - 500;
      nutritionRecommendation = "A high-protein, low-carb diet is recommended.";
    } else if (goal === "Gain Weight") {
      adjustedCalories = TDEE + 500;
      nutritionRecommendation =
        "Consume high-calorie meals with protein and healthy fats.";
    } else {
      adjustedCalories = TDEE;
      nutritionRecommendation =
        "A balanced diet with lean protein, complex carbs, and veggies is ideal.";
    }

    const caloriesRemaining = adjustedCalories - totalCalories;

    setCaloriesNeeded(`${Math.round(caloriesRemaining)} kcal remaining`);
    setNutritionNeeds(nutritionRecommendation);

    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        caloriesNeeded: Math.round(caloriesRemaining),
      });
    }
  }, [weight, height, age, gender, goal, totalCalories]);

  const calculateBMI = () => {
    if (!weight || !height) return;

    const heightMeters = height / 100;
    const bmi = weight / (heightMeters * heightMeters);
    let category = "";
    let recommendation = "";

    if (bmi < 18.5) {
      category = "Underweight";
      recommendation =
        "Increase calorie intake with nutritious foods. Strength training is recommended.";
    } else if (bmi >= 18.5 && bmi < 24.9) {
      category = "Normal Weight";
      recommendation = "Maintain a balanced diet and regular exercise.";
    } else if (bmi >= 25 && bmi < 29.9) {
      category = "Overweight";
      recommendation = "Reduce refined carbs and increase physical activity.";
    } else {
      category = "Obese";
      recommendation =
        "Consult a nutritionist for a structured diet plan. Engage in regular low-impact exercises.";
    }

    setBmiCategory(category);
    setHealthRecommendation(recommendation);
  };

  const markAsDone = useCallback(
    async (exerciseId: string) => {
      const user = auth.currentUser;
      if (!user) return;

      const updatedExercises = exerciseList.filter(
        (exercise) => exercise.id !== exerciseId
      );
      setExerciseList(updatedExercises);

      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { exercises: updatedExercises });
    },
    [exerciseList]
  );

  if (loading) {
    return <div className="text-center text-gray-800">Loading...</div>;
  }

  const weightChartData = {
    labels: weightHistory.map((_, index) => `Day ${index + 1}`),
    datasets: [
      {
        label: "Weight Over Time",
        data: weightHistory,
        borderColor: "#4A90E2",
        backgroundColor: "rgba(74, 144, 226, 0.2)",
        fill: true,
      },
    ],
  };

  const chartData = {
    labels: exerciseList.map((exercise) => exercise.name),
    datasets: [
      {
        label: "Pending Exercises",
        data: exerciseList.map(() => 1),
        borderColor: "#4A90E2",
        backgroundColor: "rgba(74, 144, 226, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <>
      <ArrowLongLeftIcon
        onClick={() => navigate("/")}
        className="h-8 w-8 text-gray-50 hover:text-gray-300 transition duration-200 fixed left-0 ml-5 mt-5 block md:hidden z-50"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#000059] to-[#D9D9D9] p-4 sm:p-6 dark:from-[#0a0a23] dark:to-[#1a1a4d] text-black dark:text-black"
      >
        <div className="w-full max-w-screen-xl flex flex-col sm:flex-row gap-6 sm:gap-12 px-4 sm:px-6 py-8">
          <div className="w-full sm:w-1/3 bg-white rounded-xl shadow-lg p-6 sm:p-8 flex flex-col justify-between">
            <h1 className="text-3xl font-bold text-center text-[#000059] mb-6">
              PROGRESS TRACKER
            </h1>

            <div className="text-lg font-semibold space-y-4">
              <div>Weight: {weight ? `${weight} kg` : "Not Available"}</div>
              <div>Height: {height ? `${height} cm` : "Not Available"}</div>
              <div>Age: {age || "Not Available"}</div>
              <div>Goal: {goal || "Not Available"}</div>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Nutrition Needs</h3>
              <p className="text-sm">{nutritionNeeds}</p>
            </div>
            <div className="mt-8 space-y-6">
              <div>
                <h3 className="text-xl font-semibold">BMI</h3>
                <p className="text-sm">{bmiCategory || "Calculating..."}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold">Calories Needed</h3>
                <p className="text-sm">{caloriesNeeded}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold">Health Advice</h3>
                <p className="text-sm">{healthRecommendation}</p>
              </div>
            </div>
          </div>
          <div className="w-full sm:w-1/3 bg-white rounded-xl shadow-lg p-6 sm:p-8 flex flex-col">
            <h3 className="text-xl font-semibold mb-3">Pending Exercises</h3>
            <div className="max-h-72 overflow-y-auto">
              <ul>
                {exerciseList.map((exercise) => (
                  <li
                    key={exercise.id}
                    className="flex justify-between items-center p-4 bg-gray-100 rounded-lg mb-3 hover:bg-gray-200 transition duration-300"
                  >
                    <span className="text-sm">{exercise.name}</span>
                    <button
                      onClick={() => markAsDone(exercise.id)}
                      className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200"
                    >
                      Done
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="w-full sm:w-1/3 flex flex-col gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 flex flex-col justify-between">
              <h3 className="text-xl font-semibold mb-4">Weight Progress</h3>
              <Line data={weightChartData} />
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 flex flex-col justify-between">
              <h3 className="text-xl font-semibold mb-4">Exercise Progress</h3>
              <Line data={chartData} />
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Progress;
