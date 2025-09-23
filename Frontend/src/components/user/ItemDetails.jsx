import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductDetail = () => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [filters, setFilters] = useState({
        category: '',
        minPrice: '',
        maxPrice: '',
        organic: false,
        page: 1,
        limit: 5
    });

    const { productId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/gaupal/products/${productId}`);
                setProduct(response.data);

                // Set initial category filter based on product category
                setFilters(prev => ({
                    ...prev,
                    category: response.data.category || ''
                }));

                setLoading(false);
            } catch (error) {
                console.error('Error fetching product details:', error);
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [productId]);

    // Fetch related products
    useEffect(() => {
        const fetchRelatedProducts = async () => {
            if (!product) return;

            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/gaupal/products`, {
                    params: {
                        category: filters.category,
                        minPrice: filters.minPrice,
                        maxPrice: filters.maxPrice,
                        organic: filters.organic,
                        page: filters.page,
                        limit: filters.limit
                    }
                });

                // Filter out the current product from related products
                const filteredProducts = response.data.products.filter(
                    p => p.productId !== productId
                );

                setRelatedProducts(filteredProducts);
            } catch (error) {
                console.error('Error fetching related products:', error);
            }
        };

        fetchRelatedProducts();
    }, [product, filters, productId]);

    if (loading) {
        return <div className="text-center text-green-800 py-8">Loading...</div>;
    }

    if (!product) {
        return <div className="text-center text-red-600 py-8">Product not found</div>;
    }

    // Convert Firestore timestamp to readable date
    const formatDate = (timestamp) => {
        // Check if timestamp is an object with _seconds
        const seconds = timestamp?._seconds || timestamp;
        return new Date(seconds * 1000).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Image carousel navigation
    const handleNextImage = () => {
        if (product.images && product.images.length > 0) {
            setCurrentImageIndex((prev) =>
                (prev + 1) % product.images.length
            );
        }
    };

    const handlePrevImage = () => {
        if (product.images && product.images.length > 0) {
            setCurrentImageIndex((prev) =>
                prev === 0 ? product.images.length - 1 : prev - 1
            );
        }
    };

    // Handle related product click
    const handleRelatedProductClick = (id) => {
        navigate(`/buyer/product/${id}`);
    };

    return (
        <div className="container mx-auto p-4 bg-gray-50">
            <div className="grid md:grid-cols-[3fr,1fr] gap-6">
                {/* Main Product Details */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-green-50 p-4">
                        <h1 className="text-2xl font-bold text-green-800">{product.name}</h1>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 p-6">
                        {/* Image Carousel */}
                        <div className="relative">
                            {product.images && product.images.length > 0 ? (
                                <div className="relative">
                                    {/* Main Image */}
                                    <img
                                        src={product.images[currentImageIndex]}
                                        alt={`${product.name} - ${currentImageIndex + 1}`}
                                        className="w-full h-96 object-cover rounded-lg"
                                    />

                                    {/* Navigation Buttons - Only show if more than one image */}
                                    {product.images.length > 1 && (
                                        <>
                                            <button
                                                onClick={handlePrevImage}
                                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-green-500 text-white p-2 rounded-full"
                                            >
                                                &#10094;
                                            </button>
                                            <button
                                                onClick={handleNextImage}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-green-500 text-white p-2 rounded-full"
                                            >
                                                &#10095;
                                            </button>
                                        </>
                                    )}

                                    {/* Image Indicators */}
                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                        {product.images.map((_, index) => (
                                            <span
                                                key={index}
                                                className={`h-2 w-2 rounded-full cursor-pointer ${index === currentImageIndex ? 'bg-green-600' : 'bg-green-200'
                                                    }`}
                                                onClick={() => setCurrentImageIndex(index)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg">
                                    <span className="text-gray-500">No Image Available</span>
                                </div>
                            )}

                            {/* Thumbnail Gallery - Only show if more than one image */}
                            {product.images && product.images.length > 1 && (
                                <div className="mt-4 flex space-x-2 overflow-x-auto">
                                    {product.images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`${product.name} thumbnail ${index + 1}`}
                                            className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${index === currentImageIndex ? 'border-green-600' : 'border-transparent'
                                                }`}
                                            onClick={() => setCurrentImageIndex(index)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Details */}
                        <div>
                            <div className="mb-4">
                                <h2 className="text-2xl font-bold text-green-700 mb-2">{product.name}</h2>
                                <p className="text-xl font-semibold text-green-600">₹{product.price} / {product.unit}</p>

                                <div className="mt-4">
                                    <h3 className="font-semibold text-gray-700">Product Details:</h3>
                                    <ul className="list-disc list-inside text-gray-600">
                                        <li>Quantity: {product.quantity} {product.unit}</li>
                                        <li>Location: {product.location}</li>
                                        <li>
                                            Type:
                                            <span className={product.organic ? 'text-green-600 ml-2' : 'text-gray-600 ml-2'}>
                                                {product.organic ? 'Organic' : 'Non-Organic'}
                                            </span>
                                        </li>
                                        <li>Harvest Date: {formatDate(product.harvestDate)}</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-4 mt-6">
                                <button className="flex-1 border-2 border-green-500 text-green-700 py-3 rounded-lg hover:bg-green-50 transition">
                                    Add to Cart
                                </button>
                                <button className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition">
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="p-6 bg-gray-50">
                        <h2 className="text-lg font-semibold text-green-700 mb-2">Description</h2>
                        <p className="text-gray-700">{product.description}</p>
                    </div>
                </div>

                {/* Filters and Related Products */}
                <div>
                    {/* <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                        <h2 className="text-lg font-semibold text-green-700 mb-4">Filter Related Products</h2>

                        <div className="space-y-4">
                            <select
                                value={filters.category}
                                onChange={(e) => setFilters(prev => ({
                                    ...prev,
                                    category: e.target.value
                                }))}
                                className="w-full border border-green-300 rounded p-2 focus:outline-none focus:border-green-500"
                            >
                                <option value="">All Categories</option>
                                {['Fruits', 'Vegetables', 'Grains', 'Dairy'].map(cat => (
                                    <option key={cat} value={cat.toLowerCase()}>
                                        {cat}
                                    </option>
                                ))}
                            </select>

                            <div className="flex space-x-2">
                                <input
                                    type="number"
                                    placeholder="Min Price"
                                    value={filters.minPrice}
                                    onChange={(e) => setFilters(prev => ({
                                        ...prev,
                                        minPrice: e.target.value
                                    }))}
                                    className="w-1/2 border border-green-300 rounded p-2 focus:outline-none focus:border-green-500"
                                />
                                <input
                                    type="number"
                                    placeholder="Max Price"
                                    value={filters.maxPrice}
                                    onChange={(e) => setFilters(prev => ({
                                        ...prev,
                                        maxPrice: e.target.value
                                    }))}
                                    className="w-1/2 border border-green-300 rounded p-2 focus:outline-none focus:border-green-500"
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="organic"
                                    checked={filters.organic}
                                    onChange={(e) => setFilters(prev => ({
                                        ...prev,
                                        organic: e.target.checked
                                    }))}
                                    className="mr-2 text-green-600 focus:ring-green-500"
                                />
                                <label htmlFor="organic" className="text-green-800">
                                    Organic Only
                                </label>
                            </div>
                        </div>
                    </div> */}

                    {/* Related Products */}
                    {/* Related Products */}
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <h2 className="text-lg font-semibold text-green-700 mb-4">Related Products</h2>

                        {relatedProducts.length === 0 ? (
                            <p className="text-center text-gray-500">No related products found</p>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto">
                                {relatedProducts.map((relProduct) => (
                                    <div
                                        key={relProduct.productId}
                                        onClick={() => handleRelatedProductClick(relProduct.productId)}
                                        className="bg-white border border-green-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                                    >
                                        {/* Image */}
                                        <div className="h-40 overflow-hidden rounded-t-lg">
                                            {relProduct.images && relProduct.images.length > 0 ? (
                                                <img
                                                    src={relProduct.images[0]}
                                                    alt={relProduct.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                                                    No Image
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Details */}
                                        <div className="p-3">
                                            <h3 className="text-sm font-semibold text-green-700 truncate mb-1">
                                                {relProduct.name}
                                            </h3>
                                            <div className="flex justify-between items-center">
                                                <p className="text-sm text-gray-600">
                                                    ₹{relProduct.price} / {relProduct.unit}
                                                </p>
                                                <span className={`text-xs px-2 py-1 rounded ${relProduct.organic
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {relProduct.organic ? 'Organic' : 'Regular'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;