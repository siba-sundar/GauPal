import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Star, Heart, Info, MapPin, BookOpen, Lightbulb } from 'lucide-react';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

import BreedDetailsModal from '../common/BreedDetailModal.jsx';

import ChatbotComponent from '../ChatBot.jsx';
import { MessageCircle, X, Minus } from 'lucide-react';

const UserDashboard = () => {
    const [isChatMinimized, setIsChatMinimized] = useState(true);
    const [isChatClosed, setIsChatClosed] = useState(false);
    const [featuredBreeds, setFeaturedBreeds] = useState([]);
    const [selectedBreed, setSelectedBreed] = useState(null);
    const [trendingProducts, setTrendingProducts] = useState([]);
    const [productFilters, setProductFilters] = useState({
        category: 'Dairy',
        organic: null,
        searchQuery: '' // Added missing searchQuery
    });
    const [topSellers, setTopSellers] = useState([
        { id: 1, name: 'Anand Organic Farm', location: 'Mathura, UP', rating: 4.8, products: 24, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgxB0ZxPF-NmTpt15r5w_x7wK181a51BfOyA&s' },
        { id: 2, name: 'Kamdhenu Farms', location: 'Jaipur, Rajasthan', rating: 4.9, products: 18, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIVMLseNkbKQLr_yhdpntKJc9AyzENQKLmJg&s' },
        { id: 3, name: 'Gau Seva Kendra', location: 'Ahmedabad, Gujarat', rating: 4.7, products: 32, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSYZluWUrXjCXLutBoKJgN0FVXGoQQxfEjeA&s' },
    ]);

    const [articles, setArticles] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const auth = getAuth();
    const navigate = useNavigate();

    // Helper function to safely convert objects to strings
    const safeStringify = (obj) => {
        if (obj === null || obj === undefined) return 'N/A';
        if (typeof obj === 'object') {
            // If it's an object with address or coordinates, try to extract meaningful info
            if (obj.address) return obj.address.toString();
            if (obj.coordinates) return `Lat: ${obj.coordinates.lat}, Lng: ${obj.coordinates.lng}`;
            return JSON.stringify(obj);
        }
        return obj.toString();
    };

    // Sanitize product data to handle specific data structure
    const sanitizeProductData = (product) => {
        return {
            ...product,
            // Convert timestamps to readable dates if needed
            harvestDate: product.harvestDate
                ? new Date(product.harvestDate._seconds * 1000).toLocaleDateString()
                : 'N/A',
            expiryDate: product.expiryDate
                ? new Date(product.expiryDate._seconds * 1000).toLocaleDateString()
                : 'N/A',
            // Ensure images is always an array
            images: product.images && product.images.length > 0
                ? product.images
                : ['/default-product-image.png'], // Add a default image path

            // Safely handle any potential nested objects
            location: safeStringify(product.location),
            address: safeStringify(product.address),
            coordinates: safeStringify(product.coordinates)
        };
    };

    // Fetch Trending Products
    useEffect(() => {
        const fetchTrendingProducts = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    console.error('User not authenticated');
                    setTrendingProducts([]);
                    return;
                }

                const token = await user.getIdToken();

                const response = await axios.get('http://localhost:5000/gaupal/products', {
                    params: {
                        category: productFilters.category,
                        organic: productFilters.organic,
                        page: 1,
                        limit: 4
                    },
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const { products } = response.data;

                // Sanitize products
                const sanitizedProducts = products.map(sanitizeProductData);

                // Apply search filter client-side
                const searchFilteredProducts = sanitizedProducts.filter(product =>
                    product.name.toLowerCase().includes(productFilters.searchQuery.toLowerCase()) ||
                    (product.description && product.description.toLowerCase().includes(productFilters.searchQuery.toLowerCase()))
                );

                setTrendingProducts(searchFilteredProducts);
            } catch (error) {
                console.error('Error fetching trending products:', error);
                setTrendingProducts([]);
                setError('Failed to fetch products');
            }
        };

        fetchTrendingProducts();
    }, [productFilters, auth]);

    // Fetch Articles and Breeds
    useEffect(() => {
        const fetchRandomArticles = async () => {
            try {
                const user = auth.currentUser;

                if (!user) {
                    setError('Error: Unable to authenticate. Please log in again.');
                    setLoading(false);
                    return;
                }

                const token = await user.getIdToken();

                const response = await axios.get('http://localhost:5000/gaupal/article/random/article', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setArticles(response.data.data || []);
            } catch (error) {
                console.error('Error fetching random articles:', error);
                setError('Failed to fetch articles');
            }
        };

        const fetchRandomBreeds = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    console.error('User not authenticated');
                    return;
                }

                const token = await user.getIdToken();

                const response = await axios.get('http://localhost:5000/gaupal/article/random/breed', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setFeaturedBreeds(response.data.data || []);
            } catch (error) {
                console.error('Error fetching random breeds:', error);
            }
        };

        fetchRandomArticles();
        fetchRandomBreeds();
        setLoading(false);
    }, [auth]);

    // Handle product click
    const handleProductClick = (productId) => {
        navigate(`/buyer/product/${productId}`);
    };

    // Handle learn more for breed
    const handleLearnMore = (breed) => {
        setSelectedBreed(breed);
    };

    // If loading, return a loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-green-500"></div>
            </div>
        );
    }

    // If there's an error, display error message
    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-red-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h2>
                    <p className="text-red-500">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }


    const toggleChat = () => {
        setIsChatMinimized(!isChatMinimized);
    };

    const closeChat = () => {
        setIsChatClosed(true);
    };

    const reopenChat = () => {
        setIsChatClosed(false);
        setIsChatMinimized(true);
    };

    if (isChatClosed) {
        return (
            <>
                <UserDashboard />

            </>
        );
    }

    return (
        <div className="relative min-h-screen">
            <div className="min-h-screen bg-gray-50">
                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Hero Section */}
                    <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-xl shadow-md overflow-hidden mb-8">
                        <div className="md:flex">
                            <div className="p-8 md:w-1/2">
                                <h2 className="text-3xl font-bold text-white mb-4">Support Indigenous Cow Breeds</h2>
                                <p className="text-green-100 mb-6">
                                    Discover authentic products from India's indigenous cow breeds. Support local farmers and preserve our heritage.
                                </p>
                                <div className="flex space-x-4">
                                    <button className="bg-white text-green-700 font-medium py-2 px-4 rounded-md hover:bg-green-50">
                                        Shop Now
                                    </button>
                                    <button className="bg-transparent text-white border border-white font-medium py-2 px-4 rounded-md hover:bg-green-600">
                                        Learn More
                                    </button>
                                </div>
                            </div>
                            <div className="md:w-1/2 relative h-64 md:h-auto">
                                <img
                                    src="https://images.pexels.com/photos/7772719/pexels-photo-7772719.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                                    alt="Indigenous Cows"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Category Filters */}
                    <div className="flex overflow-x-auto pb-4 mb-8 space-x-4">
                        <button
                            onClick={() => setProductFilters(prev => ({ ...prev, category: 'Dairy', organic: null }))}
                            className={`${productFilters.category === 'Dairy' && productFilters.organic === null ? 'bg-green-600 text-white' : 'bg-white text-gray-700'} px-4 py-2 rounded-full text-sm font-medium flex-shrink-0 hover:bg-green-50`}
                        >
                            All Products
                        </button>
                        <button
                            onClick={() => setProductFilters(prev => ({ ...prev, organic: true }))}
                            className={`${productFilters.organic === true ? 'bg-green-600 text-white' : 'bg-white text-gray-700'} px-4 py-2 rounded-full text-sm font-medium flex-shrink-0 hover:bg-green-50`}
                        >
                            Organic
                        </button>
                        <button
                            onClick={() => setProductFilters(prev => ({ ...prev, organic: false }))}
                            className={`${productFilters.organic === false ? 'bg-green-600 text-white' : 'bg-white text-gray-700'} px-4 py-2 rounded-full text-sm font-medium flex-shrink-0 hover:bg-green-50`}
                        >
                            Inorganic
                        </button>
                    </div>

                    {/* Trending Products */}
                    <div className="mb-12">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Trending Products</h2>
                            <Link to="/buyer/item-list" className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center">
                                View All <ChevronRight size={16} className="ml-1" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {trendingProducts && trendingProducts.length > 0 ? (
                                trendingProducts.map((product) => (
                                    <div
                                        key={product.productId}
                                        onClick={() => handleProductClick(product.productId)}
                                        className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer"
                                    >
                                        <div className="relative h-48 bg-gray-200">
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute top-2 right-2">
                                                <button className="p-1.5 bg-white rounded-full text-gray-500 hover:text-red-500">
                                                    <Heart size={16} />
                                                </button>
                                            </div>
                                            <div className="absolute bottom-2 left-2 bg-green-600 text-white px-2 py-1 rounded-md text-xs font-medium">
                                                {product.category}
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-medium text-gray-800 mb-1">{product.name}</h3>
                                            <p className="text-gray-500 text-sm mb-2">{product.location}</p>
                                            <div className="flex items-center justify-between">
                                                <p className="font-bold text-green-600">₹{product.price}/{product.unit}</p>
                                                <div className="flex items-center">
                                                    <Star size={14} className="text-yellow-400 fill-current" />
                                                    <span className="text-sm text-gray-600 ml-1">
                                                        {product.organic ? 'Organic' : 'Inorganic'}
                                                    </span>
                                                </div>
                                            </div>
                                            <button className="w-full mt-3 bg-green-50 text-green-600 font-medium py-2 rounded-md hover:bg-green-100 transition-colors duration-300">
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center text-gray-500">
                                    No trending products available
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Featured Breeds & Farm Locations */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                        <div className="lg:col-span-2">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Featured Cow Breeds</h2>
                                <Link to="/buyer/breed" className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center">

                                    View All Breeds <ChevronRight size={16} className="ml-1" />
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {featuredBreeds.map((breed) => (
                                    <div
                                        key={breed.id}
                                        className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                                    >
                                        <div className="h-32 bg-gray-200">
                                            <img
                                                src={breed.introduction.image.url}
                                                alt={breed.breed}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-medium text-gray-800 mb-1 capitalize">{breed.breed}</h3>
                                            <p className="text-gray-500 text-sm mb-2">
                                                {breed.introduction.content.slice(0, 100)}...
                                            </p>
                                            <button
                                                onClick={() => handleLearnMore(breed)}
                                                className="w-full mt-3 bg-green-50 text-green-600 font-medium py-2 rounded-md hover:bg-green-100 transition-colors duration-300 flex items-center justify-center"
                                            >
                                                <Info size={16} className="mr-2" /> Learn More
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Breed Details Modal */}
                        {selectedBreed && (
                            <BreedDetailsModal
                                breed={selectedBreed}
                                onClose={() => setSelectedBreed(null)}
                            />
                        )}

                        {/* Top Sellers */}
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Top Sellers</h2>
                                <button className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center">
                                    View All <ChevronRight size={16} className="ml-1" />
                                </button>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm p-4">
                                {topSellers.map((seller, index) => (
                                    <div key={seller.id} className={`flex items-center ${index !== topSellers.length - 1 ? 'border-b border-gray-100 pb-4 mb-4' : ''}`}>
                                        <img src={seller.image} alt={seller.name} className="w-12 h-12 rounded-full mr-4" />
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-800">{seller.name}</h3>
                                            <div className="flex items-center text-sm text-gray-500 mb-1">
                                                <MapPin size={14} className="mr-1" />
                                                {seller.location}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <Star size={14} className="text-yellow-400 fill-current" />
                                                    <span className="text-sm text-gray-600 ml-1">{seller.rating}</span>
                                                </div>
                                                <span className="text-sm text-gray-500">{seller.products} products</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button className="w-full mt-4 bg-green-50 text-green-600 font-medium py-2 rounded-md hover:bg-green-100 transition-colors duration-300">
                                    Become a Seller
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Knowledge Center */}
                    <div className="mb-12">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Knowledge Center</h2>
                            <button className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center">
                                View All Articles <ChevronRight size={16} className="ml-1" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {articles.map((article) => (
                                <div key={article.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col md:flex-row">
                                    <div className="md:w-1/3 h-48 md:h-auto bg-gray-200">
                                        <img src={article.introduction.image.url} alt={article.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="p-4 md:w-2/3">
                                        <h3 className="font-medium text-gray-800 mb-2">{article.title}</h3>
                                        <p className="text-gray-600 text-sm mb-4">{article.summary}</p>
                                        <Link
                                            to={`/article/${article.slug}`}
                                            className="text-green-600 font-medium text-sm hover:text-green-700 flex items-center"
                                        >
                                            Read More <ChevronRight size={16} className="ml-1" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Breed Identification Feature */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-12">
                        <div className="md:flex">
                            <div className="md:w-1/2 p-8">
                                <div className="flex items-center mb-4">
                                    <h2 className="text-2xl font-bold text-gray-800">Breed Identification</h2>
                                </div>
                                <p className="text-gray-600 mb-6">
                                    Upload a photo of any cow and our AI will identify the breed, provide details about its characteristics, and suggest matching products.
                                </p>
                                <button className="bg-green-600 text-white font-medium py-2 px-6 rounded-md hover:bg-green-700 transition-colors duration-300">
                                    Try Now
                                </button>
                            </div>
                            <div className="md:w-1/2 relative h-64 md:h-auto">
                                <img src="https://images.pexels.com/photos/4547431/pexels-photo-4547431.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Cow Breed Identification" className="absolute inset-0 w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>

                    {/* Learn About Cows */}
                    <div className="bg-green-50 rounded-lg p-8 mb-12">
                        <div className="flex items-center mb-4">
                            <Lightbulb size={24} className="text-green-600 mr-2" />
                            <h2 className="text-2xl font-bold text-gray-800">Learn About Indigenous Cows</h2>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Discover the rich heritage of India's indigenous cow breeds, their unique characteristics, and the benefits of their products.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-white rounded-lg p-4 flex items-center">
                                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                                    <BookOpen size={24} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-800">Breed Encyclopedia</h3>
                                    <p className="text-gray-500 text-sm">32 Indigenous Breeds</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg p-4 flex items-center">
                                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                                    <Star size={24} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-800">Usage & Benefits</h3>
                                    <p className="text-gray-500 text-sm">Comprehensive Guide</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg p-4 flex items-center">
                                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                                    <Info size={24} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-800">Cow Care Tips</h3>
                                    <p className="text-gray-500 text-sm">Expert Advice</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-white border-t border-gray-200 mt-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div>
                                <div className="flex items-center mb-4">
                                    <span className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold mr-3">
                                        G
                                    </span>
                                    <h3 className="font-bold text-gray-800">GauShala Marketplace</h3>
                                </div>
                                <p className="text-gray-600 text-sm mb-4">
                                    Supporting indigenous cow breeds and local farmers through sustainable commerce.
                                </p>
                                <div className="flex space-x-4">
                                    <a href="#" className="text-gray-400 hover:text-gray-500">
                                        <span className="sr-only">Facebook</span>
                                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                        </svg>
                                    </a>
                                    <a href="#" className="text-gray-400 hover:text-gray-500">
                                        <span className="sr-only">Instagram</span>
                                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                                        </svg>
                                    </a>
                                    <a href="#" className="text-gray-400 hover:text-gray-500">
                                        <span className="sr-only">Twitter</span>
                                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 mb-4">Quick Links</h3>
                                <ul className="space-y-2">
                                    <li><a href="#" className="text-gray-600 hover:text-green-600">Home</a></li>
                                    <li><a href="#" className="text-gray-600 hover:text-green-600">Shop</a></li>
                                    <li><a href="#" className="text-gray-600 hover:text-green-600">Cow Breeds</a></li>
                                    <li><a href="#" className="text-gray-600 hover:text-green-600">Sellers</a></li>
                                    <li><a href="#" className="text-gray-600 hover:text-green-600">About Us</a></li>
                                    <li><a href="#" className="text-gray-600 hover:text-green-600">Contact</a></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 mb-4">Newsletter</h3>
                                <p className="text-gray-600 text-sm mb-4">
                                    Subscribe to our newsletter for updates on new products and indigenous cow conservation efforts.
                                </p>
                                <form className="flex">
                                    <input
                                        type="email"
                                        placeholder="Your email"
                                        className="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent flex-1"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-green-600 text-white px-4 py-2 rounded-r-md hover:bg-green-700"
                                    >
                                        Subscribe
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
                            <p className="text-gray-500 text-sm">
                                © 2025 GauShala Marketplace. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Chatbot Widget */}
            <div className="fixed bottom-4 right-4 z-50 ">
                {isChatMinimized ? (
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={toggleChat}
                            className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors flex items-center"
                        >
                            <MessageCircle size={24} className="mr-2" /> GauGuru Assistant
                        </button>

                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-xl border border-gray-200">
                        <div
                            className="bg-green-500 text-white p-3 rounded-t-lg flex justify-between items-center"
                        >
                            <span className="font-semibold">Customer Support</span>
                            <div className="flex space-x-2">
                                <button
                                    onClick={toggleChat}
                                    className="hover:bg-green-600 p-1 rounded"
                                >
                                    <Minus size={20} />
                                </button>
                                <button
                                    onClick={closeChat}
                                    className="hover:bg-red-600 p-1 rounded"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                        <div className="h-[80vh]">
                            <ChatbotComponent />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;