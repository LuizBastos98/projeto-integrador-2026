import { useNavigate } from 'react-router-dom';

export function Clientes() {
    const navigate = useNavigate();

    // Dados provisórios (Mock)
    const clientesFalsos = [
        { id: 1, nome: 'Carlos Silva', telefone: '(62) 98765-4321', email: 'carlos.silva@gmail.com', tipo: 'Cliente' },
        { id: 2, nome: 'Miguel Santos', telefone: '(62) 91234-5678', email: 'miguel.santos@gmail.com', tipo: 'Cliente' },
        { id: 3, nome: 'Rui Costa', telefone: '(62) 99999-8888', email: 'rui.costa@gmail.com', tipo: 'Cliente' },
        { id: 4, nome: 'Administrador (Você)', telefone: '(00) 00000-0000', email: 'administrador@barbearia.com', tipo: 'Admin' },
    ];

    return (
        <div className="w-full max-w-5xl bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-300">

            {/* Cabeçalho */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        👥 Clientes & Usuários
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Gerencie os cadastros do sistema</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 font-medium rounded-lg transition-colors shadow-sm">
                        + Novo Cliente
                    </button>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 font-medium rounded-lg transition-colors flex items-center gap-2"
                    >
                        <span>←</span> Voltar ao Painel
                    </button>
                </div>
            </div>

            {/* Tabela de Dados */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="pb-3 text-sm font-semibold text-gray-600 dark:text-gray-400">Nome</th>
                        <th className="pb-3 text-sm font-semibold text-gray-600 dark:text-gray-400">Telefone</th>
                        <th className="pb-3 text-sm font-semibold text-gray-600 dark:text-gray-400">E-mail</th>
                        <th className="pb-3 text-sm font-semibold text-gray-600 dark:text-gray-400">Tipo</th>
                        <th className="pb-3 text-sm font-semibold text-gray-600 dark:text-gray-400 text-right">Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {clientesFalsos.map((cliente) => (
                        <tr key={cliente.id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                            <td className="py-4 text-gray-900 dark:text-gray-100 font-medium">{cliente.nome}</td>
                            <td className="py-4 text-gray-600 dark:text-gray-300">{cliente.telefone}</td>
                            <td className="py-4 text-gray-600 dark:text-gray-300">{cliente.email}</td>
                            <td className="py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${cliente.tipo === 'Admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                                        {cliente.tipo}
                                    </span>
                            </td>
                            <td className="py-4 text-right">
                                <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium mr-4 transition-colors">Editar</button>
                                <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium transition-colors">Remover</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}