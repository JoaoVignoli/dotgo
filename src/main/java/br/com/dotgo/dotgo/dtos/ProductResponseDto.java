package br.com.dotgo.dotgo.dtos;

import java.math.BigDecimal;

import br.com.dotgo.dotgo.entities.Product;
import jakarta.validation.constraints.NotBlank;

public class ProductResponseDto {
    private Integer id;
    @NotBlank(message = "O nome do produto é obrigatório.")
    private String name;
    @NotBlank(message = "A descrição do produto é obrigatório.")
    private String description;
    private BigDecimal price;
    private Integer estimatedTime;
    private Boolean receiveAttachments;
    private Boolean autoApprove;
    private Boolean priceToBeAgreed;
    private Boolean timeToBeAgreed;
    private String picture;
    
    public ProductResponseDto(Product product, String pictureUrl) {
        this.id = product.getId();
        this.name = product.getName();
        this.description = product.getName();
        this.price = product.getPrice();
        this.estimatedTime = product.getEstimatedTime();
        this.receiveAttachments = product.getReceiveAttachments();
        this.autoApprove = product.getAutoApprove();
        this.priceToBeAgreed = product.getPriceToBeAgreed();
        this.timeToBeAgreed = product.getTimeToBeAgreed();
        this.picture = pictureUrl;
    }

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

    public Integer getEstimatedTime() {
        return estimatedTime;
    }

    public void setEstimatedTime(Integer estimatedTime) {
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

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }
}
