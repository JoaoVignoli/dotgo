package br.com.dotgo.dotgo.repositories;

import br.com.dotgo.dotgo.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {
}
