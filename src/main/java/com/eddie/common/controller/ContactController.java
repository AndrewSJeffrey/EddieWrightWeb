package com.eddie.common.controller;

import com.eddie.dao.ContactDao;
import com.eddie.domain.Contact;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

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

    @RequestMapping(value = "/getContactById", method = RequestMethod.GET)
    public
    @ResponseBody
    Contact getContactById(@RequestParam(value = "id") int id) {
        try {
            return contactDao.load(id);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @RequestMapping(value = "/search", method = RequestMethod.GET)
    public
    @ResponseBody
    List<Contact> search(@RequestParam(value = "search") String search) {
        try {
            List<Contact> contacts = contactDao.search(search);
            return contacts;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @RequestMapping(value = "/searchFirstName", method = RequestMethod.GET)
    public
    @ResponseBody
    List<Contact> startsWith(@RequestParam(value = "search") String search) {
        try {
            List<Contact> contacts = contactDao.searchFirstName(search);
            return contacts;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }



    @ResponseBody
    @RequestMapping(value = "/count", method = {RequestMethod.GET})
    public int count() {
        return contactDao.count();
    }

    @ResponseBody
    @RequestMapping(value = "/new", method = {RequestMethod.POST})
    public Contact create(@RequestBody final Contact contact) {
        final Date dateNow = new Date();
        contact.setId(null);
        contact.setCreatedOn(dateNow);
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
    }
}