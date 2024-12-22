import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../utils/constant";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, UserPlus, Eye, EyeOff } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signupHandle = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        BASE_URL + "/signup",
        {
          firstName,
          lastName,
          emailId,
          password,
        },
        { withCredentials: true }
      );

      dispatch(addUser(res.data.data));
      toast.success("Signup Successful! Welcome!", {
        duration: 1700,
        style: {
          background: "black",
          color: "#fff",
        },
      });
      navigate("/profile");
    } catch (error) {
      console.error("Signup failed", error);
      toast.error(error?.response?.data || "Something went wrong", {
        style: {
          background: "#f44336",
          color: "#fff",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-b from-black to-gray-800 flex items-center justify-center p-4">
      <Toaster position="bottom-right" reverseOrder={false} />

      <div className="bg-black bg-opacity-70 backdrop-blur-lg rounded-lg shadow-2xl p-8 w-full max-w-md border border-gray-700">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-gray-800 rounded-full shadow-md">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-white mb-2">
          Create Account
        </h1>
        <p className="text-gray-400 text-center mb-6">
          Join us and find your perfect match
        </p>

        {/* Form */}
        <form onSubmit={signupHandle}>
          <div className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-3 pl-10 bg-gray-800 text-white placeholder-gray-400 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <User className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-3 pl-10 bg-gray-800 text-white placeholder-gray-400 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <User className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Email Field */}
            <div className="relative">
              <input
                type="email"
                placeholder="Email"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                className="w-full p-3 pl-10 bg-gray-800 text-white placeholder-gray-400 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
            </div>

            {/* Password Field */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 pl-10 bg-gray-800 text-white placeholder-gray-400 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-medium py-3 rounded-lg hover:from-blue-700 hover:to-blue-900 transition duration-300 mt-6 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Creating Account...
              </span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        {/* Or Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-600"></div>
          <div className="mx-4 text-gray-400 text-sm">
            Already Have an Account?
          </div>
          <div className="flex-grow border-t border-gray-600"></div>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <Link to="/login" className="text-blue-400 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
