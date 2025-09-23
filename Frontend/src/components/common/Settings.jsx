import React, { useState } from 'react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    newsletter: false
  });
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('english');
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Form states
  const [profile, setProfile] = useState({
    firstName: 'Rajesh',
    lastName: 'Kumar',
    email: 'rajeshkumar@gmail.com',
    phone: '+91 4567656567',
    location: 'Guntur, Andhra Pradesh, India'
  });
  
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const handleNotificationChange = (type) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurity(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSave = (e) => {
    e.preventDefault();
    // Show success message
    setSaveSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };
  
  return (
    <div className="min-h-screen bg-green-50">
      <div className="container mx-auto p-4 md:p-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-green-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-green-100">Manage your account preferences and settings</p>
          </div>
          
          {/* Success Alert */}
          {saveSuccess && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 mx-6 mt-4 rounded-md">
              <div className="flex items-center">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p>Your settings have been saved successfully!</p>
              </div>
            </div>
          )}
          
          {/* Tab Navigation */}
          <div className="border-b px-6 flex flex-wrap">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-2 md:px-4 font-medium text-sm border-b-2 mr-4 ${activeTab === 'profile' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-green-500'}`}
            >
              Profile
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`py-4 px-2 md:px-4 font-medium text-sm border-b-2 mr-4 ${activeTab === 'security' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-green-500'}`}
            >
              Security
            </button>
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`py-4 px-2 md:px-4 font-medium text-sm border-b-2 mr-4 ${activeTab === 'notifications' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-green-500'}`}
            >
              Notifications
            </button>
            <button 
              onClick={() => setActiveTab('preferences')}
              className={`py-4 px-2 md:px-4 font-medium text-sm border-b-2 ${activeTab === 'preferences' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-green-500'}`}
            >
              Preferences
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div>
                <div className="flex flex-col md:flex-row items-start md:items-center mb-6">
                  <div className="mr-6 mb-4 md:mb-0">
                    <div className="w-24 h-24 rounded-full bg-green-200 flex items-center justify-center relative">
                      <span className="text-3xl text-green-800 font-medium">JD</span>
                      <button className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md hover:bg-green-50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-gray-800">Profile Picture</h2>
                    <p className="text-gray-500 text-sm mt-1">JPG, GIF or PNG. Max size of 800K</p>
                    <div className="mt-2 flex flex-wrap">
                      <button className="bg-green-600 text-white text-sm py-2 px-3 rounded-md mr-2 mb-2 hover:bg-green-700 transition duration-200">
                        Upload new image
                      </button>
                      <button className="bg-white text-gray-700 text-sm py-2 px-3 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-200 mb-2">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
                
                <form onSubmit={handleSave}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={profile.firstName}
                        onChange={handleProfileChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={profile.lastName}
                        onChange={handleProfileChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleProfileChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="text"
                        name="phone"
                        value={profile.phone}
                        onChange={handleProfileChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={profile.location}
                        onChange={handleProfileChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Security Settings */}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-lg font-medium text-gray-800 mb-4">Security Settings</h2>
                <form onSubmit={handleSave}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={security.currentPassword}
                        onChange={handleSecurityChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={security.newPassword}
                        onChange={handleSecurityChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={security.confirmPassword}
                        onChange={handleSecurityChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-md font-medium text-gray-800 mb-3">Two-Factor Authentication</h3>
                    <div className="bg-green-50 border border-green-100 rounded-md p-4 flex justify-between items-center">
                      <div>
                        <p className="text-gray-700 font-medium">Enable two-factor authentication</p>
                        <p className="text-gray-500 text-sm mt-1">Add an extra layer of security to your account</p>
                      </div>
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          id="toggle"
                          className="sr-only"
                        />
                        <div className="block bg-gray-300 w-14 h-8 rounded-full"></div>
                        <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="text-md font-medium text-gray-800 mb-3">Sessions</h3>
                      <div className="bg-white border border-gray-200 rounded-md p-4 mb-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="bg-green-100 rounded-full p-2 mr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-gray-700 font-medium">MacBook Pro</p>
                              <p className="text-gray-500 text-sm">New York, USA · Current Session</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-md p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="bg-green-100 rounded-full p-2 mr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-gray-700 font-medium">iPhone 13</p>
                              <p className="text-gray-500 text-sm">New York, USA · Last active: 2 days ago</p>
                            </div>
                          </div>
                          <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                            Log out
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-lg font-medium text-gray-800 mb-4">Notification Settings</h2>
                <form onSubmit={handleSave}>
                  <div className="space-y-4">
                    <div className="bg-white border border-gray-200 rounded-md p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-gray-700 font-medium">Email Notifications</p>
                          <p className="text-gray-500 text-sm mt-1">Receive updates, alerts, and important information via email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={notifications.email}
                            onChange={() => handleNotificationChange('email')}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                      </div>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-md p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-gray-700 font-medium">Push Notifications</p>
                          <p className="text-gray-500 text-sm mt-1">Get push notifications on your devices</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={notifications.push}
                            onChange={() => handleNotificationChange('push')}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                      </div>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-md p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-gray-700 font-medium">SMS Notifications</p>
                          <p className="text-gray-500 text-sm mt-1">Receive text messages for critical updates</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={notifications.sms}
                            onChange={() => handleNotificationChange('sms')}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                      </div>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-md p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-gray-700 font-medium">Newsletter</p>
                          <p className="text-gray-500 text-sm mt-1">Receive our monthly newsletter with updates and tips</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={notifications.newsletter}
                            onChange={() => handleNotificationChange('newsletter')}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Preferences Settings */}
            {activeTab === 'preferences' && (
              <div>
                <h2 className="text-lg font-medium text-gray-800 mb-4">Display Preferences</h2>
                <form onSubmit={handleSave}>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div 
                          className={`border rounded-md p-3 flex items-center cursor-pointer ${theme === 'light' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
                          onClick={() => setTheme('light')}
                        >
                          <div className="h-8 w-8 rounded-full bg-white border border-gray-200 mr-3 flex-shrink-0"></div>
                          <div>
                            <p className="font-medium text-gray-700">Light</p>
                            <p className="text-xs text-gray-500">Default light theme</p>
                          </div>
                        </div>
                        
                        <div 
                          className={`border rounded-md p-3 flex items-center cursor-pointer ${theme === 'dark' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
                          onClick={() => setTheme('dark')}
                        >
                          <div className="h-8 w-8 rounded-full bg-gray-800 mr-3 flex-shrink-0"></div>
                          <div>
                            <p className="font-medium text-gray-700">Dark</p>
                            <p className="text-xs text-gray-500">Dark mode</p>
                          </div>
                        </div>
                        
                        <div 
                          className={`border rounded-md p-3 flex items-center cursor-pointer ${theme === 'system' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
                          onClick={() => setTheme('system')}
                        >
                          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-gray-100 to-gray-800 mr-3 flex-shrink-0"></div>
                          <div>
                            <p className="font-medium text-gray-700">System</p>
                            <p className="text-xs text-gray-500">Follow system settings</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                      >
                        <option value="english">English</option>
                        <option value="spanish">Spanish</option>
                        <option value="french">French</option>
                        <option value="german">German</option>
                        <option value="chinese">Chinese</option>
                        <option value="japanese">Japanese</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-center">
                          <input type="radio" id="date-mdy" name="dateFormat" className="h-4 w-4 text-green-600 focus:ring-green-500" />
                          <label htmlFor="date-mdy" className="ml-2 text-gray-700">MM/DD/YYYY</label>
                        </div>
                        <div className="flex items-center">
                          <input type="radio" id="date-dmy" name="dateFormat" className="h-4 w-4 text-green-600 focus:ring-green-500" defaultChecked />
                          <label htmlFor="date-dmy" className="ml-2 text-gray-700">DD/MM/YYYY</label>
                        </div>
                        <div className="flex items-center">
                          <input type="radio" id="date-ymd" name="dateFormat" className="h-4 w-4 text-green-600 focus:ring-green-500" />
                          <label htmlFor="date-ymd" className="ml-2 text-gray-700">YYYY/MM/DD</label>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time Format</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-center">
                          <input type="radio" id="time-12" name="timeFormat" className="h-4 w-4 text-green-600 focus:ring-green-500" defaultChecked />
                          <label htmlFor="time-12" className="ml-2 text-gray-700">12-hour (AM/PM)</label>
                        </div>
                        <div className="flex items-center">
                          <input type="radio" id="time-24" name="timeFormat" className="h-4 w-4 text-green-600 focus:ring-green-500" />
                          <label htmlFor="time-24" className="ml-2 text-gray-700">24-hour</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;