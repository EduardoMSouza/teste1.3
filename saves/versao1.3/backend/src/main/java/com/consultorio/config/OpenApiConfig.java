package com.consultorio.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.servers.Server;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.context.annotation.Configuration;

@OpenAPIDefinition(
        info = @Info(
                title = "Odontosys - Gestão de Pacientes",
                description = "APIs para cadastro de pacientes, profissionais e gestão de agendas odontológicas.",
                version = "1.0.0",
                contact = @Contact(name = "Equipe Odontosys", email = "contato@odontosys.com"),
                license = @License(name = "MIT", url = "https://opensource.org/licenses/MIT")
        ),
        servers = {
                @Server(url = "http://localhost:8080", description = "Servidor local")
        },
        tags = {
                @Tag(name = "Pacientes", description = "Operações de gerenciamento de pacientes"),
                @Tag(name = "Profissionais", description = "Cadastro e consulta de profissionais"),
                @Tag(name = "Agendas", description = "Gestão de agendas por dentista e marcação de consultas")
        }
)
@Configuration
public class OpenApiConfig {
}
