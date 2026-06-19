package me.gabrielporto.sniplink.short_service.dto;

import java.io.Serializable;
import java.time.LocalDateTime;

public record ClickEventMessage(
        String shortCode,
        String ip,
        String userAgent,
        LocalDateTime timestamp
        ) implements Serializable {

}
