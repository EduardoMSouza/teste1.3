// DentistaService.java
package com.consultorio.domain.dentista;

import com.consultorio.domain.dentista.dto.*;
import com.consultorio.domain.dentista.exception.DentistaDuplicadoException;
import com.consultorio.domain.dentista.exception.DentistaNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DentistaService {

    private final DentistaRepository repo;
    private final DentistaConverter converter;

    public DentistaService(DentistaRepository repo, DentistaConverter converter) {
        this.repo = repo;
        this.converter = converter;
    }

    @Transactional
    public DentistaResponseDTO criar(DentistaCreateDTO dto) {
        validarDuplicados(dto, null);

        Dentista dentista = converter.fromCreate(dto).toEntity();
        return converter.fromEntity(repo.save(dentista)).toResponse();
    }

    public List<DentistaListDTO> listar() {
        return repo.findAll().stream()
                .map(dentista -> converter.fromEntity(dentista).toList())
                .toList();
    }

    public List<DentistaListDTO> listarAtivos() {
        return repo.findByAtivoTrue().stream()
                .map(dentista -> converter.fromEntity(dentista).toList())
                .toList();
    }

    public DentistaResponseDTO buscarPorId(Long id) {
        Dentista dentista = repo.findById(id)
                .orElseThrow(() -> new DentistaNotFoundException("Dentista não encontrado com ID: " + id));
        return converter.fromEntity(dentista).toResponse();
    }

    @Transactional
    public DentistaResponseDTO atualizar(Long id, DentistaUpdateDTO dto) {
        Dentista dentista = repo.findById(id)
                .orElseThrow(() -> new DentistaNotFoundException("Dentista não encontrado com ID: " + id));

        validarDuplicados(dto, id);
        converter.fromUpdate(dto).updateEntity(dentista);

        return converter.fromEntity(repo.save(dentista)).toResponse();
    }

    @Transactional
    public void deletar(Long id) {
        if (!repo.existsById(id)) {
            throw new DentistaNotFoundException("Dentista não encontrado com ID: " + id);
        }
        repo.deleteById(id);
    }

    @Transactional
    public void desativar(Long id) {
        Dentista dentista = repo.findById(id)
                .orElseThrow(() -> new DentistaNotFoundException("Dentista não encontrado com ID: " + id));
        dentista.setAtivo(false);
        repo.save(dentista);
    }

    private void validarDuplicados(Object dto, Long id) {
        if (dto instanceof DentistaCreateDTO createDTO) {
            if (repo.existsByCro(createDTO.cro())) {
                throw new DentistaDuplicadoException("Já existe um dentista com este CRO: " + createDTO.cro());
            }
        } else if (dto instanceof DentistaUpdateDTO updateDTO) {
            if (updateDTO.cro() != null && repo.existsByCroAndIdNot(updateDTO.cro(), id)) {
                throw new DentistaDuplicadoException("Já existe outro dentista com este CRO: " + updateDTO.cro());
            }
        }
    }
}