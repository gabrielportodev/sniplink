package me.gabrielporto.sniplink.analytics_service.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "click_events", indexes = {
        @Index(name = "idx_click_events_short_code", columnList = "shortCode"),
        @Index(name = "idx_click_events_clicked_at", columnList = "clickedAt")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClickEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String shortCode;

    private String ipAddress;

    private String country;

    private String city;

    private String browser;

    private String operatingSystem;

    private String deviceType;

    private String referrer;

    @Column(nullable = false)
    private LocalDateTime clickedAt;

}
