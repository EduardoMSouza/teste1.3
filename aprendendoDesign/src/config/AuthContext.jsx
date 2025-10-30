import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null); // null = não logado

    const login = (email, password) => {
        // Aqui você valida (simule ou chame API real)
        // Exemplo simples: credenciais fixas para teste
        if (email === 'variadogp@gmail.com' && password === 'Variado1234') {
            const fakeUser = { email };
            localStorage.setItem('user', JSON.stringify(fakeUser)); // Salva no localStorage
            setUser(fakeUser);
            return true;
        }
        return false;
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    // Carrega usuário do localStorage na inicialização
    const loadUser = () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loadUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);