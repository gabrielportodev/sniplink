package me.gabrielporto.sniplink.analytics_service.dto;

import java.time.LocalDate;

public record DailyClickResponse(
        LocalDate date,
        long count
        ) {

}
