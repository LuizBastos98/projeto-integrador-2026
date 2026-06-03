import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export interface ServicoDTO {
    id?: number;
    nome: string;
    descricao: string;
    duracao: string;
    preco: number | string;
}

export function Servicos() {
    const navigate = useNavigate();

    const [servicos, setServicos] = useState<ServicoDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // 👇 ESTE É O "MOTOR" DO MODAL QUE FALTAVA
    const [modalAberto, setModalAberto] = useState(false);
    const [novoServico, setNovoServico] = useState<ServicoDTO>({ nome: '', descricao: '', duracao: '', preco: '' });

    useEffect(() => {
        carregarServicos();
    }, []);

    const carregarServicos = async () => {
        try {
            const response = await api.get<ServicoDTO[]>('/servicos');
            setServicos(response.data);
            setError(null);
        } catch (err: any) {
            console.error(err);
            setError('Não foi possível carregar os serviços. Verifique a conexão.');
        } finally {
            setLoading(false);
        }
    };

    const handleSalvar = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Garante que o preço vai como número pro Java
            const payload = { ...novoServico, preco: Number(novoServico.preco) };

            await api.post('/servicos', payload);

            setModalAberto(false); // Fecha a janelinha
            setNovoServico({ nome: '', descricao: '', duracao: '', preco: '' }); // Limpa os campos
            carregarServicos(); // Recarrega a tabela!

        } catch (err) {
            alert('Erro ao criar serviço. Tente novamente.');
        }
    };

    const formatarMoeda = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
    };

    return (
        <div className="w-full max-w-5xl bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-300 relative">

            {/* Cabeçalho */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        ✂️ Serviços
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Gestão de preçário e cortes</p>
                </div>
                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    {/* 👇 OLHA O EVENTO onClick AQUI PLUGADO NO MODAL */}
                    <button
                        onClick={() => setModalAberto(true)}
                        className="flex-1 md:flex-none px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 font-medium rounded-lg transition-colors shadow-sm"
                    >
                        + Novo Serviço
                    </button>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex-1 md:flex-none px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 font-medium rounded-lg transition-colors flex justify-center items-center gap-2"
                    >
                        <span>←</span> Voltar
                    </button>
                </div>
            </div>

            {loading && <p className="text-center py-10 dark:text-gray-400 animate-pulse">Carregando...</p>}
            {error && <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

            {/* Tabela de Dados */}
            {!loading && !error && (
                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">Nome do Serviço</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">Descrição</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">Duração</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">Preço</th>
                        </tr>
                        </thead>
                        <tbody>
                        {servicos.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-500">Nenhum serviço encontrado no banco de dados.</td>
                            </tr>
                        ) : (
                            servicos.map((servico) => (
                                <tr key={servico.id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                                    <td className="p-4 text-gray-900 dark:text-gray-100 font-medium whitespace-nowrap">{servico.nome}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-300 text-sm min-w-[200px]">{servico.descricao}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">{servico.duracao}</td>
                                    <td className="p-4 text-emerald-600 dark:text-emerald-400 font-semibold whitespace-nowrap">
                                        {formatarMoeda(Number(servico.preco))}
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* 👇 ESTA É A JANELA FLUTUANTE (MODAL) */}
            {modalAberto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in duration-200">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Novo Serviço</h2>

                        <form onSubmit={handleSalvar} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome do Corte</label>
                                <input required type="text" value={novoServico.nome} onChange={e => setNovoServico({...novoServico, nome: e.target.value})} className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Ex: Degradê Navalhado" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição</label>
                                <input required type="text" value={novoServico.descricao} onChange={e => setNovoServico({...novoServico, descricao: e.target.value})} className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Ex: Corte com tesoura e máquina..." />
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duração</label>
                                    <input required type="text" value={novoServico.duracao} onChange={e => setNovoServico({...novoServico, duracao: e.target.value})} className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Ex: 45 min" />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preço (R$)</label>
                                    <input required type="number" step="0.01" value={novoServico.preco} onChange={e => setNovoServico({...novoServico, preco: e.target.value})} className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="35.00" />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setModalAberto(false)} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">Salvar Serviço</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}