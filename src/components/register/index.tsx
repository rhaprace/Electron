import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../db/firebaseapp";
import { motion } from "framer-motion";
import Select, { StylesConfig } from "react-select";

const generateExercises = (goal: string) => {
  if (goal === "Weight Loss") {
    return [
      { id: 1, name: "Jump Rope" },
      { id: 2, name: "Burpees" },
      { id: 3, name: "Running" },
    ];
  } else if (goal === "Gain Weight") {
    return [
      { id: 1, name: "Deadlifts" },
      { id: 2, name: "Squats" },
      { id: 3, name: "Bench Press" },
    ];
  } else {
    return [
      { id: 1, name: "Push-Ups" },
      { id: 2, name: "Pull-Ups" },
      { id: 3, name: "Plank" },
    ];
  }
};

type GoalOption = {
  value: string;
  label: string;
};

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [goal, setGoal] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [authing, setAuthing] = useState(false);

  const registerUser = async () => {
    setAuthing(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const exercises = generateExercises(goal);

      await setDoc(doc(db, "users", user.uid), {
        name,
        weight: Number(weight),
        height: Number(height),
        age: Number(age),
        gender,
        goal,
        email,
        exercises,
      });

      navigate("/login", { replace: true });
    } catch (error: any) {
      setError(error.message);
    } finally {
      setAuthing(false);
    }
  };

  const goalOptions: GoalOption[] = [
    { value: "Weight Loss", label: "Weight Loss" },
    { value: "Gain Weight", label: "Gain Weight" },
    { value: "Physically Fit", label: "Physically Fit" },
  ];

  const customStyles: StylesConfig<GoalOption> = {
    control: (base) => ({
      ...base,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderColor: "rgba(255, 255, 255, 0.3)",
      color: "white",
      backdropFilter: "blur(8px)",
      boxShadow: "none",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#1a1a1a",
      color: "white",
    }),
    singleValue: (base) => ({
      ...base,
      color: "white",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#000059" : "#1a1a1a",
      color: "white",
      cursor: "pointer",
    }),
    input: (base) => ({
      ...base,
      color: "white",
    }),
    placeholder: (base) => ({
      ...base,
      color: "rgba(255,255,255,0.7)",
    }),
  };
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#000059] to-[#D9D9D9] flex items-center justify-center px-4 py-10">
      <motion.div
        className="w-full max-w-2xl bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-lg border border-white border-opacity-30 p-8"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-center text-white mb-2">
          Create Account
        </h2>
        <p className="text-md text-center text-gray-200 mb-6">
          Start Your Fitness Journey!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-white text-sm">Name</label>
            <input
              type="text"
              className="w-full py-2 px-3 mt-1 rounded-md bg-transparent border border-gray-400 text-white focus:outline-none focus:border-blue-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-white text-sm">Email</label>
            <input
              type="email"
              className="w-full py-2 px-3 mt-1 rounded-md bg-transparent border border-gray-400 text-white focus:outline-none focus:border-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-white text-sm">Password</label>
            <input
              type="password"
              className="w-full py-2 px-3 mt-1 rounded-md bg-transparent border border-gray-400 text-white focus:outline-none focus:border-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="text-white text-sm">Age</label>
            <input
              type="number"
              className="w-full py-2 px-3 mt-1 rounded-md bg-transparent border border-gray-400 text-white focus:outline-none focus:border-blue-400"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
          <div>
            <label className="text-white text-sm">Weight (kg)</label>
            <input
              type="number"
              className="w-full py-2 px-3 mt-1 rounded-md bg-transparent border border-gray-400 text-white focus:outline-none focus:border-blue-400"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
          <div>
            <label className="text-white text-sm">Height (cm)</label>
            <input
              type="number"
              className="w-full py-2 px-3 mt-1 rounded-md bg-transparent border border-gray-400 text-white focus:outline-none focus:border-blue-400"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="text-white block text-sm mb-2">Gender</label>
          <div className="flex gap-4">
            <label className="text-white">
              <input
                type="radio"
                name="gender"
                value="Male"
                onChange={(e) => setGender(e.target.value)}
                className="mr-1"
              />
              Male
            </label>
            <label className="text-white">
              <input
                type="radio"
                name="gender"
                value="Female"
                onChange={(e) => setGender(e.target.value)}
                className="mr-1"
              />
              Female
            </label>
          </div>
        </div>

        <div className="mt-6">
          <label className="text-white block text-sm mb-2">Fitness Goal</label>
          <Select<GoalOption>
            options={goalOptions}
            styles={customStyles}
            onChange={(selected) => setGoal(selected?.value || "")}
            placeholder="Select your goal"
            className="mb-4"
          />
        </div>

        <motion.button
          className="mt-8 w-full py-3 rounded-md font-semibold bg-[#000059] text-white hover:bg-white hover:text-black transition-all"
          onClick={registerUser}
          disabled={authing}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {authing ? "Registering..." : "Register"}
        </motion.button>

        {error && <div className="text-red-500 text-center mt-4">{error}</div>}

        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/login")}
            className="text-white text-sm"
          >
            Already Registered?{" "}
            <span className="text-[#000059] underline">Log in here</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
