package com.eddie.common.controller;

import com.eddie.common.service.MailMonitor;
import com.eddie.dao.ContactDao;
import com.eddie.dao.EmailMessageDao;
import com.eddie.dao.EventDao;
import com.eddie.domain.EmailMessage;
import com.eddie.domain.Event;
import org.apache.commons.mail.Email;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

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