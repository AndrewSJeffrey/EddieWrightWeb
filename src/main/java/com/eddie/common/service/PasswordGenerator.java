package com.eddie.common.service;

import org.apache.commons.lang3.RandomStringUtils;

/**
 * Created by andrewjeffrey on 23/06/15.
 */
public class PasswordGenerator {

    public static String generatePassword() {
       return RandomStringUtils.random(20, 0, 20, true, true, "qw32rfHIJk9iQ8Ud7h0X".toCharArray());
    }

}
