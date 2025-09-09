package br.com.dotgo.dotgo.dtos;

import br.com.dotgo.dotgo.entities.Product;
import br.com.dotgo.dotgo.entities.ServiceOrder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ServiceOrderResponseDto {

    private Integer id;
    private Integer client;
    private Product product;
    private BigDecimal total_value;
    private String observation;
    private LocalDateTime createdAt;
    private LocalDateTime initialDate;
    private LocalDateTime previousEndDate;
    private Boolean approval;
    private Boolean waitApproval;
    private Integer userApproval;
    private String status;

    public ServiceOrderResponseDto (ServiceOrder serviceOrder) {
        this.id = serviceOrder.getId();
        this.client = serviceOrder.getClient().getId();
        this.product = serviceOrder.getProduct();
        this.total_value = serviceOrder.getTotal_value();
        this.observation = serviceOrder.getObservation();
        this.createdAt = serviceOrder.getCreatedAt();
        this.initialDate = serviceOrder.getInitialDate();
        this.previousEndDate = serviceOrder.getPreviousEndDate();
        this.approval = serviceOrder.getApproval();
        this.waitApproval = serviceOrder.getWaitApproval();
        this.userApproval = serviceOrder.getUserApproval().getId();
        this.status = serviceOrder.getStatus();
    }

    public Integer getId() {
        return id;
    }

    public Integer getClient() {
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

    public Integer getUserApproval() {
        return userApproval;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setClient(Integer client) {
        this.client = client;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public void setTotal_value(BigDecimal total_value) {
        this.total_value = total_value;
    }

    public void setObservation(String observation) {
        this.observation = observation;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setInitialDate(LocalDateTime initialDate) {
        this.initialDate = initialDate;
    }

    public void setPreviousEndDate(LocalDateTime previousEndDate) {
        this.previousEndDate = previousEndDate;
    }

    public void setApproval(Boolean approval) {
        this.approval = approval;
    }

    public void setWaitApproval(Boolean waitApproval) {
        this.waitApproval = waitApproval;
    }

    public void setUserApproval(Integer userApproval) {
        this.userApproval = userApproval;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
