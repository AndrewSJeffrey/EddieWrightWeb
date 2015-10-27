package com.eddie.common.controller;

import com.eddie.common.service.MailMonitor;
import com.eddie.dao.*;
import com.eddie.domain.*;
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

    @Autowired
    private UserDao userDao;

    @Autowired
    private ActionDao actionDao;


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

    @RequestMapping(value = "/discard", method = RequestMethod.GET)
    public
    @ResponseBody
    void discard(@RequestParam(value = "id") int messageId,
                 @RequestParam(value = "userId") int userId,
                 @RequestParam(value = "reason") String reason) {

        EmailMessage emailMessage = emailMessageDao.load(messageId);
        User user = userDao.load(userId);

        emailMessage.setDiscarded(true);
        emailMessage.setProcessed(true);
        emailMessage.setProcessedDate(new Date());

        Action action = new Action();
        action.setActionRequiredBy(null);
        action.setReason(reason);
        action.setNote("User discarded email");
        action.setOutcome(Integer.toString(messageId));
        action.setType("DISCARD");
        action.setCreatedBy(user.getId());
        action.setAssignedTo(null);
        action.setCreatedOn(new Date());

        emailMessageDao.save(emailMessage);
        actionDao.save(action);
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