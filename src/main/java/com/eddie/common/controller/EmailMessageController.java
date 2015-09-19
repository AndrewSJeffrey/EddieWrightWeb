package com.eddie.common.controller;

import com.eddie.common.service.MailMonitor;
import com.eddie.dao.ContactDao;
import com.eddie.dao.EmailMessageDao;
import com.eddie.dao.EventDao;
import com.eddie.domain.EmailDetails;
import com.eddie.domain.EmailMessage;
import com.eddie.domain.Event;
import org.apache.commons.mail.Email;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@Controller
@Transactional
@RequestMapping("/emailMessage")
public class EmailMessageController {


    @Autowired
    private EmailMessageDao emailMessageDao;

    @Autowired
    private ContactDao contactDao;


    @RequestMapping(value = "/run", method = RequestMethod.GET)
    public
    @ResponseBody
    void run() {
        MailMonitor mailMonitor = new MailMonitor(emailMessageDao, contactDao);
        mailMonitor.runMe();
    }

    @RequestMapping(value = "/find", method = RequestMethod.GET)
    public
    @ResponseBody
    EmailDetails find(@RequestParam(value = "messageId") int messageId) {
        System.out.println("try locate message?");
        MailMonitor mailMonitor = new MailMonitor(emailMessageDao, contactDao);
        EmailDetails message = mailMonitor.getMessage(messageId);
        return message;
    }

    @RequestMapping(value = "/all", method = RequestMethod.GET)
    public
    @ResponseBody
    List<EmailMessage> getAllEmailMessages() {
        List<EmailMessage> list = emailMessageDao.list();
        return list;
    }

    @RequestMapping(value = "", method = RequestMethod.GET)
    public
    @ResponseBody
    List<EmailMessage> getEmailMessages() {
        List<EmailMessage> list = emailMessageDao.getUnprocessed();
        return list;
    }



}