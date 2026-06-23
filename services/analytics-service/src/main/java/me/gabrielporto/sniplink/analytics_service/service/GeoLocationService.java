package me.gabrielporto.sniplink.analytics_service.service;

import java.net.InetAddress;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class GeoLocationService {

    private static final String UNKNOWN = "Unknown";

    private final RestClient restClient = RestClient.create();

    public GeoLocation resolve(String ip) {
        if (ip == null || ip.isBlank() || isPrivateOrLocal(ip)) {
            return GeoLocation.unknown();
        }
        try {
            IpApiResponse response = restClient.get()
                    .uri("http://ip-api.com/json/{ip}?fields=status,country,city", ip)
                    .retrieve()
                    .body(IpApiResponse.class);

            if (response == null || !"success".equals(response.status())) {
                return GeoLocation.unknown();
            }
            return new GeoLocation(orUnknown(response.country()), orUnknown(response.city()));
        } catch (Exception e) {
            log.debug("Could not resolve location for IP {}: {}", ip, e.getMessage());
            return GeoLocation.unknown();
        }
    }

    private boolean isPrivateOrLocal(String ip) {
        try {
            InetAddress address = InetAddress.getByName(ip);
            return address.isLoopbackAddress() || address.isAnyLocalAddress()
                    || address.isSiteLocalAddress() || address.isLinkLocalAddress();
        } catch (Exception e) {
            return true;
        }
    }

    private String orUnknown(String value) {
        return value != null && !value.isBlank() ? value : UNKNOWN;
    }

    public record GeoLocation(String country, String city) {
        static GeoLocation unknown() {
            return new GeoLocation(UNKNOWN, UNKNOWN);
        }
    }

    private record IpApiResponse(String status, String country, String city) {
    }
}
