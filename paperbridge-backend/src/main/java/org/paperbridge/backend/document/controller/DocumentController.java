package org.paperbridge.backend.document.controller;

import org.paperbridge.backend.document.model.Document;
import org.paperbridge.backend.document.model.DocumentHistory;
import org.paperbridge.backend.document.repository.DocumentHistoryRepository;
import org.paperbridge.backend.document.repository.DocumentRepository;
import org.paperbridge.backend.document.storage.StorageService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.List;

/**
 * REST controller for managing documents and their history.
 *
 * This class handles all HTTP requests related to the Document entity, including CRUD operations,
 * searching by tags, and retrieving version history.
 */
@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {

  private final DocumentRepository documentRepository;
  private final DocumentHistoryRepository documentHistoryRepository;
  private final StorageService storageService;

  /**
   * Retrieves all documents from the database.
   *
   * @return A list of all documents.
   */
  @GetMapping
  public List<Document> getAllDocuments() {
    return documentRepository.findAll();
  }

  /**
   * Retrieves a single document by its unique ID.
   *
   * @param id The ID of the document to retrieve.
   * @return The document with the specified ID.
   * @throws DocumentNotFoundException if the document does not exist.
   */
  @GetMapping("/{id}")
  public ResponseEntity<Document> getDocumentById(@NonNull @PathVariable Long id) {
    Document document = documentRepository.findById(id)
        .orElseThrow(() -> new DocumentNotFoundException("Document not found with ID: " + id));
    return ResponseEntity.ok(document);
  }

  /**
   * Creates a new document.
   *
   * @param file The file to upload.
   * @param subfolder Optional subfolder path where the file should be stored.
   * @return The newly created document.
   */
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public ResponseEntity<Document> createDocument(
      @RequestParam("file") MultipartFile file,
      @RequestParam(value = "subfolder", required = false) String subfolder) {

    // Store file
    if (file == null) {
      throw new RuntimeException("File is null");
    }
    String filePath = storageService.store(file, subfolder);

    // Update document entity
    
    Document document = Document.builder()
        .title(file.getOriginalFilename())
        .filePath(filePath)
        .createdAt(LocalDateTime.now())
        .updatedAt(LocalDateTime.now())
        .build();
    return ResponseEntity.ok(documentRepository.save(document));
  }

  /**
   * Updates an existing document.
   *
   * @param id The ID of the document to update.
   * @param updatedDocument The updated document object.
   * @return The updated document.
   * @throws DocumentNotFoundException if the document does not exist.
   */
  @PutMapping("/{id}")
  public ResponseEntity<Document> updateDocument(@NonNull @PathVariable Long id,
      @RequestBody Document updatedDocument) {
    Document existingDocument = documentRepository.findById(id)
        .orElseThrow(() -> new DocumentNotFoundException("Document not found with ID: " + id));

    existingDocument.setTitle(updatedDocument.getTitle());
    existingDocument.setContent(updatedDocument.getContent());
    existingDocument.setFilePath(updatedDocument.getFilePath());
    existingDocument.setTags(updatedDocument.getTags());
    existingDocument.setUpdatedAt(LocalDateTime.now());

    Document savedDocument = documentRepository.save(existingDocument);
    return ResponseEntity.ok(savedDocument);
  }

  /**
   * Deletes a document by its ID.
   *
   * @param id The ID of the document to delete.
   * @return A response indicating successful deletion.
   * @throws DocumentNotFoundException if the document does not exist.
   */
  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteDocument(@NonNull @PathVariable Long id) {
    if (!documentRepository.existsById(id)) {
      throw new DocumentNotFoundException("Document not found with ID: " + id);
    }
    documentRepository.deleteById(id);
  }

  /**
   * Retrieves documents containing a specific tag.
   *
   * @param tag The tag to filter by.
   * @return A list of documents with the specified tag.
   */
  @GetMapping("/search")
  public List<Document> searchByTag(@RequestParam String tag) {
    return documentRepository.findByTagsContaining(tag);
  }

  /**
   * Retrieves the version history for a specific document.
   *
   * @param documentId The ID of the document.
   * @return A list of DocumentHistory entries.
   * @throws DocumentNotFoundException if the parent document does not exist.
   */
  @GetMapping("/{documentId}/history")
  public List<DocumentHistory> getDocumentHistory(@NonNull @PathVariable Long documentId) {
    if (!documentRepository.existsById(documentId)) {
      throw new DocumentNotFoundException("Document not found with ID: " + documentId);
    }
    return documentHistoryRepository.findByDocumentIdOrderByVersionNumber(documentId);
  }

  /**
   * Retrieves a list of unique folder paths from all documents.
   *
   * @return A list of folder paths (e.g., ["folder1", "folder1/subfolder", "folder2"]).
   */
  @GetMapping("/folders")
  public List<String> getFolders() {
    return documentRepository.findAll().stream()
        .map(Document::getFilePath)
        .filter(path -> path != null && path.contains("/"))
        .map(path -> {
          int lastSlash = path.lastIndexOf("/");
          return lastSlash > 0 ? path.substring(0, lastSlash) : "";
        })
        .filter(folder -> !folder.isEmpty())
        .distinct()
        .sorted()
        .toList();
  }

  /**
   * Serves the file content for a document by its ID.
   *
   * @param id The ID of the document.
   * @return The file resource with appropriate headers.
   * @throws DocumentNotFoundException if the document does not exist.
   */
  @GetMapping("/{id}/file")
  public ResponseEntity<Resource> getDocumentFile(@NonNull @PathVariable Long id) {
    Document document = documentRepository.findById(id)
        .orElseThrow(() -> new DocumentNotFoundException("Document not found with ID: " + id));

    try {
      Path filePath = storageService.load(document.getFilePath());
      Resource resource = new UrlResource(filePath.toUri());

      if (!resource.exists() || !resource.isReadable()) {
        throw new RuntimeException("File not found or not readable: " + document.getFilePath());
      }

      // Determine content type
      String contentType = Files.probeContentType(filePath);
      if (contentType == null) {
        contentType = "application/octet-stream";
      }

      return ResponseEntity.ok()
          .contentType(MediaType.parseMediaType(contentType))
          .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + document.getTitle() + "\"")
          .body(resource);
    } catch (IOException e) {
      throw new RuntimeException("Failed to load file for document ID: " + id, e);
    }
  }
}


/**
 * Custom exception to be thrown when a document is not found. This is handled by the controller to
 * return a 404 Not Found response.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
class DocumentNotFoundException extends RuntimeException {
  public DocumentNotFoundException(String message) {
    super(message);
  }
}



