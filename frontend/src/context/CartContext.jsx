import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ items: [] });
    const { token } = useAuth();

    const fetchCart = async () => {
        if (!token) {
            setCart({ items: [] });
            return;
        }
        try {
            const { data } = await api.get('/cart');
            setCart(data || { items: [] });
        } catch (error) {
            console.error('Failed to fetch cart', error);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [token]);

    const addToCart = async (productId, quantity = 1) => {
        if (!token) return false;
        try {
            await api.post('/cart/add', { productId, quantity });
            await fetchCart();
            return true;
        } catch (error) {
            console.error('Failed to add to cart', error);
            return false;
        }
    };

    const removeFromCart = async (productId) => {
        try {
            await api.delete(`/cart/remove/${productId}`);
            await fetchCart();
        } catch (error) {
            console.error('Failed to remove from cart', error);
        }
    };

    const clearCart = async () => {
        try {
            await api.delete('/cart/clear');
            await fetchCart();
        } catch (error) {
            console.error('Failed to clear cart', error);
        }
    };

    const items = cart?.items || [];
    const cartTotal = items.reduce((total, item) => total + ((item.product?.price || 0) * item.quantity), 0);
    const cartItemCount = items.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, items, addToCart, removeFromCart, clearCart, cartTotal, cartItemCount }}>
            {children}
        </CartContext.Provider>
    );
};
