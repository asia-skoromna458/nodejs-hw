import { Note } from "../models/note.js";
import createHttpError from "http-errors";



export const getAllNotes = async (req, res) => {
  const note = await Note.find();
  res.status(200).json(note);
};//повертає всі нотатки GET

export const getNoteById = async(req,res) => {
  const { noteId } = req.params;
  const note = await Note.findOne({ _id: noteId });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }
  res.status(200).json(note);
};//повертає одну нотатку GET

export const createNote = async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json(note);
};//створення нотатки POST

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({ _id: noteId, });
  if (!note) {
    throw createHttpError(404, 'Note not found');

  }
  res.status(200).json(note);
};//видалення через айді DELETE


export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findByIdAndUpdate(
    noteId,
    req.body,
    { returnDocument: "after" },
  );
  if (!note) {
    throw createHttpError(404, 'Note not found');
  }
  res.status(200).json(note);
};//оновлення PATCH
