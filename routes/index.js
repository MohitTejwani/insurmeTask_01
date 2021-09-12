var express = require('express');
var router = express.Router();
const { uploadBulkPolicies,getPolicyByUserName,getPolicyByUser } = require('../controllers/policyController');
router.get('/',(req,res)=>{
    res.send("Hello")
})

router.post('/upload',uploadBulkPolicies)
router.get('/user',getPolicyByUserName)
router.get('/policy',getPolicyByUser)






module.exports = (app) => {
    app.use('/v1',router)
    
}