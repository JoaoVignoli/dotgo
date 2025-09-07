package br.com.dotgo.dotgo.dtos;

import java.time.LocalDate;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;

public class CertificateRequestDto {
    
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
    private MultipartFile picture;

    public CertificateRequestDto(@NotBlank(message = "O nome do curso é obrigatório.") String course,
            @NotBlank(message = "O nome da instituição de ensino é obrigatório.") String institution,
            @NotBlank(message = "A carga horária é obrigatória.") Integer workload,
            @NotBlank(message = "A data de início é obrigatória.") LocalDate startDate, LocalDate endDate,
            String description, MultipartFile picture) {
        this.course = course;
        this.institution = institution;
        this.workload = workload;
        this.startDate = startDate;
        this.endDate = endDate;
        this.description = description;
        this.picture = picture;
    }

    public CertificateRequestDto() {
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

    public MultipartFile getPicture() {
        return picture;
    }

    public void setPicture(MultipartFile picture) {
        this.picture = picture;
    }

}
