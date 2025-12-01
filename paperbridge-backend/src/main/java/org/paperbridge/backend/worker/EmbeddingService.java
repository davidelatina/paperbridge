package org.paperbridge.backend.worker;

import java.util.List;

/**
 * Service interface for generating embeddings from document content.
 * Future implementation will create vector embeddings for RAG (Retrieval-Augmented Generation) purposes.
 */
public interface EmbeddingService {

    /**
     * Generates embeddings for the given text content.
     *
     * @param text The text content to generate embeddings for.
     * @return A list of embedding values (vector representation).
     */
    List<Float> generateEmbedding(String text);

    /**
     * Generates embeddings for multiple text chunks.
     *
     * @param textChunks List of text chunks to generate embeddings for.
     * @return List of embedding vectors, one for each text chunk.
     */
    List<List<Float>> generateEmbeddings(List<String> textChunks);
}



