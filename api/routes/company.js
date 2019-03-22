const express = require("express");
const router = express.Router();


const {Company} = require('../models/company');
const {ObjectId} = require('mongodb');
const {authenticate} = require('../../middleware/authenticate');
const {Log} = require ('../models/audit_Trail');

// Company Onboarding Route
router.post('/company/registration',authenticate,(req,res,next)=>{
    req.body.name = req.body.name.toLowerCase(); // change company name to lower case
    
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


// GET Route to get all company staffs
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
    let id = req.params.name;
    Company.findOne({id})
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

module.exports = router;