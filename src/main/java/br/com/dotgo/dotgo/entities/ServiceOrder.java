package br.com.dotgo.dotgo.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class ServiceOrder {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;
    @ManyToOne
    @JoinColumn(name = "client_id")
    private User client;
    private BigDecimal total_value;
    private String observation;
    private LocalDateTime createdAt;
    private LocalDateTime initialDate;
    private LocalDateTime previousEndDate;
    private LocalDateTime endDate;
    private Boolean approval;
    private Boolean waitApproval;
    @ManyToOne
    @JoinColumn(name = "user_approval")
    private User userApproval;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public User getClient() {
        return client;
    }

    public void setClient(User client) {
        this.client = client;
    }

    public BigDecimal getTotal_value() {
        return total_value;
    }

    public void setTotal_value(BigDecimal total_value) {
        this.total_value = total_value;
    }

    public String getObservation() {
        return observation;
    }

    public void setObservation(String observation) {
        this.observation = observation;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getInitialDate() {
        return initialDate;
    }

    public void setInitialDate(LocalDateTime initialDate) {
        this.initialDate = initialDate;
    }

    public LocalDateTime getPreviousEndDate() {
        return previousEndDate;
    }

    public void setPreviousEndDate(LocalDateTime previousEndDate) {
        this.previousEndDate = previousEndDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public Boolean getApproval() {
        return approval;
    }

    public void setApproval(Boolean approval) {
        this.approval = approval;
    }

    public Boolean getWaitApproval() {
        return waitApproval;
    }

    public void setWaitApproval(Boolean waitApproval) {
        this.waitApproval = waitApproval;
    }

    public User getUserApproval() {
        return userApproval;
    }

    public void setUserApproval(User userApproval) {
        this.userApproval = userApproval;
    }

}
