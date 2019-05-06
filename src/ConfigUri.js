//export const baseurl = 'http://10.0.0.14:4001/';
//export const baseurl = 'http://10.0.0.3:4001/';
//export const baseurl = 'http://192.168.1.49:4001/';
//export const baseurl = 'http://10.0.0.47:4001/';
//export const baseurl = 'http://192.168.1.49:4001/';

//export const baseurl = 'http://localhost:4001/';
//export const redirtUrl = 'http://localhost:4000/reset-password/';

export const RecentUpdateState = `${baseurl}api/getstatedata`;
//for the state recent update

export const RecentUpdateMetro = `${baseurl}api/getmetrodata`;
//for the metro recent update

export const Upload_cbsa_file = `${baseurl}api/importcbsadata`;
export const Upload_state_file = `${baseurl}api/importstatedata`;
export const Upload_zip_file = `${baseurl}api/importzipdata`;
export const Upload_master_file = `${baseurl}api/importmasterdata`;
export const Replace_Upload_Data = `${baseurl}api/updateDataModule/`;
//for uploading the text file for the metro

export const Upload_State_file = `${baseurl}api/uploadstatefile`;
//for uploading the text file for the state

export const Map_View = `${baseurl}api/mapviews`;
//the above api used in map_container....no1

export const Map_Details = `${baseurl}api/details`;
//the above api used in map_container....no2

export const Zip_Code = `${baseurl}api/getDataByZipCode/`;
//the above api used in home.jsx.......no1

export const Import_Address = `${baseurl}api/importaddress`;
//the above api used in address_form.jsx.......no1

export const user_login = `${baseurl}api/user/login`;
//the above api used in user login
export const viewPayment = `${baseurl}api/viewpayment`;
//the above api used in user login
export const searchmortage = `${baseurl}api/searchmortage`;
//the above api used in user login
export const advancesearchlist = `${baseurl}api/getallist`;
//the above api used in user login
export const filteraddress = `${baseurl}api/advansesearch`;
//the above api used in user login

export const getsmscodedata = `${baseurl}api/getsmscodedata`;
//the above api used in user login
export const getsmscodelist = `${baseurl}api/getsmscodelist`;
//the above api used in user login
export const getFilteredAccountList = `${baseurl}api/searchmortagelist`;
//above api used to get Filtered list of accounts
export const getBorrowerSwapBalanceHistory = `${baseurl}api/borrower/swapbalance/`;
//above api used to get Borrower Swap Balance History
export const getSelectedBorrowerProfile = `${baseurl}api/borrower/`;
//above api used to get selected Borrower Profile data
export const getReportScreenData = `${baseurl}api/servicer/getallswapfunder`;
//above api used to get all swapfunder data

export const getMortgageListByMSA = `${baseurl}api/getmortagelistbymsa`;
//above api used to get all swapfunder data

export const getservicerlist = `${baseurl}api/getservicerlist`;

export const getSwapFunderSummary = `${baseurl}api/analysis/portfolio`;
//above api is used to get Portfolio analysis data

export const getPropertyDetails = `${baseurl}api/property/detail?address=`;
//above api is used to get Property Details

export const getMortgageOriginatorMonthData = `${baseurl}api/originatorlist`;
//above api is used to get list of month for originator
export const getMonthReportByDate = `${baseurl}api/originatorlistbydate/`;
//above api is used to get month report by date

export const updateMortgageList = `${baseurl}api/updatemortgage`;

export const updateMortgagePaymentData = `${baseurl}api/addmortgagepayment/`;

export const deleteSelectedMortgagePaymentData = `${baseurl}api/borrower/deleteswapbalance`;

export const getMortgageList = `${baseurl}api/getmortgagelist`;

export const getMortgageListWithPayments = `${baseurl}api/getmortgagewithpayment/`;

export const add_adjust_payment = `${baseurl}api/addadjustpayment`;
export const get_adjust_payment = `${baseurl}api/getadjustpayment/`;
export const add_pool_name = `${baseurl}api/addupdatepool`;
export const update_fee = `${baseurl}api/addpoolsubscriptionfee`;

