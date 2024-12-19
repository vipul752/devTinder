import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { addFeed } from "../utils/feedSlice";
import { BASE_URL } from "../utils/constant";

const Feed = () => {
  const feed = useSelector((state) => state.feed);
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [slideDirection, setSlideDirection] = useState("");
  const [error, setError] = useState(null);

  const getFeed = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(BASE_URL + "/feed?page=1&limit=10", {
        withCredentials: true,
      });
      dispatch(addFeed(response.data.data));
    } catch (error) {
      setError("Failed to load profiles. Please try again later.");
      console.error("Failed to fetch feed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  const handleAction = (action) => {
    setSlideDirection(action === "Interested" ? "right" : "left");

    setTimeout(() => {
      if (currentIndex < feed.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
      setSlideDirection("");
    }, 300);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-32 h-32 bg-gray-700 rounded-full"></div>
          <div className="h-4 w-48 bg-gray-700 rounded"></div>
          <div className="h-4 w-32 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="text-center p-8 bg-red-500/10 rounded-lg max-w-md">
          <svg
            className="w-16 h-16 mx-auto text-red-500 mb-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path d="M12 8v4m0 4h.01" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <p className="text-red-200">{error}</p>
          <button
            onClick={getFeed}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  text-white p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
          Find Your Match
        </h1>

        {Array.isArray(feed) &&
        feed.length > 0 &&
        currentIndex < feed.length ? (
          <div
            className={`transform transition-all duration-300 ${
              slideDirection === "left"
                ? "-translate-x-full opacity-0"
                : slideDirection === "right"
                ? "translate-x-full opacity-0"
                : "translate-x-0"
            }`}
          >
            <div className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/30 z-10" />

              <img
                src={feed[currentIndex].photoUrl}
                alt={`${feed[currentIndex].firstName} ${feed[currentIndex].lastName}`}
                className="w-full h-96 object-cover"
              />

              <div className="absolute bottom-0 left-0 right-0 z-20 p-6 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                <h2 className="text-3xl font-bold mb-2">
                  {feed[currentIndex].firstName} {feed[currentIndex].lastName}
                </h2>

                <div className="flex items-center gap-2 text-gray-300 mb-3">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                      strokeWidth="2"
                    />
                    <circle cx="12" cy="7" r="4" strokeWidth="2" />
                  </svg>
                  <span className="capitalize">
                    {feed[currentIndex].gender}
                  </span>
                </div>

                <p className="text-gray-300 mb-4 line-clamp-2">
                  {feed[currentIndex].about}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {feed[currentIndex].skills.length > 0 ? (
                    feed[currentIndex].skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gradient-to-r from-pink-500/80 to-purple-500/80 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400">No skills listed</span>
                  )}
                </div>

                <div className="flex justify-center gap-4 mt-6">
                  <button
                    onClick={() => handleAction("Ignore")}
                    className="flex-1 bg-red-500/80 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-medium backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-lg"
                  >
                    Pass
                  </button>
                  <button
                    onClick={() => handleAction("Interested")}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg"
                  >
                    Connect
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center text-gray-400">
              <p>{feed.length - currentIndex} more profiles</p>
            </div>
          </div>
        ) : (
          <div className="text-center p-8 bg-white/5 rounded-2xl backdrop-blur-sm">
            <svg
              className="w-24 h-24 mx-auto text-gray-600 mb-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                strokeWidth="2"
              />
              <circle cx="9" cy="7" r="4" strokeWidth="2" />
              <path
                d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
                strokeWidth="2"
              />
            </svg>
            <p className="text-xl text-gray-300">No more profiles to show</p>
            <button
              onClick={getFeed}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-colors"
            >
              Refresh Profiles
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
