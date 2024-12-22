import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { addRequest } from "../utils/requestSlice";
import { Link } from "react-router-dom";
import {
  UserCircle,
  Loader2,
  CheckCircle,
  XCircle,
  Code,
  ArrowLeft,
  BadgeInfo,
} from "lucide-react";

const Request = () => {
  const dispatch = useDispatch();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingRequests, setProcessingRequests] = useState({});

  const fetchRequest = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}/user/request/received`, {
        withCredentials: true,
      });
      const requestData = response.data.connectionRequestData;
      dispatch(addRequest(requestData));
      setRequests(requestData);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch requests");
      console.error("Request fetch failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequest = async (requestId, status) => {
    try {
      setProcessingRequests((prev) => ({ ...prev, [requestId]: true }));

      const response = await axios.post(
        `${BASE_URL}/connection/review/${status}/${requestId}`,
        {},
        { withCredentials: true }
      );

      if (response.data.message) {
        // Remove the processed request from the list
        setRequests((prevRequests) =>
          prevRequests.filter((request) => request._id !== requestId)
        );
      }
    } catch (error) {
      console.error(`Failed to ${status} request:`, error);
      const errorMessage =
        error.response?.data?.error || `Failed to ${status} request`;
      // Show error as a toast or alert (you can integrate your preferred notification system)
      alert(errorMessage);
    } finally {
      setProcessingRequests((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  useEffect(() => {
    fetchRequest();
  }, []);

  const RequestCard = ({ request }) => (
    <div className="bg-white rounded-lg  shadow-md hover:shadow-lg transition-all duration-300">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="bg-gray-100 rounded-full p-3">
            <UserCircle className="w-12 h-12 text-gray-600" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">
                  {request.fromUserId.firstName} {request.fromUserId.lastName}
                </h2>
                <p className="text-sm text-gray-500">
                  Age: {request.fromUserId.age}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleRequest(request._id, "accepted")}
                  disabled={processingRequests[request._id]}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full transition-colors ${
                    processingRequests[request._id]
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                >
                  {processingRequests[request._id] ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  Accept
                </button>
                <button
                  onClick={() => handleRequest(request._id, "rejected")}
                  disabled={processingRequests[request._id]}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full transition-colors ${
                    processingRequests[request._id]
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : "bg-red-100 text-red-700 hover:bg-red-200"
                  }`}
                >
                  {processingRequests[request._id] ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  Reject
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-2">
                <BadgeInfo className="w-4 h-4 mt-1 text-gray-600" />
                <p className="text-gray-600">{request.fromUserId.about}</p>
              </div>

              {request.fromUserId.skills?.length > 0 && (
                <div className="flex items-start gap-2">
                  <Code className="w-4 h-4 mt-1 text-gray-600" />
                  <div className="flex flex-wrap gap-2">
                    {request.fromUserId.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-500">
                Requested on: {new Date(request.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!requests.length) {
    return (
      <div className="container h-screen  mx-auto p-4 text-center">
        <div className="max-w-md mx-auto mb-7">
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
            <p>No pending connection requests</p>
          </div>
        </div>
        <Link
          to="/"
          className="absolute justify-between left-[960px] flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200 group bg-black bg-opacity-50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700 hover:border-gray-500"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-200" />
          <span>Go Back</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2 text-center">
        Connection Requests
      </h1>
      <p className="text-gray-600 mb-8 text-center">
        You have {requests.length} pending connection{" "}
        {requests.length === 1 ? "request" : "requests"}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {requests.map((request) => (
          <RequestCard key={request._id} request={request} />
        ))}
      </div>
    </div>
  );
};

export default Request;
