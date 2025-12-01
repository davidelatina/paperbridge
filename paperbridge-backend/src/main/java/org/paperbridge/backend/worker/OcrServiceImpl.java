package org.paperbridge.backend.worker;

import org.springframework.stereotype.Service;

import java.nio.file.Path;

/**
 * Placeholder implementation of OcrService.
 * This is a rough draft and will be implemented in the future.
 */
@Service
public class OcrServiceImpl implements OcrService {

    @Override
    public String extractText(Path imagePath) {
        // TODO: Implement OCR logic
        // This will use OCR libraries (e.g., Tesseract, Google Cloud Vision, etc.)
        // to extract text from document images
        return "";
    }
}



