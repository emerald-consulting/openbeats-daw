package com.openbeats.openbeatsdaw.model.Entity;

import java.util.Map;

public class SpotifyUserInfo {

    protected Map<String, Object> attributes;

    public static SpotifyUserInfo getOAuth2UserInfo(String registrationId, Map<String, Object> attributes) {
        return new SpotifyUserInfo(attributes);
    }

    public SpotifyUserInfo(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

    public Map<String, Object> getAttributes() {
        return attributes;
    }


    public String getId() {
        return ((Integer) attributes.get("id")).toString();
    }

    public String getName() {
        return (String) attributes.get("display_name");
    }

    public String getEmail() {
        return (String) attributes.get("email");
    }

    public String getImageUrl() {
        return (String) attributes.get("avatar_url");
    }
}