export const getPoolList = `${baseurl}api/getpoollist/`;
export const deletePoolList = `${baseurl}api/deletepool`;
export const getMortgageListDrop = `${baseurl}api/getmortgagewithpool`;
export const getSelectdPoolMortgageList = `${baseurl}api/getpoolmortgagelist/`;

export const addpoolmortgage = `${baseurl}api/addpoolmortgage`;
export const removepoolmortgage = `${baseurl}api/removepoolmortgage`;
export const getPoolMortgageHistory = `${baseurl}api/getpoolmortgagehistory/`;
export const getPoolLevelReportingUrl = `${baseurl}api/getAggrHistory/`;
export const getPortfolioPerformances = `${baseurl}api/getportfolioperformance`;
export const getWeightAvg = `${baseurl}api/getweightavg`;
export const poolHistory = `${baseurl}api/getpoolpropertieslist/`;
export const getPeriodPoolById = `${baseurl}api/getperiodpoolbyid/`;
export const getPoolPropertieList = `${baseurl}api/displaypollproperties`;
export const searchMortgage = `${baseurl}api/searchmortagelist`;
export const getBusiness = `${baseurl}api/bussinessdetail`;
export const addBusiness = `${baseurl}api/bussiness/signup`;
export const getUserData = `${baseurl}api/getusersdata`;
export const getCompanyData = `${baseurl}api/user/getcompanybyrole/`;
export const addUserData = `${baseurl}api/user/signup`;
export const addUserDataByAdmin = `${baseurl}api/user/signupbyadmin`;
export const deleteUserData = `${baseurl}api/deleteuser/`;
export const deleteBusinessData = `${baseurl}api/deletebusinessuser/`;
export const getBorrowerPayment = `${baseurl}api/borrower/getpaymenthistory/`;
export const getBorrowerBill = `${baseurl}api/borrower/getborrowerbilldetail/`;
export const getBorrowerPaid = `${baseurl}api/borrower/getborrowerpaiddetail/`;
export const getUserInPools = `${baseurl}api/genratepaymentreport/`;
export const getPoolCsv = `${baseurl}api/exportdata`;
export const forgetPasswordUrl = `${baseurl}api/resetpassword`;
export const getPoolPropertyDetail = `${baseurl}api/showpropertiespostaldata`;
export const hpiData = `${baseurl}api/getperformancemodel/`;
export const addProperty = `${baseurl}api/addproperty`;
export const companyList = `${baseurl}api/user/getcompanyname`;
export const getUserProperties = `${baseurl}api/propertydetailbyid/`;
export const getUserPool = `${baseurl}api/getpoolproperty/`;
export const resetPassword = `${baseurl}api/changepassword`;
export const addUserProperty = `${baseurl}api/addpropertybyhomeowner`;
export const unassociateUser = `${baseurl}api/removeproperty`;
export const propertyUserList = `${baseurl}api/getuserslistofproperty/`;
export const associateUserList = `${baseurl}api/getassosiateuserlist/`;
export const getLogs = `${baseurl}api/getactivitylog`;
export const getSubscriptionFee = `${baseurl}api/getpoolsubscriptionhistory/`;
export const getUserInProperties = `${baseurl}api/getuserbyproperty/`;
export const exportCsv = `${baseurl}api/exportcsv/`;
export const getPropertiesPool = `${baseurl}api/getpropertylistforpool/`;
export const getPoolHistoryExport = `${baseurl}api/exportpoolhistory/`;
export const getExit = `${baseurl}api/getexitdate`;
export const checkFirstLogIn = `${baseurl}api/user/isloogedin/`;
export const checkProperty = `${baseurl}api/user/checkProperty/`;
export const renewPasswordUrl = `${baseurl}api/updatepassword`;
export const googleLoginApi = `${baseurl}api/auth/google`;
export const facebookLoginApi = `${baseurl}api/auth/facebook`;
export const getUserProfile = `${baseurl}api/user/getuserprofile`;
