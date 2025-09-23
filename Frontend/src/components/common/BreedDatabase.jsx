import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Filter,
  Eye,
  Edit,
  Database,
  Grid,
  List,
  X,
  Save,
  Upload,
  ArrowRight,
} from "lucide-react";
import axios from "axios";
import { getAuth } from "firebase/auth";
import BreedDetailsModal from "./BreedDetailModal";
import "../../styles/breed-database.css";

const BreedDatabase = () => {
  const [breeds, setBreeds] = useState([]);
  const [filteredBreeds, setFilteredBreeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBreed, setSelectedBreed] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [showAddModal, setShowAddModal] = useState(false);
  const [sortBy, setSortBy] = useState("name"); // 'name', 'recent'

  // Form state for adding new breed
  const [newBreed, setNewBreed] = useState({
    breed: "",
    title: "",
    introduction: {
      content: "",
      image: {
        url: "",
        caption: "",
      },
    },
    headings: [],
  });

  const auth = getAuth();

  // Fetch all breeds
  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        const token = await user.getIdToken();
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/gaupal/article/all-breed`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBreeds(response.data.data);
        setFilteredBreeds(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching breeds:", err);
        setError("Failed to fetch breeds");
        setLoading(false);
      }
    };

    fetchBreeds();
  }, [auth]);

  // Filter and search functionality
  useEffect(() => {
    let filtered = [...breeds];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (breed) =>
          breed.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
          breed.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          breed.introduction.content
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === "name") {
        return a.breed.localeCompare(b.breed);
      }
      return 0; // Default sorting for 'recent'
    });

    setFilteredBreeds(filtered);
  }, [breeds, searchTerm, sortBy]);

  // Handle adding new section to breed
  const addNewSection = () => {
    setNewBreed((prev) => ({
      ...prev,
      headings: [
        ...prev.headings,
        {
          heading: "",
          content: "",
          image: {
            url: "",
            caption: "",
          },
        },
      ],
    }));
  };

  // Handle removing section
  const removeSection = (index) => {
    setNewBreed((prev) => ({
      ...prev,
      headings: prev.headings.filter((_, i) => i !== index),
    }));
  };

  // Handle section update
  const updateSection = (index, field, value) => {
    setNewBreed((prev) => ({
      ...prev,
      headings: prev.headings.map((section, i) =>
        i === index ? { ...section, [field]: value } : section
      ),
    }));
  };

  // Handle image update for sections
  const updateSectionImage = (index, field, value) => {
    setNewBreed((prev) => ({
      ...prev,
      headings: prev.headings.map((section, i) =>
        i === index
          ? { ...section, image: { ...section.image, [field]: value } }
          : section
      ),
    }));
  };

  // Handle form submission
  const handleSubmitBreed = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("User not authenticated");
        return;
      }

      const _token = await user.getIdToken();

      // Send the data to your backend
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/gaupal/article/breed`,
        newBreed,
        {
          headers: {
            Authorization: `Bearer ${_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Add the new breed to local state
      setBreeds((prev) => [...prev, response.data.data]);
      setShowAddModal(false);

      // Reset form
      setNewBreed({
        breed: "",
        title: "",
        introduction: {
          content: "",
          image: {
            url: "",
            caption: "",
          },
        },
        headings: [],
      });

      alert("Breed added successfully!");
    } catch (error) {
      console.error("Error adding breed:", error);
      alert("Failed to add breed");
    }
  };

  // Breed card component
  const BreedCard = ({ breed, viewMode }) => (
    <div
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 ${
        viewMode === "list" ? "flex p-4" : "p-6"
      }`}
    >
      {viewMode === "grid" ? (
        <>
          <div className="h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
            <img
              src={breed.introduction?.image?.url || "/api/placeholder/300/200"}
              alt={breed.breed}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-grow">
            <h3 className="text-xl font-bold text-gray-800 mb-2 capitalize">
              {breed.breed}
            </h3>
            <h4 className="text-lg font-semibold text-green-600 mb-3">
              {breed.title}
            </h4>
            <p className="text-gray-600 mb-4 line-clamp-3">
              {breed.introduction?.content}
            </p>
            <div className="flex justify-between items-center">
              <button
                onClick={() => setSelectedBreed(breed)}
                className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Eye size={16} className="mr-2" />
                View Details
              </button>
              <span className="text-sm text-gray-500">
                {breed.headings?.length || 0} sections
              </span>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="w-24 h-24 bg-gray-200 rounded-lg mr-4 flex-shrink-0 overflow-hidden">
            <img
              src={breed.introduction?.image?.url || "/api/placeholder/100/100"}
              alt={breed.breed}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-gray-800 capitalize">
                  {breed.breed}
                </h3>
                <h4 className="text-md font-semibold text-green-600 mb-2">
                  {breed.title}
                </h4>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {breed.introduction?.content}
                </p>
              </div>
              <button
                onClick={() => setSelectedBreed(breed)}
                className="flex items-center text-green-600 hover:text-green-800 ml-4"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <Database size={32} className="text-green-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Breed Database
                </h1>
                <p className="text-gray-600">
                  Comprehensive information about cow breeds
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Add New Breed
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search breeds by name, title, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="name">Sort by Name</option>
              <option value="recent">Most Recent</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-white shadow-sm"
                    : "hover:bg-gray-200"
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-white shadow-sm"
                    : "hover:bg-gray-200"
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredBreeds.length} of {breeds.length} breeds
          </p>
        </div>

        {/* Breeds Grid/List */}
        <div
          className={`${
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }`}
        >
          {filteredBreeds.map((breed) => (
            <BreedCard key={breed.id} breed={breed} viewMode={viewMode} />
          ))}
        </div>

        {filteredBreeds.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No breeds found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}
      </div>

      {/* Add Breed Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                Add New Breed
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmitBreed} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Breed Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBreed.breed}
                    onChange={(e) =>
                      setNewBreed((prev) => ({
                        ...prev,
                        breed: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBreed.title}
                    onChange={(e) =>
                      setNewBreed((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Introduction Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Introduction
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Introduction Content *
                    </label>
                    <textarea
                      required
                      rows="4"
                      value={newBreed.introduction.content}
                      onChange={(e) =>
                        setNewBreed((prev) => ({
                          ...prev,
                          introduction: {
                            ...prev.introduction,
                            content: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image URL
                      </label>
                      <input
                        type="url"
                        value={newBreed.introduction.image.url}
                        onChange={(e) =>
                          setNewBreed((prev) => ({
                            ...prev,
                            introduction: {
                              ...prev.introduction,
                              image: {
                                ...prev.introduction.image,
                                url: e.target.value,
                              },
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image Caption
                      </label>
                      <input
                        type="text"
                        value={newBreed.introduction.image.caption}
                        onChange={(e) =>
                          setNewBreed((prev) => ({
                            ...prev,
                            introduction: {
                              ...prev.introduction,
                              image: {
                                ...prev.introduction.image,
                                caption: e.target.value,
                              },
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Sections */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Additional Sections
                  </h3>
                  <button
                    type="button"
                    onClick={addNewSection}
                    className="flex items-center text-green-600 hover:text-green-800"
                  >
                    <Plus size={16} className="mr-1" />
                    Add Section
                  </button>
                </div>

                {newBreed.headings.map((section, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 mb-4"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-md font-medium text-gray-700">
                        Section {index + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeSection(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Section Heading
                        </label>
                        <input
                          type="text"
                          value={section.heading}
                          onChange={(e) =>
                            updateSection(index, "heading", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Content
                        </label>
                        <textarea
                          rows="3"
                          value={section.content}
                          onChange={(e) =>
                            updateSection(index, "content", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Image URL
                          </label>
                          <input
                            type="url"
                            value={section.image.url}
                            onChange={(e) =>
                              updateSectionImage(index, "url", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Image Caption
                          </label>
                          <input
                            type="text"
                            value={section.image.caption}
                            onChange={(e) =>
                              updateSectionImage(
                                index,
                                "caption",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Save size={16} className="mr-2" />
                  Save Breed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Breed Details Modal */}
      {selectedBreed && (
        <BreedDetailsModal
          breed={selectedBreed}
          onClose={() => setSelectedBreed(null)}
        />
      )}
    </div>
  );
};

export default BreedDatabase;
