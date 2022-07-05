import Models from "./../models/index";
import { GenericObject, GenericServiceCallback } from '../../definations';
import mongoose from "mongoose";


/**
 * @author Sanchit Dang
 * @description Generic MongoDB Service Template
 */
export default class GenericMongoService {
    declare model: mongoose.Model<unknown>;

    /**
     * @private
     * @author Sanchit Dang
     * @description Validate if models exists
     * @param {String} modelName name of the model 
     */
    private isModelValid(modelName: string): boolean {
        return !(!modelName || 0 === modelName.length || !Models.hasOwnProperty(modelName as PropertyKey));
    }

    /**
     * 
     * @param {String} modelName Name of the Model
     */
    constructor(modelName: string) {
        if (!this.isModelValid(modelName)) {
            console.error(`Invalid model name ${modelName}`);
            throw "Invalid model name '" + modelName + "'. Terminating app..."
        }
        this.model = Models[modelName];
    }



    /**
     * @author Sanchit Dang
     * @description Update a record in DB
     * @param {Object} criteria 
     * @param {Object} data 
     * @param {Object} options 
     * @param {Function} callback 
     */
    async updateRecord(criteria: GenericObject, data: GenericObject, options: GenericObject, callback?: GenericServiceCallback | ((err?: Error | null | undefined, result?: unknown) => void)) {
        try {
            options.lean = true;
            options.new = true;
            const result = await this.model.findOneAndUpdate(criteria, data, options, callback);
            if (!callback) return result;
        } catch (error) {
            if (!callback) throw error;
        }
    }

    /**
     * @author Sanchit Dang
     * @description Insert a record in DB
     * @param {Object} data 
     * @param {Function} callback 
     */
    async createRecord(data: GenericObject, callback?: GenericServiceCallback | ((err?: Error | null | undefined, result?: unknown) => void)) {
        try {
            const result = await new this.model(data).save();
            if (!callback) return result;
        } catch (error) {
            if (!callback) throw error;
        }

    }

    /**
     * @author Sanchit Dang
     * @description Hard delete a record
     * @param {Object} criteria 
     * @param {Function} callback 
     */
    async deleteRecord(criteria: GenericObject, callback?: GenericServiceCallback | ((err?: Error | null | undefined, result?: unknown) => void)) {
        try {
            const result = await this.model.findOneAndRemove(criteria, callback);
            if (!callback) return result;
        } catch (error) {
            if (!callback) throw error;
        }
    }

    /**
     * @author Sanchit Dang
     * @description Retrive records
     * @param {Object} criteria 
     * @param {Object} projection 
     * @param {Object} options 
     * @param {Function} callback 
     */
    async getRecord(criteria: GenericObject, projection: GenericObject, options: GenericObject, callback?: GenericServiceCallback | ((err?: Error | null | undefined, result?: unknown) => void)) {
        try {
            options.lean = true;
            const result = await this.model.find(criteria, projection, options, callback);
            if (!callback) return result;
        } catch (error) {
            if (!callback) throw error;
        }
    }

    /**
     * @author Sanchit Dang
     * @description Retrive records while populating them
     * @param {Object} criteria 
     * @param {Object} projection 
     * @param {Object|string} populate 
     * @param {Function} callback 
     */
    async getPopulatedRecords(criteria: GenericObject, projection: GenericObject, populate: string | string[], callback?: GenericServiceCallback | ((err?: Error | null | undefined, result?: unknown) => void)) {
        try {
            const result = await this.model.find(criteria).select(projection).populate(populate);
            if (!callback) return result;
            else {
                callback(null, result);
            }
        } catch (error) {
            if (!callback) throw error;
            else {
                callback(error as Error);
            }
        }
    }

}