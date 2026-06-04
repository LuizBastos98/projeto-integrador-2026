import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export function Login() {
    const navigate = useNavigate();

    // 1. Estados para guardar o que o usuário digita
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [loading, setLoading] = useState(false);

    // 2. A nossa função real de Login
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); // Evita que a página recarregue
        setErro('');
        setLoading(true);

        try {
            // Bate na porta do Spring Boot
            const response = await api.post('/auth/login', { email, senha });

            // Guarda os dados VIP no navegador
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('nomeUsuario', response.data.nome);
            localStorage.setItem('tipoUsuario', response.data.tipoUsuario);
            localStorage.setItem('usuarioId', response.data.id);

            // Abre as portas e vai para o Painel!
            navigate('/dashboard');

        } catch (err: any) {
            console.error(err);

            // Verifica se NÃO houve resposta do servidor (Erro de rede / CORS / Offline)
            if (!err.response) {
                setErro('Não foi possível conectar ao servidor. Verifique sua conexão ou a VPN.');
                return;
            }

            // Agora a tela de Login lê a fofoca exata que o Spring Boot mandar!
            const erroDoJava = err.response?.data;

            if (typeof erroDoJava === 'string') {
                setErro(erroDoJava); // Exibe: "Acesso Negado: Este usuário foi desativado..."
            } else {
                setErro('E-mail ou senha incorretos. Tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 transition-colors duration-300">

            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">💈 Barbearia</h1>
                <p className="text-gray-500 dark:text-gray-400">Faça login para acessar o sistema</p>
            </div>

            {/* Aviso de erro (se houver) */}
            {erro && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 text-sm text-center">
                    {erro}
                </div>
            )}

            {/* 3. O nosso formulário conectado à função handleLogin */}
            <form onSubmit={handleLogin} className="flex flex-col gap-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-mail</label>
                    <input
                        required
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                        placeholder="seu@email.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Senha</label>
                    <input
                        required
                        type="password"
                        value={senha}
                        onChange={e => setSenha(e.target.value)}
                        className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg disabled:opacity-70 flex justify-center items-center"
                >
                    {loading ? 'Verificando...' : 'Entrar no Sistema'}
                </button>
            </form>

        </div>
    );
}