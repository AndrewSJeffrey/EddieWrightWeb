package com.eddie.common.controller;

import com.eddie.dao.OpportunityDao;
import com.eddie.domain.Opportunity;
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
@RequestMapping("/opportunities")
public class OpportunityController {

    @Autowired
    private OpportunityDao opportunityDao;

    @RequestMapping(value = "", method = RequestMethod.GET)
    public
    @ResponseBody
    List<Opportunity> getEvents() {

        try {
            List<Opportunity> opportunities = opportunityDao.list();
            return opportunities;
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    @ResponseBody
    @RequestMapping(value = "/new", method = {RequestMethod.POST})
    public Opportunity create(@RequestBody final Opportunity opportunity) {
        final Date dateNow = new Date();
        opportunity.setId(null);
        opportunity.setCreatedOn(dateNow);
        opportunity.setModifiedOn(dateNow);
        opportunityDao.save(opportunity);
        return opportunity;
    }

    @ResponseBody
    @RequestMapping(value = "/update", method = {RequestMethod.POST})
    public Opportunity update(@RequestBody final Opportunity opportunity) {
        final Date dateNow = new Date();
        opportunity.setModifiedOn(dateNow);
        opportunityDao.save(opportunity);
        return opportunity;
    }

    @ResponseBody
    @RequestMapping(value = "/delete", method = {RequestMethod.POST})
    public Opportunity delete(@RequestBody final Opportunity opportunity) {
        final Date dateNow = new Date();
        opportunity.setRemoved(true);
        opportunity.setModifiedOn(dateNow);
        opportunityDao.save(opportunity);
        return opportunity;
    }

    @ResponseBody
    @RequestMapping(value = "/restore", method = {RequestMethod.POST})
    public Opportunity restore(@RequestBody final Opportunity opportunity) {
        final Date dateNow = new Date();
        opportunity.setRemoved(false);
        opportunity.setModifiedOn(dateNow);
        opportunityDao.save(opportunity);
        return opportunity;
    }
}