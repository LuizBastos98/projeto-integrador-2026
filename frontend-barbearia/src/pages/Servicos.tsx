import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export interface ServicoDTO {
    id?: number;
    nome: string;
    descricao: string;
    tempoDuracao: string; // 1️⃣ Correção aqui
    preco: number | string;
}

export function Servicos() {
    const navigate = useNavigate();

    const [servicos, setServicos] = useState<ServicoDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [modalAberto, setModalAberto] = useState(false);
    const [servicoEditandoId, setServicoEditandoId] = useState<number | null>(null);

    // 2️⃣ Correção no estado inicial
    const [novoServico, setNovoServico] = useState<ServicoDTO>({ nome: '', descricao: '', tempoDuracao: '', preco: '' });

    useEffect(() => { carregarServicos(); }, []);

    const carregarServicos = async () => {
        try {
            const response = await api.get<ServicoDTO[]>('/servicos');
            setServicos(response.data);
            setError(null);
        } catch (err: any) {
            console.error(err);
            setError('Não foi possível carregar os serviços.');
        } finally {
            setLoading(false);
        }
    };

    const handleSalvar = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = { ...novoServico, preco: Number(novoServico.preco) };

            if (servicoEditandoId) {
                await api.put(`/servicos/${servicoEditandoId}`, payload);
            } else {
                await api.post('/servicos', payload);
            }

            fecharModal();
            carregarServicos();
        } catch (err) {
            alert('Erro ao salvar serviço. Tente novamente.');
        }
    };

    const handleEditar = (servico: ServicoDTO) => {
        if (!servico.id) return;
        setServicoEditandoId(servico.id);
        // 3️⃣ Correção na hora de carregar para edição
        setNovoServico({
            nome: servico.nome,
            descricao: servico.descricao,
            tempoDuracao: servico.tempoDuracao,
            preco: servico.preco
        });
        setModalAberto(true);
    };

    const handleExcluir = async (id: number | undefined) => {
        if (!id) return;
        if (window.confirm("🚨 Tem certeza que deseja excluir este serviço?")) {
            try {
                await api.delete(`/servicos/${id}`);
                carregarServicos();
            } catch (err) { alert('Erro ao excluir o serviço.'); }
        }
    };

    const abrirModalNovo = () => {
        setServicoEditandoId(null);
        // Correção no estado inicial
        setNovoServico({ nome: '', descricao: '', tempoDuracao: '', preco: '' });
        setModalAberto(true);
    };

    const fecharModal = () => {
        setModalAberto(false);
        setServicoEditandoId(null);
        // Correção no estado inicial
        setNovoServico({ nome: '', descricao: '', tempoDuracao: '', preco: '' });
    };

    const formatarMoeda = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
    };

    return (
        <div className="w-full max-w-5xl bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-300 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">✂️ Serviços</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Gestão de preçário e cortes</p>
                </div>
                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    <button onClick={abrirModalNovo} className="flex-1 md:flex-none px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 font-medium rounded-lg">
                        + Novo Serviço
                    </button>
                    <button onClick={() => navigate('/dashboard')} className="flex-1 md:flex-none px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium rounded-lg">
                        ← Voltar
                    </button>
                </div>
            </div>

            {loading && <p className="text-center py-10">Carregando...</p>}
            {error && <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

            {!loading && !error && (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead className="bg-gray-50">
                        <tr className="border-b border-gray-200">
                            <th className="p-4 text-sm font-semibold text-gray-600">Nome do Serviço</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Descrição</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Duração</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Preço</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 text-right">Ações</th>
                        </tr>
                        </thead>
                        <tbody>
                        {servicos.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-500">Nenhum serviço encontrado.</td></tr>
                        ) : (
                            servicos.map((servico) => (
                                <tr key={servico.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="p-4 text-gray-900 font-medium">{servico.nome}</td>
                                    <td className="p-4 text-gray-600 text-sm">{servico.descricao}</td>
                                    {/* 4️⃣ Correção na hora de exibir na tabela */}
                                    <td className="p-4 text-gray-600">{servico.tempoDuracao}</td>
                                    <td className="p-4 text-emerald-600 font-semibold">{formatarMoeda(Number(servico.preco))}</td>
                                    <td className="p-4 text-right space-x-3">
                                        <button onClick={() => handleEditar(servico)} className="text-blue-500 hover:text-blue-700 font-medium">Editar</button>
                                        <button onClick={() => handleExcluir(servico.id)} className="text-red-400 hover:text-red-600 font-medium">Excluir</button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            )}

            {modalAberto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">{servicoEditandoId ? 'Editar Serviço' : 'Novo Serviço'}</h2>

                        <form onSubmit={handleSalvar} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Corte</label>
                                <input required type="text" value={novoServico.nome} onChange={e => setNovoServico({...novoServico, nome: e.target.value})} className="w-full p-2 border rounded-lg bg-gray-50" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                <input required type="text" value={novoServico.descricao} onChange={e => setNovoServico({...novoServico, descricao: e.target.value})} className="w-full p-2 border rounded-lg bg-gray-50" />
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Duração</label>
                                    {/* 5️⃣ Correção no Input do Modal */}
                                    <input required type="text" value={novoServico.tempoDuracao} onChange={e => setNovoServico({...novoServico, tempoDuracao: e.target.value})} className="w-full p-2 border rounded-lg bg-gray-50" placeholder="Ex: 45 min" />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
                                    <input required type="number" step="0.01" value={novoServico.preco} onChange={e => setNovoServico({...novoServico, preco: e.target.value})} className="w-full p-2 border rounded-lg bg-gray-50" />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={fecharModal} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg">Salvar Serviço</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}