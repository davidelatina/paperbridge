package org.paperbridge.backend.document.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Represents a historical version of a document. This entity stores a log of changes and file paths
 * for each version, allowing for basic versioning and rollback capabilities.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "document_history")
public class DocumentHistory {

  /**
   * Unique identifier for history entries.
   * 
   * @Id marks this field as the primary key.
   * @GeneratedValue configures the primary key generation strategy.
   */
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  /**
   * The ID of the parent document this history entry belongs to. Establishes the relationship
   * between the main document and its history.
   */
  private Long documentId;

  /**
   * Version number of this history entry. Starts at 1 and increments with each new version.
   */
  private Integer versionNumber;

  /**
   * Searchable text content extracted for this specific version.
   */
  @Lob
  @Column(columnDefinition = "TEXT")
  private String content;

  /**
   * File path to the specific version of the document.
   */
  @Column(nullable = false, length = 1024)
  private String filePath;

  /**
   * Description of the change made in this version (e.g., "Initial upload", "Applied deskew").
   */
  private String changeDescription;

  /**
   * Date and time when this history entry was created.
   */
  private LocalDateTime createdAt;
}



