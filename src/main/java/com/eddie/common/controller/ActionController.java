package com.eddie.common.controller;

import com.eddie.dao.ActionDao;
import com.eddie.dao.ContactDao;
import com.eddie.dao.EmailMessageDao;
import com.eddie.dao.UserDao;
import com.eddie.domain.Action;
import com.eddie.domain.Contact;
import com.eddie.domain.EmailMessage;
import com.eddie.domain.User;
import com.sun.scenario.effect.impl.sw.sse.SSEBlend_SRC_OUTPeer;
import com.sun.xml.internal.bind.v2.runtime.output.SAXOutput;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@Controller
@Transactional
@RequestMapping("/actions")
public class ActionController {

    @Autowired
    private ActionDao actionDao;

    @Autowired
    private ContactDao contactDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private EmailMessageDao emailMessageDao;

    @RequestMapping(value = "/all", method = RequestMethod.GET)
    public
    @ResponseBody
    List<Action> getActions() {
        try {
            List<Action> actions = actionDao.list();
            return actions;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }


    @RequestMapping(value = "/myActions", method = RequestMethod.GET)
    public
    @ResponseBody
    List<Action> getMyActions(@RequestParam(value = "id") int userId) {
        try {
            List<Action> actions = actionDao.findByUserId(userId);
            return actions;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @RequestMapping(value = "/getLatestActionForContact", method = RequestMethod.GET)
    public
    @ResponseBody
    Action getLatestActionForContact(@RequestParam(value = "id") int customerId) {
        Contact load = contactDao.load(customerId);
        Action currentAction = load.getCurrentAction();
        return currentAction;
    }

    @ResponseBody
    @RequestMapping(value = "/new", method = {RequestMethod.POST})
    public Action newAction(@RequestBody final Action action) {


        try {
            final Date dateNow = new Date();
            User user = userDao.load(action.getCreatedBy());
            action.setCreatedOn(dateNow);
            action.setAssignedTo(action.getAssignedTo());

            if (action.getContactId() != null) {
                Contact load = contactDao.load(action.getContactId());
                Action currentAction = load.getCurrentAction();

                if (currentAction != null) {
                    currentAction.setOutcome(action.getOutcome());

                    action.setOutcome(null);
                    action.setPreviousAction(currentAction.getId());

                    actionDao.save(action);
                    currentAction.setNextAction(action.getId());
                    actionDao.save(currentAction);


                    load.setCurrentAction(action);
                    contactDao.save(load);

                    if (action.getMessageId() != null) {
                        EmailMessage emailMessage = emailMessageDao.load(action.getMessageId());
                        emailMessage.setProcessed(true);
                        emailMessage.setProcessedDate(new Date());
                        emailMessage.setAssignedContact(load);
                        emailMessage.setProcessedBy(user.getId());
                        emailMessageDao.save(emailMessage);
                    }

                } else {
                    actionDao.save(action);
                    load.setCurrentAction(action);
                    contactDao.save(load);

                    if (action.getMessageId() != null) {
                        EmailMessage emailMessage = emailMessageDao.load(action.getMessageId());
                        emailMessage.setProcessed(true);
                        emailMessage.setProcessedDate(new Date());
                        emailMessage.setAssignedContact(load);
                        emailMessage.setProcessedBy(user.getId());
                        emailMessageDao.save(emailMessage);
                    }

                }
            }


        } catch (Exception e) {
            e.printStackTrace();
        }
        return action;
    }

/*

    @ResponseBody
    @RequestMapping(value = "/delete", method = {RequestMethod.POST})
    public Contact delete(@RequestBody final Contact contact) {
        final Date dateNow = new Date();
        contact.setRemoved(true);
        contact.setModifiedOn(dateNow);
        contactDao.save(contact);
        return contact;
    }

    @ResponseBody
    @RequestMapping(value = "/restore", method = {RequestMethod.POST})
    public Contact restore(@RequestBody final Contact contact) {
        final Date dateNow = new Date();
        contact.setRemoved(false);
        contact.setModifiedOn(dateNow);
        contactDao.save(contact);
        return contact;
    }*/
}