package org.paperbridge.backend.worker;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.file.Path;
import java.util.List;

/**
 * Main worker service that coordinates image manipulation, OCR, and embedding generation.
 * This service orchestrates the workflow for processing documents.
 */
@Service
@RequiredArgsConstructor
public class WorkerService {

    private final ImageManipulationService imageManipulationService;
    private final OcrService ocrService;
    private final EmbeddingService embeddingService;

    /**
     * Processes a document through the complete worker pipeline:
     * 1. Image manipulation (deskewing, denoising, etc.)
     * 2. OCR text extraction
     * 3. Embedding generation
     *
     * @param documentPath Path to the document to process.
     * @return ProcessedDocument containing the processed image path, extracted text, and embeddings.
     */
    public ProcessedDocument processDocument(Path documentPath) {
        // TODO: Implement complete document processing pipeline
        Path processedImage = imageManipulationService.processImage(documentPath);
        String extractedText = ocrService.extractText(processedImage);
        List<Float> embeddings = embeddingService.generateEmbedding(extractedText);

        return ProcessedDocument.builder()
                .processedImagePath(processedImage)
                .extractedText(extractedText)
                .embeddings(embeddings)
                .build();
    }

    /**
     * Data class representing the result of document processing.
     */
    @lombok.Data
    @lombok.Builder
    public static class ProcessedDocument {
        private Path processedImagePath;
        private String extractedText;
        private List<Float> embeddings;
    }
}

