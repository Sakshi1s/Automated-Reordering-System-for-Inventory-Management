// Import necessary modules and components
"use client";
import Link from 'next/link';

import Header from '@/components/Header';
import { useState, useEffect } from 'react';

export default function Home() {

  const [calculateInputs, setCalculateInputs] = useState({
    targetBrand: '',
    salesDate: '',
    salesQuantity: 0,
    leadTime: 0,
    description: '',
  });
  const handleCalculateInputChange = (e) => {
    setCalculateInputs({
      ...calculateInputs,
      [e.target.name]: e.target.value,
    });
  };

  const handleCalculateReorder = async () => {
    // Perform the reorder calculation based on the input values
    // You can use calculateInputs.targetBrand, calculateInputs.salesDate, etc.
    // Implement your logic here
    alert('Reorder calculation logic goes here');

    // Assuming you have calculated values in some variables (e.g., calculatedValue)
    const calculatedValue =23  // Replace this with your actual calculated value
    // Navigate to the proceed page with the calculated value
    router.push({
      pathname: '/proceed',
      query: { calculatedValue },
    });
  };

  const [productForm, setProductForm] = useState({});
  const [products, setProducts] = useState([]);
  const [alert, setAlert] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [dropdown, setDropdown] = useState([]);
  const [orderQuantity, setOrderQuantity] = useState(0);
  const [isOrderModalOpen, setOrderModalOpen] = useState(false);
  const [reorderProduct, setReorderProduct] = useState(null);

  useEffect(() => {
    // Fetch products on load
    const fetchProducts = async () => {
      const response = await fetch('/api/product');
      const rjson = await response.json();
      setProducts(rjson.products);
    };
    fetchProducts();
  }, []);

  const buttonAction = async (action, slug, initialQuantity) => {
    // Immediately change the quantity of the product with the given slug in Products
    let index = products.findIndex((item) => item.slug == slug);
    let newProducts = JSON.parse(JSON.stringify(products));
    if (action == 'plus') {
      newProducts[index].quantity = parseInt(initialQuantity) + 1;
    } else {
      newProducts[index].quantity = parseInt(initialQuantity) - 1;
    }
    setProducts(newProducts);

    // Immediately change the quantity of the product with the given slug in Dropdown
    let indexDrop = dropdown.findIndex((item) => item.slug == slug);
    let newDropdown = JSON.parse(JSON.stringify(dropdown));
    if (action == 'plus') {
      newDropdown[indexDrop].quantity = parseInt(initialQuantity) + 1;
    } else {
      newDropdown[indexDrop].quantity = parseInt(initialQuantity) - 1;
    }
    setDropdown(newDropdown);

    setLoadingAction(true);
    const response = await fetch('/api/action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, slug, initialQuantity }),
    });
    let r = await response.json();
    setLoadingAction(false);
  };

  const addProduct = async (e) => {
    try {
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productForm),
      });

      if (response.ok) {
        // Product added successfully
        setAlert('Your Product has been added!');
        setProductForm({});
      } else {
        // Handle error case
        console.error('Error adding product');
      }
    } catch (error) {
      console.error('Error:', error);
    }
    // Fetch all the products again to sync back
    const response = await fetch('/api/product');
    let rjson = await response.json();
    setProducts(rjson.products);
    e.preventDefault();
  };

  const handleChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const onDropdownEdit = async (e) => {
    let value = e.target.value;
    setQuery(value);
    if (value.length > 3) {
      setLoading(true);
      setDropdown([]);
      const response = await fetch('/api/serach?query=' + query);
      let rjson = await response.json();
      setDropdown(rjson.products);
      setLoading(false);
    } else {
      setDropdown([]);
    }
  };

  const handlePurchaseOrder = (product) => {
    setReorderProduct(product);
    setOrderModalOpen(true);
  };

  const closeOrderModal = () => {
    setOrderModalOpen(false);
    setOrderQuantity(0);
  };

  const placeOrder = async () => {
    if (reorderProduct) {
      try {
        const response = await fetch('/api/place-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            slug: reorderProduct.slug,
            quantity: orderQuantity,
          }),
        });

        if (response.ok) {
          // Order placed successfully
          setAlert(`Order for ${reorderProduct.slug} placed successfully.`);
          closeOrderModal();
          // Fetch updated product data
          const response = await fetch('/api/product');
          const rjson = await response.json();
          setProducts(rjson.products);
        } else {
          console.error('Error placing order');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto my-8">
        <div className="text-green-800 text-center">{alert}</div>
        <h1 className="text-3xl font-semibold mb-6">Search a Product</h1>
        <div className="flex mb-2">
          <input
            onChange={onDropdownEdit}
            type="text"
            placeholder="Enter a product name"
            className="flex-1 border border-gray-300 px-4 py-2 rounded-l-md"
          />
          <select className="border border-gray-300 px-4 py-2 rounded-r-md">
            <option value="">All</option>
            <option value="category1">Category 1</option>
            <option value="category2">Category 2</option>
            {/* Add more options as needed */}
          </select>
        </div>
        {loading && (
          <div className="flex justify-center items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 50 50"
              className="w-16 h-16 text-blue-500 animate-spin"
            >
              <circle
                cx="25"
                cy="25"
                r="12"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray="60, 75"
                transform="rotate(90 25 25)"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 25 25"
                  to="360 25 25"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
          </div>
        )}
        <div className="dropcontainer absolute w-[72vw] border-1 bg-purple-100 rounded-md">
          {dropdown.map((item) => {
            const isBelowReorderPoint = item.quantity <= item.reorder;
            return (
              <div key={item.slug} className="container flex justify-between p-2 my-1 border-b-2">
                <span className={`slug ${isBelowReorderPoint ? 'text-red-500' : ''}`}>
                  {item.slug} ({item.quantity} available for ₹{item.price})
                  {isBelowReorderPoint && ' - Stock is low!'}
                </span>
                <div className="mx-5">
                  <button
                    onClick={() => {
                      buttonAction('minus', item.slug, item.quantity);
                    }}
                    disabled={loadingAction}
                    className="subtract inline-block px-3 py-1 cursor-pointer bg-purple-500 text-white font-semibold rounded-lg shadow-md disabled:bg-purple-200"
                  >
                    -
                  </button>
                  <span className="quantity inline-block min-w-3 mx-3">{item.quantity}</span>
                  <button
                    onClick={() => {
                      buttonAction('plus', item.slug, item.quantity);
                    }}
                    disabled={loadingAction}
                    className="add inline-block px-3 py-1 cursor-pointer bg-purple-500 text-white font-semibold rounded-lg shadow-md disabled:bg-purple-200"
                  >
                    +
                  </button>
                </div>
                {isBelowReorderPoint && (
                  <button
                    onClick={() => handlePurchaseOrder(item)}
                    className="bg-red-500 text-white px-2 py-1 rounded-lg shadow-md"
                  >
                    Place Order
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Display Current Stock */}
      <div className="container mx-auto my-8">
        <h1 className="text-3xl font-semibold mb-6">Add a Product</h1>
        <form>
          <div className="mb-4">
            <label htmlFor="slug" className="block mb-2">
              Product Slug
            </label>
            <input
              value={productForm?.slug || ''}
              name="slug"
              onChange={handleChange}
              type="text"
              id="slug"
              className="w-full border border-gray-300 px-4 py-2"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="quantity" className="block mb-2">
              Quantity
            </label>
            <input
              value={productForm?.quantity || ''}
              name="quantity"
              onChange={handleChange}
              type="number"
              id="quantity"
              className="w-full border border-gray-300 px-4 py-2"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="reorder" className="block mb-2">
              Reorder point
            </label>
            <input
              value={productForm?.reorder || ''}
              name="reorder"
              onChange={handleChange}
              type="number"
              id="reorder"
              className="w-full border border-gray-300 px-4 py-2"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="price" className="block mb-2">
              Price
            </label>
            <input
              value={productForm?.price || ''}
              name="price"
              onChange={handleChange}
              type="number"
              id="price"
              className="w-full border border-gray-300 px-4 py-2"
            />
          </div>
          <button
            onClick={addProduct}
            type="submit"
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg shadow-md font-semibold"
          >
            Add Product
          </button>
        </form>
      </div>

      <div className="container my-8 mx-auto">
        <h1 className="text-3xl font-semibold mb-6">Display Current Stock</h1>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Product Name</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Reorder</th>
              <th className="px-4 py-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.slug}>
                <td className="border px-4 py-2">{product.slug}</td>
                <td className="border px-4 py-2">{product.quantity}</td>
                <td className="border px-4 py-2">{product.reorder}</td>
                <td className="border px-4 py-2">₹{product.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isOrderModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-filter backdrop-blur-sm">
    <div className="bg-white p-9 shadow-lg rounded-md w-600"> {/* Adjust the width as needed */}
      {/* ... (your existing modal content) */}
      <div className="flex justify-center">
        {reorderProduct.quantity <= reorderProduct.reorder ? (
            <Link href="/proceedpage">
            <div className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Submit</div>
            </Link>
        ) : null}
        {/* ... (your existing buttons) */}
      </div>

      {/* Additional input fields for reorder calculation */}

{reorderProduct.quantity <= reorderProduct.reorder && (
  <div className="mt-4 w-full">
    <h3 className="text-xl font-semibold mb-2">Reorder Calculation</h3>

    {/* Target Brand Dropdown */}
    <div className="mb-4">
      <label htmlFor="targetBrand" className="block mb-2">
        Target Brand
      </label>
      <select
        id="targetBrand"
        name="targetBrand"
        value={calculateInputs.targetBrand}
        onChange={handleCalculateInputChange}
        className="w-full border border-gray-300 px-4 py-2"
      >
        <option value="">Select Target Brand</option>
        <option value="1004">1004</option>
        <option value="1005">1005</option>
        <option value="10058">10058</option>
        <option value="1006">1006</option>
        <option value="10062">10062</option>
      </select>
    </div>

    {/* Sales Date Dropdown */}
    <div className="mb-4">
      <label htmlFor="salesDate" className="block mb-2">
        Sales Date
      </label>
      <select
        id="salesDate"
        name="salesDate"
        value={calculateInputs.salesDate}
        onChange={handleCalculateInputChange}
        className="w-full border border-gray-300 px-4 py-2"
      >
        <option value="">Select Sales Date</option>
        <option value="1/15/2016">1/15/2016</option>
        <option value="1/22/2016">1/22/2016</option>
        <option value="1/30/2016">1/30/2016</option>
        <option value="1/19/2016">1/19/2016</option>
      </select>
    </div>

    {/* Sales Quantity Dropdown */}
    <div className="mb-4">
      <label htmlFor="salesQuantity" className="block mb-2">
        Sales Quantity
      </label>
      <select
        id="salesQuantity"
        name="salesQuantity"
        value={calculateInputs.salesQuantity}
        onChange={handleCalculateInputChange}
        className="w-full border border-gray-300 px-4 py-2"
      >
        <option value="">Select Sales Quantity</option>
        {[...Array(15).keys()].map((num) => (
          <option key={num + 1} value={num + 1}>
            {num + 1}
          </option>
        ))}
      </select>
    </div>

    {/* Lead Time Dropdown */}
    <div className="mb-4">
      <label htmlFor="leadTime" className="block mb-2">
        Lead Time
      </label>
      <select
        id="leadTime"
        name="leadTime"
        value={calculateInputs.leadTime}
        onChange={handleCalculateInputChange}
        className="w-full border border-gray-300 px-4 py-2"
      >
        <option value="">Select Lead Time</option>
        {[...Array(25).keys()].map((num) => (
          <option key={num + 1} value={num + 1}>
            {num + 1}
          </option>
        ))}
      </select>
    </div>

    {/* Description Dropdown */}
    <div className="mb-4">
      <label htmlFor="description" className="block mb-2">
        Description
      </label>
      <select
        id="description"
        name="description"
        value={calculateInputs.description}
        onChange={handleCalculateInputChange}
        className="w-full border border-gray-300 px-4 py-2"
      >
        <option value="">Select Description</option>
        <option value="Jim Beam w/2 Rocks Glasses">Jim Beam w/2 Rocks Glasses</option>
        <option value="Maker's Mark Combo Pack">Maker's Mark Combo Pack</option>
        <option value="F Coppola Dmd Ivry Cab Svgn">F Coppola Dmd Ivry Cab Svgn</option>
        <option value="Jim Beam Candy Cane 4/50mLs">Jim Beam Candy Cane 4/50mLs</option>
        <option value="Terroirs du Rhone">Terroirs du Rhone</option>
      </select>
    </div>

    {/* Add more dropdowns as needed */}
  </div>
)}


    </div>
  </div>
)}

    </>
  );
}


export function notifyReorderPoint(products) {
  // Notify when reorder point is met or exceeded
  products.forEach((product) => {
    if (product.quantity <= product.reorder) {
      alert(`Reorder point met for ${product.slug}`);
    }
  });
}
