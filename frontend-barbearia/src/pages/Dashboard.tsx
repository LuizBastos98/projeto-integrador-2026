import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import iconeCalendario from '../assets/calendario.svg';
import iconeTesoura from '../assets/tesoura.svg';
import iconeUsuario from '../assets/usuario.svg';

export function Dashboard() {
    const navigate = useNavigate();

    // Puxa as informações de quem logou
    const [nomeUsuario, setNomeUsuario] = useState('');
    const [tipoUsuario, setTipoUsuario] = useState('');

    useEffect(() => {
        // Se não encontrar o nome, chama de 'Usuário'
        const nome = localStorage.getItem('nomeUsuario') || 'Usuário';
        const tipo = localStorage.getItem('tipoUsuario') || 'CLIENTE';

        setNomeUsuario(nome);
        setTipoUsuario(tipo);
    }, []);

    const handleLogout = () => {
        // Apaga o Token e os dados do usuário da memória do navegador
        localStorage.clear();
        navigate('/'); // Redireciona para o Login
    };

    return (
        <div className="w-full max-w-5xl mx-auto bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-300">

            {/* Cabeçalho Centralizado */}
            <div className="flex flex-col items-center justify-center gap-5 mb-10 text-center">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                        Painel de Controle
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
                        Bem-vindo(a), <span className="font-semibold text-purple-600 dark:text-purple-400">{nomeUsuario}</span>!
                    </p>
                </div>

                <button
                    onClick={handleLogout}
                    className="px-6 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                    Terminar Sessão
                </button>
            </div>

            {/* Grid de Cartões */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center">

                {/* 1. Cartão de Agendamentos (Redirecionamento Dinâmico) */}
                <div
                    // 👇 SE FOR CLIENTE, MANDA PARA O HISTÓRICO DELE. SE FOR ADM/BARBEIRO, MANDA PARA A TELA GERAL
                    onClick={() => navigate(tipoUsuario === 'CLIENTE' ? '/meus-agendamentos' : '/agendamentos')}
                    className="cursor-pointer group p-6 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 rounded-xl border border-blue-100 dark:border-blue-800/30 transition-all duration-300 flex flex-col items-center text-center"
                >
                    <img
                        src={iconeCalendario}
                        alt="Ícone de Calendário"
                        className="w-12 h-12 mb-4 dark:brightness-0 dark:invert transition-all"
                    />
                    <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-2 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                        Agendamentos
                    </h2>
                    <p className="text-blue-600/80 dark:text-blue-300/80 text-sm">
                        Gerencie suas marcações e horários.
                    </p>
                </div>

                {/* 2. Cartão de Serviços (Esconde se for CLIENTE) */}
                {tipoUsuario !== 'CLIENTE' && (
                    <div
                        onClick={() => navigate('/servicos')}
                        className="cursor-pointer group p-6 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 rounded-xl border border-emerald-100 dark:border-emerald-800/30 transition-all duration-300 flex flex-col items-center text-center"
                    >
                        <img
                            src={iconeTesoura}
                            alt="Ícone de Tesoura"
                            className="w-12 h-12 mb-4 dark:brightness-0 dark:invert transition-all"
                        />
                        <h2 className="text-xl font-bold text-emerald-900 dark:text-emerald-100 mb-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                            Serviços
                        </h2>
                        <p className="text-emerald-600/80 dark:text-emerald-300/80 text-sm">
                            Tabela de preços e tipos de corte.
                        </p>
                    </div>
                )}

                {/* 3. Cartão de Clientes (Apenas ADMINISTRADOR) */}
                {tipoUsuario === 'ADMINISTRADOR' && (
                    <div
                        onClick={() => navigate('/clientes')}
                        className="cursor-pointer group p-6 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/40 rounded-xl border border-purple-100 dark:border-purple-800/30 transition-all duration-300 flex flex-col items-center text-center"
                    >
                        <img
                            src={iconeUsuario}
                            alt="Ícone de Usuário"
                            className="w-12 h-12 mb-4 dark:brightness-0 dark:invert transition-all"
                        />
                        <h2 className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-2 group-hover:text-purple-700 dark:group-hover:text-purple-300">
                            Clientes & Equipe
                        </h2>
                        <p className="text-purple-600/80 dark:text-purple-300/80 text-sm">
                            Fichas e permissões de acesso.
                        </p>
                    </div>
                )}

            </div>
        </div>
    );
}