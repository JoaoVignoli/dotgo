package br.com.dotgo.dotgo.dtos;

import br.com.dotgo.dotgo.entities.Product;
import br.com.dotgo.dotgo.entities.ServiceOrder;
import br.com.dotgo.dotgo.entities.User;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ServiceOrderResponseDto {

    private Integer id;
    private User client;
    private Product product;
    private BigDecimal total_value;
    private String observation;
    private LocalDateTime createdAt;
    private LocalDateTime initialDate;
    private LocalDateTime previousEndDate;
    private Boolean approval;
    private Boolean waitApproval;
    private User userApproval;

    public ServiceOrderResponseDto (ServiceOrder serviceOrder) {
        this.id = serviceOrder.getId();
        this.client = serviceOrder.getUser();
        this.product = serviceOrder.getProduct();
        this.total_value = serviceOrder.getTotal_value();
        this.observation = serviceOrder.getObservation();
        this.createdAt = serviceOrder.getCreatedAt();
        this.initialDate = serviceOrder.getInitialDate();
        this.previousEndDate = serviceOrder.getPreviousEndDate();
        this.approval = serviceOrder.getApproval();
        this.waitApproval = serviceOrder.getWaitApproval();
        this.userApproval = serviceOrder.getUserApproval();
    }

    public Integer getId() {
        return id;
    }

    public User getClient() {
        return client;
    }

    public Product getProduct() {
        return product;
    }

    public BigDecimal getTotal_value() {
        return total_value;
    }

    public String getObservation() {
        return observation;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getInitialDate() {
        return initialDate;
    }

    public LocalDateTime getPreviousEndDate() {
        return previousEndDate;
    }

    public Boolean getApproval() {
        return approval;
    }

    public Boolean getWaitApproval() {
        return waitApproval;
    }

    public User getUserApproval() {
        return userApproval;
    }
}
