import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const auth = getAuth();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/gaupal/farmer/${productId}`
        );

        setProduct(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Failed to load product details. Please try again later.");
        setLoading(false);
        toast.error("Failed to load product details");
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const user = auth.currentUser;

        if (!user) {
          toast.error("Authentication error. Please log in again.");
          return;
        }

        const token = await user.getIdToken();

        await axios.delete(`http://localhost:5001/gaupal/farmer/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success("Product deleted successfully");
        navigate("/farmer/products");
      } catch (err) {
        console.error("Error deleting product:", err);
        toast.error("Failed to delete product");
      }
    }
  };

  const toggleAvailability = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        toast.error("Authentication error. Please log in again.");
        return;
      }

      const token = await user.getIdToken();

      await axios.put(
        `http://localhost:5001/gaupal/products/${productId}`,
        { isAvailable: !product.isAvailable },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProduct({
        ...product,
        isAvailable: !product.isAvailable,
      });

      toast.success(
        `Product marked as ${
          !product.isAvailable ? "available" : "unavailable"
        }`
      );
    } catch (err) {
      console.error("Error updating product availability:", err);
      toast.error("Failed to update product availability");
    }
  };

  // Format date function
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  if (loading) return <div className="text-center p-5">Loading...</div>;
  if (error) return <div className="text-center p-5 text-red-500">{error}</div>;
  if (!product) return <div className="text-center p-5">Product not found</div>;

  return (
    <div className="container mx-auto p-4 bg-white min-h-screen">
      <div className="mb-4">
        <Link
          to="/farmer/products"
          className="text-green-600 hover:text-green-800 flex items-center font-medium"
        >
          ← Back to Products
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-green-100">
        <div className="md:flex">
          {/* Product Images */}
          <div className="md:w-1/2 p-4">
            <div className="mb-4 h-80 overflow-hidden rounded-lg border border-green-200">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-500">No image</span>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`h-16 w-16 cursor-pointer border-2 rounded-md overflow-hidden ${
                      activeImage === index
                        ? "border-green-500"
                        : "border-green-200"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="md:w-1/2 p-6">
            <h1 className="text-3xl font-bold mb-4 text-green-800">
              {product.name}
            </h1>

            <div className="mb-6">
              <p className="text-2xl font-semibold text-green-700 mb-2">
                ₹{product.price} / {product.unit}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Available Quantity:</span>{" "}
                {product.quantity} {product.unit}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Category:</span>{" "}
                {product.category}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Location:</span>{" "}
                {product.location}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Harvest Date:</span>{" "}
                {formatDate(product.harvestDate)}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Expiry Date:</span>{" "}
                {formatDate(product.expiryDate)}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Organic:</span>{" "}
                {product.organic ? "Yes" : "No"}
              </p>
              <p className="text-gray-600 mb-4">
                <span className="font-semibold">Status:</span>
                <span
                  className={`ml-1 ${
                    product.isAvailable ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.isAvailable ? "Available" : "Not Available"}
                </span>
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2 text-green-700">
                Description
              </h2>
              <p className="text-gray-700">
                {product.description || "No description available"}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to={`/farmer/edit-product/${productId}`}
                className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded"
              >
                Edit Product
              </Link>
              <button
                onClick={toggleAvailability}
                className={`py-2 px-4 rounded ${
                  product.isAvailable
                    ? "bg-gray-500 hover:bg-gray-600"
                    : "bg-green-600 hover:bg-green-700"
                } text-white`}
              >
                Mark as {product.isAvailable ? "Unavailable" : "Available"}
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
