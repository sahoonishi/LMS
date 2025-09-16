import { Schema, Document, model } from "mongoose";

export interface IFaq extends Document {
  question: string;
  answer: string;
}
export interface ICategory extends Document {
  title: string;
}
export interface IBannerImage extends Document {
  public_id: string;
  url: string;
}
export interface ILayout extends Document {
  type: string;
  faq: IFaq[];
  categories: ICategory[];
  banner: {
    image: IBannerImage;
    title: string;
    subtitle: string;
  };
}


//-------------------------_SCHEMA---------------------



const faqSchema = new Schema<IFaq>({
  question: { type: String },
  answer: { type: String },
});

const categorySchema = new Schema<ICategory>({
  title: { type: String },
});

const bannerimageSchema = new Schema<IBannerImage>({
  public_id: { type: String },
  url: { type: String },
});
const layoutSchema = new Schema<ILayout>({
  type: { type: String,enum:["Banner","Faq","Categories"] },
  faq: [faqSchema],
  categories: [categorySchema],
  banner: {
    image: bannerimageSchema,
    title: { type: String },
    subtitle: { type: String },
  },
});
const LayoutModel = model<ILayout>("Layout", layoutSchema);
export default LayoutModel;
