package com.example.fitApp.repository;


import com.example.fitApp.model.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends CrudRepository<User, Long> {

    Optional<User> findByEmail(String email); //vai buscar o email
    Optional<User> findByVerificationCode(String verificationCode); //vai buscar a verificação do email
}








