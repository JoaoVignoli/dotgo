package br.com.dotgo.dotgo.repositories;

import br.com.dotgo.dotgo.entities.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Integer> {
}
