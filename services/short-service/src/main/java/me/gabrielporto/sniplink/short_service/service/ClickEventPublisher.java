package me.gabrielporto.sniplink.short_service.service;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import me.gabrielporto.sniplink.short_service.dto.ClickEventMessage;

@Service
@Slf4j
@RequiredArgsConstructor
public class ClickEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    @Value("${app.rabbitmq.exchange}")
    private String exchange;

    @Value("${app.rabbitmq.routing-key}")
    private String routingKey;

    public void publish(ClickEventMessage message) {
        rabbitTemplate.convertAndSend(exchange, routingKey, message);
        log.info("Published click event for code '{}'", message.shortCode());
    }

}
