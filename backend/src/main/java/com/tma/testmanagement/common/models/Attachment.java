package com.tma.testmanagement.common.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "attachments")
public class Attachment {
    @Id
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "fk_id", nullable = false)
    private Long fkId;

    @Column(name = "fk_table", nullable = false, length = 250)
    private String fkTable;

    @Column(name = "title", nullable = false, length = 250)
    private String title;

    @Column(name = "description", length = 250)
    private String description;

    @Column(name = "file_name", nullable = false, length = 100)
    private String fileName;

    @Column(name = "file_path", nullable = false, length = 250)
    private String filePath;

    @Column(name = "file_size", nullable = false)
    private Integer fileSize;

    @Column(name = "file_type", nullable = false, length = 250)
    private String fileType;

    @Column(name = "date_added", nullable = false)
    private Instant dateAdded;

    @Column(name = "content")
    private byte[] content;

    @Column(name = "compression_type", nullable = false)
    private Integer compressionType;

}