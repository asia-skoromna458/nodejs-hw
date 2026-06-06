import { Joi, Segments } from "celebrate";
import { TAGS } from "../src/constants/tags.js";
import { isValidObjectId } from "mongoose";

export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object({
  page: Joi.number().integer().min(1).default(1),
  perPage: Joi.number().integer().min(5).max(20).default(10),
  tag: Joi.string().valid(...TAGS),
  search: Joi.string().allow(''),
}),//GET /notes

};


export const objectValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message('Invalid id format') : value;
};//notes/:noteId, GET i DELETE
export const noteIdSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectValidator).required(),
  }),
};//notes/:noteId, GET i DELETE


export const createNoteSchema = {[Segments.BODY]: Joi.object({
  title: Joi.string().min(1).required(),
  content: Joi.string().allow(''),
  tag: Joi.string().valid(...TAGS),

})};//POST /notes

export const updateNoteSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectValidator),
  }),
  [Segments.BODY]: Joi.object({
        title: Joi.string().min(1),
    content: Joi.string().allow(''),
    tag: Joi.string().valid(...TAGS),
  }).min(1),

};//PATCH /notes/:noteId
