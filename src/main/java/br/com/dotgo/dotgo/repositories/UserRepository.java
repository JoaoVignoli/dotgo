package br.com.dotgo.dotgo.repositories;

import br.com.dotgo.dotgo.entities.User;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import br.com.dotgo.dotgo.enums.UserRole;


public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);
    
    List<User> findByRole(UserRole role);
    
    Page<User> findByRole(UserRole role, Pageable pageable);
    
    Page<User> findByRoleAndVerified(UserRole role, Boolean verified, Pageable pageable);
    
    Page<User> findByRoleInAndVerified(List<UserRole> roles, Boolean verified, Pageable pageable);
    
    Page<User> findByVerified(Boolean verified, Pageable pageable);
}
