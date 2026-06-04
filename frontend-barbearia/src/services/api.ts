import axios from 'axios';

// 1. Descobre qual IP está na barra de endereços do navegador agora mesmo
const hostAtual = window.location.hostname;

// 2. A Mágica: Se for o IP do seu amigo (.78), o Axios mira na porta 8080 dele.
// Se não for (seja você no .79 ou testando em localhost), mira no seu .79.
const urlBackend = hostAtual === '100.113.122.78'
    ? 'http://100.113.122.78:8080'
    : 'http://100.113.122.79:8080';

// Criação da instância do Axios usando a URL decidida automaticamente acima
export const api = axios.create({
    baseURL: urlBackend,
    timeout: 10000,
});

// Interceptor para injetar o token JWT automaticamente em todas as requisições
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor de RESPOSTA para lidar com Tokens Expirados
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Se o erro for 403 (Proibido) ou 401 (Não Autorizado)
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.log("Token expirado ou inválido. Deslogando...");
            localStorage.removeItem('token');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);