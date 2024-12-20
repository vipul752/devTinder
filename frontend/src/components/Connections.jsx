import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { addConnection } from "../utils/connectionSlice";
import { BASE_URL } from "../utils/constant";
import {
  UserCircle,
  Mail,
  MapPin,
  Code,
  AlertCircle,
  Loader2,
} from "lucide-react";

const Connections = () => {
  const dispatch = useDispatch();
  const [connections, setConnections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConnections = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}/user/connection/accepted`, {
        withCredentials: true,
      });

      const connectionData = response.data.connections;
      dispatch(addConnection(connectionData));
      setConnections(connectionData);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to fetch connections. Please try again later."
      );
      console.error("Failed to fetch connections:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const ConnectionCard = ({ connection }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="bg-gray-100 rounded-full p-3">
            <UserCircle className="w-8 h-8 text-gray-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">
              {connection.firstName} {connection.lastName}
            </h2>
            <div className="space-y-2">
              {connection.age && (
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>Age: {connection.age}</span>
                </div>
              )}
              <div className="flex items-start text-gray-600">
                <Mail className="w-4 h-4 mr-2 mt-1" />
                <p className="flex-1">
                  {connection.about || "No bio available"}
                </p>
              </div>
              {connection.skills?.length > 0 && (
                <div className="flex items-start text-gray-600">
                  <Code className="w-4 h-4 mr-2 mt-1" />
                  <div className="flex flex-wrap gap-2">
                    {connection.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 px-2 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
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
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!connections.length) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="max-w-md mx-auto">
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
            <div className="flex items-center justify-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              <p>
                No connections found. Start connecting with other users to see
                them here!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        My Connections ({connections.length})
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {connections.map((connection) => (
          <ConnectionCard key={connection._id} connection={connection} />
        ))}
      </div>
    </div>
  );
};

export default Connections;
