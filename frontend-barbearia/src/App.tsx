import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Agendamentos } from './pages/Agendamentos';
import { MeusAgendamentos } from './pages/MeusAgendamentos'; // 👈 1. IMPORTANDO A NOVA TELA DO CLIENTE!
import { Servicos } from './pages/Servicos';
import { Clientes } from './pages/Clientes';
import { ThemeToggle } from './components/ThemeToggle';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col items-center justify-center p-4 relative">

                {/* Botão de Tema no canto superior direito */}
                <div className="absolute top-4 right-4">
                    <ThemeToggle />
                </div>

                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/agendamentos" element={<Agendamentos />} />

                    {/* 👇 2. A ROTA QUE ESTAVA FALTANDO PARA O HISTÓRICO EXCLUSIVO! */}
                    <Route path="/meus-agendamentos" element={<MeusAgendamentos />} />

                    <Route path="/servicos" element={<Servicos />} />
                    <Route path="/clientes" element={<Clientes />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;