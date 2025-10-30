const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

export const api = {
  // GET - Buscar todos os pacientes
  async getAllPatients() {
    try {
      const response = await fetch(`${API_BASE_URL}/pacientes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Erro ao buscar pacientes")
      }

      return await response.json()
    } catch (error) {
      console.error("Erro na API:", error)
      throw error
    }
  },

  // GET - Buscar paciente por ID
  async getPatientById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/pacientes/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Paciente não encontrado")
      }

      return await response.json()
    } catch (error) {
      console.error("Erro na API:", error)
      throw error
    }
  },

  // POST - Criar novo paciente
  async createPatient(patientData) {
    try {
      const response = await fetch(`${API_BASE_URL}/pacientes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientData),
      })

      if (!response.ok) {
        throw new Error("Erro ao cadastrar paciente")
      }

      return await response.json()
    } catch (error) {
      console.error("Erro na API:", error)
      throw error
    }
  },

  // PUT - Atualizar paciente
  async updatePatient(id, patientData) {
    try {
      const response = await fetch(`${API_BASE_URL}/pacientes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientData),
      })

      if (!response.ok) {
        throw new Error("Erro ao atualizar paciente")
      }

      return await response.json()
    } catch (error) {
      console.error("Erro na API:", error)
      throw error
    }
  },

  // DELETE - Deletar paciente
  async deletePatient(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/pacientes/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Erro ao deletar paciente")
      }

      return true
    } catch (error) {
      console.error("Erro na API:", error)
      throw error
    }
  },

  // GET - Buscar paciente por nome
  async searchPatientByName(name) {
    try {
      const response = await fetch(`${API_BASE_URL}/pacientes/buscar?nome=${encodeURIComponent(name)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Erro ao buscar paciente")
      }

      return await response.json()
    } catch (error) {
      console.error("Erro na API:", error)
      throw error
    }
  },
}
