package br.com.dotgo.dotgo.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import br.com.dotgo.dotgo.entities.ServiceOrder;

public interface ServiceOrderRepository extends JpaRepository<ServiceOrder, Integer>{
    @Query("SELECT so FROM ServiceOrder so JOIN so.product p WHERE p.user.id = :providerId")
    List<ServiceOrder> findAllByServiceProviderId(Integer providerId);
}
