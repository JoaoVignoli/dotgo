package br.com.dotgo.dotgo.services;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import io.minio.MinioClient;
import io.minio.PutObjectArgs;

@Service
public class FileStorageService {

    @Autowired
    private MinioClient minioClient;
    
    @Value("${minio.bucket.name}")
    private String bucketName;
    
    @Value("${minio.public-url}")
    private String minioEndpoint;

    public String uploadFile(MultipartFile file, String folderPath) {
        try {
            String uniqueFileName = UUID.randomUUID().toString() + "." + getFileExtension(file.getOriginalFilename());
            String objectKey = folderPath + "/" + uniqueFileName;

            minioClient.putObject(
                PutObjectArgs.builder()
                    .bucket(bucketName)
                    .object(objectKey)
                    .stream(file.getInputStream(), file.getSize(), -1)
                    .contentType(file.getContentType())
                    .build()
            );
            return objectKey; // Chave para ser salva no DB
        } catch (Exception e) {
            throw new RuntimeException("Erro no upload: " + e.getMessage(), e);
        }
    }

    public String getPublicFileUrl(String objectKey) {
        return String.format("%s/%s/%s", minioEndpoint, bucketName, objectKey);
    }

    private String getFileExtension(String fileName) {
        return fileName.substring(fileName.lastIndexOf(".") + 1);
    }
}
