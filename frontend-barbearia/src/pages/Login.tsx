import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export function Login() {
    const navigate = useNavigate();

    // 1. Estado para controlar se estamos na tela de Login ou de Cadastro
    const [isCadastro, setIsCadastro] = useState(false);

    // 2. Estados para guardar o que o usuário digita
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const [erro, setErro] = useState('');
    const [loading, setLoading] = useState(false);

    // 3. Função que lida tanto com o Login quanto com o Cadastro
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro('');
        setLoading(true);

        try {
            if (isCadastro) {
                // 👇 LÓGICA DE CADASTRO
                await api.post('/usuarios', {
                    nome,
                    email,
                    senha,
                    telefone,
                    tipoUsuario: 'CLIENTE' // Força o cadastro como cliente comum
                });

                alert('✅ Conta criada com sucesso! Agora você já pode fazer login.');

                // Limpa a tela e volta para o modo Login
                setIsCadastro(false);
                setSenha('');
                setNome('');
                setTelefone('');
            } else {
                // 👇 LÓGICA DE LOGIN
                const response = await api.post('/auth/login', { email, senha });

                localStorage.setItem('token', response.data.token);
                localStorage.setItem('nomeUsuario', response.data.nome);
                localStorage.setItem('tipoUsuario', response.data.tipoUsuario);
                localStorage.setItem('usuarioId', response.data.id);

                navigate('/dashboard');
            }

        } catch (err: any) {
            console.error(err);

            if (!err.response) {
                setErro('Não foi possível conectar ao servidor. Verifique sua conexão ou a VPN.');
                return;
            }

            const erroDoJava = err.response?.data;

            if (isCadastro) {
                // Tratamento de erros de Cadastro (ex: e-mail já existe)
                if (typeof erroDoJava === 'string') {
                    setErro(erroDoJava);
                } else if (typeof erroDoJava === 'object') {
                    const mensagens = Object.values(erroDoJava).join(' | ');
                    setErro(mensagens || 'Verifique os dados preenchidos.');
                } else {
                    setErro('Erro ao criar conta. Verifique se este e-mail já está em uso.');
                }
            } else {
                // Tratamento de erros de Login
                if (typeof erroDoJava === 'string') {
                    setErro(erroDoJava);
                } else {
                    setErro('E-mail ou senha incorretos. Tente novamente.');
                }
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 transition-colors duration-300">

            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {isCadastro ? 'Crie sua Conta' : '💈 Barbearia'}
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    {isCadastro ? 'Preencha seus dados para agendar' : 'Faça login para acessar o sistema'}
                </p>
            </div>

            {erro && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 text-sm text-center">
                    {erro}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                {/* Campos exclusivos do modo Cadastro */}
                {isCadastro && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome Completo</label>
                            <input
                                required
                                type="text"
                                value={nome}
                                onChange={e => setNome(e.target.value)}
                                className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                placeholder="João da Silva"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telefone / WhatsApp</label>
                            <input
                                required
                                type="text"
                                value={telefone}
                                onChange={e => setTelefone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                                className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                placeholder="62900000000"
                            />
                        </div>
                    </>
                )}

                {/* Campos comuns (Email e Senha) */}
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
                    {loading ? 'Processando...' : (isCadastro ? 'Concluir Cadastro' : 'Entrar no Sistema')}
                </button>
            </form>

            {/* 👇 Botão de Alternância (Login <-> Cadastro) */}
            <div className="mt-6 text-center border-t dark:border-gray-700 pt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isCadastro ? 'Já tem uma conta?' : 'Ainda não é cliente?'}
                    <button
                        type="button"
                        onClick={() => {
                            setIsCadastro(!isCadastro);
                            setErro(''); // Limpa erros ao trocar de tela
                        }}
                        className="ml-2 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-bold transition-colors"
                    >
                        {isCadastro ? 'Faça Login aqui' : 'Cadastre-se grátis'}
                    </button>
                </p>
            </div>

        </div>
    );
}