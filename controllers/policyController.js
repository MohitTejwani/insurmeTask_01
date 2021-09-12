const agentShema = require('../models/agentModel');
const carrierShema = require('../models/carrierModel');
const LOBShema = require('../models/LOBModel');
const policyShema = require('../models/policyModel');
const accountShema = require('../models/usersAccountModel');
const userShema = require('../models/usersModel');
const csv = require('csv-parser')
const fs = require('fs')
const formidable = require('formidable');
const { info } = require('console');

const uploadBulkPolicies = async (req, res) => {
    try {
        const form = formidable();
        let results = [];
        form.parse(req, (err, fields, files) => {
            if (files.file.path == undefined || files.file.path == null || !files.file.path) {
                // throw new Error("File not found")
                res.status(410).json({
                    message: "File not found",
                })
            }
            fs.createReadStream(files.file.path)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', async () => {
                    await createPolicy(results)

                    res.status(200).json({
                        messege: "All data added"
                    })

                })
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}
const createPolicy = async (results) => {
    return new Promise(async (resolve, reject) => {
        const errorInRecored = []
        let recoredNumber = 0
        const agentList = await agentShema.find();
        const companyList = await carrierShema.find();
        const LOBList = await LOBShema.find();
        const accountList = await accountShema.find();
        for (let info of results) {
            recoredNumber++
            const existingAgent = agentList.find((agent) => { return agent.agentName == info.agent });
            const existingCompany = companyList.find((company) => { return company.companyName == info.company_name });
            const existingLOB = LOBList.find((lob) => { return lob.categoryName == info.category_name })
            const existingAccountList = accountList.find((account) => { return account.accountName == info.account_name });
            let agent = existingAgent;
            if (!agent) {
                const newAgent = new agentShema({ agentName: info.agent });
                agent = await newAgent.save();
            }
            if (agent) {
                let company = existingCompany;
                if (!company) {
                    const newCompany = new carrierShema({ companyName: info.company_name });
                    company = await newCompany.save();
                }
                let lob = existingLOB
                if (!lob) {
                    const newLOB = new LOBShema({ categoryName: info.category_name });
                    lob = await newLOB.save();
                }
                let account = existingAccountList
                if (!account) {
                    const newAccount = new accountShema({ accountName: info.account_name });
                    account = await newAccount.save();
                }
                const newUser = new userShema({
                    firstName: info.firstname,
                    DOB: Date(info.dob),
                    address: info.address,
                    phoneNumber: info.phone,
                    state: info.state,
                    zipCode: info.zipCode,
                    email: info.email,
                    gender: info.gender,
                    userType: info.userType
                })
                let user = await newUser.save();
                const newPolicyInfo = new policyShema({
                    policyNumber: info.policy_number,
                    policyStartDate: info.policy_start_date,
                    policyEndDate: info.policy_end_date,
                    policyCategory: lob._id || 1,
                    companyId: company._id,
                    userId: user._id,
                    policyMode: info.policy_mode,
                    premiumAmount: info.premium_amount
                });
                await newPolicyInfo.save();
            } else {
                errorInRecored.push(`Recored Number : ${recoredNumber} is not able to  add due to  agent name is missing `)
            }
        }
        resolve()
    })
}

const getPolicyByUserName = async (req, res) => {
    try {
        const { userName } = req.query
        const user = await userShema.find({ firstName: userName }).select('_id');
        let userId = []
        user.map(x => {
            userId.push(x._id.toString())
        })
        const policy = await policyShema.find({
            userId: { $in: userId }
        }).populate('companyId policyCategory userId')
        res.status(200).json(policy)
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}
const getPolicyByUser = async (req, res) => {
    try {
        const { userName } = req.query
        const user = await userShema.find({ firstName: userName }).select('_id');
        let userId = []
        user.map(x => {
            userId.push(x._id.toString())
        })
        const policy = await policyShema.findOne({
            userId: { $in: userId }
        });
        let greater = policy.premiumAmount + ((policy.premiumAmount * 10) / 100);
        let lessthan = policy.premiumAmount - ((policy.premiumAmount * 10) / 100);
        const recomendedPolicy = await policyShema.find({
            $or: [
                { premiumAmount: { $gte: lessthan, $lte: greater } },
                { policyMode: policy.policyMode },
                { companyId: policy.companyId },
                { policyCategory: policy.policyCategory }

            ]
        }).populate('companyId policyCategory');

        res.status(200).json(recomendedPolicy)
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}

module.exports = {
    getPolicyByUserName,
    uploadBulkPolicies,
    getPolicyByUser
}