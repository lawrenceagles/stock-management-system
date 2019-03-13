const express = require("express");
const router = express.Router();


const {Company} = require('../models/company')
const {authenticate} = require('../../middleware/authenticate');
const {Log} = require ('../models/audit_Trail');

// Company Onboarding Route
router.post('/registration',(req,res,next)=>{
    Company.find({name:req.body.name},(err,doc)=>{
    if(doc.length){
        res.status(400).json({
         message:`Bad request name conflict`
        })
     }
    else{
       const company = new Company
        company.name=req.body.name;
        company.type=req.body.type;
        company.totalSchemeMembers=req.body.totalSchemeMembers;
        company.totalSharesAllotedToScheme=req.body.totalSharesAllotedToScheme;
        company.totalSharesAllotedToSchemeMembers=req.body.totalSharesAllotedToSchemeMembers;
        company.totalUnallotedShares=req.body.totalUnallotedShares;
        company.totalSharesForfieted=req.body.totalSharesForfieted;
        company.totalSharesRepurchased=req.body.totalSharesRepurchased;
        company.totalDividentDeclared=req.body.totalDividentDeclared;
        company.vestingDate=req.body.vestingDate;
        company.dateOfAllocation=req.body.dateOfAllocation;
        company.dividendTypeCash=req.body.dividendTypeCash;
        company.bonus = req.body.bonus;
        company.dividendTypeShare=req.body.dividendTypeShare;
        company.dividendRatePerShares = req.body.dividendRatePerShares;
        company.canBuyShares=req.body.canBuyShares;
        company.grade=req.body.grade;
        company.level = req.body.level;
        company.canSellShares=req.body.canSellShares;
        company.canCollateriseShares=req.body.canCollateriseShares;
        company.currentShareValuation=req.body.currentShareValuation;
        company.canRepurchase=req.body.canRepurchase;
        company.initialShareSale=req.body.initialShareSale;
        company.purchasePrice=req.body.purchasePrice;
        company.schemeRules=req.body.schemeRules;
        company.paymentPeriod=req.body.paymentPeriod;
        company.userList = req.body.userList;

        // let log = new Log({
        //     action: `${req.admin.lastname} ${req.admin.firstname} created ${company.name} profile `,
        //     createdBy: `${req.admin.lastname} ${req.admin.firstname}`
        // });

        // log.save();

        company.save()
    .then(response=>{
             res.status(200).json({
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

router.get('/list',(req,res,next)=>{ 
    let pageOptions = {
        page: req.query.page || 0,
        limit: req.query.limit || 10
    }
    
    Company.find()
        .skip(pageOptions.page*pageOptions.limit)
        .limit(pageOptions.limit)
        .exec( (err, doc)=>{
            if(err) { res.status(500).json(err); return; };
            res.status(200).json(doc);
        })   
})
//log out
    router.get('/logout',  function (req, res, next)  {
    console.log(req.token)
         if (req.token) {
       req.token.destroy(function (err) {
         if (err) {
           return next(err);
         } else {
           return res.redirect('/');
         }
       });
     }
  });

  //delet
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
                        action: `${req.admin.lastname} ${req.admin.firstname} deleted ${company.name} profile `,
                        createdBy: `${req.admin.lastname} ${req.admin.firstname}`
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
                error:` delete request failed${err}`
            })
        })
    })
})

router.put('/update/:id',authenticate,(req,res)=>{               //update
    const id = req.params.id;
        Company.findOne({_id:id},(err, company)=>{
            if (err) {
                res.status(500).json({
                    message:'Bad request update failed'
                });
              }
            else {
                if(!company){
                res.satus(404).json({
                    message:`Document not found`
                    })
                }
                else{
                    if(req.body.name){
                        company.name = req.body.name;
                    }
                    if(req.body.type){
                        company.type = req.body.type;
                    }
                    if(req.body.totalSchemeMembers){
                        company.totalSchemeMembers = req.body.totalSchemeMembers;
                    }
                    if(req.body.totalSharesAllotedToScheme){
                        company.totalSharesAllotedToScheme = req.body.totalSharesAllotedToScheme;
                    }
                    if(req.body.totalSharesAllotedToSchemeMembers){
                        company.totalSharesAllotedToSchemeMembers = req.body.totalSharesAllotedToSchemeMembers;
                    }
                    if(req.body.totalUnallotedShares){
                        company.totalUnallotedShares = req.body.totalUnallotedShares;
                    }
                    
                    if(req.body.grade){
                        company.grade = req.body.grade;
                    }
                    if(req.body.totalSharesForfieted){
                        company.totalSharesForfieted = req.body.totalSharesForfieted;
                    }
                    if(req.body.totalSharesRepurchased){
                        company.totalSharesRepurchased = req.body.totalSharesRepurchased;
                    }
                    if(req.body.totalDividentDeclared){
                        company.totalDividentDeclared =req.body.totalDividentDeclared
                    }
                    if(req.body.vestingDate){
                        company.vestingDate = req.body.vestingDate;
                    }
                    if(req.body.dateOfAllocation){
                        company.dateOfAllocation = req.body.dateOfAllocation;
                    }
                    if(req.body.dividendTypeCash){
                        company.dividendTypeCash = req.body.dividendTypeCash;
                    }
                    if(req.body.dividendTypeShare){
                        company.dividendTypeShare = req.body.dividendTypeShare;
                    }
                    if(req.body.dividendRatePerShares){
                        company.dividendRatePerShares = req.body.dividendRatePerShares;
                    }
                    if (req.body.canBuyShares){
                        company.canBuyShares = req.body.canBuyShares;
                    }
                    if(req.body.canSellShares){
                        company.canSellShares = req.body.canSellShares;
                    }
                    if(req.body.canCollateriseShares){
                        company.canCollateriseShares = req.body.canCollateriseShares;
                    }
                    if(req.body.bonus){
                        company.bonus = req.body.bonus;
                    }
                    if(req.body.currentShareValuation){
                        company.currentShareValuation = req.body.currentShareValuation;
                    }
                    if(req.body.canRepurchase){
                        company.canRepurchase = req.body.canRepurchase;
                    }
                    if(req.body.initialShareSale){
                        company.initialShareSale =req.body.initialShareSale;
                    }
                    if(req.body.purchasePrice){
                        company.purchasePrice = req.body.purchasePrice
                    }
                    if(req.body.paymentPeriod){
                        company.paymentPeriod = req.body.paymentPeriod;
                    }
                    if(req.body.level){
                        company.level= req.body.level;
                    }
                    if(req.body.schemeRules){
                        company.schemeRules = req.body.schemeRules;
                    }

                    let log = new Log({
                        action: `${req.admin.lastname} ${req.admin.firstname} created ${company.name} profile `,
                        createdBy: `${req.admin.lastname} ${req.admin.firstname}`
                    });

                    log.save();

                    company.save((err,UpdatedCompany)=>{
                        if(err) res.status(500).json({
                            message:`Error occured while saving Company detail`,
                            err:`${err}`
                        })
                        else{
                            res.status(200).json({
                                message:"update successfull",
                                result:`${UpdatedCompany}  `
                            })
                        }
                    })
                }
            };
       });
})

module.exports = router;