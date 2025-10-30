export interface Endereco {
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
}

export interface ContatoEmergencia {
    nome?: string;
    telefone?: string;
    parentesco?: string;
}

export interface Responsavel {
    nome?: string;
    rg?: string;
    orgaoExpedidor?: string;
    cpf?: string;
    estadoCivil?: string;
    nomeConjuge?: string;
    cpfConjuge?: string;
}

export interface Paciente {
    id: number;
    nome: string;
    cpf?: string;
    rg?: string;
    orgaoExpedidor?: string;
    email?: string;
    telefone?: string;
    dataNascimento?: string;
    sexo?: 'MASCULINO' | 'FEMININO' | 'OUTRO';
    estadoCivil?: string;
    endereco?: Endereco;
    profissao?: string;
    naturalidade?: string;
    nacionalidade?: string;
    convenio?: string;
    numeroCarteirinha?: string;
    contatoEmergencia?: ContatoEmergencia;
    responsavel?: Responsavel;
    observacoesGerais?: string;
    dataCadastro: string;
    dataAtualizacao: string;
    status: string;
}

export interface PacienteCreateDTO {
    nome: string;
    cpf?: string;
    rg?: string;
    orgaoExpedidor?: string;
    email?: string;
    telefone?: string;
    dataNascimento?: string;
    sexo?: 'MASCULINO' | 'FEMININO' | 'OUTRO';
    estadoCivil?: string;
    endereco?: Endereco;
    profissao?: string;
    naturalidade?: string;
    nacionalidade?: string;
    convenio?: string;
    numeroCarteirinha?: string;
    contatoEmergencia?: ContatoEmergencia;
    responsavel?: Responsavel;
    observacoesGerais?: string;
}

export interface PacienteUpdateDTO extends Partial<PacienteCreateDTO> {}

export interface PacienteResponseDTO extends Paciente {}

export interface PacienteListDTO {
    id: number;
    nome: string;
    cpf?: string;
    telefone?: string;
    email?: string;
    dataNascimento?: string;
    status: string;
}

export interface StatusUpdateDTO {
    status: string;
}