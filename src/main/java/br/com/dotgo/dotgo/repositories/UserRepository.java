package br.com.dotgo.dotgo.repositories;

import br.com.dotgo.dotgo.entities.User;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import br.com.dotgo.dotgo.enums.UserRole;


public interface UserRepository extends JpaRepository<User, Integer> {
    public Optional<User> findByEmail(String email);
    public List<User> findByRole(UserRole role);
}
