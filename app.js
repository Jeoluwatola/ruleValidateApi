const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const bodyParser = require('body-parser');
const port = process.env.PORT || 8080;
const morgan = require('morgan');
const app = express();

const info =
{
    "message": "My Rule-Validation API",
    "status": "success",
    "data": {
        "name": "Oluwatola Jesutofunmi Olubi",
        "github": "@Jeoluwatola",
        "email": "olubioluwatola@gmail.com",
        "mobile": "08172764020"
    }
}

//function to get key using value  
function getKey(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: false }));


//GET ROUTE
app.get('/', (req, res) => {
    res.json(info);
});

//POST ROUTE
app.post('/validate-rule', (req, res) => {
    const { rule, data } = req.body;

    const head = { rule: rule, data: data }

    // checking that rule and data exist
    for (let i = 0; i < 2; i++) {
        if (!Object.values(head)[i]) {
            const e = getKey(head, Object.values(head)[i])
            res.status(400).json({
                message: `${e} +  is required.`,
                status: "error",
                data: null
            });            
        }
    }
    // //checking that rule is an object    
    if ((typeof (rule) != "object")) {
        res.status(400).json({
            message: "Rule should be an object.",
            status: "error",
            data: null,
        });
    }

    const field = rule.field;
    const condition = rule.condition;
    const condition_value = rule.condition_value;
    const fields = { field: field, condition: condition, condition_value: condition_value }
    const success = {
        message: `field ${field} successfully validated.`,
        status: "success",
        data: {
            validation: {
                error: false,
                field: field,
                field_value: data[field],
                condition: condition,
                condition_value: condition_value
            },
        }
    }
    
    const failed = {
        message: `field ${field} failed validation.`,
        status: "success",
        data: {
            validation: {
                error: true,
                field: field,
                field_value: data[field],
                condition: condition,
                condition_value: condition_value
            },
        }
    }

    //checking that fields in rule exist
    for (let i = 0; i < 3; i++) {        
        if (!Object.values(fields)[i]) {
            const f = getKey(fields, Object.values(fields)[i])            
            res.status(400).json({
                message:`${f} is required.`,
                status: "error",
                data: null
            });
        }
    }

    //checking that field is a string
    if ((typeof (field) != "string")) {
        res.status(400).json({
            message: "field should be a string.",
            status: "error",
            data: null
        });
    }
    //checking that condition is a string
    else if ((typeof (condition) != "string")) {
        res.status(400).json({
            message: "condition should be a string.",
            status: "error",
            data: null
        });
    }
    //checking that condition_value is of the correct type
    else if ((typeof (condition_value) != "string") && (typeof (condition_value) != "number")) {
        res.status(400).json({
            message: "condition should be a string or number.",
            status: "error",
            data: null
        });
    }
    //checking that data is either an object, a string or an array     
    else if ((typeof (data) != "object") && (typeof (data) != "string") && (typeof (data) != "array")) {
        res.status(400).json({
            message: "Data should be an object, string or array.",
            status: "error",
            data: null
        });
    }
    //checking that field specified in rule object is in data   
    else if (!data[field]) {
        res.status(400).json({
            message: `field ${field} is missing from data.`,
            status: "error",
            data: null
        });
    }

    //actual field validattion code starts here    
    //equal to function
    if (condition == "eq") {
        if (condition_value == data[field]) {
            res.status(200).json(success);
        } else (
            res.status(400).json(failed)
        );
    }
    // not equal to function
    else if (condition == "neq") {
        if (condition_value != data[field]) {
            res.status(200).json(success);
        } else (
            res.status(400).json(failed)
        );
    }
    // greater than function
    else if (condition == "gt") {
        if (data[field] > condition_value) {
            res.status(200).json(success);
        } else (
            res.status(400).json(failed)
        );
    }
    // greater than or equal to function
    else if (condition == "gte") {
        if (data[field] >= condition_value) {
            res.status(200).json(success);
        } else (
            res.status(400).json(failed)
        );
    }
    //contains function
    else if (condition == "contains") { 
        if (data[field].indexOf(condition_value) > -1) {
            res.status(200).json(success);
        } else (
            res.status(400).json(failed)
        );
    }
});


//Handling Invalid json payload  
app.use((error, req, res, next) => {
    if (error = SyntaxError + "JSON") {
        res.status(400).json({
            message: "Invalid JSON payload passed.",
            status: "error",
            data: null,
        });
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}` )
})
