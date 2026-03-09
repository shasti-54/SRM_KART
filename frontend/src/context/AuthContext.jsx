import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            // Optionally fetch user profile with token here
        } else {
            localStorage.removeItem('token');
            setUser(null);
        }
    }, [token]);

    const login = async (email, password) => {
        try {
            const { data } = await axios.post('http://localhost:8080/api/auth/login', { email, password });
            setToken(data.token);
            setUser({ username: data.username, email: data.email, roles: data.roles });
            return true;
        } catch (error) {
            console.error('Login failed', error);
            return false;
        }
    };

    const register = async (name, email, password) => {
        try {
            await axios.post('http://localhost:8080/api/auth/register', { name, email, password });
            return true;
        } catch (error) {
            console.error('Registration failed', error);
            return false;
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
