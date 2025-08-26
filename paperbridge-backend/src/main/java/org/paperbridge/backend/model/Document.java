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
@Table(name = "documents")
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
   * The file path to the original document. This field will store the location of the file on the
   * file system or in cloud storage.
   */
  private String filePath;

  /**
   * The main content of the document. This field is intended to hold the OCR text extracted from
   * the document, which can be used for search and indexing.
   * 
   * @Lob specifies that the field should be persisted as a large object, suitable for storing large
   *      amounts of text.
   */
  @Lob
  private String content;

  /**
   * A collection of user-defined tags for the document.
   * 
   * @ElementCollection creates a separate table to store the tags.
   * @CollectionTable defines the name of the new table and its join column.
   * @Column renames the column that holds the tag value.
   */
  @ElementCollection
  @CollectionTable(name = "document_tags", joinColumns = @JoinColumn(name = "document_id"))
  @Column(name = "tag")
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

