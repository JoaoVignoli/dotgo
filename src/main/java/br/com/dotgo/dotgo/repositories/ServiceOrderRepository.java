package br.com.dotgo.dotgo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.dotgo.dotgo.entities.ServiceOrder;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ServiceOrderRepository extends JpaRepository<ServiceOrder, Integer>{
    @Query
    List<ServiceOrder> findByServiceProviderId(Integer providerId);
}
