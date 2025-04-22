import React, { useState, useEffect, useRef } from "react";
import { auth, db } from "../../db/firebaseapp";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  PencilSquareIcon,
  CheckIcon,
  XMarkIcon,
  CameraIcon,
  ArrowLongLeftIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import AvatarEditor from "react-avatar-editor";

const EditProfile = () => {
  const [userData, setUserData] = useState<{
    name: string;
    weight: number;
    height: number;
    age: number;
    gender: string;
    goal: string;
  } | null>(null);
  const [editField, setEditField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [scale, setScale] = useState(1);
  const [editorRef, setEditorRef] = useState<AvatarEditor | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data() as typeof userData);
          setProfilePic(userDoc.data()?.photoURL || null);
        }
      }
    };
    fetchUserData();
  }, []);

  const handleEdit = (field: string, value: string) => {
    setEditField(field);
    setTempValue(value);
  };

  const handleSave = async () => {
    if (!userData || !tempValue.trim()) return;
    const user = auth.currentUser;
    if (!user) return;

    const updatedValue = fieldIsNumber(editField!)
      ? parseFloat(tempValue)
      : tempValue;
    const updatedData = { ...userData, [editField!]: updatedValue };

    try {
      const userDocRef = doc(db, "users", user.uid);
      if (editField === "weight") {
        const currentDoc = await getDoc(userDocRef);
        const currentData = currentDoc.data();
        const currentHistory = Array.isArray(currentData?.weightHistory)
          ? currentData.weightHistory
          : [];
        await updateDoc(userDocRef, {
          ...updatedData,
          weightHistory: [...currentHistory, updatedValue],
        });
      } else {
        await updateDoc(userDocRef, updatedData);
      }
      setUserData(updatedData);
      setEditField(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  const fieldIsNumber = (field: string) =>
    ["weight", "height", "age"].includes(field);

  const handleProfilePicClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfilePicUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
  };

  const handleImageUpload = async () => {
    if (!image || !editorRef) return;

    const canvas = editorRef.getImage();
    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("file", blob as Blob);
      formData.append("upload_preset", "athletech_profile_pics");

      try {
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dvxtadqxa/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await res.json();
        if (!data.secure_url) throw new Error("Upload failed");

        const user = auth.currentUser;
        if (!user) return;
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { photoURL: data.secure_url });
        setProfilePic(data.secure_url);

        alert("Profile picture updated!");
      } catch (err) {
        console.error("Failed to upload image:", err);
        alert("Image upload failed.");
      }
    });
  };

  const handleCloseEditor = () => {
    setImage(null);
  };

  if (!userData) {
    return <p className="text-center text-white">Loading profile...</p>;
  }

  return (
    <>
      <ArrowLongLeftIcon
        onClick={() => navigate("/")}
        className="h-8 w-8 text-white transition duration-200 fixed left-0 ml-5 mt-5 block md:hidden z-50"
      />
      <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#000059] to-[#D9D9D9] p-6 dark:from-[#0a0a23] dark:to-[#1a1a4d] text-black dark:text-white">
        <div className="w-full max-w-lg p-6 bg-white/20 backdrop-blur-lg rounded-xl shadow-lg border border-white/30">
          <h2 className="text-3xl font-bold text-white text-center mb-6">
            Edit Profile
          </h2>
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-gray-500 text-sm">
                  No Image
                </div>
              )}
              <CameraIcon
                onClick={handleProfilePicClick}
                className="absolute bottom-0 right-0 h-8 w-8 bg-blue-500 text-white p-1 rounded-full cursor-pointer hover:bg-blue-600 transition-all"
              />
            </div>
            <button
              onClick={handleProfilePicClick}
              className="mt-2 text-sm text-blue-400 hover:underline"
            >
              Change Profile Picture
            </button>
          </div>

          {image && (
            <div className="flex flex-col items-center mt-6">
              <AvatarEditor
                ref={(ref) => setEditorRef(ref)}
                image={image}
                width={200}
                height={200}
                border={50}
                scale={scale}
                borderRadius={100}
                rotate={0}
              />
              <div className="mt-4">
                <button
                  onClick={() => setScale(scale - 0.1)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-all"
                >
                  Zoom Out
                </button>
                <button
                  onClick={() => setScale(scale + 0.1)}
                  className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-all"
                >
                  Zoom In
                </button>
              </div>
              <button
                onClick={handleImageUpload}
                className="mt-4 w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 hover:scale-105 transition-all duration-300"
              >
                Save Profile Picture
              </button>
              <button
                onClick={handleCloseEditor}
                className="mt-4 w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 hover:scale-105 transition-all duration-300"
              >
                Close Editor
              </button>
            </div>
          )}

          {["name", "age", "gender", "goal", "weight", "height"].map(
            (field) => (
              <div
                key={field}
                className="flex justify-between items-center text-white mb-4"
              >
                <span className="capitalize">{field}:</span>
                {editField === field ? (
                  <div className="flex gap-2">
                    {field === "gender" ? (
                      <select
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="p-2 text-black rounded-lg"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    ) : field === "goal" ? (
                      <select
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="p-2 text-black rounded-lg"
                      >
                        <option value="Weight Loss">Weight Loss</option>
                        <option value="Gain Weight">Gain Weight</option>
                        <option value="Maintain">Maintain</option>
                      </select>
                    ) : (
                      <input
                        type={fieldIsNumber(field) ? "number" : "text"}
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="p-2 text-black rounded-lg"
                        autoFocus
                      />
                    )}
                    <CheckIcon
                      onClick={handleSave}
                      className="h-6 w-6 text-green-500 cursor-pointer hover:text-green-600 transition-all"
                    />
                    <XMarkIcon
                      onClick={() => setEditField(null)}
                      className="h-6 w-6 text-red-500 cursor-pointer hover:text-red-600 transition-all"
                    />
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <span>{userData[field as keyof typeof userData]}</span>
                    <PencilSquareIcon
                      onClick={() =>
                        handleEdit(
                          field,
                          userData[
                            field as keyof typeof userData
                          ]?.toString() || ""
                        )
                      }
                      className="h-6 w-6 text-blue-400 cursor-pointer hover:text-blue-500 transition-all"
                    />
                  </div>
                )}
              </div>
            )
          )}

          <button
            onClick={() => alert("All changes saved successfully!")}
            className="mt-6 w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 hover:scale-105 transition-all duration-300"
          >
            Save All Changes
          </button>
        </div>
      </section>

      <input
        type="file"
        accept="image/*"
        onChange={handleProfilePicUpload}
        ref={fileInputRef}
        style={{ display: "none" }}
      />
    </>
  );
};

export default EditProfile;
