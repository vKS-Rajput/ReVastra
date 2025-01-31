const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');

  // Fetch product data
  useEffect(() => {
    const product = products.find((item) => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.image[0]);
    }
  }, [productId, products]);

  // Handle add to cart
  const handleAddToCart = async () => {
    if (size) {
      try {
        await addToCart(productData._id, size);
        toast.success(`${productData.name} added to cart!`);
      } catch (error) {
        toast.error('Failed to add item to cart. Please try again.');
      }
    } else {
      toast.error('Please select a size before adding to cart.');
    }
  };

  return productData ? (
    <div className="border-t-2 pt-10" style={{ marginTop: '90px' }}>
      <div className="flex flex-col sm:flex-row gap-12">
        {/* Product Images */}
        <div className="flex-1 flex flex-col-reverse sm:flex-row gap-3">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll sm:w-[18%] w-full">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className={`w-[18%] sm:w-full cursor-pointer ${
                  image === item ? 'border-2 border-gray-400' : ''
                }`}
                alt={`Product ${index}`}
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img className="w-full h-auto rounded-lg" src={image} alt="Selected product" />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <h1 className="font-bold text-3xl mt-2">{productData.name}</h1>
          <p className="text-lg text-gray-400 line-through">Original: {currency}{productData.price}</p>
          <p className="text-4xl font-semibold text-[#ff6347] mt-2">
            Rent: {currency}{productData.rental_price} <span className="text-lg font-normal">/ day</span>
          </p>

          <p className="mt-5 text-gray-600">{productData.description}</p>

          {/* Select Size */}
          {productData.isAvailable ? (
            <div className="flex flex-col gap-4 my-8">
              <p className="text-lg font-semibold">Select Size</p>
              <div className="flex gap-2">
                {productData.sizes.map((item, index) => (
                  <button
                    className={`border py-2 px-4 text-sm rounded-md ${
                      item === size ? 'bg-gray-900 text-white' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    key={index}
                    onClick={() => setSize(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xl font-semibold text-red-600 mt-5">Sold Out</p>
          )}

          {/* Add to Cart Button */}
          {productData.isAvailable ? (
            <button
              onClick={handleAddToCart}
              className="px-6 py-3 mt-4 bg-[#E63946] text-white rounded-lg shadow-md hover:bg-[#e5533f]"
            >
              Add to Cart
            </button>
          ) : (
            <button
              disabled
              className="px-6 py-3 mt-4 bg-gray-400 text-white rounded-lg cursor-not-allowed"
            >
              Sold Out
            </button>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default Product;
