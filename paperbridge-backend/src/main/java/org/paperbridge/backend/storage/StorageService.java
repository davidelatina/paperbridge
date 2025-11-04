package org.paperbridge.backend.storage;

import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Path;

/**
 * Defines the contract for storing and managing application files.
 */
public interface StorageService {

  /**
   * Initializes the storage directory, ensuring it exists.
   */
  void init();

  /**
   * Stores a file on the filesystem.
   *
   * @param file The file received from the client.
   * @return The canonical, relative file path used for the Document entity.
   */
  String store(MultipartFile file);

  /**
   * Resolves the Path for a stored file given its relative path.
   *
   * @param relativePath The relative path stored in the Document entity.
   * @return The absolute Path object.
   */
  Path load(String relativePath);
}