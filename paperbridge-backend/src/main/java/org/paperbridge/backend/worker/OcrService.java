package org.paperbridge.backend.worker;

import java.nio.file.Path;

/**
 * Service interface for OCR (Optical Character Recognition) operations.
 * Future implementation will extract text from document images.
 */
public interface OcrService {

    /**
     * Performs OCR on a document image to extract text content.
     *
     * @param imagePath Path to the image file to process.
     * @return The extracted text content.
     */
    String extractText(Path imagePath);
}



