import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import iconeCalendario from '../assets/calendario-preto.svg';

export interface AgendamentoResponseDTO {
    id: number;
    horaInicial: string;
    horaFinal: string;
    barbeiroNome: string;
    clienteNome: string;
    servicoNome: string;
    statusServico: string;
}

export interface UsuarioDTO { id: number; nome: string; tipoUsuario: string; ativo?: boolean; }
export interface ServicoDTO { id: number; nome: string; preco: number; }

export function Agendamentos() {
    const navigate = useNavigate();

    const [agendamentos, setAgendamentos] = useState<AgendamentoResponseDTO[]>([]);
    const [barbeiros, setBarbeiros] = useState<UsuarioDTO[]>([]);
    const [clientes, setClientes] = useState<UsuarioDTO[]>([]);
    const [servicos, setServicos] = useState<ServicoDTO[]>([]);

    const [loading, setLoading] = useState(true);
    const [modalAberto, setModalAberto] = useState(false);

    const [form, setForm] = useState({ data: '', hora: '', barbeiroId: '', clienteId: '', servicoId: '', statusServico: 'PENDENTE' });
    const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);
    const [filtroBarbeiro, setFiltroBarbeiro] = useState('');

    useEffect(() => {
        carregarDados();
    }, []);

    useEffect(() => {
        if (form.data) {
            const horarios = calcularHorarios(form.data);
            setHorariosDisponiveis(horarios);
            if (!horarios.includes(form.hora)) {
                setForm(prev => ({ ...prev, hora: '' }));
            }
        } else {
            setHorariosDisponiveis([]);
        }
    }, [form.data]);

    const calcularHorarios = (dataEscolhida: string) => {
        const horariosBase = [];
        for (let i = 8; i <= 20; i++) {
            const hora = i.toString().padStart(2, '0');
            horariosBase.push(`${hora}:00`);
            horariosBase.push(`${hora}:30`);
        }

        const hoje = new Date();
        const [ano, mes, dia] = dataEscolhida.split('-').map(Number);
        const isHoje = hoje.getFullYear() === ano && (hoje.getMonth() + 1) === mes && hoje.getDate() === dia;

        if (isHoje) {
            const horaAtual = hoje.getHours();
            const minutoAtual = hoje.getMinutes();

            return horariosBase.filter(h => {
                const [hStr, mStr] = h.split(':');
                const hNum = Number(hStr);
                const mNum = Number(mStr);

                if (hNum > horaAtual) return true;
                if (hNum === horaAtual && mNum > minutoAtual) return true;
                return false;
            });
        }

        return horariosBase;
    };

    const getDataMinima = () => {
        const tzOffset = (new Date()).getTimezoneOffset() * 60000;
        return (new Date(Date.now() - tzOffset)).toISOString().split('T')[0];
    };

    const carregarDados = async () => {
        setLoading(true);
        try {
            const [resAgendamentos, resUsuarios, resServicos] = await Promise.all([
                api.get<AgendamentoResponseDTO[]>('/agendamentos'),
                api.get<UsuarioDTO[]>('/usuarios'),
                api.get<ServicoDTO[]>('/servicos')
            ]);

            setAgendamentos(resAgendamentos.data);
            setServicos(resServicos.data);

            const profs = resUsuarios.data.filter(u => u.ativo !== false && u.tipoUsuario === 'BARBEIRO');
            const clis = resUsuarios.data.filter(u => u.ativo !== false && u.tipoUsuario === 'CLIENTE');

            setBarbeiros(profs);
            setClientes(clis);
        } catch (err) {
            alert('Erro ao carregar dados.');
        } finally {
            setLoading(false);
        }
    };

    const handleSalvar = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const dataHoraCompleta = `${form.data}T${form.hora}:00`;

            const payload = {
                horaInicial: dataHoraCompleta,
                clienteId: Number(form.clienteId),
                barbeiroId: Number(form.barbeiroId),
                servicoId: Number(form.servicoId)
            };

            const response = await api.post('/agendamentos', payload);

            if (form.statusServico !== 'PENDENTE') {
                await api.patch(`/agendamentos/${response.data.id}/status?status=${form.statusServico}`);
            }

            fecharModal();
            carregarDados();
        } catch (err: any) {
            alert(`Erro ao salvar:\n${err.response?.data || 'Verifique os dados'}`);
        }
    };

    const handleAtualizarStatus = async (id: number, novoStatus: string) => {
        try {
            await api.patch(`/agendamentos/${id}/status?status=${novoStatus}`);
            carregarDados();
        } catch (err) {
            alert('Erro ao atualizar status.');
        }
    };

    const abrirModalNovo = () => {
        setForm({ data: '', hora: '', barbeiroId: '', clienteId: '', servicoId: '', statusServico: 'PENDENTE' });
        setModalAberto(true);
    };

    const fecharModal = () => {
        setModalAberto(false);
    };

    const formatarData = (dataIso: string) => {
        return new Date(dataIso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const renderizarStatus = (status: string) => {
        switch (status) {
            case 'CONFIRMADO': return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold border border-blue-200">Confirmado</span>;
            case 'FINALIZADO': return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-bold border border-emerald-200">Concluído</span>;
            case 'CANCELADO': return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold border border-red-200">Cancelado</span>;
            default: return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-bold border border-yellow-200">Pendente</span>;
        }
    };

    const agendamentosFiltrados = filtroBarbeiro
        ? agendamentos.filter(ag => ag.barbeiroNome === filtroBarbeiro)
        : agendamentos;

    return (
        <div className="w-full max-w-6xl mx-auto bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-300 relative">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <img src={iconeCalendario} alt="Ícone de Calendário" className="w-12 h-12 dark:invert transition-all" />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Agendamentos</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Gestão geral de horários da barbearia</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 w-full md:w-auto items-center">
                    <select
                        value={filtroBarbeiro}
                        onChange={(e) => setFiltroBarbeiro(e.target.value)}
                        className="flex-1 md:flex-none px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Todos os profissionais</option>
                        {barbeiros.map(b => (
                            <option key={b.id} value={b.nome}>{b.nome}</option>
                        ))}
                    </select>

                    <button onClick={abrirModalNovo} className="flex-1 md:flex-none px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 font-medium rounded-lg">
                        + Novo Agendamento
                    </button>
                    <button onClick={() => navigate('/dashboard')} className="flex-1 md:flex-none px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium rounded-lg">
                        ← Voltar
                    </button>
                </div>
            </div>

            {loading ? (
                <p className="text-center py-10 dark:text-white">Carregando...</p>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Data/Hora</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Cliente</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Profissional</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Serviço</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">Ações</th>
                        </tr>
                        </thead>
                        <tbody>
                        {agendamentosFiltrados.length === 0 ? (
                            <tr><td colSpan={6} className="p-8 text-center text-gray-500">Nenhum agendamento encontrado.</td></tr>
                        ) : (
                            agendamentosFiltrados.map(ag => (
                                <tr key={ag.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/20">
                                    <td className="p-4 font-medium text-gray-900 dark:text-white">{formatarData(ag.horaInicial)}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-300">{ag.clienteNome}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-300">{ag.barbeiroNome}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-300">{ag.servicoNome}</td>
                                    <td className="p-4">{renderizarStatus(ag.statusServico)}</td>
                                    <td className="p-4 text-right space-x-2">
                                        <select
                                            className="text-sm border rounded p-1 dark:bg-gray-700 dark:text-white dark:border-gray-600 outline-none"
                                            value={ag.statusServico}
                                            onChange={(e) => handleAtualizarStatus(ag.id, e.target.value)}
                                        >
                                            <option value="PENDENTE">Pendente</option>
                                            <option value="CONFIRMADO">Confirmar</option>
                                            <option value="FINALIZADO">Finalizar</option>
                                            <option value="CANCELADO">Cancelar</option>
                                        </select>
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
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Novo Agendamento</h2>

                        <form onSubmit={handleSalvar} className="flex flex-col gap-4">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data do Agendamento</label>
                                <div className="flex gap-2">
                                    <input
                                        required
                                        type="date"
                                        min={getDataMinima()}
                                        value={form.data}
                                        onChange={e => setForm({...form, data: e.target.value})}
                                        className="w-[55%] p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <select
                                        required
                                        disabled={!form.data}
                                        value={form.hora}
                                        onChange={e => setForm({...form, hora: e.target.value})}
                                        className="w-[45%] p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                    >
                                        <option value="" disabled>{form.data ? 'Horário' : 'Selecione a data'}</option>
                                        {horariosDisponiveis.map(h => <option key={h} value={h}>{h}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profissional</label>
                                <select required value={form.barbeiroId} onChange={e => setForm({...form, barbeiroId: e.target.value})} className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="" disabled>Selecione o profissional</option>
                                    {barbeiros.map(b => <option key={b.id} value={b.id}>{b.nome}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cliente</label>
                                <select required value={form.clienteId} onChange={e => setForm({...form, clienteId: e.target.value})} className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="" disabled>Selecione o cliente</option>
                                    {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Serviço</label>
                                <select required value={form.servicoId} onChange={e => setForm({...form, servicoId: e.target.value})} className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="" disabled>Selecione o serviço</option>
                                    {servicos.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                                <select required value={form.statusServico} onChange={e => setForm({...form, statusServico: e.target.value})} className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="PENDENTE">Pendente</option>
                                    <option value="CONFIRMADO">Confirmado</option>
                                    <option value="FINALIZADO">Concluído</option>
                                    <option value="CANCELADO">Cancelado</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 mt-6 border-t dark:border-gray-700 pt-4">
                                <button type="button" onClick={fecharModal} className="px-4 py-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg">Salvar Agendamento</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}