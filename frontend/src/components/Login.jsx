import { useState } from "react";
import axios from "axios";

function App() {
  const [email, setEmail] = useState("vipul1@gmail.com");
  const [password, setPassword] = useState("VIPUl@752");

  const handleSubmit = async () => {
    try {
      const data = await axios.post(
        "http://localhost:3000/login",
        {
          emailId: email,
          password: password,
        },
        {
          withCredentials: true,
        }
      );

      console.log(data);
      alert("Logged in successfully");
    } catch (error) {
      console.log(error);
      alert("Error logging in");
    }
  };

  return (
    <div className="h-screen bg-gradient-to-b from-black to-gray-800 flex items-center justify-center p-4">
      <div className="bg-black bg-opacity-70 backdrop-blur-lg rounded-lg shadow-2xl p-8 w-full max-w-md border border-gray-700">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-gray-800 rounded-full shadow-md">
            <img
              src="https://img.icons8.com/ios-glyphs/30/ffffff/login-rounded-right.png"
              alt="Login Icon"
              className="w-8 h-8"
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-white mb-2">
          Sign in with Email
        </h1>
        <p className="text-gray-400 text-center mb-6">
          Welcome Back , Find Your Match Here
        </p>

        {/* Form */}
        <form>
          <div className="space-y-4">
            {/* Email Input */}
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              className="w-full p-3 bg-gray-800 text-white placeholder-gray-400 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />

            {/* Password Input */}
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              className="w-full p-3 bg-gray-800 text-white placeholder-gray-400 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Forgot Password */}
          <div className="text-right mt-2">
            <a href="#" className="text-blue-400 text-sm hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-medium py-3 rounded-lg hover:from-blue-700 hover:to-blue-900 transition duration-300 mt-4 shadow-lg"
          >
            Get Started
          </button>
        </form>

        {/* Or Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-600"></div>
          <div className="mx-4 text-gray-400 text-sm">Or Have a Account</div>
          <div className="flex-grow border-t border-gray-600"></div>
        </div>

        <div className="space-y-4  flex items-center justify-center">
          <p>
            Create a Account ?
            <a href="#" className="text-blue-400 hover:underline">
              {" "}
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
