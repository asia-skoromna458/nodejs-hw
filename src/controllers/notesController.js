import { Notes } from "../models/note.js";
import createHttpError from "http-errors";



export const getAllNotes = async (req, res) => {
  const notes = await Notes.find();
  res.status(200).json(notes);
};//повертає всі нотатки GET

export const getNoteById = async(req,res) => {
  const { noteId } = req.params;
  const notes = await Notes.findOne({ _id: noteId });

  if (!notes) {
    throw createHttpError(404, 'Note not found');
  }
  res.status(200).json(notes);
};//повертає одну нотатку GET

export const createNote = async (req, res) => {
  const notes = await Notes.create(req.body);
  res.status(201).json(notes);
};//створення нотатки POST

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const notes = await Notes.findOneAndDelete({ _id: noteId, });
  if (!notes) {
    throw createHttpError(404, 'Note not found');

  }
  res.status(200).json(notes);
};//видалення через айді DELETE


export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const notes = await Notes.findByIdAndUpdate(
    { _id: noteId },
    req.body,
    { returnDocument: "after" },
  );
  if (!notes) {
    throw createHttpError(404, 'Note not found');
  }
  res.status(200).json(notes);
};//оновлення PATCH
