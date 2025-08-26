package br.com.dotgo.dotgo.dtos;

import java.math.BigDecimal;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ProductCreateDto {
    
    @NotBlank(message = "O nome do produto é obrigatório.")
    private String name;
    private String description;
    private BigDecimal price;
    private Integer estimatedTime;
    private Boolean receiveAttachments;
    private Boolean autoApprove;
    private Boolean priceToBeAgreed;
    private Boolean timeToBeAgreed;
    @NotNull(message = "Necessário informar o id da subctegoria do produto.")
    private Integer subcategoryId;
    private Integer serviceHolderId;
    
    public ProductCreateDto(
            @NotBlank(message = "O nome do produto é obrigatório.") String name, String description,
            BigDecimal price, Integer estimatedTime, Boolean receiveAttachments, Boolean autoApprove,
            Boolean priceToBeAgreed, Boolean timeToBeAgreed,
            @NotNull(message = "Necessário informar o id da subctegoria do produto.") Integer subcategoryId,
            MultipartFile picture, Integer serviceHolderId
    ) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.estimatedTime = estimatedTime;
        this.receiveAttachments = receiveAttachments;
        this.autoApprove = autoApprove;
        this.priceToBeAgreed = priceToBeAgreed;
        this.timeToBeAgreed = timeToBeAgreed;
        this.subcategoryId = subcategoryId;
        this.serviceHolderId = serviceHolderId;
    }

    public ProductCreateDto() {
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

    public Integer getSubcategoryId() {
        return subcategoryId;
    }

    public void setSubcategoryId(Integer subcategoryId) {
        this.subcategoryId = subcategoryId;
    }

    public void setServiceHolderId(Integer serviceHolderId) {
        this.serviceHolderId = serviceHolderId;
    }

    public Integer getServiceHolderId() {
        return serviceHolderId;
    }

}
