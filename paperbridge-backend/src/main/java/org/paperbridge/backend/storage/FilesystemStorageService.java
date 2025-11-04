package org.paperbridge.backend.storage;

import org.paperbridge.backend.config.StorageProperties;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;
import jakarta.annotation.PostConstruct;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

/**
 * Implementation of StorageService that saves files to the local filesystem.
 */
@Service
public class FilesystemStorageService implements StorageService {

  private final Path rootLocation;

  public FilesystemStorageService(StorageProperties properties) {
    // Resolve the storage location specified in properties
    this.rootLocation = Paths.get(properties.getLocation());
  }

  /**
   * Executes after the bean is constructed to ensure the root directory exists.
   */
  @PostConstruct
  @Override
  public void init() {
    try {
      Files.createDirectories(rootLocation);
    } catch (IOException e) {
      throw new RuntimeException("Could not initialize storage location: " + rootLocation, e);
    }
  }

  /**
   * Saves the MultipartFile and returns the relative path.
   *
   * @param file The file received from the client.
   * @return The relative path used in the Document entity.
   */
  @Override
  public String store(MultipartFile file) {
    if (file == null) {
      throw new RuntimeException("File is null");
    }
    if (file.isEmpty()) {
      throw new RuntimeException("File is empty");
    }
    if (file.getOriginalFilename() == null) {
      throw new RuntimeException("File has no original filename");
    }
    // Normalize filename and create a unique file name
    String filename = StringUtils.cleanPath(file.getOriginalFilename());
    String extension = StringUtils.getFilenameExtension(filename);
    String baseName = StringUtils.stripFilenameExtension(StringUtils.getFilename(filename));
    String uniqueFilename = baseName + "-" +
        UUID.randomUUID().toString() + 
        (extension != null ? "." + extension : "");

    try {
      if (file.isEmpty()) {
        throw new IOException("Failed to store empty file " + filename);
      }

      Path destinationFile = this.rootLocation.resolve(uniqueFilename).normalize().toAbsolutePath();

      // Security check to prevent path traversal
      if (!destinationFile.getParent().equals(this.rootLocation.toAbsolutePath())) {
        throw new IOException("Cannot store file outside the configured directory.");
      }

      try (InputStream inputStream = file.getInputStream()) {
        Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
      }

      // Return the relative path for database storage
      return uniqueFilename;

    } catch (IOException e) {
      throw new RuntimeException("Failed to store file " + filename, e);
    }
  }

  /**
   * Resolves the Path for a stored file given its relative path.
   */
  @Override
  public Path load(String relativePath) {
    return rootLocation.resolve(relativePath);
  }
}