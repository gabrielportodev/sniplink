package me.gabrielporto.sniplink.analytics_service.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import me.gabrielporto.sniplink.analytics_service.dto.DailyClickResponse;
import me.gabrielporto.sniplink.analytics_service.dto.DeviceStatsResponse;
import me.gabrielporto.sniplink.analytics_service.entity.ClickEvent;

public interface ClickEventRepository extends JpaRepository<ClickEvent, UUID> {

    long countByShortCodeAndClickedAtGreaterThanEqual(String shortCode, LocalDateTime since);

    @Query("""
            SELECT COUNT(DISTINCT c.country)
            FROM ClickEvent c
            WHERE c.shortCode = :shortCode
              AND c.clickedAt >= :since
              AND c.country IS NOT NULL
              AND c.country <> 'Unknown'
            """)
    long countDistinctCountries(@Param("shortCode") String shortCode,
                                @Param("since") LocalDateTime since);

    @Query("""
            SELECT new me.gabrielporto.sniplink.analytics_service.dto.DailyClickResponse(
                CAST(c.clickedAt AS LocalDate), COUNT(c))
            FROM ClickEvent c
            WHERE c.shortCode = :shortCode AND c.clickedAt >= :since
            GROUP BY CAST(c.clickedAt AS LocalDate)
            ORDER BY CAST(c.clickedAt AS LocalDate)
            """)
    List<DailyClickResponse> findDailyClicks(@Param("shortCode") String shortCode,
                                             @Param("since") LocalDateTime since);

    @Query("""
            SELECT new me.gabrielporto.sniplink.analytics_service.dto.DeviceStatsResponse(
                c.browser, COUNT(c))
            FROM ClickEvent c
            WHERE c.shortCode = :shortCode AND c.clickedAt >= :since AND c.browser IS NOT NULL
            GROUP BY c.browser
            ORDER BY COUNT(c) DESC
            """)
    List<DeviceStatsResponse> findBrowserStats(@Param("shortCode") String shortCode,
                                               @Param("since") LocalDateTime since);

    @Query("""
            SELECT new me.gabrielporto.sniplink.analytics_service.dto.DeviceStatsResponse(
                c.deviceType, COUNT(c))
            FROM ClickEvent c
            WHERE c.shortCode = :shortCode AND c.clickedAt >= :since AND c.deviceType IS NOT NULL
            GROUP BY c.deviceType
            ORDER BY COUNT(c) DESC
            """)
    List<DeviceStatsResponse> findDeviceStats(@Param("shortCode") String shortCode,
                                              @Param("since") LocalDateTime since);

    @Query("""
            SELECT new me.gabrielporto.sniplink.analytics_service.dto.DeviceStatsResponse(
                c.country, COUNT(c))
            FROM ClickEvent c
            WHERE c.shortCode = :shortCode AND c.clickedAt >= :since AND c.country IS NOT NULL
            GROUP BY c.country
            ORDER BY COUNT(c) DESC
            """)
    List<DeviceStatsResponse> findCountryStats(@Param("shortCode") String shortCode,
                                               @Param("since") LocalDateTime since);

}
