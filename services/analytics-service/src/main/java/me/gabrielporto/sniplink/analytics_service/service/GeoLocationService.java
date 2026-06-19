package me.gabrielporto.sniplink.analytics_service.service;

import java.io.File;
import java.net.InetAddress;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.maxmind.geoip2.DatabaseReader;
import com.maxmind.geoip2.model.CityResponse;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class GeoLocationService {

    private static final String UNKNOWN = "Unknown";

    private final String databasePath;
    private DatabaseReader reader;

    public GeoLocationService(@Value("${app.geoip.database-path:}") String databasePath) {
        this.databasePath = databasePath;
    }

    @PostConstruct
    void init() {
        if (databasePath == null || databasePath.isBlank()) {
            log.warn("GeoIP database path not set (app.geoip.database-path); "
                    + "all locations will resolve to '{}'.", UNKNOWN);
            return;
        }
        try {
            this.reader = new DatabaseReader.Builder(new File(databasePath)).build();
            log.info("Loaded GeoLite2 database from {}", databasePath);
        } catch (Exception e) {
            log.error("Failed to load GeoLite2 database from {} — falling back to '{}'.",
                    databasePath, UNKNOWN, e);
        }
    }

    public GeoLocation resolve(String ip) {
        if (reader == null || ip == null || ip.isBlank()) {
            return GeoLocation.unknown();
        }
        try {
            InetAddress address = InetAddress.getByName(ip);
            if (isPrivateOrLocal(address)) {
                return GeoLocation.unknown();
            }
            return toGeoLocation(reader.city(address));
        } catch (Exception e) {
            log.debug("Could not resolve location for IP {}: {}", ip, e.getMessage());
            return GeoLocation.unknown();
        }
    }

    private boolean isPrivateOrLocal(InetAddress address) {
        return address.isLoopbackAddress() || address.isAnyLocalAddress()
                || address.isSiteLocalAddress() || address.isLinkLocalAddress();
    }

    private GeoLocation toGeoLocation(CityResponse response) {
        String country = response.getCountry() != null ? response.getCountry().getName() : null;
        String city = response.getCity() != null ? response.getCity().getName() : null;
        return new GeoLocation(orUnknown(country), orUnknown(city));
    }

    private String orUnknown(String value) {
        return value != null ? value : UNKNOWN;
    }

    @PreDestroy
    void close() {
        if (reader != null) {
            try {
                reader.close();
            } catch (Exception e) {
                log.debug("Error closing GeoLite2 reader: {}", e.getMessage());
            }
        }
    }

    public record GeoLocation(String country, String city) {
        static GeoLocation unknown() {
            return new GeoLocation(UNKNOWN, UNKNOWN);
        }
    }

}
