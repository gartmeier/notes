package dev.gartmeier.notes.note;

import dev.gartmeier.notes.common.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "notes")
public class Note extends BaseEntity {
    private String content;

    @jakarta.persistence.Column(nullable = false)
    private String owner;
}
