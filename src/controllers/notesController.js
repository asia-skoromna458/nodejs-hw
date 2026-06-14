import { Note } from "../models/note.js";
import createHttpError from "http-errors";



export const getAllNotes = async (req, res) => {
  const { page = 1, perPage = 10, tag, search } = req.query;
  const myQuery = Note.find({userId: req.user._id});
  if (tag) {
    myQuery.where("tag").equals(tag);
  }
  if (search) {
    myQuery.where({
  $or: [
    { title: { $regex: search, $options: 'i' } },
    { content: { $regex: search, $options: 'i' } },
  ],
    });
  }

  const skip = (page - 1) * perPage;
  const [notes, totalNotes] = await Promise.all([
    myQuery.clone().skip(skip).limit(perPage),
    myQuery.clone().countDocuments()
  ]);

  const totalPages = Math.ceil(totalNotes / perPage);
  res.status(200).json({
  page,
  perPage,
  totalNotes,
  totalPages,
  notes
}
);
};//повертає всі нотатки GET

export const getNoteById = async(req,res) => {
  const { noteId } = req.params;
  const note = await Note.findOne({ _id: noteId, userId: req.user._id });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }
  res.status(200).json(note);
};//повертає одну нотатку GET

export const createNote = async (req, res) => {
  const note = await Note.create({ ...req.body, userId: req.user._id, });

  res.status(201).json(note);
};//створення нотатки POST

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({ _id: noteId, userId:req.user._id });
  if (!note) {
    throw createHttpError(404, 'Note not found');

  }
  res.status(200).json(note);
};//видалення через айді DELETE


export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndUpdate(
    {_id: noteId, userId:req.user._id },
    req.body,
    { returnDocument: "after" },
  );
  if (!note) {
    throw createHttpError(404, 'Note not found');
  }
  res.status(200).json(note);
};//оновлення PATCH


