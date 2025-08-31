package br.com.dotgo.dotgo.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ServiceOrderRequestDto {

    private Integer clientId;
    private Integer productId;
    private BigDecimal total_value;
    private String observation;
    private LocalDateTime initialDate;
    private LocalDateTime previousEndDate;
    private Boolean approval;
    private Boolean waitApproval;
    private Integer userApproval;

    public Integer getClientId() {
        return clientId;
    }

    public Integer getProductId() {
        return productId;
    }

    public BigDecimal getTotal_value() {
        return total_value;
    }

    public String getObservation() {
        return observation;
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
}
