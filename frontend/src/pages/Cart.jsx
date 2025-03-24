import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets';

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, delivery_fee, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const tempData = [];
    for (const itemId in cartItems) {
      const itemSizes = cartItems[itemId];
      for (const size in itemSizes) {
        if (itemSizes[size] > 0) {
          tempData.push({
            _id: itemId,
            size: size,
            quantity: itemSizes[size],
          });
        }
      }
    }
    setCartData(tempData);
  }, [cartItems]);

  const handleQuantityChange = (itemId, size, newQuantity) => {
    if (newQuantity >= 0) {
      updateQuantity(itemId, size, newQuantity);
    }
  };

  return (
    <div className="min-h-screen bg-[url('/assets/real-estate-bg.jpg')] bg-cover bg-center text-gray-800 py-10 px-6">
      <div className="max-w-5xl mx-auto bg-white bg-opacity-90 shadow-lg rounded-lg p-6">
        {/* Title */}
        <div className="text-3xl font-bold text-center text-gray-900 mb-6">
          <Title text1="Your " text2="Bookings" />
        </div>

        {/* Cart Items */}
        <div>
          {cartData.map((item) => {
            const productData = products.find((product) => product._id === item._id);
            if (!productData) return null;

            return (
              <div
                key={`${item._id}-${item.size}`}
                className="flex items-center justify-between border-b py-4"
              >
                <div className="flex items-center gap-6">
                  <img className="w-24 rounded-md" src={productData.image[0]} alt={productData.name} />
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{productData.name}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <p className="text-gray-600">Price: {currency} {productData.price.toFixed(2)}</p>
                      <span className="px-3 py-1 bg-gray-200 rounded-md text-gray-800">{item.size}</span>
                    </div>
                  </div>
                </div>
                <img onClick={() => updateQuantity(item._id, item.size, 0)} className='w-6 cursor-pointer' src={assets.bin_icon} alt="Remove" />
              </div>
            );
          })}
        </div>

        {/* Cart Total & Checkout */}
        <div className="flex justify-end mt-10">
          <div className="w-full sm:max-w-sm">
            <CartTotal />
            <div className="w-full text-end mt-6">
              <button onClick={() => navigate('/place-order')} className="bg-blue-600 text-white py-3 px-8 rounded-md hover:bg-blue-700 transition duration-300">
                PROCEED TO PAYMENT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;