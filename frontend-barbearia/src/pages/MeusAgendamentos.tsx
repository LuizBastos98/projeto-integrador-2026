import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import iconeCalendario from '../assets/calendario.svg';

export interface AgendamentoResponseDTO {
    id: number;
    horaInicial: string;
    horaFinal: string;
    barbeiroNome: string;
    servicoNome: string;
    statusServico: string;
}

export interface UsuarioDTO { id: number; nome: string; tipoUsuario: string; ativo?: boolean; }
export interface ServicoDTO { id: number; nome: string; preco: number; }

export function MeusAgendamentos() {
    const navigate = useNavigate();
    const clienteId = localStorage.getItem('usuarioId');
    const nomeCliente = localStorage.getItem('nomeUsuario');

    const [meusAgendamentos, setMeusAgendamentos] = useState<AgendamentoResponseDTO[]>([]);
    const [barbeiros, setBarbeiros] = useState<UsuarioDTO[]>([]);
    const [servicos, setServicos] = useState<ServicoDTO[]>([]);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({ data: '', hora: '', barbeiroId: '', servicoId: '' });

    const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);

    useEffect(() => {
        if (!clienteId) {
            navigate('/');
            return;
        }
        carregarDados();
    }, []);

    useEffect(() => {
        if (form.data) {
            const horarios = calcularHorarios(form.data);
            setHorariosDisponiveis(horarios);
            // Se a data mudou, limpamos a hora antiga para ele escolher de novo
            setForm(prev => ({ ...prev, hora: '' }));
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

    const carregarDados = async () => {
        setLoading(true);
        try {
            const [resAgendamentos, resUsuarios, resServicos] = await Promise.all([
                api.get<AgendamentoResponseDTO[]>(`/agendamentos/cliente/${clienteId}`),
                api.get<UsuarioDTO[]>('/usuarios'),
                api.get<ServicoDTO[]>('/servicos')
            ]);

            setMeusAgendamentos(resAgendamentos.data);
            setServicos(resServicos.data);

            const profs = resUsuarios.data.filter(u => u.ativo !== false && u.tipoUsuario === 'BARBEIRO');
            setBarbeiros(profs);
        } catch (err) {
            alert('Erro ao carregar seus dados.');
        } finally {
            setLoading(false);
        }
    };

    const handleAgendar = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Junta Data e Hora no formato universal do Java (ISO)
            const dataHoraCompleta = `${form.data}T${form.hora}:00`;

            const payload = {
                horaInicial: dataHoraCompleta,
                clienteId: Number(clienteId),
                barbeiroId: Number(form.barbeiroId),
                servicoId: Number(form.servicoId)
            };

            await api.post('/agendamentos', payload);
            alert("✅ Horário marcado com sucesso!");
            setForm({ data: '', hora: '', barbeiroId: '', servicoId: '' });
            carregarDados();
        } catch (err: any) {
            alert(`❌ Erro ao agendar:\n${err.response?.data || 'Verifique os dados'}`);
        }
    };

    const handleCancelar = async (id: number) => {
        if (!window.confirm('Tem certeza que deseja cancelar este agendamento?')) return;
        try {
            await api.patch(`/agendamentos/${id}/status?status=CANCELADO`);
            carregarDados();
        } catch (err) {
            alert('Erro ao cancelar.');
        }
    };

    const formatarData = (dataIso: string) => {
        return new Date(dataIso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    };

    // Bloqueia clicar em dias passados no calendário
    const getDataMinima = () => {
        const tzOffset = (new Date()).getTimezoneOffset() * 60000;
        return (new Date(Date.now() - tzOffset)).toISOString().split('T')[0];
    };

    const renderizarStatus = (status: string) => {
        switch (status) {
            case 'CONFIRMADO': return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">Confirmado</span>;
            case 'FINALIZADO': return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-bold">Concluído</span>;
            case 'CANCELADO': return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold">Cancelado</span>;
            default: return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-bold">Pendente</span>;
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            <div className="flex justify-between items-center mb-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Olá, {nomeCliente?.split(' ')[0]}! </h1>
                    <p className="text-gray-500">Bem-vindo ao seu portal exclusivo de agendamentos.</p>
                </div>
                <button onClick={() => { localStorage.clear(); navigate('/'); }} className="text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors font-medium">Sair</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-fit">
                    <img src={iconeCalendario} alt="Ícone de Calendário" className="w-8 h-8 mb-4 dark:brightness-0 dark:invert transition-all" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Marcar Horário</h2>

                    <form onSubmit={handleAgendar} className="flex flex-col gap-4">

                        {/* 👇 A ARQUITETURA VISUAL: Data e Hora agrupados e limpos */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data e Hora do Corte</label>
                            <div className="flex gap-2">
                                <input
                                    required
                                    type="date"
                                    min={getDataMinima()} // Trava os dias passados
                                    value={form.data}
                                    onChange={e => setForm({...form, data: e.target.value})}
                                    className="w-[55%] p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <select
                                    required
                                    disabled={!form.data} // Só deixa escolher a hora DEPOIS de escolher o dia
                                    value={form.hora}
                                    onChange={e => setForm({...form, hora: e.target.value})}
                                    className="w-[45%] p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <option value="" disabled>{form.data ? 'Horário' : 'Selecione o dia'}</option>
                                    {horariosDisponiveis.map(h => <option key={h} value={h}>{h}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profissional</label>
                            <select required value={form.barbeiroId} onChange={e => setForm({...form, barbeiroId: e.target.value})} className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="" disabled>Quem vai te atender?</option>
                                {barbeiros.map(b => <option key={b.id} value={b.id}>{b.nome}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Serviço</label>
                            <select required value={form.servicoId} onChange={e => setForm({...form, servicoId: e.target.value})} className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="" disabled>O que vamos fazer hoje?</option>
                                {servicos.map(s => <option key={s.id} value={s.id}>{s.nome} - R$ {s.preco.toFixed(2)}</option>)}
                            </select>
                        </div>
                        <button type="submit" className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-all active:scale-95">Confirmar Reserva</button>
                    </form>
                </div>

                {/* COLUNA DIREITA: Histórico */}
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6"> Seu Histórico</h2>
                    {loading ? (
                        <p className="animate-pulse text-gray-500">Buscando seus horários...</p>
                    ) : meusAgendamentos.length === 0 ? (
                        <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl text-center border border-dashed border-gray-300">
                            <p className="text-gray-500">Você ainda não tem nenhum horário marcado com a gente.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {meusAgendamentos.map(ag => (
                                <div key={ag.id} className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg font-bold text-gray-900 dark:text-white">{formatarData(ag.horaInicial)}</span>
                                            {renderizarStatus(ag.statusServico)}
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400 font-medium">{ag.servicoNome}</p>
                                        <p className="text-sm text-gray-500">Com {ag.barbeiroNome}</p>
                                    </div>

                                    {(ag.statusServico === 'PENDENTE' || ag.statusServico === 'CONFIRMADO') && (
                                        <button onClick={() => handleCancelar(ag.id)} className="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors">
                                            Cancelar Horário
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}