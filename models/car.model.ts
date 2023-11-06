import mongoose, { Schema } from 'mongoose';

const modeloSchema = new Schema({
  modelo: { type: String, required: true },
  imagemModelo: { type: String, required: false },
  detalhes: { type: String, required: false },
  valor: { type: Number, required: true },
});

const marcaSchema = new Schema({
  marca: { type: String, required: true },
  imagemMarca: { type: String, required: false },
  modelos: [modeloSchema],
});

export const carModel =
  mongoose.models.carros || mongoose.model('carros', marcaSchema);
