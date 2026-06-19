package me.gabrielporto.sniplink.analytics_service.service;

import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import nl.basjes.parse.useragent.UserAgent;
import nl.basjes.parse.useragent.UserAgentAnalyzer;

@Service
@Slf4j
public class UserAgentService {

    private static final String UNKNOWN = "Unknown";

    private UserAgentAnalyzer analyzer;

    @PostConstruct
    void init() {
        this.analyzer = UserAgentAnalyzer.newBuilder()
                .hideMatcherLoadStats()
                .withCache(10_000)
                .withField(UserAgent.AGENT_NAME)
                .withField(UserAgent.OPERATING_SYSTEM_NAME)
                .withField(UserAgent.DEVICE_CLASS)
                .build();
        log.info("Yauaa User-Agent analyzer ready.");
    }

    public UserAgentInfo parse(String userAgent) {
        if (userAgent == null || userAgent.isBlank()) {
            return new UserAgentInfo(UNKNOWN, UNKNOWN, DeviceType.DESKTOP);
        }
        UserAgent agent = analyzer.parse(userAgent);
        return new UserAgentInfo(
                normalize(agent.getValue(UserAgent.AGENT_NAME)),
                normalize(agent.getValue(UserAgent.OPERATING_SYSTEM_NAME)),
                DeviceType.fromDeviceClass(agent.getValue(UserAgent.DEVICE_CLASS)));
    }

    private String normalize(String value) {
        if (value == null || value.isBlank() || "Unknown".equalsIgnoreCase(value)
                || "Hacker".equalsIgnoreCase(value)) {
            return UNKNOWN;
        }
        return value;
    }

    public record UserAgentInfo(String browser, String operatingSystem, DeviceType deviceType) {
    }

}
