import { useNavigate } from 'react-router-dom';

export function Dashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="w-full max-w-5xl bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            {/* Cabeçalho do Dashboard */}
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Painel Administrativo</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Bem-vindo à Barbearia do João</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 font-medium rounded-lg transition-colors"
                >
                    Terminar Sessão
                </button>
            </div>

            {/* Grelha de Menus */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Cartão 1: Agendamentos */}
                <div onClick={() => navigate('/agendamentos')} className="cursor-pointer bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 p-6 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📅</div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Agendamentos</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Gerir marcações e horários do dia</p>
                </div>

                {/* Cartão 2: Serviços */}
                <div onClick={() => navigate('/servicos')} className="cursor-pointer bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 p-6 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">✂️</div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Serviços</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Tabela de preços e tipos de corte</p>
                </div>

                {/* Cartão 3: Clientes */}
                <div onClick={() => navigate('/clientes')} className="cursor-pointer bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/50 p-6 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">👥</div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Clientes</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Ficha de clientes e utilizadores</p>
                </div>

            </div>
        </div>
    );
}