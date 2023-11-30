// pages/proceed.js
"use client"
import { useState } from 'react';
import Header from '@/components/Header';

const ProceedPage = () => {
  const [quantity, setQuantity] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    try {
      // Simple validation: Ensure both quantity and shippingAddress are provided
      if (!quantity || !shippingAddress) {
        setError('Please fill out all fields.');
        return;
      }

      // Assume you have an API endpoint for placing an order
      const orderData = { quantity, shippingAddress };
      const response = await fetch('/api/proceedorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      // Handle different HTTP status codes
      if (response.ok) {
        // Order placement was successful
        setSuccessMessage('Order placed successfully!');
        // You may want to redirect after a delay or based on user interaction
        setTimeout(() => {
          router.push('/confirmation');
        }, 2000);
      } else if (response.status === 400) {
        // Bad request, handle validation errors
        const data = await response.json();
        setError(data.message);
      } else {
        // Handle other errors
        setError('An error occurred during order placement.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div> <Header />
    <div className="flex flex-col items-center justify-center h-screen">
     
      <div className="bg-white p-8 rounded shadow-md w-96 ">
        <h2 className="text-2xl font-bold mb-4  ">Proceed Order</h2>

        {successMessage && (
          <div className="text-green-500 mb-4">{successMessage}</div>
        )}

        <form onSubmit={handleSubmitOrder}>
          <div className="mb-4">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
              Quantity:
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              className="mt-1 p-2 w-full border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700">
              Shipping Address:
            </label>
            <textarea
              id="shippingAddress"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              required
              className="mt-1 p-2 w-full border rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Place Order
          </button>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div></div>
  );
};

export default ProceedPage;
