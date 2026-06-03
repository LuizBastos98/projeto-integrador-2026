import { useNavigate } from 'react-router-dom';

export function Agendamentos() {
    const navigate = useNavigate();

    // Dados provisórios (Mock) para vermos o layout a funcionar
    const agendamentosFalsos = [
        { id: 1, cliente: 'Carlos Silva', servico: 'Corte Degradê', data: '15/10/2026', hora: '14:30', estado: 'Confirmado' },
        { id: 2, cliente: 'Miguel Santos', servico: 'Barba na Toalha Quente', data: '15/10/2026', hora: '15:00', estado: 'Pendente' },
        { id: 3, cliente: 'Rui Costa', servico: 'Corte + Barba', data: '15/10/2026', hora: '16:00', estado: 'Confirmado' },
    ];

    return (
        <div className="w-full max-w-5xl bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-300">

            {/* Cabeçalho */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        📅 Agendamentos
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Controle as marcações da barbearia</p>
                </div>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                    <span>←</span> Voltar ao Painel
                </button>
            </div>

            {/* Tabela de Dados */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="pb-3 text-sm font-semibold text-gray-600 dark:text-gray-400">Cliente</th>
                        <th className="pb-3 text-sm font-semibold text-gray-600 dark:text-gray-400">Serviço</th>
                        <th className="pb-3 text-sm font-semibold text-gray-600 dark:text-gray-400">Data e Hora</th>
                        <th className="pb-3 text-sm font-semibold text-gray-600 dark:text-gray-400">Estado</th>
                        <th className="pb-3 text-sm font-semibold text-gray-600 dark:text-gray-400 text-right">Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {agendamentosFalsos.map((agendamento) => (
                        <tr key={agendamento.id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                            <td className="py-4 text-gray-900 dark:text-gray-100 font-medium">{agendamento.cliente}</td>
                            <td className="py-4 text-gray-600 dark:text-gray-300">{agendamento.servico}</td>
                            <td className="py-4 text-gray-600 dark:text-gray-300">{agendamento.data} às {agendamento.hora}</td>
                            <td className="py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${agendamento.estado === 'Confirmado' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                        {agendamento.estado}
                                    </span>
                            </td>
                            <td className="py-4 text-right">
                                <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium mr-4 transition-colors">Editar</button>
                                <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium transition-colors">Cancelar</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}