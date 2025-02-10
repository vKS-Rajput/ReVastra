import { createContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = "₹";
    const delivery_fee = 10;
    const backEndURL = import.meta.env.VITE_BACKEND_URL

    // State management
    const [token, setToken] = useState('');
    const [search, setSearch] = useState('');
    const [products, setProducts] = useState([]);
    const [showSearch, setShowSearch] = useState(true);
    const [cartItems, setCartItems] = useState({});
    const navigate = useNavigate();


    // Function to add an item to the cart
    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error(
                "⚠️ Please select a product size before adding to cart!",
                toastConfig(5000)
            );
            return;
        }
    
        let cartData = structuredClone(cartItems);
        const itemInfo = products.find((product) => product._id === itemId);
        if (!itemInfo) {
            toast.error("⚠️ Product not found!");
            return;
        }
    
        const latestPrice = itemInfo.rental_price;
    
        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                if (cartData[itemId][size].quantity < 3) {
                    cartData[itemId][size].quantity += 1; // Fixed price for first 3
                } else {
                    cartData[itemId][size].quantity += 1;
                    cartData[itemId][size].price = latestPrice; // Update price for additional quantity
                }
            } else {
                cartData[itemId][size] = { quantity: 3, price: latestPrice }; // Default to 3 with fixed price
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = { quantity: 3, price: latestPrice }; // Default to 3 with fixed price
        }
    
        setCartItems(cartData);
    
        if (token) {
            try {
                await axios.post(backEndURL + '/api/cart/add', { itemId, size, quantity: 3, price: latestPrice }, { headers: { token } });
            } catch (error) {
                console.error("API Error:", error);
                toast.error(
                    error.response?.data?.message || "Failed to update cart!",
                    toastConfig(4000)
                );
            }
        } else {
            toast.error(
                "⚠️ User is not authenticated. Please log in.",
                toastConfig(5000)
            );
        }
    };
    

    // Get total cart item count
    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {

                }
            }
        }
        return totalCount;
    }

    // Update cart item quantity
    const updateQuantity = async (itemId, size, quantity) => {

        let cartData = structuredClone(cartItems);

        cartData[itemId][size] = quantity;

        setCartItems(cartData)

        if (token) {
            try {

                await axios.post(backEndURL + '/api/cart/update', { itemId, size, quantity }, { headers: { token } })

            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }

    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            for (const size in cartItems[items]) {
                try {
                    const cartItem = cartItems[items][size];
                    if (cartItem.quantity > 0) {
                        if (cartItem.quantity <= 3) {
                            totalAmount += cartItem.price * cartItem.quantity; // Fixed price for first 3
                        } else {
                            const latestPrice = itemInfo ? itemInfo.rental_price : cartItem.price;
                            totalAmount += (cartItem.price * 3) + (latestPrice * (cartItem.quantity - 3)); // Updated price for extra quantity
                        }
                    }
                } catch (error) {
                    console.error("Error calculating cart amount:", error);
                }
            }
        }
        return totalAmount;
    };
    

    // Fetch products from the backend
    const getProductData = async () => {
        try {
            const response = await axios.get(`${backEndURL}/api/product/list`)
            if (response.data.success) {
                setProducts(response.data.products);
            } else {
                toast.error(
                    "⚠️ Failed to fetch products!",
                    toastConfig(5000) // 5 seconds duration
                );
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error(
                "⚠️ Something went wrong while fetching products!",
                toastConfig(5000) // 5 seconds duration
            );
        }
    };

    // Fetch user cart from the backend
    const getUserCart = async () => {
        if (token) {
            try {
                const response = await axios.post(backEndURL + '/api/cart/get',{},{headers:{token}})
                if (response.data.success) {
                    setCartItems(response.data.cartData);
                } else {
                    toast.error(
                        "⚠️ Failed to fetch cart!",
                        toastConfig(4000) // 4 seconds duration
                    );
                }
            } catch (error) {
                console.error("Error fetching cart:", error);
                toast.error(
                    error.message || "Failed to fetch cart",
                    toastConfig(5000) // 5 seconds duration
                );
            }
        }
    };

    // Initial product fetch
    useEffect(() => {
        getProductData();
    }, []);

    // Token retrieval from localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem("token")
        if (!token && storedToken) {
            setToken(storedToken)
            getUserCart(storedToken)
        }
    }, [token])

    // Memoized value for the context
    const value = 
        {
            products,
            currency,
            delivery_fee,
            search,
            setSearch,
            showSearch,
            setShowSearch,
            getCartAmount,
            cartItems,
            addToCart,
            backEndURL,
            getCartCount,
            updateQuantity,
            setToken,
            token,
            navigate,
        }
    ;

    return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;
