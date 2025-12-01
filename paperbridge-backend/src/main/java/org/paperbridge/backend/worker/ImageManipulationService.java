package org.paperbridge.backend.worker;

import java.nio.file.Path;

/**
 * Service interface for image manipulation operations.
 * Future implementation will handle operations like deskewing, denoising, contrast adjustment, etc.
 */
public interface ImageManipulationService {

    /**
     * Applies image manipulation operations to a document image.
     *
     * @param imagePath Path to the image file to process.
     * @return Path to the processed image file.
     */
    Path processImage(Path imagePath);
}



