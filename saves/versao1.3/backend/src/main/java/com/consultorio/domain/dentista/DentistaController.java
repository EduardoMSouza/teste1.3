// DentistaController.java
package com.consultorio.domain.dentista;

import com.consultorio.domain.dentista.dto.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/dentistas")
@CrossOrigin(origins = "*")
public class DentistaController {

    private final DentistaService service;

    public DentistaController(DentistaService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<DentistaResponseDTO> criar(@Valid @RequestBody DentistaCreateDTO dto) {
        DentistaResponseDTO response = service.criar(dto);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.getId())
                .toUri();
        return ResponseEntity.created(location).body(response);
    }

    @GetMapping
    public ResponseEntity<List<DentistaListDTO>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @GetMapping("/ativos")
    public ResponseEntity<List<DentistaListDTO>> listarAtivos() {
        return ResponseEntity.ok(service.listarAtivos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DentistaResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DentistaResponseDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody DentistaUpdateDTO dto) {
        return ResponseEntity.ok(service.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/desativar")
    public ResponseEntity<Void> desativar(@PathVariable Long id) {
        service.desativar(id);
        return ResponseEntity.noContent().build();
    }
}