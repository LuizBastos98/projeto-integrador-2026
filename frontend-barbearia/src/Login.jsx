import { useState } from 'react';

function Login() {
    // Estados para armazenar o que o usuário digita
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita que a página recarregue

        const dadosLogin = {
            email: email,
            senha: senha
        };

        try {
            const response = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dadosLogin)
            });

            if (response.ok) {
                const data = await response.json();
                // O seu LoginResponseDTO deve devolver o token aqui
                localStorage.setItem("token", data.token);
                alert("Login realizado com sucesso!");
            } else {
                alert("Erro ao fazer login. Verifique suas credenciais.");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Não foi possível conectar ao servidor. O back-end está rodando?");
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '300px', margin: 'auto' }}>
            <h2>Login - Barbearia</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <br />
                <div>
                    <label>Senha:</label>
                    <input
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />
                </div>
                <br />
                <button type="submit">Entrar</button>
            </form>
        </div>
    );
}

export default Login;