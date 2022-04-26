const req = require("express/lib/request");
const res = require("express/lib/response");
const mongoose = require("mongoose");
const { BadRequestError } = require("../errors");
const handlePromise = require("../helpers/promise.helper");
const Coffee = require("../models/coffee.model");

exports.create = async(req, res,next) => {
    if(!req.body.name) {
        return next(new BadRequestError(400, "Name can not be empty"));
    }

    const coffee = new Coffee({
        name: req.body.name,
        price: req.body.price,
        description : req.body.description,
        status: req.body.status === true,
    });

    const [error, document] = await handlePromise(coffee.save());

    if(error) {
        return next(new BadRequestError(500, "An error occurred while creating the contact"));
    }

    return res.send(document);
};

exports.findAll = async (req, res, next) => {
    const condition = { } ;
    const { name } = req.query;
    if (name) {
        condition.name = {$regex: new RegExp(name), $options: "i"};
    }

    const [error, documents] = await handlePromise(Coffee.find(condition));

    if(error) {
        return next(new BadRequestError(500, "An error occurred while retrieving coffees"));
    }
    return res.send(documents);
};


exports.findOne = async (req, res, next) => {
    const {id} = req.params;
    const condition = {
        _id: id && mongoose.isValidObjectId(id) ? id : null,
    };

    const [error, document] = await handlePromise(Coffee.findOne(condition));

    if (error) {
        return next(new BadRequestError(500, `Error retrieving coffee with id= ${req.params.id}`));
    }

    if (!document) {
        return next(new BadRequestError(404, "Drink not found"));
    }
    return res.send(document);
}

exports.update = async (req, res, next) => {
    if(Object.keys(req.body).length === 0){
        return next(new BadRequestError(400, "Data to update can not be empty"));
    }

    const {id} = req.params;
    const condition = {
        __id: id && mongoose.isValidObjectId(id) ? id : null,
    };

    const [error, document] = await handlePromise (
        Coffee.findOneAndUpdate(condition, req.body, {
            new: true,
        })
    );

    if (error) {
        return next (new BadRequestError(500, `Error updating coffee with id=${req.params.id}`));
    }

    if(!document) {
        return next(new BadRequestError(404, "Coffee not found"));
    }

    return res.send({ message: "Coffee was updated successfully",});
};

exports.delete = async (req, res, next) => {
    const {id} = req.params;
    const condition = {
        _id: id && mongoose.isValidObjectId(id) ? id : null,
    };

    const [error, document] = await handlePromise (
        Coffee.findOneAndDelete(condition)
    );

    if(error) {
        return next(new BadRequestError(500, `Could not delete coffee with id=${req.params.id}`));
    }

    if (!document) {
        return next(new BadRequestError(404, "Coffee not found"));
    }

    return res.send({message: "Coffee was delete successfully"});
};

exports.deleteAll = async (req, res, next) => {
    const [error, data] = await handlePromise(
        Coffee.deleteMany({})
    );

    if (error) {
        return next(new BadRequestError(500, "An error occurred while removing all drinks"));
    }

    return res.send({
        message: `${data.deleteCount} drinks were deleted successfully`,    });
};

