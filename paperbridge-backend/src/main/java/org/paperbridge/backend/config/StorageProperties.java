package org.paperbridge.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration class for defining storage properties, such as the location
 * where files will be persisted on the local filesystem.
 */
@Configuration
@ConfigurationProperties(prefix = "paperbridge.storage")
public class StorageProperties {

    /**
     * Filesystem location where application documents are stored.
     */
    private String location = "data/";

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}