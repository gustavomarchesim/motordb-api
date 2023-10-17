import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true },
  senha: { type: String, required: true },
  avatar: { type: String, require: false },
  isAdmin: { type: Boolean, require: false },
});

export const userModel =
  mongoose.models.usuarios || mongoose.model('usuarios', userSchema);
