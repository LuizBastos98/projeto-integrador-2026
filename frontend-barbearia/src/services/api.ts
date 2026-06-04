import axios from 'axios';

// Criação da instância do Axios com a URL do seu Spring Boot
export const api = axios.create({
    baseURL: 'http://192.168.1.251:8080',
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