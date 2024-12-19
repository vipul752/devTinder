import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { Toaster, toast } from "react-hot-toast";

const EditProfile = ({ user }) => {
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    gender: user.gender || "",
    age: user.age || "",
    photoUrl: user.photoUrl || "",
    about: user.about || "",
    skills: user.skills || []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const dispatch = useDispatch();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.age) newErrors.age = "Age is required";
    if (formData.age < 18) newErrors.age = "Must be 18 or older";
    if (!formData.about.trim()) newErrors.about = "Tell us about yourself";
    if (formData.skills.length === 0) newErrors.skills = "Add at least one skill";
    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setIsDirty(true);
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map(skill => skill.trim()).filter(Boolean);
    setFormData(prev => ({
      ...prev,
      skills
    }));
    setIsDirty(true);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        toast.error("Image must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          photoUrl: reader.result
        }));
        setIsDirty(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await axios.patch(
        `${BASE_URL}/profile/edit`,
        formData,
        { withCredentials: true }
      );

      dispatch(addUser(res.data.data));
      toast.success("Profile updated successfully!", {
        duration: 1700,
        style: {
          background: "black",
          color: "#fff",
        },
      });
      setIsDirty(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong", {
        style: {
          background: "#f44336",
          color: "#fff",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Warn user before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  return (
    <div className="min-h-screen 0 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="bottom-right" reverseOrder={false} />
      
      <div className="max-w-2xl mx-auto backdrop-blur-sm bg-gray-800/50 rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Edit Your Profile
          </h1>
          <p className="mt-2 text-gray-400">Make your profile stand out</p>
          {isDirty && (
            <p className="mt-2 text-yellow-400 text-sm">You have unsaved changes</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Photo Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gray-700 overflow-hidden ring-4 ring-purple-500/30 group-hover:ring-purple-500/50 transition-all">
                {formData.photoUrl ? (
                  <img
                    src={formData.photoUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-full h-full text-gray-400 p-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="2"/>
                    <circle cx="12" cy="7" r="4" strokeWidth="2"/>
                  </svg>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-2 cursor-pointer hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-110">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" strokeWidth="2"/>
                  <circle cx="12" cy="13" r="4" strokeWidth="2"/>
                </svg>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
              </label>
            </div>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-lg bg-gray-700/50 border-2 ${
                  errors.firstName ? 'border-red-500' : 'border-transparent'
                } focus:border-purple-500 focus:ring-2 focus:ring-purple-500 text-white px-4 py-2`}
                placeholder="John"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-lg bg-gray-700/50 border-2 ${
                  errors.lastName ? 'border-red-500' : 'border-transparent'
                } focus:border-purple-500 focus:ring-2 focus:ring-purple-500 text-white px-4 py-2`}
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Age and Gender Fields */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Age *
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-lg bg-gray-700/50 border-2 ${
                  errors.age ? 'border-red-500' : 'border-transparent'
                } focus:border-purple-500 focus:ring-2 focus:ring-purple-500 text-white px-4 py-2`}
                placeholder="25"
              />
              {errors.age && (
                <p className="mt-1 text-sm text-red-500">{errors.age}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Gender *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-lg bg-gray-700/50 border-2 ${
                  errors.gender ? 'border-red-500' : 'border-transparent'
                } focus:border-purple-500 focus:ring-2 focus:ring-purple-500 text-white px-4 py-2`}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <p className="mt-1 text-sm text-red-500">{errors.gender}</p>
              )}
            </div>
          </div>

          {/* About Section */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              About Me *
            </label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleInputChange}
              rows={4}
              className={`mt-1 block w-full rounded-lg bg-gray-700/50 border-2 ${
                errors.about ? 'border-red-500' : 'border-transparent'
              } focus:border-purple-500 focus:ring-2 focus:ring-purple-500 text-white px-4 py-2`}
              placeholder="Tell us about yourself..."
            />
            {errors.about && (
              <p className="mt-1 text-sm text-red-500">{errors.about}</p>
            )}
          </div>

          {/* Skills Section */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Skills * <span className="text-gray-400">(comma-separated)</span>
            </label>
            <input
              type="text"
              value={formData.skills.join(', ')}
              onChange={handleSkillsChange}
              className={`mt-1 block w-full rounded-lg bg-gray-700/50 border-2 ${
                errors.skills ? 'border-red-500' : 'border-transparent'
              } focus:border-purple-500 focus:ring-2 focus:ring-purple-500 text-white px-4 py-2`}
              placeholder="React, Node.js, Tailwind CSS"
            />
            {errors.skills && (
              <p className="mt-1 text-sm text-red-500">{errors.skills}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-500/20 rounded-full text-sm font-medium text-purple-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || (!isDirty && Object.keys(errors).length === 0)}
              className={`px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium
                ${(isSubmitting || (!isDirty && Object.keys(errors).length === 0)) 
                  ? "opacity-50 cursor-not-allowed" 
                  : "hover:from-blue-600 hover:to-purple-600 transform hover:scale-105"}
                transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving Changes
                </div>
              ) : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;