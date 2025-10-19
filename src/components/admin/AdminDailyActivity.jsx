import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';
import { Activity, Trash2, Edit, PlusCircle, Calendar, Building, FileText, Image as ImageIcon, X } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const AdminDailyActivity = () => {
  const [activities, setActivities] = useState([]);
  const [formData, setFormData] = useState({
    date: '',
    department: '',
    title: '',
    description: '',
    image: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_URL}/api/admin/daily-updates`);
      setActivities(res.data.activities || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image') {
      const file = files[0];
      setFormData({ ...formData, image: file });

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const clearForm = () => {
    setFormData({
      date: '',
      department: '',
      title: '',
      description: '',
      image: null
    });
    setImagePreview(null);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key]) data.append(key, formData[key]);
    });

    try {
      if (editingId) {
        await axios.put(`${API_URL}/api/admin/daily-updates/${editingId}`, data);
      } else {
        await axios.post(`${API_URL}/api/admin/daily-updates`, data);
      }
      clearForm();
      fetchActivities();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (activity) => {
    setEditingId(activity._id);
    setFormData({
      date: new Date(activity.date).toISOString().split('T')[0],
      department: activity.department,
      title: activity.title,
      description: activity.description,
      image: null,
    });
    setImagePreview(activity.imageUrl || null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;
    try {
      await axios.delete(`${API_URL}/api/admin/daily-updates/${id}`);
      fetchActivities();
    } catch (err) {
      console.error(err);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: null });
    setImagePreview(null);
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <AdminNavbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div className="flex items-center space-x-3 mb-4 sm:mb-0">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Daily Activities</h2>
                <p className="text-gray-600 mt-1">Manage and track daily municipal activities</p>
              </div>
            </div>
            {editingId && (
                <button
                    onClick={clearForm}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel Edit
                </button>
            )}
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-2 h-6 bg-green-500 rounded-full"></div>
              <h3 className="text-xl font-semibold text-gray-900">
                {editingId ? 'Edit Activity' : 'Add New Activity'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date Input */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <Calendar className="h-4 w-4" />
                    <span>Date</span>
                  </label>
                  <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      required
                  />
                </div>

                {/* Department Input */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <Building className="h-4 w-4" />
                    <span>Department</span>
                  </label>
                  <input
                      type="text"
                      name="department"
                      placeholder="Sanitation, Roads, Water, etc."
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      required
                  />
                </div>
              </div>

              {/* Title Input */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <FileText className="h-4 w-4" />
                  <span>Title</span>
                </label>
                <input
                    type="text"
                    name="title"
                    placeholder="Enter activity title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    required
                />
              </div>

              {/* Description Input */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <FileText className="h-4 w-4" />
                  <span>Description</span>
                </label>
                <textarea
                    name="description"
                    placeholder="Describe the activity in detail..."
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-vertical"
                    required
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <ImageIcon className="h-4 w-4" />
                  <span>Image</span>
                </label>

                {imagePreview ? (
                    <div className="relative inline-block">
                      <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-32 w-32 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors duration-200">
                      <input
                          type="file"
                          name="image"
                          onChange={handleChange}
                          className="hidden"
                          id="image-upload"
                          accept="image/*"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">Click to upload an image</p>
                        <p className="text-sm text-gray-400">PNG, JPG, JPEG up to 5MB</p>
                      </label>
                    </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg py-3 px-4 hover:from-green-600 hover:to-emerald-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium"
              >
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <PlusCircle className="h-5 w-5" />
                )}
                <span>{editingId ? 'Update Activity' : 'Add Activity'}</span>
              </button>
            </form>
          </div>

          {/* Activities Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-6 bg-green-500 rounded-full"></div>
                <h3 className="text-xl font-semibold text-gray-900">Activities List</h3>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm font-medium">
                {activities.length} activities
              </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="flex justify-center items-center space-x-2">
                          <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-gray-600">Loading activities...</span>
                        </div>
                      </td>
                    </tr>
                ) : activities.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="text-gray-400 space-y-2">
                          <Activity className="h-12 w-12 mx-auto" />
                          <p className="text-lg font-medium">No activities found</p>
                          <p className="text-sm">Get started by adding your first activity</p>
                        </div>
                      </td>
                    </tr>
                ) : (
                    activities.map(act => (
                        <tr
                            key={act._id}
                            className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {new Date(act.date).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {act.department}
                        </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                              {act.title}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-600 max-w-md truncate">
                              {act.description}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex justify-center space-x-2">
                              <button
                                  onClick={() => handleEdit(act)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                  title="Edit activity"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                  onClick={() => handleDelete(act._id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                  title="Delete activity"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                    ))
                )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
  );
};

export default AdminDailyActivity;