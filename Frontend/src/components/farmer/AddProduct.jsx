import React, { useState, useRef } from 'react';
import { getAuth } from 'firebase/auth';

const ProductForm = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    category: 'fruits',
    price: 0,
    quantity: 0,
    unit: 'kg',
    location: '',
    isAvailable: true,
    organic: false,
    harvestDate: '',
    expiryDate: ''
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);
  const formRef = useRef(null);
  const auth = getAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    // Convert date inputs to ISO format
    const date = new Date(value);
    setProduct(prev => ({
      ...prev,
      [name]: date.toISOString()
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    // Limit to maximum 5 images
    const availableSlots = 5 - imageFiles.length;
    if (availableSlots <= 0) {
      setMessage('Maximum 5 images allowed. Remove some images before adding more.');
      return;
    }
    
    const newFiles = files.slice(0, availableSlots);

    // Store file objects for form submission
    setImageFiles([...imageFiles, ...newFiles]);

    // Generate previews for the new files
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeImage = (index) => {
    // Remove from files array
    const newImageFiles = [...imageFiles];
    newImageFiles.splice(index, 1);
    setImageFiles(newImageFiles);

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(previews[index]);

    // Remove from previews
    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Get the current user's token
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setMessage('Error: You must be logged in to add a product');
      return;
    }
    
    try {
      // Get the token from Firebase
      const token = await currentUser.getIdToken();
      
      if (!token) {
        setMessage('Error: Unable to authenticate. Please log in again.');
        return;
      }
      
      setLoading(true);
      setMessage('');
      
      // Create FormData object
      const formData = new FormData();
      
      // Add each product field individually with the specified keys
      formData.append('description', product.description);
      formData.append('name', product.name);
      formData.append('category', product.category);
      formData.append('price', product.price);
      formData.append('unit', product.unit);
      formData.append('quantity', product.quantity);
      formData.append('organic', product.organic ? 'yes' : 'no');
      formData.append('harvestDate', product.harvestDate);
      formData.append('expiryDate', product.expiryDate);
      formData.append('location', product.location);
      
      // Add each image file - with 'images' as the key
      imageFiles.forEach((file) => {
        formData.append('images', file);
      });
      
      // Send the form data to the server with the auth token
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/gaupal/farmer/add-product`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Note: Don't set Content-Type here, the browser will set it with the correct boundary for FormData
        },
        body: formData,
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage('Product added successfully!');
        // Reset form
        setProduct({
          name: '',
          description: '',
          category: 'fruits',
          price: 0,
          quantity: 0,
          unit: 'kg',
          location: '',
          isAvailable: true,
          organic: false,
          harvestDate: '',
          expiryDate: ''
        });
        setImageFiles([]);
        setPreviews([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = null;
        }
        if (formRef.current) {
          formRef.current.reset();
        }
      } else {
        setMessage(`Error: ${data.message || 'Failed to add product'}`);
      }
    } catch (error) {
      console.error('Error submitting product:', error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Convert ISO string to YYYY-MM-DD format for input
  const formatDateForInput = (isoString) => {
    if (!isoString) return '';
    return isoString.split('T')[0];
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-green-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-green-800">Add New Product</h2>
      
      {message && (
        <div className={`p-4 mb-4 rounded-md ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} ref={formRef} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-green-700">Product Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={product.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-green-700">Description</label>
              <textarea
                id="description"
                name="description"
                value={product.description}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-green-700">Category</label>
              <select
                id="category"
                name="category"
                value={product.category}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
              >
                <option value="fruits">Fruits</option>
                <option value="vegetables">Vegetables</option>
                <option value="dairy">Dairy</option>
                <option value="grains">Grains</option>
                <option value="meat">Meat</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-green-700">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={product.location}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
              />
            </div>
          </div>
          
          {/* Pricing and Quantity */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-green-700">Price</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                />
              </div>
              
              <div>
                <label htmlFor="unit" className="block text-sm font-medium text-green-700">Unit</label>
                <select
                  id="unit"
                  name="unit"
                  value={product.unit}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                >
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="lb">lb</option>
                  <option value="piece">piece</option>
                  <option value="dozen">dozen</option>
                  <option value="liter">liter</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-green-700">Quantity</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={product.quantity}
                onChange={handleChange}
                min="0"
                className="mt-1 block w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
              />
            </div>
            
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="organic"
                name="organic"
                checked={product.organic}
                onChange={handleChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-green-300 rounded"
              />
              <label htmlFor="organic" className="ml-2 block text-sm text-green-700">Organic</label>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="harvestDate" className="block text-sm font-medium text-green-700">Harvest Date</label>
                <input
                  type="date"
                  id="harvestDate"
                  name="harvestDate"
                  value={formatDateForInput(product.harvestDate)}
                  onChange={handleDateChange}
                  className="mt-1 block w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                />
              </div>
              
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-green-700">Expiry Date</label>
                <input
                  type="date"
                  id="expiryDate"
                  name="expiryDate"
                  value={formatDateForInput(product.expiryDate)}
                  onChange={handleDateChange}
                  className="mt-1 block w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Image Upload - limited to 5 images */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-green-700 mb-2">
              Product Images (Maximum 5)
            </label>
            <div className="flex items-center gap-4">
              <label className={`cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${imageFiles.length >= 5 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'}`}>
                <span>Upload Images</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  ref={fileInputRef}
                  className="hidden"
                  name="images"
                  disabled={imageFiles.length >= 5}
                />
              </label>
              <span className="text-sm text-green-600">
                {imageFiles.length}/5 image(s) selected
              </span>
            </div>
          </div>
          
          {/* Image Previews */}
          {previews.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-green-700 mb-2">Image Previews</h3>
              <div className="grid grid-cols-3 gap-4">
                {previews.map((previewUrl, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200">
                      <img
                        src={previewUrl}
                        alt={`Preview ${index + 1}`}
                        className="h-24 w-24 object-cover object-center"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 focus:outline-none"
                    >
                      ×
                    </button>
                    <p className="mt-1 text-xs text-green-700 truncate">
                      {imageFiles[index]?.name || "Image " + (index + 1)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300"
          >
            {loading ? 'Submitting...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;