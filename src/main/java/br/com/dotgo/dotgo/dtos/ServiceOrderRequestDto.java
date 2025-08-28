package br.com.dotgo.dotgo.dtos;

import br.com.dotgo.dotgo.entities.Product;
import br.com.dotgo.dotgo.entities.User;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ServiceOrderRequestDto {

    private User client;
    private Product product;
    private BigDecimal total_value;
    private String observation;
    private LocalDateTime createdAt;
    private LocalDateTime initialDate;
    private LocalDateTime previousEndDate;
    private LocalDateTime endDate;
    private Boolean approval;
    private Boolean waitApproval;
    private User userApproval;

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

    public LocalDateTime getEndDate() {
        return endDate;
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
