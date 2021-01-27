const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
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

    //rule and data field required
    const one = ["rule", "data"]
    one.forEach(e => {
        if (!e) {
            res.status(400).json({
                message: e + "field is required!!.",
                status: "error",
                data: null
            });
        }
    });

    //checking that rule is an object  
    if ((typeof (rule) != "object")) {
        res.status(400).json({
            message: "Rule should be an object.",
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
    
    //assigning rule fields to variabble
    const fld = rule.field;
    const condition = rule.condition;
    const conditionValue = rule.condition_value;


    //checking that field specified in rule object is in data   
    if (!data[fld]) {
        res.status(400).json({
            message: "field " + fld + " is missing from data.",
            status: "error",
            data: null
        });
    } 

    //actual field validattion code starts here       

    //equal to function
    if (condition == "eq") {
        if (conditionValue == data[fld]) {
            res.status(200).json({
                message: "field " + fld +" successfully validated.",
                status: "success",
                data: {
                    validation: {
                        error: false,
                        field: fld,
                        field_value: data[fld],
                        condition: condition,
                        condition_value: conditionValue
                    },
                }
            });
        } else (
            res.status(400).json({
                message: "field " + fld +" failed validation.",
                status: "success",
                data: {
                    validation: {
                        error: true,
                        field: fld,
                        field_value: data[fld],
                        condition: condition,
                        condition_value: conditionValue
                    },
                }
            })
        );
    } 

    //not equal to function
    else if (condition == "neq") {
        if (conditionValue != data[fld]) {
            res.status(200).json({
                message: "field " + fld +" successfully validated.",
                status: "success",
                data: {
                    validation: {
                        error: false,
                        field: fld,
                        field_value: data[fld],
                        condition: condition,
                        condition_value: conditionValue
                    },
                }
            });
        } else (
            res.status(400).json({
                message: "field " + fld +" failed validation.",
                status: "success",
                data: {
                    validation: {
                        error: true,
                        field: fld,
                        field_value: data[fld],
                        condition: condition,
                        condition_value: conditionValue
                    },
                }
            })
        );
    }

    //greater than function
    else if (condition == "gt") {
        if ( data[fld] > conditionValue ) {
            res.status(200).json({
                message: "field " + fld +" successfully validated.",
                status: "success",
                data: {
                    validation: {
                        error: false,
                        field: fld,
                        field_value: data[fld],
                        condition: condition,
                        condition_value: conditionValue
                    },
                }
            });
        } else (
            res.status(400).json({
                message: "field " + fld +" failed validation.",
                status: "success",
                data: {
                    validation: {
                        error: true,
                        field: fld,
                        field_value: data[fld],
                        condition: condition,
                        condition_value: conditionValue
                    },
                }
            })
        );
    }

    //greater than or equal to function
    else if (condition == "gte") {
        if ( data[fld] >= conditionValue ) {
            res.status(200).json({
                message: "field " + fld +" successfully validated.",
                status: "success",
                data: {
                    validation: {
                        error: false,
                        field: fld,
                        field_value: data[fld],
                        condition: condition,
                        condition_value: conditionValue
                    },
                }
            });
        } else (
            res.status(400).json({
                message: "field " + fld +" failed validation.",
                status: "success",
                data: {
                    validation: {
                        error: true,
                        field: fld,
                        field_value: data[fld],
                        condition: condition,
                        condition_value: conditionValue
                    },
                }
            })
        );
    }

    //contains function
    else if (condition == "contains") {
        if ( data[fld].indexOf(conditionValue) > -1 ) {
            res.status(200).json({
                message: "field " + fld +" successfully validated.",
                status: "success",
                data: {
                    validation: {
                        error: false,
                        field: fld,
                        field_value: data[fld],
                        condition: condition,
                        condition_value: conditionValue
                    },
                }
            });
        } else (
            res.status(400).json({
                message: "field " + fld +" failed validation.",
                status: "success",
                data: {
                    validation: {
                        error: true,
                        field: fld,
                        field_value: data[fld],
                        condition: condition,
                        condition_value: conditionValue
                    },
                }
            })
        );
    }
});


//Handling Invalid json payload  
app.use((error, req, res, next) => {    
    if(error = SyntaxError ){
        res.status(400).json({
            message: "Invalid JSON payload passed.",
            status: "error",
            data: null,
        });
    }   
  });

app.listen(port, () => {
    debug("Listening on port " + chalk.green(port))
})