import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProduct from '../components/RelatedProduct';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');

  useEffect(() => {
    const foundProduct = products.find((item) => item._id === productId);
    if (foundProduct) {
      setProductData(foundProduct);
      setImage(foundProduct.image[0]);
    }
  }, [productId, products]);

  return productData ? (
    <div className="border-t-2 pt-10 px-4 md:px-8 lg:px-16">
      {/* Product Container */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Images Section */}
        <div className="flex flex-col lg:flex-row gap-6 w-full lg:w-1/2">
          {/* Small Thumbnails */}
          <div className="flex lg:flex-col gap-4 overflow-x-auto">
            {productData.image.map((item, index) => (
              <img
                key={index}
                src={item}
                alt={`Thumbnail ${index + 1}`}
                onClick={() => setImage(item)}
                className={`w-48 h-16 object-cover border rounded-lg cursor-pointer transition-transform transform hover:scale-105 ${
                  image === item ? 'border-orange-500' : 'border-gray-300'
                }`}
              />
            ))}
          </div>
          {/* Main Image */}
          <div className="flex-grow">
            <img
              src={image}
              alt="Main Product"
              className="w-full h-auto object-cover rounded-lg shadow-md border"
            />
          </div>
        </div>

        {/* Product Info Section */}
        <div className="flex-1 space-y-4">
          <h1 className="text-2xl md:text-3xl font-semibold">{productData.name}</h1>
          {/* Ratings */}
          <div className="flex items-center gap-2">
            {[...Array(4)].map((_, i) => (
              <img key={i} src={assets.star_icon} alt="Star" className="w-5" />
            ))}
            <img src={assets.star_dull_icon} alt="Star Dull" className="w-5" />
            <span className="text-gray-500">(122 Reviews)</span>
          </div>
          {/* Price */}
          <p className="text-3xl font-bold text-gray-800">{currency}{productData.price}</p>
          {/* Description */}
          <p className="text-gray-600 leading-relaxed text-sm md:text-base">{productData.description}</p>
          {/* Sizes */}
          <div className='flex flex-col gap-2'>
            <p className='font-semibold'>Select SquareFeet:</p>
            <div className='flex gap-2'>
              {productData.sizes.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 bg-gray-100 rounded-md transition-colors ${
                    item === size ? 'border-orange-500' : 'border-gray-300'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => addToCart(productData._id, size)}
            className='bg-black text-white px-6 py-3 text-sm rounded-md hover:bg-gray-800 transition'
          >
            Book Now
          </button>
          <hr className='mt-6' />
          {/* Additional Info */}
          <div className='text-sm text-gray-500 space-y-1'>
            <p>  🏡 Luxury Villa – A stunning 4-bedroom villa with breathtaking sea views.</p>
            <p> 🌆 Countryside Retreat – Peaceful 3-bedroom home with a large garden and mountain views.</p>
            <p> 🏢 C ommercial Space – Prime office space in a high-demand business district.</p>
          </div>
        </div>
      </div>

      {/* Tabs & Description */}
      <div className='mt-16'>
        <div className='flex border-b'>
          <b className='border px-5 pt-3 text-sm bg-gray-100'>Description</b>
          <p className='border px-5 py-3 text-sm'>Reviews (122)</p>
        </div>
        <div className='border px-6 py-6 text-sm text-gray-600'>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid, illum debitis.</p>
          <p>Dolores minima qui eius debitis aliquam atque dolor. Deserunt sed repudiandae.</p>
        </div>
      </div>
      {/* Related Products */}
      <RelatedProduct category={productData.category} subCategory={productData.subCategory} />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
