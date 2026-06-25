import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IReflection extends Document {
  surahNumber: number;
  surahName: string;
  arabicSurahName: string;
  ayahNumber: number;
  ayahEnd: number;
  title: string;
  arabicText: string;
  translation: string;
  reflection: string;
  tags: string[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReflectionSchema = new Schema<IReflection>(
  {
    surahNumber: { type: Number, required: true },
    surahName: { type: String, required: true, trim: true },
    arabicSurahName: { type: String, default: "", trim: true },
    ayahNumber: { type: Number, required: true },
    ayahEnd: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    arabicText: { type: String, required: true },
    translation: { type: String, required: true, trim: true },
    reflection: { type: String, required: true },
    tags: { type: [String], default: [] },
    published: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

// Compound index for Qur'an-order sorting (surah → ayah ascending)
ReflectionSchema.index({ surahNumber: 1, ayahNumber: 1 });
// Unique constraint: one reflection per surah:ayah combination
ReflectionSchema.index({ surahNumber: 1, ayahNumber: 1 }, { unique: true });

export const ReflectionModel: Model<IReflection> =
  mongoose.models.Reflection ??
  mongoose.model<IReflection>("Reflection", ReflectionSchema);
