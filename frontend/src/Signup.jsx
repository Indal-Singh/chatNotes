import React, { useState } from 'react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission locally
    console.log('Form Data:', formData);
    alert('Signup successful! (This is a mock response)');
    // Reset form
    setFormData({
      name: '',
      email: '',
      password: '',
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="brutalism max-w-md w-full p-8">
        <h2 className="text-4xl text-white font-bold text-center mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="text-white text-xl font-semibold">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              required
              value={formData.name}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-white text-xl font-semibold">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              required
              value={formData.email}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-white text-xl font-semibold">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              required
              value={formData.password}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div className="text-center">
            <button type="submit" className="submit-btn">
              Sign Up
            </button>
          </div>
        </form>
        <p className="text-white text-center mt-4 text-lg">
          Already have an account?{' '}
          <a href="/login" className="link">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
