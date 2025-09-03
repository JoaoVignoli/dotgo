package br.com.dotgo.dotgo.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.dotgo.dotgo.dtos.CertificateRequestDto;
import br.com.dotgo.dotgo.dtos.CertificateResponseDto;
import br.com.dotgo.dotgo.entities.Certificate;
import br.com.dotgo.dotgo.entities.User;
import br.com.dotgo.dotgo.enums.UserRole;
import br.com.dotgo.dotgo.repositories.CertificateRepository;
import br.com.dotgo.dotgo.repositories.UserRepository;
import br.com.dotgo.dotgo.services.FileStorageService;
import br.com.dotgo.dotgo.services.JWTService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/certificates")
public class CertificateController {

    private CertificateRepository certificateRepository;
    private JWTService jwtService; 
    private FileStorageService fileStorageService;
    private UserRepository userRepository;
    private final static String CERTIFICATES_PICTURES_FOLDER = "/pictures/users/";

    public CertificateController(CertificateRepository certificateRepository, JWTService jwtService,
            FileStorageService fileStorageService, UserRepository userRepository) {
        this.certificateRepository = certificateRepository;
        this.jwtService = jwtService;
        this.fileStorageService = fileStorageService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<?> createNewCertificate(HttpServletRequest request, @ModelAttribute @Valid CertificateRequestDto certificateRequestDto) {
        
        String jwtToken = jwtService.getJwtFromCookie(request);

        if (jwtToken == null || jwtToken.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Token de autenticação não encontrado.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        // 2. Validar o token
        if (!jwtService.validateJwtToken(jwtToken)) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Token inválido ou expirado.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        // 3. Extrair o Email do usuário do token
        String userEmail = jwtService.extractUsername(jwtToken);
        if (userEmail == null || userEmail.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Email não localizado no token.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        Optional<User> optionalUser = this.userRepository.findByEmail(userEmail);

        if (optionalUser.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Usuário não localizado.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        User user = optionalUser.get();

        if (user.getRole() == UserRole.CLIENT) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Usuário do tipo cliente, não pode registrar certificados.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        String certificatesPicturesPath = CERTIFICATES_PICTURES_FOLDER + user.getId() + "/certificates";

        String newPictureMinIOPath = this.fileStorageService.uploadFile(certificateRequestDto.getPicture(), certificatesPicturesPath);

        Certificate newCertificate = new Certificate();

        newCertificate.setCourse(certificateRequestDto.getCourse());
        newCertificate.setDescription(certificateRequestDto.getDescription());
        newCertificate.setEndDate(certificateRequestDto.getEndDate());
        newCertificate.setInstitution(certificateRequestDto.getInstitution());
        newCertificate.setPictureUrl(newPictureMinIOPath);
        newCertificate.setServiceProvider(user);
        newCertificate.setStartDate(certificateRequestDto.getStartDate());
        newCertificate.setWorkload(certificateRequestDto.getWorkload());

        var certificateSaved = this.certificateRepository.save(newCertificate);

        String pictureUrl = this.fileStorageService.getPublicFileUrl(newPictureMinIOPath);

        return ResponseEntity.status(HttpStatus.CREATED).body(new CertificateResponseDto(certificateSaved, pictureUrl));
    }
    
}
