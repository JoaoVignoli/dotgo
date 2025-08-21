package br.com.dotgo.dotgo.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private String description;
    private BigDecimal price;
    private int estimatedTime;
    private Boolean receiveAttachments;
    private Boolean autoApprove;
    private Boolean priceToBeAgreed;
    private Boolean timeToBeAgreed;
    private LocalDateTime createdAt;

    


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }
    
    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public int getEstimatedTime() {
        return estimatedTime;
    }

    public void setEstimatedTime(int estimatedTime) {
        this.estimatedTime = estimatedTime;
    }

    public Boolean getReceiveAttachments() {
        return receiveAttachments;
    }

    public void setReceiveAttachments(Boolean receiveAttachments) {
        this.receiveAttachments = receiveAttachments;
    }
    
    public Boolean getAutoApprove() {
        return autoApprove;
    }

    public void setAutoApprove(Boolean autoApprove) {
        this.autoApprove = autoApprove;
    }

    public Boolean getPriceToBeAgreed() {
        return priceToBeAgreed;
    }

    public void setPriceToBeAgreed(Boolean priceToBeAgreed) {
        this.priceToBeAgreed = priceToBeAgreed;
    }
    public Boolean getTimeToBeAgreed() {
        return timeToBeAgreed;
    }

    public void setTimeToBeAgreed(Boolean timeToBeAgreed) {
        this.timeToBeAgreed = timeToBeAgreed;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

}