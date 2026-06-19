package me.gabrielporto.sniplink.analytics_service.consumer;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import me.gabrielporto.sniplink.analytics_service.dto.ClickEventMessage;
import me.gabrielporto.sniplink.analytics_service.entity.ClickEvent;
import me.gabrielporto.sniplink.analytics_service.repository.ClickEventRepository;
import me.gabrielporto.sniplink.analytics_service.service.GeoLocationService;
import me.gabrielporto.sniplink.analytics_service.service.GeoLocationService.GeoLocation;
import me.gabrielporto.sniplink.analytics_service.service.UserAgentService;
import me.gabrielporto.sniplink.analytics_service.service.UserAgentService.UserAgentInfo;

@Component
@Slf4j
@RequiredArgsConstructor
public class ClickEventConsumer {

    private final ClickEventRepository repository;
    private final GeoLocationService geoLocationService;
    private final UserAgentService userAgentService;

    @RabbitListener(queues = "${app.rabbitmq.queue}")
    public void consume(ClickEventMessage message) {
        try {
            ClickEvent event = toClickEvent(message);
            repository.save(event);
            log.info("Stored click event for code '{}' ({} / {})",
                    event.getShortCode(), event.getCountry(), event.getDeviceType());
        } catch (Exception e) {
            log.error("Failed to process click event for code '{}': {}",
                    message.shortCode(), e.getMessage(), e);
        }
    }

    private ClickEvent toClickEvent(ClickEventMessage message) {
        GeoLocation location = geoLocationService.resolve(message.ip());
        UserAgentInfo userAgent = userAgentService.parse(message.userAgent());

        return ClickEvent.builder()
                .shortCode(message.shortCode())
                .ipAddress(message.ip())
                .country(location.country())
                .city(location.city())
                .browser(userAgent.browser())
                .operatingSystem(userAgent.operatingSystem())
                .deviceType(userAgent.deviceType().name())
                .clickedAt(message.timestamp())
                .build();
    }

}
