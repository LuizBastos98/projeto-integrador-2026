import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

// 1. Adicionamos o campo 'ativo' para o React saber o status
export interface UsuarioDTO {
    id?: number;
    nome: string;
    email: string;
    senha?: string;
    telefone: string;
    tipoUsuario: string;
    ativo?: boolean;
}

export function Clientes() {
    const navigate = useNavigate();

    const [usuarios, setUsuarios] = useState<UsuarioDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [modalAberto, setModalAberto] = useState(false);
    const [usuarioEditandoId, setUsuarioEditandoId] = useState<number | null>(null);
    const [novoUsuario, setNovoUsuario] = useState<UsuarioDTO>({
        nome: '', email: '', senha: '', telefone: '', tipoUsuario: 'CLIENTE'
    });

    useEffect(() => {
        carregarUsuarios();
    }, []);

    const carregarUsuarios = async () => {
        try {
            const response = await api.get<UsuarioDTO[]>('/usuarios');
            setUsuarios(response.data);
            setError(null);
        } catch (err: any) {
            console.error(err);
            setError('Não foi possível carregar os usuários. Verifique se você tem permissão.');
        } finally {
            setLoading(false);
        }
    };

    const handleNovoCadastro = () => {
        setUsuarioEditandoId(null);
        setNovoUsuario({ nome: '', email: '', senha: '', telefone: '', tipoUsuario: 'CLIENTE' });
        setModalAberto(true);
    };

    const handleEditar = (usuario: UsuarioDTO) => {
        setUsuarioEditandoId(usuario.id || null);
        setNovoUsuario({
            nome: usuario.nome,
            email: usuario.email,
            senha: '',
            telefone: usuario.telefone,
            tipoUsuario: usuario.tipoUsuario
        });
        setModalAberto(true);
    };

    // 2. Nossa nova função para alternar o status do usuário
    const handleAlternarStatus = async (usuario: UsuarioDTO) => {
        if (!usuario.id) return;

        // Define a ação baseada no status atual
        const estaAtivo = usuario.ativo !== false; // Se for undefined, consideramos ativo por padrão
        const acaoTexto = estaAtivo ? 'desativar' : 'reativar';

        // Confirmação de segurança para não clicar sem querer
        if (!window.confirm(`Tem certeza que deseja ${acaoTexto} o acesso de ${usuario.nome}?`)) {
            return;
        }

        try {
            if (estaAtivo) {
                // Se está ativo, chama o endpoint de DELETE (que no seu Java apenas desativa)
                await api.delete(`/usuarios/${usuario.id}`);
            } else {
                // Se está inativo, chama o endpoint de PATCH para ativar
                await api.patch(`/usuarios/${usuario.id}/ativar`);
            }

            carregarUsuarios(); // Atualiza a tabela na hora
        } catch (err) {
            alert(`❌ Erro ao ${acaoTexto} usuário. Verifique sua conexão ou permissões.`);
        }
    };

    const handleSalvar = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (usuarioEditandoId) {
                await api.put(`/usuarios/${usuarioEditandoId}`, novoUsuario);
                alert("✅ Usuário atualizado com sucesso!");
            } else {
                await api.post('/usuarios', novoUsuario);
                alert("✅ Usuário criado com sucesso!");
            }

            setModalAberto(false);
            carregarUsuarios();

        } catch (err: any) {
            const respostaErro = err.response?.data;
            let mensagemFinal = "Erro desconhecido ao comunicar com o servidor.";

            if (typeof respostaErro === 'string') {
                mensagemFinal = respostaErro;
            } else if (typeof respostaErro === 'object') {
                const mensagensDeErro = Object.values(respostaErro).join('\n- ');
                mensagemFinal = "Verifique os campos inválidos:\n- " + mensagensDeErro;
            }

            alert(`❌ Falha na operação:\n\n${mensagemFinal}`);
        }
    };

    const renderizarTagTipo = (tipo: string) => {
        switch (tipo) {
            case 'ADMINISTRADOR':
                return <span className="px-3 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-full text-xs font-medium border border-purple-200 dark:border-purple-800">Admin</span>;
            case 'BARBEIRO':
                return <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-medium border border-blue-200 dark:border-blue-800">Barbeiro</span>;
            default:
                return <span className="px-3 py-1 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-full text-xs font-medium border border-gray-200 dark:border-gray-600">Cliente</span>;
        }
    };

    return (
        <div className="w-full max-w-6xl bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-300 relative">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        👥 Clientes & Equipe
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Gerencie os cadastros, acessos e status do sistema</p>
                </div>
                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    <button
                        onClick={handleNovoCadastro}
                        className="flex-1 md:flex-none px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 font-medium rounded-lg transition-colors shadow-sm"
                    >
                        + Novo Cadastro
                    </button>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex-1 md:flex-none px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 font-medium rounded-lg transition-colors flex justify-center items-center gap-2"
                    >
                        <span>←</span> Voltar
                    </button>
                </div>
            </div>

            {loading && <p className="text-center py-10 dark:text-gray-400 animate-pulse">Carregando dados do servidor...</p>}
            {error && <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

            {!loading && !error && (
                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">Nome</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">E-mail</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">Telefone</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">Cargo</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">Status</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">Ações</th>
                        </tr>
                        </thead>
                        <tbody>
                        {usuarios.length === 0 ? (
                            <tr>
                                {/* Ajustado para colSpan=6 */}
                                <td colSpan={6} className="p-8 text-center text-gray-500">Nenhum usuário cadastrado.</td>
                            </tr>
                        ) : (
                            usuarios.map((usuario) => {
                                // Consideramos ativo se for true, ou se o back não enviar o campo consideramos true também
                                const estaAtivo = usuario.ativo !== false;

                                return (
                                    <tr key={usuario.id} className={`border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors ${!estaAtivo ? 'opacity-60 bg-gray-50 dark:bg-gray-800/50' : ''}`}>
                                        <td className="p-4 text-gray-900 dark:text-gray-100 font-medium whitespace-nowrap">{usuario.nome}</td>
                                        <td className="p-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">{usuario.email}</td>
                                        <td className="p-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">{usuario.telefone}</td>
                                        <td className="p-4 whitespace-nowrap">
                                            {renderizarTagTipo(usuario.tipoUsuario)}
                                        </td>
                                        <td className="p-4 whitespace-nowrap">
                                            {/* 3. Tag Visual de Status (Verde ou Vermelho) */}
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${estaAtivo ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' : 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'}`}>
                                                {estaAtivo ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right whitespace-nowrap space-x-4">
                                            <button
                                                onClick={() => handleEditar(usuario)}
                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium transition-colors"
                                            >
                                                Editar
                                            </button>
                                            {/* 4. Botão Dinâmico de Desativar/Ativar */}
                                            <button
                                                onClick={() => handleAlternarStatus(usuario)}
                                                className={`text-sm font-medium transition-colors ${estaAtivo ? 'text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300' : 'text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300'}`}
                                            >
                                                {estaAtivo ? 'Desativar' : 'Reativar'}
                                            </button>
                                        </td>
                                    </tr>
                                )})
                        )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* MODAL DE CRIAÇÃO / EDIÇÃO FICA AQUI IGUAL */}
            {modalAberto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            {usuarioEditandoId ? '✏️ Editar Usuário' : '✨ Novo Cadastro'}
                        </h2>

                        <form onSubmit={handleSalvar} className="flex flex-col gap-4">
                            <div className="flex gap-4 flex-col sm:flex-row">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome Completo</label>
                                    <input required type="text" value={novoUsuario.nome} onChange={e => setNovoUsuario({...novoUsuario, nome: e.target.value})} className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telefone</label>
                                    <input required type="text" value={novoUsuario.telefone} onChange={e => setNovoUsuario({...novoUsuario, telefone: e.target.value.replace(/\D/g, '').slice(0, 11)})} className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Ex: 62900000000" />
                                </div>
                            </div>

                            <div className="flex gap-4 flex-col sm:flex-row">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-mail</label>
                                    <input required type="email" value={novoUsuario.email} onChange={e => setNovoUsuario({...novoUsuario, email: e.target.value})} className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Senha {usuarioEditandoId && <span className="text-gray-400 text-xs">(Confirme ou Redefina)</span>}
                                    </label>
                                    <input required type="password" value={novoUsuario.senha} onChange={e => setNovoUsuario({...novoUsuario, senha: e.target.value})} className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nível de Acesso (Cargo)</label>
                                <select
                                    value={novoUsuario.tipoUsuario}
                                    onChange={e => setNovoUsuario({...novoUsuario, tipoUsuario: e.target.value})}
                                    className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                >
                                    <option value="CLIENTE">Cliente (Apenas marca horários)</option>
                                    <option value="BARBEIRO">Barbeiro (Acessa serviços e agenda)</option>
                                    <option value="ADMINISTRADOR">Administrador (Acesso total)</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setModalAberto(false)} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors shadow-sm">
                                    {usuarioEditandoId ? 'Atualizar' : 'Salvar Cadastro'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}