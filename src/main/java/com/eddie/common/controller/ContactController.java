package com.eddie.common.controller;

import com.eddie.dao.ContactDao;
import com.eddie.domain.Contact;
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
@RequestMapping("/contacts")
public class ContactController {

    @Autowired
    private ContactDao contactDao;

    @RequestMapping(value = "", method = RequestMethod.GET)
    public
    @ResponseBody
    List<Contact> getEvents() {

        try {
            List<Contact> contacts = contactDao.list();
            return contacts;
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    @ResponseBody
    @RequestMapping(value = "/new", method = {RequestMethod.POST})
    public Contact create(@RequestBody final Contact contact) {
        final Date dateNow = new Date();
        contact.setId(null);
        contact.setCreatedOn(dateNow);
        contact.setModifiedOn(dateNow);
        contactDao.save(contact);
        return contact;
    }

    @ResponseBody
    @RequestMapping(value = "/update", method = {RequestMethod.POST})
    public Contact update(@RequestBody final Contact contact) {
        final Date dateNow = new Date();
        contact.setModifiedOn(dateNow);
        contactDao.save(contact);
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
    }
}