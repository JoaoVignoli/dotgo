package br.com.dotgo.dotgo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.dotgo.dotgo.entities.ServiceOrder;

public interface ServiceOrderRepository extends JpaRepository<ServiceOrder, Integer>{

}
