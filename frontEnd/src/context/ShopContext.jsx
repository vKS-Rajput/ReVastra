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

    // Initialize token from localStorage immediately
    const [token, setToken] = useState(() => {
        const storedToken = localStorage.getItem("token");
        return storedToken && storedToken !== "undefined" && storedToken !== "null" ? storedToken : '';
    });

    // Initialize user from localStorage immediately
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        try {
            return storedUser && storedUser !== "undefined" && storedUser !== "null"
                ? JSON.parse(storedUser)
                : null;
        } catch {
            return null;
        }
    });

    const [search, setSearch] = useState('');
    const [products, setProducts] = useState([]);
    const [showSearch, setShowSearch] = useState(true);
    const [cartItems, setCartItems] = useState({});
    const [includeWashing, setIncludeWashing] = useState(() => {
        const storedValue = localStorage.getItem("includeWashing");
        return storedValue && storedValue !== "undefined" ? JSON.parse(storedValue) : false;
    });

    const navigate = useNavigate();

    // Sync token to localStorage when it changes
    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        }
    }, [token]);

    // Sync user to localStorage when it changes
    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        }
    }, [user]);

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
    const getUserCart = useCallback(async (authToken) => {
        const tokenToUse = authToken || token;
        if (!tokenToUse) return;
        try {
            const { data } = await axios.post(`${backEndURL}/api/cart/get`, {}, {
                headers: { Authorization: `Bearer ${tokenToUse}` },
            });
            if (data.success) setCartItems(data.cartData || {});
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    }, [token, backEndURL]);

    // Fetch user profile
    const fetchUserProfile = useCallback(async (authToken) => {
        const tokenToUse = authToken || token;
        if (!tokenToUse) return;

        try {
            console.log("Fetching profile from:", `${backEndURL}/api/user/profile`);
            const { data } = await axios.get(`${backEndURL}/api/user/profile`, {
                headers: { Authorization: `Bearer ${tokenToUse}` },
            });

            if (data.success) {
                setUser(data.user);
                localStorage.setItem("user", JSON.stringify(data.user));
            }
        } catch (error) {
            console.error("Profile fetch error:", error.response?.data || error.message);
            // Don't show toast for 401 errors on initial load - token might be expired
            if (error.response?.status === 401) {
                // Token is invalid, clear it
                setToken('');
                setUser(null);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            }
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

    // Initial fetch: products only (token is already loaded from localStorage)
    useEffect(() => {
        getProductData();
    }, [getProductData]);

    // Fetch user data when token is available
    useEffect(() => {
        if (token) {
            fetchUserProfile(token);
            getUserCart(token);
        }
    }, [token]);

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
