import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import iconeCalendario from '../assets/calendario-preto.svg';

// --- INTERFACES ---
export interface AgendamentoResponseDTO {
    id: number;
    horaInicial: string;
    horaFinal: string;
    clienteNome: string;
    barbeiroNome: string;
    servicoNome: string;
    statusServico: string;
}

export interface UsuarioDTO {
    id: number;
    nome: string;
    tipoUsuario: string;
    ativo?: boolean;
}

export interface ServicoDTO {
    id: number;
    nome: string;
    preco: number;
}

export function Agendamentos() {
    const navigate = useNavigate();

    const [agendamentos, setAgendamentos] = useState<AgendamentoResponseDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [clientes, setClientes] = useState<UsuarioDTO[]>([]);
    const [barbeiros, setBarbeiros] = useState<UsuarioDTO[]>([]);
    const [servicos, setServicos] = useState<ServicoDTO[]>([]);

    const [modalAberto, setModalAberto] = useState(false);
    const [form, setForm] = useState({
        horaInicial: '',
        clienteId: '',
        barbeiroId: '',
        servicoId: ''
    });

    useEffect(() => {
        carregarAgendamentos();
        carregarDadosParaFormulario();
    }, []);

    const carregarAgendamentos = async () => {
        setLoading(true);
        try {
            const response = await api.get<AgendamentoResponseDTO[]>('/agendamentos');
            setAgendamentos(response.data);
        } catch (err) {
            console.error(err);
            alert('Erro ao carregar agendamentos.');
        } finally {
            setLoading(false);
        }
    };

    const carregarDadosParaFormulario = async () => {
        try {
            const [resUsuarios, resServicos] = await Promise.all([
                api.get<UsuarioDTO[]>('/usuarios'),
                api.get<ServicoDTO[]>('/servicos')
            ]);

            const usuariosAtivos = resUsuarios.data.filter(u => u.ativo !== false);
            setClientes(usuariosAtivos.filter(u => u.tipoUsuario === 'CLIENTE'));
            setBarbeiros(usuariosAtivos.filter(u => u.tipoUsuario === 'BARBEIRO' || u.tipoUsuario === 'ADMINISTRADOR'));
            setServicos(resServicos.data);
        } catch (err) {
            console.error("Erro ao carregar dados", err);
        }
    };

    const handleSalvar = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                horaInicial: form.horaInicial,
                clienteId: Number(form.clienteId),
                barbeiroId: Number(form.barbeiroId),
                servicoId: Number(form.servicoId)
            };

            await api.post('/agendamentos', payload);
            alert("✅ Agendamento criado com sucesso!");

            setModalAberto(false);
            setForm({ horaInicial: '', clienteId: '', barbeiroId: '', servicoId: '' });
            carregarAgendamentos();
        } catch (err: any) {
            alert(`❌ Erro ao criar agendamento:\n${err.response?.data || 'Verifique os dados'}`);
        }
    };

    const handleAlterarStatus = async (id: number, novoStatus: string) => {
        if (!window.confirm(`Deseja alterar o status para ${novoStatus}?`)) return;

        try {
            await api.patch(`/agendamentos/${id}/status?status=${novoStatus}`);
            carregarAgendamentos();
        } catch (err) {
            alert('Erro ao atualizar o status do agendamento.');
        }
    };

    const formatarData = (dataIso: string) => {
        const data = new Date(dataIso);
        return data.toLocaleString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const renderizarTagStatus = (status: string) => {
        switch (status) {
            case 'CONFIRMADO': return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium border border-blue-200">Confirmado</span>;
            case 'FINALIZADO': return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200">Finalizado</span>;
            case 'CANCELADO': return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium border border-red-200">Cancelado</span>;
            default: return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium border border-yellow-200">Pendente</span>;
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto bg-white dark:bg-gray-800 p-4 md:p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">

            {/* CABEÇALHO */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">

                {/* 👇 Ícone e Títulos agrupados na mesma linha */}
                <div className="flex items-center gap-4">
                    <img
                        src={iconeCalendario}
                        alt="Ícone de Calendário"
                        className="w-12 h-12 dark:invert"
                    />
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Agendamentos</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm md:text-base">Gerencie os horários da barbearia</p>
                    </div>
                </div>

                <div className="flex w-full sm:w-auto gap-3">
                    <button onClick={() => setModalAberto(true)} className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 font-medium rounded-lg shadow-sm whitespace-nowrap">+ Novo</button>
                    <button onClick={() => navigate('/dashboard')} className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium rounded-lg">← Voltar</button>
                </div>
            </div>

            {loading && <p className="text-center py-10 dark:text-gray-400 animate-pulse">Carregando agendamentos...</p>}

            {!loading && (
                <div className="w-full">

                    {/* VISÃO MOBILE: Exibição em Cartões */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {agendamentos.length === 0 ? (
                            <div className="text-center p-6 border rounded-xl text-gray-500 bg-gray-50">Nenhum agendamento encontrado.</div>
                        ) : (
                            agendamentos.map((ag) => (
                                <div key={ag.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col gap-3">
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex-1 pr-2">
                                            <h3 className="font-bold text-lg text-gray-900 leading-tight">{ag.clienteNome}</h3>
                                            <p className="text-blue-600 font-medium text-sm mt-1">{ag.servicoNome}</p>
                                        </div>
                                        <div className="shrink-0">{renderizarTagStatus(ag.statusServico)}</div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 flex flex-col gap-1.5 border border-gray-100">
                                        <p className="flex items-center gap-2"><span>📅</span> <strong>{formatarData(ag.horaInicial)}</strong></p>
                                        <p className="flex items-center gap-2 text-gray-500 text-xs"><span>⌛</span> Até {formatarData(ag.horaFinal)}</p>
                                        <p className="flex items-center gap-2 mt-1"><span>✂️</span> Profissional: <strong>{ag.barbeiroNome}</strong></p>
                                    </div>

                                    <div className="flex gap-2 mt-2">
                                        {ag.statusServico === 'PENDENTE' && (
                                            <button onClick={() => handleAlterarStatus(ag.id, 'CONFIRMADO')} className="flex-1 py-2.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm font-semibold active:bg-blue-100">Confirmar</button>
                                        )}
                                        {(ag.statusServico === 'PENDENTE' || ag.statusServico === 'CONFIRMADO') && (
                                            <>
                                                <button onClick={() => handleAlterarStatus(ag.id, 'FINALIZADO')} className="flex-1 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm font-semibold active:bg-emerald-100">Concluir</button>
                                                <button onClick={() => handleAlterarStatus(ag.id, 'CANCELADO')} className="flex-1 py-2.5 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-semibold active:bg-red-100">Cancelar</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* VISÃO DESKTOP: Tabela Tradicional */}
                    <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Data e Hora</th>
                                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Cliente</th>
                                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Barbeiro</th>
                                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Serviço</th>
                                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">Ações</th>
                            </tr>
                            </thead>
                            <tbody>
                            {agendamentos.length === 0 ? (
                                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Nenhum agendamento encontrado.</td></tr>
                            ) : (
                                agendamentos.map((ag) => (
                                    <tr key={ag.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/20">
                                        <td className="p-4">
                                            <div className="font-medium text-gray-900 dark:text-gray-100">{formatarData(ag.horaInicial)}</div>
                                            <div className="text-xs text-gray-500">Até {formatarData(ag.horaFinal)}</div>
                                        </td>
                                        <td className="p-4 text-gray-800 dark:text-gray-300 font-medium">{ag.clienteNome}</td>
                                        <td className="p-4 text-gray-600 dark:text-gray-400">{ag.barbeiroNome}</td>
                                        <td className="p-4 text-gray-600 dark:text-gray-400">{ag.servicoNome}</td>
                                        <td className="p-4">{renderizarTagStatus(ag.statusServico)}</td>
                                        <td className="p-4 text-right space-x-3 whitespace-nowrap">
                                            {ag.statusServico === 'PENDENTE' && (
                                                <button onClick={() => handleAlterarStatus(ag.id, 'CONFIRMADO')} className="text-blue-600 hover:underline text-sm font-medium">Confirmar</button>
                                            )}
                                            {(ag.statusServico === 'PENDENTE' || ag.statusServico === 'CONFIRMADO') && (
                                                <>
                                                    <button onClick={() => handleAlterarStatus(ag.id, 'FINALIZADO')} className="text-emerald-600 hover:underline text-sm font-medium">Concluir</button>
                                                    <button onClick={() => handleAlterarStatus(ag.id, 'CANCELADO')} className="text-red-600 hover:underline text-sm font-medium">Cancelar</button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* MODAL DE NOVO AGENDAMENTO (Responsivo) */}
            {modalAberto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Novo Agendamento</h2>

                        <form onSubmit={handleSalvar} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data e Hora</label>
                                <input required type="datetime-local" value={form.horaInicial} onChange={e => setForm({...form, horaInicial: e.target.value})} className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cliente</label>
                                <select required value={form.clienteId} onChange={e => setForm({...form, clienteId: e.target.value})} className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none">
                                    <option value="" disabled>Selecione um cliente...</option>
                                    {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profissional</label>
                                <select required value={form.barbeiroId} onChange={e => setForm({...form, barbeiroId: e.target.value})} className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none">
                                    <option value="" disabled>Selecione um profissional...</option>
                                    {barbeiros.map(b => <option key={b.id} value={b.id}>{b.nome}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Serviço</label>
                                <select required value={form.servicoId} onChange={e => setForm({...form, servicoId: e.target.value})} className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none">
                                    <option value="" disabled>Selecione um serviço...</option>
                                    {servicos.map(s => <option key={s.id} value={s.id}>{s.nome} - R$ {s.preco.toFixed(2)}</option>)}
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
                                <button type="button" onClick={() => setModalAberto(false)} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm">Confirmar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}