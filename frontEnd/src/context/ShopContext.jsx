import { createContext, useEffect, useMemo, useState, useCallback } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
    const currency = "₹";
    const delivery_fee = 10;
    const washingFee = 25;
    const backEndURL = import.meta.env.VITE_BACKEND_URL;

    const [token, setToken] = useState('');
    const [user, setUser] = useState(null);
    const [search, setSearch] = useState('');
    const [products, setProducts] = useState([]);
    const [showSearch, setShowSearch] = useState(true);
    const [cartItems, setCartItems] = useState({});
    const [includeWashing, setIncludeWashing] = useState(() => {
        const storedValue = localStorage.getItem("includeWashing");
        return storedValue && storedValue !== "undefined" ? JSON.parse(storedValue) : false;
    });

    const navigate = useNavigate();

    // Toggle washing fee
    const toggleWashingFee = useCallback(() => {
        setIncludeWashing((prev) => {
            const newState = !prev;
            localStorage.setItem("includeWashing", JSON.stringify(newState));
            return newState;
        });
    }, []);

    // Add item to cart
    const addToCart = useCallback(async (itemId, size) => {
        if (!size) {
            return toast.error("⚠️ Please select a product size before adding to cart!");
        }

        setCartItems((prev) => {
            const updatedCart = { ...prev, [itemId]: { ...prev[itemId], [size]: (prev[itemId]?.[size] || 0) + 1 } };
            return updatedCart;
        });

        if (token) {
            try {
                await axios.post(`${backEndURL}/api/cart/add`, { itemId, size }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } catch (error) {
                console.error("API Error:", error);
                toast.error(error.response?.data?.message || "Failed to update cart!");
            }
        } else {
            toast.error("⚠️ User is not authenticated. Please log in.");
        }
    }, [token, backEndURL]);

    // Get cart item count
    const getCartCount = useCallback(() =>
        Object.values(cartItems).reduce(
            (total, sizes) => total + Object.values(sizes).reduce((sum, qty) => sum + qty, 0),
            0
        ), [cartItems]);

    // Update duration (rental days)
    const updateDuration = useCallback(async (itemId, size, duration) => {
        setCartItems((prev) => ({ ...prev, [itemId]: { ...prev[itemId], [size]: duration } }));

        if (token) {
            try {
                await axios.post(`${backEndURL}/api/cart/update`, { itemId, size, duration }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } catch (error) {
                toast.error(error.message || "Failed to update duration.");
            }
        }
    }, [token, backEndURL]);

    // Calculate total cart amount
    const getCartAmount = useCallback(() =>
        Object.entries(cartItems).reduce((total, [itemId, sizes]) => {
            const item = products.find(product => product._id === itemId);
            return item ? total + Object.values(sizes).reduce((sum, qty) => sum + (item.rental_price * qty), 0) : total;
        }, 0), [cartItems, products]);

    // Fetch products
    const getProductData = useCallback(async () => {
        try {
            const { data } = await axios.get(`${backEndURL}/api/product/list`);
            if (data.success) setProducts(data.products);
            else toast.error("⚠️ Failed to fetch products!");
        } catch {
            toast.error("⚠️ Error fetching products!");
        }
    }, [backEndURL]);

    // Fetch user cart
    const getUserCart = useCallback(async () => {
        if (!token) return;
        try {
            const { data } = await axios.post(`${backEndURL}/api/cart/get`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (data.success) setCartItems(data.cartData);
        } catch (error) {
            toast.error("⚠️ Error fetching cart.");
        }
    }, [token, backEndURL]);

    // Fetch user profile
    const fetchUserProfile = useCallback(async () => {
        if (!token) return;

        try {
            console.log("Fetching profile from:", `${backEndURL}/api/user/profile`);
            const { data } = await axios.get(`${backEndURL}/api/user/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (data.success) {
                setUser(data.user);
                localStorage.setItem("user", JSON.stringify(data.user));
            }
        } catch (error) {
            console.error("Profile fetch error:", error.response?.data || error.message);
            toast.error("⚠️ Error fetching profile.");
        }
    }, [token, backEndURL]);


    // Logout function
    const logout = () => {
        setToken('');
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate('/');
        toast.success("Logged out successfully.");
    };

    // Initial fetch: products, token, user, and cart
    useEffect(() => {
        getProductData();

        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        if (storedUser && storedUser !== "undefined") {
            setUser(JSON.parse(storedUser));
        } else {
            localStorage.removeItem("user"); // Clean up invalid values
        }


        if (storedToken) {
            setToken(storedToken);
            if (storedUser && storedUser !== "undefined") {
                setUser(JSON.parse(storedUser));
            }
            fetchUserProfile();
            getUserCart();
        }
    }, [getProductData, fetchUserProfile, getUserCart]);

    const value = useMemo(() => ({
        products,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        getCartAmount,
        cartItems,
        setCartItems,  // ✅ Add this line
        addToCart,
        backEndURL,
        getCartCount,
        updateDuration,
        setToken,
        token,
        user,
        setUser,
        washingFee,
        navigate,
        includeWashing,
        toggleWashingFee,
        fetchUserProfile,
        logout,
    }), [products, currency, delivery_fee, search, showSearch, cartItems, addToCart, backEndURL, getCartAmount, getCartCount, updateDuration, token, user, washingFee, navigate, includeWashing, toggleWashingFee, fetchUserProfile, logout]);

    return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
