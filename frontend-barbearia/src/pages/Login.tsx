import { useState, FormEvent } from 'react';
import { LoginResponse } from '../types/Auth';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

export function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>('');
    const [senha, setSenha] = useState<string>('');

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const dadosLogin = { email, senha };

        try {

            const response = await api.post<LoginResponse>('/auth/login', dadosLogin);
            localStorage.setItem("token", response.data.token);


            navigate('/dashboard');


            localStorage.setItem("token", response.data.token);
            alert("Login realizado com sucesso! Token guardado.");

        } catch (err: any) {
            console.error("Erro na requisição:", err);
            // O Axios nos permite tratar os erros HTTP com mais precisão
            if (err.response && err.response.status === 403) {
                setError("Credenciais inválidas. Verifique o seu e-mail e senha.");
            } else {
                setError("Não foi possível conectar ao servidor. O back-end está rodando?");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Barbearia do João</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Faça login para acessar o sistema</p>
            </div>

            {error && (
                <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 text-sm rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-left">E-mail</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                        className="w-full px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 dark:disabled:bg-gray-800"
                        placeholder="seu@email.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-left">Senha</label>
                    <input
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                        disabled={isLoading}
                        className="w-full px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 dark:disabled:bg-gray-800"
                        placeholder="••••••••"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-4 text-white font-semibold rounded-lg transition-all mt-2 
                        ${isLoading ? 'bg-blue-400 dark:bg-blue-500/50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-md hover:shadow-lg'}`}
                >
                    {isLoading ? 'A entrar...' : 'Entrar'}
                </button>
            </form>
        </div>
    );
}