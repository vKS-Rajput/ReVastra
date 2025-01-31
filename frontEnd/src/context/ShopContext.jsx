import { createContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = "₹";
    const delivery_fee = 10;
    const backEndURL = import.meta.env.VITE_BACKEND_URL;

    // State management
    const [token, setToken] = useState("");
    const [search, setSearch] = useState("");
    const [products, setProducts] = useState([]);
    const [showSearch, setShowSearch] = useState(true);
    const [cartItems, setCartItems] = useState({});
    const navigate = useNavigate();


    // Function to add an item to the cart
    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error(
                "⚠️ Please select a product size before adding to cart!",
                toastConfig(5000) // 5 seconds duration for errors
            );
            return;
        }

        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            }
            else {
                cartData[itemId][size] = 1;
            }
        }
        else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);

        if (token) {
            try {
                const response = await axios.post(
                    `${backEndURL}/api/cart/add`,
                    { itemId, size },
                    { headers: { token } }
                );
                console.log(response.data);
                
            } catch (error) {
                console.error("API Error:", error);
                toast.error(
                    error.response?.data?.message || "Failed to update cart!",
                    toastConfig(4000) // 4 seconds duration for API errors
                );
            }
        } else {
            toast.error(
                "⚠️ User is not authenticated. Please log in.",
                toastConfig(5000) // 5 seconds duration for login errors
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
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalAmount += itemInfo.rental_price * cartItems[items][item];
                    }
                } catch (error) {

                }
            }
        }
        return totalAmount;
    }

    // Fetch products from the backend
    const getProductData = async () => {
        try {
            const response = await axios.get(`${backEndURL}/api/product/list`);
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
                const response = await axios.get(`${backEndURL}/api/cart/get`, {
                    headers: { token },
                });
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
        const storedToken = localStorage.getItem("token");
        if (!token && storedToken) {
            setToken(storedToken);
            getUserCart(storedToken);
        }
    }, [token]);

    // Memoized value for the context
    const value = useMemo(
        () => ({
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
        }),
    );

    return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;
