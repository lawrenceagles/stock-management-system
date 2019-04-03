const express = require("express");
const router = express.Router();


const {Company} = require('../models/company');
const {User} = require('../models/user');
const {Batch} = require ('../models/batch');
const {Dividend} = require('../models/dividend');
const {ObjectId} = require('mongodb');
const {authenticate} = require('../../middleware/authenticate');
const {Log} = require ('../models/audit_Trail');

// Company Onboarding Route
router.post('/company/registration',authenticate,(req,res,next)=>{
    
    Company.find({name:req.body.name},(err,doc)=>{
    if(doc.length){
        res.status(400).json({
         message:`A company with that name already exists`
        })
     }
    else{
       const company = new Company({...req.body});

        let log = new Log({
            createdBy: `${req.admin.lastname} ${req.admin.firstname}`,
            action: `created a company `,
            company: `${company.name}`

        });

        log.save();

        company.save()
        .then(response=>{
                 res.status(200).json({
                    response,
                    info:"save successfull"
                })
            })
        .catch(err=>{
            return res.status(404).json({
                message:'something is wrong '+ err
            });
        })
      }
    })
})

router.get('/company/list',authenticate,(req,res,next)=>{ 
    const sort = {}

    let pageOptions = {
        page: req.query.page || 0,
        limit: req.query.limit || 10
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    
    Company.find()
        .skip(pageOptions.page*pageOptions.limit)
        .limit(pageOptions.limit)
        .sort(sort)
        .exec( (err, doc)=>{
            if(err) { res.status(500).json(err); return; };
            res.status(200).json(doc);
        })   
})

router.get('/allcompany',authenticate,(req,res,next)=>{ 
    
    Company.find({}).then(docs=>{
        if(!docs){
            return res.status(404).send("No company found. Please onboard companies");
        }

        return res.send(docs);
    })
          
})


// GET Route to get one company staff
router.get('/companymember/:name',authenticate, (req,res)=>{
    let name = req.params.name;
    Company.findOne({name})
        .then(doc=>{
            doc
            .populate({
                path: 'staffs'
            })
            .execPopulate()
            .then(company=>{
                if(!company){
                    return res.status(404).send("No scheme member for this company")
                }
                res.send(company.staffs);
            });
        })

});


// get company users by id
router.get('/companystaff/:id', authenticate, (req,res)=>{
    let id = req.params.id;

    if(!ObjectId.isValid(id)){
        res.status(400).send(`Error: invalid Object ID`);
    }

    Company.findById(id)
        .then(doc=>{
            if(!doc){
                return res.status(404).send(`No users found`);
            }
            doc
            .populate({
                path: 'staffs'
            })
            .execPopulate()
            .then(company=>{
                if(!company){
                    return res.status(404).send("No scheme member for this company")
                }
                res.send(company.staffs);
            });
        })

})


// GET Route to get get company by id
router.get('/company/:id',authenticate, (req,res)=>{
    let id = req.params.id;

    // validate the company id
    if(!ObjectId.isValid(id)){
        return res.status(400).send("Error invalid ObjectId");
    }

    Company.findOne({_id:id}).then(company=>{
        if(!company){
            return res.status(404).send("Error No company Found");
        }

        res.send(company);

    }).catch(e=>{
        res.status(400).send(`Error ${e}`);
    })
        

});

  //delete a company
router.delete('/delete/:id',authenticate,(req,res,next)=>{   //delete
 const id = req.params.id
   Company.findOneAndDelete({_id:id})
    .then(response=>{
       res.status(200).json({
           message:"Company has been deleted"
         })
        .then(id=>{
            find({_id:id},(err,doc)=>{
                if (err){
                    res.status(404).json({
                     message:`Delete failed${err}`
                    })
                }
                else{
                    let log = new Log({
                        createdBy: `${req.admin.lastname} ${req.admin.firstname}`,
                        action: `deleted a company`,
                        company: `${company.name}`
                        
                    });

                    log.save();

                    res.satus(200).json({
                        message:`Document has been deleted`
                      })
                    }       
                })
            })
        .catch(err=>{
            res.status(404).json({
                error:`delete request failed${err}`
            })
        })
    })
})

// Update company route
router.patch('/company/:id',authenticate,(req,res)=>{//update
    const id = req.params.id;
    
    // validate the company id
    if(!ObjectId.isValid(id)){
        return res.status(400).send("Error invalid ObjectId");
    }

        Company.findOneAndUpdate({_id:id}, {$set:req.body}, {new: true}).then(doc=>{
            // check if doc was foun and updated
            if(!doc){
                res.status(404).send();
            }

            if(req.password !== doc.password){
                let password = doc.password;
                let saltRounds = 10;
                let hash = bcrypt.hashSync(password, saltRounds);
                doc.password = hash;
            }

            doc.save();

            Company.findById(id).then(doc=>{
                let log = new Log({
                    action: `$Edited an admin profile`,
                    createdBy: `${req.admin.lastname} ${req.admin.firstname}`,
                    user: `${doc.firstname} ${doc.lastname}`
                });

                log.save();
                res.send(doc);
            }).catch((e)=>{
                res.status(400).send(`${e}`, "Error cannot return updated document");
            });
            
       }).catch((e)=>{
            res.status(400).send(`${e}`, "Error update error");
        });
})


// Declare a dividend
router.post('/company/dividend/:id',authenticate,(req,res)=>{
    const ID = req.params.id;
    req.body.company = ID; // set company id from req.params.
    Company.findById(ID).then(company=>{

        if(!req.body.bonus_Shares && !req.body.rate){
            return res.status(400).json({Message: "Both rate and bonus Shares cannot be empty"});
        }

        if(req.body.bonus_Shares !== undefined && req.body.rate !== undefined){
            return res.status(400).json({Message: "You cannot declare both rate and bonus shares in a dividend"});
        }

        const dividend = new Dividend({...req.body}); // create dividend

        let log = new Log({ // create audit trail
                action: `$Edited an admin profile`,
                createdBy: `${req.admin.lastname} ${req.admin.firstname}`,
                user: `${company.name}`
            });

            log.save(); // save audit trail

        dividend.save().then(dividendDoc=>{
            if(dividendDoc.bonus_Shares){
                User.find({company:ID}).then(users=>{
                    if(users.length === 0){
                        return res.status(404).json({Message: "No users in this company yet. Please onboard users before declaring dividend"})
                    }
                    users.forEach(function(user){ // loop through company users array.
                        let dividendAmountReceived = user.dividend.amountReceived;
                        dividendAmountReceived += dividendDoc.bonus_Shares;
                        user.save();
                    });

                    if(company.dividend.type !== "cash" ) {// add dividend to total shares allocated to scheme members
						company.totalSharesAllocatedToSchemeMembers += user.dividend.amountReceived;
					}
					// save updated company data to store database
			        company.save();
                    return res.json({Message: "Dividend successfully declared and added to eligible users"})
                  
                })
            }else if(dividendDoc.rate){
                User.find({company:ID}).then(users=>{
                    if(users.length === 0){
                        return res.status(404).json({Message: "No users in this company yet. Please onboard users before declaring dividend"})
                    }
                    users.forEach(function(user){
                        let dividendAmountReceived = user.dividend.amountReceived;
                        if(dividendAmountReceived < dividendDoc.rate.per){
                            dividendAmountReceived += 0;
                        }

                        let bonus_Shares = (dividendAmountReceived / dividendDoc.rate.per) * dividendDoc.rate.value;
                        dividendAmountReceived += bonus_Shares;
                        user.save();

                    });

                    if(company.dividend.type !== "cash" ) {// add dividend to total shares allocated to scheme members
						company.totalSharesAllocatedToSchemeMembers += user.dividend.amountReceived;
					}
					// save updated company data to store database
			        company.save();
                    res.json({Message: "Dividend successfully declared and added to eligible users by rate"});
                })

            }

        }).catch(e=>{
           res.status(400).json({Message:`${e}`}); 
        })

    }).catch(e=>{
        res.status(400).json({Message:`${e}`});
    })
})

// Delete a dividend
router.delete('/company/dividend/:id',authenticate,(req,res)=>{
    const ID = req.params.id;
    req.body.company = ID; // set company id from req.params.
    Company.findById(ID).then(company=>{

 		Dividend.findOneAndDelete(dividend=>{
 			let log = new Log({ // create audit trail
                action: `Deleted batch ${dividend.name}`,
                createdBy: `${req.admin.lastname} ${req.admin.firstname}`,
                user: `${company.name}`
            });

            if(dividendDoc.bonus_Shares){
                User.find({company:ID}).then(users=>{
                    if(users.length > 0){
                        users.forEach(function(user){ // loop through company users array.
	                        let dividendAmountReceived = user.dividend.amountReceived;
	                        dividendAmountReceived += dividendDoc.bonus_Shares;
	                        user.save();
	                    });
                    }

                    if(company.dividend.type !== "cash" ) {// add dividend to total shares allocated to scheme members
						company.totalSharesAllocatedToSchemeMembers -= user.dividend.amountReceived;
					}
					// save updated company data to store database
			        company.save();
                    return res.json({Message: "Dividend successfully declared and added to eligible users"})
                  
                })
            }else if(dividendDoc.rate){
                User.find({company:ID}).then(users=>{
                    if(users.length > 0){
                        users.forEach(function(user){
	                        let dividendAmountReceived = user.dividend.amountReceived;

	                        let bonus_Shares = (dividendAmountReceived / dividendDoc.rate.per) * dividendDoc.rate.value;
	                        dividendAmountReceived -= bonus_Shares;
	                        user.save();

	                    });
                    }

                    if(company.dividend.type !== "cash" ) {// add dividend to total shares allocated to scheme members
						company.totalSharesAllocatedToSchemeMembers -= user.dividend.amountReceived;
					}
					// save updated company data to store database
			        company.save();
                    res.json({Message: "Dividend successfully declared and added to eligible users by rate"});
                })

            }

            log.save(); // save audit trail
 		})

    }).catch(e=>{
        res.status(400).json({Message:`${e}`});
    })
})

// create a batch
router.post('/company/batch/:id',authenticate,(req,res)=>{
	const ID = req.params.id;
	Company.findById(ID).then(company=>{
		req.body.company = company._id; // pass the company id to req.body to link the batch
		let newBatch = new Batch({...req.body})

		let log = new Log({ // create the audit log
                action: `Created ${batch.name}`,
                createdBy: `${req.admin.lastname} ${req.admin.firstname}`,
                user: `${company.name}`
            });

        log.save(); // save the audit log
        newBatch.save().then(batch=>{
        	let batchID = batch._id;
        	company.batch = company.batch.concat([batchID]); 
        	company.save();
        	res.status(201).send(batch);
        }).catch(e=>{
        	res.status(400).json({Message: `${e}`});
        })


	}).catch(e=>{
		res.status(400).json({Message: `${e}`});
	})
})

module.exports = router;