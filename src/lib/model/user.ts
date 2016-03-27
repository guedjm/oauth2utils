"use strict";

import bcrypt = require("bcrypt");
import mongoose = require("mongoose");

import { Utils } from "../misc/utils";

export interface IUserDocument extends mongoose.Document {
  publicId: string;
  email: string;
  password: string;
  registrationDate: Date;

  verifyPassword(password: string, cb: (err: any, result: boolean) => void): void;
}

export interface IUserDocumentModel extends mongoose.Model<IUserDocument> {

  createUser(email: string, password: string, cb: (err: any, user: IUserDocument) => void): void;
  findUserByEmail(email: string, cb: (err: any, user: IUserDocument) => void): void;
  findUserByPublicId(publicId: string, cb: (err: any, user: IUserDocument) => void): void;
  deleteByEmail(email: string, cb: (err: any) => void): void;
}

const userSchema: any = new mongoose.Schema({
  publicId: mongoose.Schema.Types.String,
  email: mongoose.Schema.Types.String,
  password: mongoose.Schema.Types.String,
  registrationDate: Date
});


userSchema.static("createUser", function(email: string, password: string,
  cb: (err: any, user: IUserDocument) => void): void {
  const salt: string = bcrypt.genSaltSync(6);

  userDocumentModel.create({
    publicId: Utils.uidGen(20),
    email: email,
    password: bcrypt.hashSync(password, salt),
    registrationDate: new Date()
  }, cb);
});

userSchema.static("findUserByEmail", function(email: string, cb: (err: any, user: IUserDocument) => void): void {
  userDocumentModel.findOne({ email: email }, cb);
});

userSchema.static("findUserByPublicId", function(publicId: string, cb: (err: any, user: IUserDocument) => void): void {
  userDocumentModel.findOne({ publicId: publicId }, cb);
});

userSchema.static("deleteByEmail", function(email: string, cb: (err: any) => void): void {
  userDocumentModel.findOneAndRemove({ email: email }, cb);
});


userSchema.method("verifyPassword", function(password: string, cb: (err: any, result: boolean) => void): void {
  bcrypt.compare(password, this.password, cb);
});

export const userDocumentModel: IUserDocumentModel = <IUserDocumentModel>mongoose.model("user", userSchema);
