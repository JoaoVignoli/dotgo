package br.com.dotgo.dotgo.dtos;

import java.time.LocalDate;

import br.com.dotgo.dotgo.entities.Certificate;
import jakarta.validation.constraints.NotBlank;

public class CertificateResponseDto {

    private Integer id;
    @NotBlank(message = "O nome do curso é obrigatório.")
    private String course;
    @NotBlank(message = "O nome da instituição de ensino é obrigatório.")
    private String institution;
    @NotBlank(message = "A carga horária é obrigatória.")
    private Integer workload;
    @NotBlank(message = "A data de início é obrigatória.")
    private LocalDate startDate;
    private LocalDate endDate;
    private String description;
    private String pictureUrl;

    public CertificateResponseDto(Certificate certificate, String pictureUrl) {
        this.id = certificate.getId();
        this.course = certificate.getCourse();
        this.institution = certificate.getInstitution();
        this.workload = certificate.getWorkload();
        this.startDate = certificate.getStartDate();
        this.endDate = certificate.getEndDate();
        this.description = certificate.getDescription();
        this.pictureUrl = pictureUrl;
    }

    public CertificateResponseDto() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public String getInstitution() {
        return institution;
    }

    public void setInstitution(String institution) {
        this.institution = institution;
    }

    public Integer getWorkload() {
        return workload;
    }

    public void setWorkload(Integer workload) {
        this.workload = workload;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPictureUrl() {
        return pictureUrl;
    }

    public void setPictureUrl(String pictureUrl) {
        this.pictureUrl = pictureUrl;
    }

}
