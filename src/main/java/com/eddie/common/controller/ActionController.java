package com.eddie.common.controller;

import com.eddie.dao.ActionDao;
import com.eddie.dao.ContactDao;
import com.eddie.domain.Action;
import com.eddie.domain.Contact;
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

    @RequestMapping(value = "", method = RequestMethod.GET)
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


/*
    @ResponseBody
    @RequestMapping(value = "/update", method = {RequestMethod.POST})
    public Contact update(@RequestBody final Contact contact) {
        final Date dateNow = new Date();
        contact.setModifiedOn(dateNow);
        contact.setModifiedBy(contact.getCreatedBy());
        try {
            contactDao.save(contact);
        }catch (Exception e) {
            e.printStackTrace();
        }
        return contact;
    }

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