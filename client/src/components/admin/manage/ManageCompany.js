import React, { Component } from 'react';
import axios from 'axios';
import './Manage.css';
import Sidebar from '../templates/Sidebar';
import TopNavbar from '../templates/TopNavbar';

class ManageCompany extends Component {
  constructor(props) {
    super(props);

    this.state = {
      companyName: '',
      companyType: '',
      totalShares: '',
      totalAllocatedShares: '',
      totalUnallocatedShares: '',
      totalSchemeMembers: '',
      allocationDate: '',
      vestingDateSchedule: '',
      cash: false,
      bonus: false,
      share: '',
      shareBonus: '',
      currentShareValue: '',
      canBuy: false,
      canSell: false,
      totalSharesForfieted: '',
      collaterizedShares: false,
      purchasePrice: '',
      paymentPeriod: '',
      grade: '',
      level: '',
      schemeRules: '',
      success: false,
      error: '',
    };
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onBoardCompany = e => {
    e.preventDefault();
    const {
      companyName,
      companyType,
      totalShares,
      totalAllocatedShares,
      totalUnallocatedShares,
      totalSchemeMembers,
      allocationDate,
      vestingDateSchedule,
      cash,
      bonus,
      share,
      shareBonus,
      currentShareValue,
      canBuy,
      canSell,
      totalSharesForfieted,
      collaterizedShares,
      purchasePrice,
      paymentPeriod,
      grade,
      level,
      schemeRules,
    } = this.state;

    const companyData = {
      companyName,
      companyType,
      totalShares,
      totalAllocatedShares,
      totalUnallocatedShares,
      totalSchemeMembers,
      allocationDate,
      vestingDateSchedule,
      cash,
      bonus,
      share,
      shareBonus,
      currentShareValue,
      canBuy,
      canSell,
      totalSharesForfieted,
      collaterizedShares,
      purchasePrice,
      paymentPeriod,
      grade,
      level,
      schemeRules,
    };

    axios
      .post('http://localhost:8000/registration', companyData)
      .then(res => {
        this.setState({ success: true });
      })
      .catch(error => {
        this.setState({ error });
      });
  };

  render() {
    const {
      companyName,
      companyType,
      totalShares,
      totalAllocatedShares,
      totalUnallocatedShares,
      totalSchemeMembers,
      allocationDate,
      vestingDateSchedule,
      cash,
      bonus,
      share,
      shareBonus,
      currentShareValue,
      canBuy,
      canSell,
      totalSharesForfieted,
      collaterizedShares,
      purchasePrice,
      paymentPeriod,
      grade,
      level,
      schemeRules,
      success,
      error,
    } = this.state;
    return (
      <div>
       <div className="content">
          <section>
             <div className="container">
                 <div className="row">
                     <div className="col-lg-9 comp-info">
                         <div className="row pt-5 mb-5">                
                             <div className=" col-md-3">
                                  <select id="inputState" className="form-control">
                                    <option>Sort</option>
                                    <option>Ascending</option>
                                    <option>Descending</option>
                                  </select>
                            </div>
                            <div className="col-md-3 ">
                                  <input type="text" className="form-control" placeholder="Search Here"/>
                             </div>
                             
                         </div>
                          <div className="row" style={{width: "1000px"}}>
                            <div className="col-lg-6 ">
                              <div className="card dash">
                                <div className="card-body ">
                                  <h5 className="card-title mb-4">Interswitch Inc.<span className="chart">Public</span></h5>
                                  <a href="#" className="btn c-btn-bg-3 btn-success">View Scheme Members</a>
                                </div>
                              </div>
                             </div>
                             <div className="col-lg-6">
                              
                                     <a href="#" className="c-btn-bg4 btn1 btn mr-4">Add Members</a>
                               
                         
                                     <a href="#" className="c-btn-bg4 btn btn2 mr-4">Edit Info</a>
                  
                                     <a href="#" className="c-btn-bg4 btn3 btn ">Delete</a>
                               </div>
                             </div>
                             </div>
                          </div>
                     </div>
                  </section>
                 </div>

    
    <section style={{ marginLeft: "25px"}}>
        <div className="container">
            <div className="row mb-5 custom-role">
                <div className="col-xl-10 col-lg-9 col-md-8 ml-auto mt-4">
                    <div className="row" >
                     
                       <div className="col-lg-3">
                          <div className="card card-custom-body mb-4">              
                            <div className="card-body">
                               <h6 className="card-subtitle p-2">Total Allocated Shares</h6>
                               <h4 className="card-title mb-2 text-muted">1,234 Units</h4>
                            </div>
                          </div>
                        </div>
                          <div className="col-lg-3">
                              <div className="card card-custom-body">
                                <div className="card-body">
                                  <h6 className="card-subtitle p-2">Total Allocated Shares</h6>
                                   <h4 className="card-title mb-2 text-muted">1,234 Units</h4>
                                </div>
                            </div>
                          </div>
                       
                      <div className="col-lg-3">
                              <div className="card card-custom-body">
                                <div className="card-body">
                                  <h6 className="card-subtitle p-2">Total Allocated Shares</h6>
                                   <h4 className="card-title mb-2 text-muted">1,234 Units</h4>
                                </div>
                            </div>
                          </div>

                           <div className="col-lg-3">
                              <div className="card card-custom-body">
                                <div className="card-body">
                                  <h6 className="card-subtitle p-2">Total Allocated Shares</h6>
                                   <h4 className="card-title mb-2 text-muted">1,234 Units</h4>
                                </div>
                            </div>
                          </div>
                     <div className="col-lg-3">
                              <div className="card card-custom-body">
                                <div className="card-body">
                                  <h6 className="card-subtitle p-2">Total Allocated Shares</h6>
                                   <h4 className="card-title mb-2 text-muted">1,234 Units</h4>
                                </div>
                            </div>
                          </div> 

                          <div className="col-lg-3">
                              <div className="card card-custom-body">
                                <div className="card-body">
                                  <h6 className="card-subtitle p-2">Total Allocated Shares</h6>
                                   <h4 className="card-title mb-2 text-muted">1,234 Units</h4>
                                </div>
                            </div>
                          </div>

                           <div className="col-lg-3">
                              <div className="card card-custom-body">
                                <div className="card-body">
                                  <h6 className="card-subtitle p-2">Total Allocated Shares</h6>
                                   <h4 className="card-title mb-2 text-muted">1,234 Units</h4>
                                </div>
                            </div>
                          </div>

                           <div className="col-lg-3">
                              <div className="card card-custom-body">
                                <div className="card-body">
                                  <h6 className="card-subtitle p-2">Total Allocated Shares</h6>
                                   <h4 className="card-title mb-2 text-muted">1,234 Units</h4>
                                </div>
                            </div>
                          </div>
                      
                    </div>
                </div>
           </div>
         </div>
    </section>
  </div>            
    );
  }
}

export default ManageCompany;
