package org.paperbridge.backend.document.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.paperbridge.backend.document.model.DocumentHistory;

import java.util.List;

/**
 * Repository for managing DocumentHistory entities.
 * This interface provides standard CRUD operations and custom query methods.
 */
@Repository
public interface DocumentHistoryRepository extends JpaRepository<DocumentHistory, Long> {

    /**
     * Retrieves all history entries for a given document, ordered by version number.
     *
     * @param documentId The ID of the document.
     * @return A list of history entries.
     */
    List<DocumentHistory> findByDocumentIdOrderByVersionNumber(Long documentId);
}



