import { createContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = "₹";
    const delivery_fee = 10;
    const backEndURL = import.meta.env.VITE_BACKEND_URL;

    const [token, setToken] = useState("");
    const [search, setSearch] = useState("");
    const [products, setProducts] = useState([]);
    const [showSearch, setShowSearch] = useState(true);
    const [cartItems, setCartItems] = useState({});
    const navigate = useNavigate();

    const getProductData = async () => {
        try {
            const response = await axios.get(`${backEndURL}/api/product/list`);
            if (response.data.success) {
                setProducts(response.data.products);
            } else {
                toast.error("⚠️ Failed to fetch products!");
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("⚠️ Error fetching products!");
        }
    };

    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error("⚠️ Please select a product size before adding to cart!");
            return;
        }

        const product = products.find((item) => item._id === itemId);
        if (!product || !product.isAvailable) {
            toast.error("⚠️ This product is sold out!");
            return;
        }

        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
        } else {
            cartData[itemId] = { [size]: 1 };
        }
        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(`${backEndURL}/api/cart/add`, { itemId, size }, { headers: { token } });
            } catch (error) {
                console.error("API Error:", error);
                toast.error("Failed to update cart!");
            }
        } else {
            toast.error("⚠️ User is not authenticated. Please log in.");
        }
    };

    const getCartCount = () => {
        return Object.values(cartItems).reduce((total, sizes) => {
            return total + Object.values(sizes).reduce((sum, count) => sum + count, 0);
        }, 0);
    };

    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;
        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(`${backEndURL}/api/cart/update`, { itemId, size, quantity }, { headers: { token } });
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    };

    const markProductAsSoldOut = (productId) => {
        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product._id === productId ? { ...product, isAvailable: false } : product
            )
        );
    };

    const placeOrder = async (productId) => {
        try {
            const response = await axios.post(
                `${backEndURL}/api/order`,
                { productId },
                { headers: { token } }
            );

            if (response.data.success) {
                markProductAsSoldOut(productId);
                toast.success("Order placed successfully!");
            } else {
                toast.error("⚠️ Order failed!");
            }
        } catch (error) {
            toast.error("⚠️ Failed to place order.");
        }
    };

    useEffect(() => {
        getProductData();
    }, []);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!token && storedToken) {
            setToken(storedToken);
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
        cartItems,
        addToCart,
        backEndURL,
        placeOrder,
        markProductAsSoldOut,
        setToken,
        token,
        navigate,
        getCartCount,
        updateQuantity,
    }), [products, cartItems, token]);

    return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;