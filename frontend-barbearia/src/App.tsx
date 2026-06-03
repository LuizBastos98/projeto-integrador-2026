import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Agendamentos } from './pages/Agendamentos';
import { Servicos } from './pages/Servicos';
import { Clientes } from './pages/Clientes'; // 👈 Importamos a tela de Clientes
import { ThemeToggle } from './components/ThemeToggle';

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
                <ThemeToggle />

                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/agendamentos" element={<Agendamentos />} />
                    <Route path="/servicos" element={<Servicos />} />

                    {/* Nossa rota final do escopo de hoje! */}
                    <Route path="/clientes" element={<Clientes />} />
                </Routes>

            </div>
        </BrowserRouter>
    );
}

export default App;