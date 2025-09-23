import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getAuth } from 'firebase/auth';

const FarmerProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const auth = getAuth();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const user = auth.currentUser;
                
                if (!user) {
                    setError('Error: Unable to authenticate. Please log in again.');
                    setLoading(false);
                    return;
                }
                
                const token = await user.getIdToken();

                const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/gaupal/farmer/farmer-products`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setProducts(response.data.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products. Please try again later.');
                setLoading(false);
                toast.error('Failed to load products');
            }
        };

        fetchProducts();
    }, []);

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const user = auth.currentUser;
                
                if (!user) {
                    toast.error('Authentication error. Please log in again.');
                    return;
                }
                
                const token = await user.getIdToken();

                await axios.delete(`${import.meta.env.VITE_SERVER_URL}/gaupal/farmer/${productId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                // Remove the deleted product from state
                setProducts(products.filter(product => product.productId !== productId));
                toast.success('Product deleted successfully');
            } catch (err) {
                console.error('Error deleting product:', err);
                toast.error('Failed to delete product');
            }
        }
    };

    if (loading) return <div className="text-center p-5">Loading...</div>;
    if (error) return <div className="text-center p-5 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-4 bg-white min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-green-800">My Products</h1>
                <Link
                    to="/farmer/add-product"
                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                >
                    Add New Product
                </Link>
            </div>

            {products.length === 0 ? (
                <div className="text-center p-10 bg-green-50 rounded-lg border border-green-100">
                    <p className="text-lg text-gray-600">You haven't added any products yet.</p>
                    <Link
                        to="/farmer/add-product"
                        className="inline-block mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                    >
                        Add Your First Product
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                        <div key={product.productId} className="border border-green-100 rounded-lg overflow-hidden shadow-md bg-white">
                            <div className="h-48 overflow-hidden">
                                {product.images && product.images.length > 0 ? (
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-green-50 flex items-center justify-center">
                                        <span className="text-gray-500">No image</span>
                                    </div>
                                )}
                            </div>

                            <div className="p-4">
                                <h2 className="text-xl font-semibold mb-2 text-green-800">{product.name}</h2>
                                <p className="text-gray-700 mb-2">Price: <span className="font-medium text-green-700">₹{product.price}</span></p>
                                <p className="text-gray-700 mb-2">Quantity: {product.quantity} {product.unit}</p>
                                <p className="text-gray-700 mb-2">Category: {product.category}</p>
                                <p className="text-gray-700 mb-4">Status:
                                    <span className={`ml-1 ${product.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                                        {product.isAvailable ? 'Available' : 'Not Available'}
                                    </span>
                                </p>

                                <div className="flex justify-between mt-4">
                                    <Link
                                        to={`/farmer/product/${product.productId}`}
                                        className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded"
                                    >
                                        View Details
                                    </Link>
                                    <div className="flex space-x-2">
                                        <Link
                                            to={`/farmer/edit-product/${product.productId}`}
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product.productId)}
                                            className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FarmerProductList;