package com.eddie.common.service;

import org.apache.commons.mail.DefaultAuthenticator;
import org.apache.commons.mail.Email;
import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.SimpleEmail;

/**
 * Created by andrewjeffrey on 23/06/15.
 */
public class EmailService {


    public static void sendEmail(String subject, String message, String toAddress) throws EmailException {
        Email email = new SimpleEmail();
        email.setHostName("smtp.gmail.com");
        email.setSmtpPort(587);
        email.setAuthenticator(new DefaultAuthenticator("ajeffrey@fleetsmart.co.uk", "swip3r/vag09"));
        email.setSSLOnConnect(true);
        email.setFrom("ew.prospecting@gmail.com");
        email.setSubject(subject);
        email.setMsg(message);
        email.addTo(toAddress);
        email.setTLS(true);
        email.send();
    }


}
