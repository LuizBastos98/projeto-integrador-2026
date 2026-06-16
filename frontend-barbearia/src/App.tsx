import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Agendamentos } from './pages/Agendamentos';
import { MeusAgendamentos } from './pages/MeusAgendamentos';
import { Servicos } from './pages/Servicos';
import { Clientes } from './pages/Clientes';
import { ThemeToggle } from './components/ThemeToggle';


const RotaProtegida = ({ children, rolesPermitidas }: { children: JSX.Element, rolesPermitidas?: string[] }) => {
    const token = localStorage.getItem('token');
    const tipoUsuario = localStorage.getItem('tipoUsuario');


    if (!token) {
        return <Navigate to="/" replace />;
    }


    if (rolesPermitidas && tipoUsuario && !rolesPermitidas.includes(tipoUsuario)) {
        return <Navigate to="/dashboard" replace />;
    }


    return children;
};

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col items-center justify-center p-4 relative">

                {/* Botão de Tema */}
                <div className="absolute top-4 right-4 z-50">
                    <ThemeToggle />
                </div>

                <Routes>

                    <Route path="/" element={<Login />} />


                    <Route path="/dashboard" element={
                        <RotaProtegida>
                            <Dashboard />
                        </RotaProtegida>
                    } />

                    <Route path="/meus-agendamentos" element={
                        <RotaProtegida>
                            <MeusAgendamentos />
                        </RotaProtegida>
                    } />


                    <Route path="/agendamentos" element={
                        <RotaProtegida rolesPermitidas={['ADMINISTRADOR', 'BARBEIRO']}>
                            <Agendamentos />
                        </RotaProtegida>
                    } />

                    <Route path="/servicos" element={
                        <RotaProtegida rolesPermitidas={['ADMINISTRADOR', 'BARBEIRO']}>
                            <Servicos />
                        </RotaProtegida>
                    } />


                    <Route path="/clientes" element={
                        <RotaProtegida rolesPermitidas={['ADMINISTRADOR']}>
                            <Clientes />
                        </RotaProtegida>
                    } />

                </Routes>
            </div>
        </Router>
    );
}

export default App;