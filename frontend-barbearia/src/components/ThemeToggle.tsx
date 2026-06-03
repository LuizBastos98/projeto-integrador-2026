import { useEffect, useState } from 'react';

export function ThemeToggle() {
    const [isDark, setIsDark] = useState<boolean>(false);

    useEffect(() => {
        // Verifica se o usuário já tinha escolhido o dark mode antes
        const theme = localStorage.getItem('theme');
        if (theme === 'dark') {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDark(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDark(true);
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="fixed top-4 right-4 p-3 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-md hover:scale-110 transition-transform duration-200"
            title="Alternar Tema"
        >
            {isDark ? '☀️' : '🌙'}
        </button>
    );
}