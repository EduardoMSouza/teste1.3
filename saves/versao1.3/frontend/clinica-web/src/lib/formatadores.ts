// formatadores.ts - ADICIONE estas funções
export const formatadores = {
    cpf: (valor: string): string => {
        const apenasNumeros = valor.replace(/\D/g, '');
        if (apenasNumeros.length <= 3) {
            return apenasNumeros;
        }
        if (apenasNumeros.length <= 6) {
            return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3)}`;
        }
        if (apenasNumeros.length <= 9) {
            return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3, 6)}.${apenasNumeros.slice(6)}`;
        }
        return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3, 6)}.${apenasNumeros.slice(6, 9)}-${apenasNumeros.slice(9, 11)}`;
    },

    telefone: (valor: string): string => {
        const apenasNumeros = valor.replace(/\D/g, '');
        if (apenasNumeros.length <= 2) {
            return `(${apenasNumeros}`;
        }
        if (apenasNumeros.length <= 6) {
            return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2)}`;
        }
        if (apenasNumeros.length <= 10) {
            return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 6)}-${apenasNumeros.slice(6)}`;
        }
        return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 7)}-${apenasNumeros.slice(7, 11)}`;
    },

    cep: (valor: string): string => {
        const apenasNumeros = valor.replace(/\D/g, '');
        if (apenasNumeros.length <= 5) {
            return apenasNumeros;
        }
        return `${apenasNumeros.slice(0, 5)}-${apenasNumeros.slice(5, 8)}`;
    },

    dataParaBackend: (data: string): string => {
        if (!data) return '';
        // Converte dd/mm/aaaa para aaaa-mm-dd
        const partes = data.split('/');
        if (partes.length === 3) {
            return `${partes[2]}-${partes[1]}-${partes[0]}`;
        }
        return data;
    },

    dataDoBackend: (data: string): string => {
        if (!data) return '';
        // Converte aaaa-mm-dd para dd/mm/aaaa
        const partes = data.split('-');
        if (partes.length === 3) {
            return `${partes[2]}/${partes[1]}/${partes[0]}`;
        }
        return data;
    }
};