package org.paperbridge.backend.document.repository;

import org.paperbridge.backend.document.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for managing Document entities. This interface provides standard CRUD operations and
 * custom query methods.
 */
@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

  /**
   * Retrieves a list of documents that contain a specific tag.
   *
   * @param tag The tag to search for.
   * @return A list of documents containing the specified tag.
   */
  List<Document> findByTagsContaining(String tag);
}



