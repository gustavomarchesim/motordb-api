import mongoose, { Schema } from 'mongoose';

const modeloSchema = new Schema({
  modelo: { type: String, required: true },
  detalhes: { type: String, required: false },
  valor: { type: Number, required: true },
});

const marcaSchema = new Schema({
  marca: { type: String, required: true },
  modelos: [modeloSchema],
});

export const carModel =
  mongoose.models.carros || mongoose.model('carros', marcaSchema);
