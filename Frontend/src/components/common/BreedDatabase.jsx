import React, { useState, useEffect } from "react";
import { Plus, Eye, Database, X, Save } from "lucide-react";
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("all"); // 'all', 'cow', 'buffalo'

  // Form state for adding new breed
  const [newBreed, setNewBreed] = useState({
    breed: "",
    title: "",
    category: "cow", // 'cow' or 'buffalo'
    origin: {
      state: "",
      region: "",
      history_summary: "",
    },
    physical_characteristics: {
      size: "",
      horns: "",
      forehead: "",
      color: [],
      coat_type: "",
      distinct_features: [],
    },
    milk_production: {
      average_liters_per_day: 0,
      fat_content_percentage: 0,
    },
    adaptability: {
      climate: [],
      resilience_traits: [],
    },
    images: [],
  });

  const auth = getAuth();

  // Event handlers
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  const handleEntriesPerPageChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing entries per page
  };

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
          breed.origin?.state
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          breed.origin?.region?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((breed) => {
        // Use the category field if available, otherwise fall back to breed name analysis
        if (breed.category) {
          return breed.category === categoryFilter;
        } else {
          // Fallback for existing data without category field
          const breedName = breed.breed.toLowerCase();
          if (categoryFilter === "cow") {
            return (
              breedName.includes("cow") ||
              (!breedName.includes("buffalo") && !breedName.includes("bull"))
            );
          } else if (categoryFilter === "buffalo") {
            return breedName.includes("buffalo") || breedName.includes("bull");
          }
        }
        return true;
      });
    }

    setFilteredBreeds(filtered);
  }, [breeds, searchTerm, categoryFilter]);

  // Handle adding new section to breed
  const addNewImage = () => {
    setNewBreed((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        {
          url: "",
          caption: "",
        },
      ],
    }));
  };

  // Handle removing image
  const removeImage = (index) => {
    setNewBreed((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Handle image update
  const updateImage = (index, field, value) => {
    setNewBreed((prev) => ({
      ...prev,
      images: prev.images.map((image, i) =>
        i === index ? { ...image, [field]: value } : image
      ),
    }));
  };

  // Handle adding new color
  const addColor = () => {
    setNewBreed((prev) => ({
      ...prev,
      physical_characteristics: {
        ...prev.physical_characteristics,
        color: [...prev.physical_characteristics.color, ""],
      },
    }));
  };

  // Handle adding new distinct feature
  const addDistinctFeature = () => {
    setNewBreed((prev) => ({
      ...prev,
      physical_characteristics: {
        ...prev.physical_characteristics,
        distinct_features: [
          ...prev.physical_characteristics.distinct_features,
          "",
        ],
      },
    }));
  };

  // Handle adding climate
  const addClimate = () => {
    setNewBreed((prev) => ({
      ...prev,
      adaptability: {
        ...prev.adaptability,
        climate: [...prev.adaptability.climate, ""],
      },
    }));
  };

  // Handle adding resilience trait
  const addResilienceTrait = () => {
    setNewBreed((prev) => ({
      ...prev,
      adaptability: {
        ...prev.adaptability,
        resilience_traits: [...prev.adaptability.resilience_traits, ""],
      },
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
        category: "cow", // 'cow' or 'buffalo'
        origin: {
          state: "",
          region: "",
          history_summary: "",
        },
        physical_characteristics: {
          size: "",
          horns: "",
          forehead: "",
          color: [],
          coat_type: "",
          distinct_features: [],
        },
        milk_production: {
          average_liters_per_day: 0,
          fat_content_percentage: 0,
        },
        adaptability: {
          climate: [],
          resilience_traits: [],
        },
        images: [],
      });

      alert("Breed added successfully!");
    } catch (error) {
      console.error("Error adding breed:", error);
      alert("Failed to add breed");
    }
  };

  // Table component for displaying breeds
  const BreedTable = () => {
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentBreeds = filteredBreeds.slice(
      indexOfFirstEntry,
      indexOfLastEntry
    );
    const totalPages = Math.ceil(filteredBreeds.length / entriesPerPage);

    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-green-700">
                  S.No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-green-700">
                  Breed Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-green-700">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Origin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Milk Production
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Physical Features
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentBreeds.map((breed, index) => (
                <tr key={breed.id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {indexOfFirstEntry + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 capitalize">
                          {breed.breed}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 line-clamp-2">
                      {breed.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        breed.category === "cow"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {breed.category
                        ? breed.category.charAt(0).toUpperCase() +
                          breed.category.slice(1)
                        : "Cow"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div className="font-medium">{breed.origin?.state}</div>
                      <div className="text-gray-500">
                        {breed.origin?.region}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>
                        {breed.milk_production?.average_liters_per_day || 0}{" "}
                        L/day
                      </div>
                      <div className="text-gray-500">
                        {breed.milk_production?.fat_content_percentage || 0}%
                        fat
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div className="font-medium">
                        {breed.physical_characteristics?.size}
                      </div>
                      <div className="text-gray-500">
                        {breed.physical_characteristics?.color
                          ?.slice(0, 2)
                          .join(", ")}
                        {breed.physical_characteristics?.color?.length > 2 &&
                          "..."}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedBreed(breed)}
                      className="text-green-600 hover:text-green-900 flex items-center"
                    >
                      <Eye size={16} className="mr-1" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">{indexOfFirstEntry + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastEntry, filteredBreeds.length)}
                </span>{" "}
                of <span className="font-medium">{filteredBreeds.length}</span>{" "}
                results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === i + 1
                        ? "z-10 bg-green-50 border-green-500 text-green-600"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    );
  };

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

      {/* Search and Filter Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Show</span>
              <select
                value={entriesPerPage}
                onChange={handleEntriesPerPageChange}
                className="border border-gray-300 rounded px-3 py-1"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-gray-700">entries</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Search:</span>
              <input
                key="search-input"
                id="breed-search"
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                className="border border-gray-300 rounded px-3 py-1 w-64"
                placeholder="Search breeds..."
              />
              <select
                value={categoryFilter}
                onChange={handleCategoryChange}
                className="border border-gray-300 rounded px-3 py-1"
              >
                <option value="all">All Categories</option>
                <option value="cow">Cow</option>
                <option value="buffalo">Buffalo</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table View */}
        <BreedTable />
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={newBreed.category}
                    onChange={(e) =>
                      setNewBreed((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  >
                    <option value="cow">Cow</option>
                    <option value="buffalo">Buffalo</option>
                  </select>
                </div>
              </div>

              {/* Origin Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Origin Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      value={newBreed.origin.state}
                      onChange={(e) =>
                        setNewBreed((prev) => ({
                          ...prev,
                          origin: { ...prev.origin, state: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Region
                    </label>
                    <input
                      type="text"
                      value={newBreed.origin.region}
                      onChange={(e) =>
                        setNewBreed((prev) => ({
                          ...prev,
                          origin: { ...prev.origin, region: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    History Summary
                  </label>
                  <textarea
                    rows="3"
                    value={newBreed.origin.history_summary}
                    onChange={(e) =>
                      setNewBreed((prev) => ({
                        ...prev,
                        origin: {
                          ...prev.origin,
                          history_summary: e.target.value,
                        },
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Physical Characteristics */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Physical Characteristics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size
                    </label>
                    <input
                      type="text"
                      value={newBreed.physical_characteristics.size}
                      onChange={(e) =>
                        setNewBreed((prev) => ({
                          ...prev,
                          physical_characteristics: {
                            ...prev.physical_characteristics,
                            size: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Horns
                    </label>
                    <input
                      type="text"
                      value={newBreed.physical_characteristics.horns}
                      onChange={(e) =>
                        setNewBreed((prev) => ({
                          ...prev,
                          physical_characteristics: {
                            ...prev.physical_characteristics,
                            horns: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Coat Type
                    </label>
                    <input
                      type="text"
                      value={newBreed.physical_characteristics.coat_type}
                      onChange={(e) =>
                        setNewBreed((prev) => ({
                          ...prev,
                          physical_characteristics: {
                            ...prev.physical_characteristics,
                            coat_type: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                {/* Colors */}
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Colors
                    </label>
                    <button
                      type="button"
                      onClick={addColor}
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      + Add Color
                    </button>
                  </div>
                  {newBreed.physical_characteristics.color.map(
                    (color, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          type="text"
                          value={color}
                          onChange={(e) => {
                            const newColors = [
                              ...newBreed.physical_characteristics.color,
                            ];
                            newColors[index] = e.target.value;
                            setNewBreed((prev) => ({
                              ...prev,
                              physical_characteristics: {
                                ...prev.physical_characteristics,
                                color: newColors,
                              },
                            }));
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                          placeholder="Enter color"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newColors =
                              newBreed.physical_characteristics.color.filter(
                                (_, i) => i !== index
                              );
                            setNewBreed((prev) => ({
                              ...prev,
                              physical_characteristics: {
                                ...prev.physical_characteristics,
                                color: newColors,
                              },
                            }));
                          }}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )
                  )}
                </div>

                {/* Distinct Features */}
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Distinct Features
                    </label>
                    <button
                      type="button"
                      onClick={addDistinctFeature}
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      + Add Feature
                    </button>
                  </div>
                  {newBreed.physical_characteristics.distinct_features.map(
                    (feature, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => {
                            const newFeatures = [
                              ...newBreed.physical_characteristics
                                .distinct_features,
                            ];
                            newFeatures[index] = e.target.value;
                            setNewBreed((prev) => ({
                              ...prev,
                              physical_characteristics: {
                                ...prev.physical_characteristics,
                                distinct_features: newFeatures,
                              },
                            }));
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                          placeholder="Enter distinct feature"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newFeatures =
                              newBreed.physical_characteristics.distinct_features.filter(
                                (_, i) => i !== index
                              );
                            setNewBreed((prev) => ({
                              ...prev,
                              physical_characteristics: {
                                ...prev.physical_characteristics,
                                distinct_features: newFeatures,
                              },
                            }));
                          }}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Adaptability */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Adaptability
                </h3>

                {/* Climate */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Climate Adaptability
                    </label>
                    <button
                      type="button"
                      onClick={addClimate}
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      + Add Climate
                    </button>
                  </div>
                  {newBreed.adaptability.climate.map((climate, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={climate}
                        onChange={(e) => {
                          const newClimate = [...newBreed.adaptability.climate];
                          newClimate[index] = e.target.value;
                          setNewBreed((prev) => ({
                            ...prev,
                            adaptability: {
                              ...prev.adaptability,
                              climate: newClimate,
                            },
                          }));
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                        placeholder="Enter climate type"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newClimate =
                            newBreed.adaptability.climate.filter(
                              (_, i) => i !== index
                            );
                          setNewBreed((prev) => ({
                            ...prev,
                            adaptability: {
                              ...prev.adaptability,
                              climate: newClimate,
                            },
                          }));
                        }}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Resilience Traits */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Resilience Traits
                    </label>
                    <button
                      type="button"
                      onClick={addResilienceTrait}
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      + Add Trait
                    </button>
                  </div>
                  {newBreed.adaptability.resilience_traits.map(
                    (trait, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          type="text"
                          value={trait}
                          onChange={(e) => {
                            const newTraits = [
                              ...newBreed.adaptability.resilience_traits,
                            ];
                            newTraits[index] = e.target.value;
                            setNewBreed((prev) => ({
                              ...prev,
                              adaptability: {
                                ...prev.adaptability,
                                resilience_traits: newTraits,
                              },
                            }));
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                          placeholder="Enter resilience trait"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newTraits =
                              newBreed.adaptability.resilience_traits.filter(
                                (_, i) => i !== index
                              );
                            setNewBreed((prev) => ({
                              ...prev,
                              adaptability: {
                                ...prev.adaptability,
                                resilience_traits: newTraits,
                              },
                            }));
                          }}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Milk Production */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Milk Production
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Average Liters per Day
                    </label>
                    <input
                      type="number"
                      value={newBreed.milk_production.average_liters_per_day}
                      onChange={(e) =>
                        setNewBreed((prev) => ({
                          ...prev,
                          milk_production: {
                            ...prev.milk_production,
                            average_liters_per_day: Number(e.target.value),
                          },
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fat Content Percentage
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={newBreed.milk_production.fat_content_percentage}
                      onChange={(e) =>
                        setNewBreed((prev) => ({
                          ...prev,
                          milk_production: {
                            ...prev.milk_production,
                            fat_content_percentage: Number(e.target.value),
                          },
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>

              {/* Images */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Images
                  </h3>
                  <button
                    type="button"
                    onClick={addNewImage}
                    className="flex items-center text-green-600 hover:text-green-800"
                  >
                    <Plus size={16} className="mr-1" />
                    Add Image
                  </button>
                </div>

                {newBreed.images.map((image, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 mb-4"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-md font-medium text-gray-700">
                        Image {index + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Image URL
                        </label>
                        <input
                          type="url"
                          value={image.url}
                          onChange={(e) =>
                            updateImage(index, "url", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Caption
                        </label>
                        <input
                          type="text"
                          value={image.caption}
                          onChange={(e) =>
                            updateImage(index, "caption", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                        />
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
