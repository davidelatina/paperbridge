package org.paperbridge.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

/**
 * Represents a document entity in the database.
 *
 * @Data provides a convenient shortcut for @ToString, @EqualsAndHashCode, @Getter, and @Setter.
 * @NoArgsConstructor creates a default, no-argument constructor.
 * @AllArgsConstructor creates a constructor with all fields as arguments.
 * @Builder implements the Builder pattern for creating instances of this class.
 * @Entity marks this class as a JPA entity, mapped to a database table.
 * @Table specifies the name of the database table.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "document")
public class Document {

  /**
   * Unique identifier for the document.
   * 
   * @Id marks this field as the primary key.
   * @GeneratedValue configures the primary key generation strategy.
   */
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  /**
   * The title of the document. This field is a simple String.
   */
  private String title;

  /**
   * The file path to the document.
   */
  @Column(nullable = false, length = 1024)
  private String filePath;

  /**
   * Main content of the document. Holds OCR text
   */
  @Lob
  private String content;

  /**
   * User-defined tags for the document.
   * 
   * @ElementCollection creates a separate table to store the tags.
   * @CollectionTable defines the name of the new table and its join column.
   * @Column renames the column that holds the tag value.
   */
  @ElementCollection
  @CollectionTable(name = "document_tags", joinColumns = @JoinColumn(name = "document_id"))
  @Column(name = "tags")
  private Set<String> tags;

  /**
   * The date and time when the document was created.
   */
  private LocalDateTime createdAt;

  /**
   * The date and time when the document was last updated.
   */
  private LocalDateTime updatedAt;
}

