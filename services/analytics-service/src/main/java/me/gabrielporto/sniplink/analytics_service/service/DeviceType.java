package me.gabrielporto.sniplink.analytics_service.service;

public enum DeviceType {

    MOBILE,
    DESKTOP,
    TABLET;

    public static DeviceType fromDeviceClass(String deviceClass) {
        if (deviceClass == null) {
            return DESKTOP;
        }
        String value = deviceClass.toLowerCase();
        if (value.contains("tablet")) {
            return TABLET;
        }
        if (value.contains("phone") || value.contains("mobile")) {
            return MOBILE;
        }
        return DESKTOP;
    }

}
