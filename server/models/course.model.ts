import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { IUser } from "./user.model";

// ----------------- Interfaces -----------------
interface IComment extends Document {
  user: Types.ObjectId | IUser; // reference to User
  question: string;
  questionReplies?: Types.DocumentArray<IComment>;
}

interface IReview extends Document {
  user: Types.ObjectId | IUser;
  rating: number;
  comment: string;
  commentReplies?: Types.DocumentArray<IComment>;
}

interface ILink extends Document {
  title: string;
  url: string;
}

interface ICourseData extends Document {
  title: string;
  description: string;
  videoUrl: string;
  videoThumbnail: string;
  videoSection: string;
  videoLength: string;
  videoPlayer: string;
  links: Types.DocumentArray<ILink>;
  suggestion: string;
  questions: Types.DocumentArray<IComment>;
}

export interface ICourse extends Document {
  name: string;
  description: string;
  price: number;
  estimatePrice?: number;
  thumbnail: {
    public_id: string;
    url: string;
  };
  tags: string;
  level: string;
  demoUrl: string;
  benefits: { title: string }[];
  prerequisites: { title: string }[];
  reviews: Types.DocumentArray<IReview>;
  courseData: Types.DocumentArray<ICourseData>;
  rating?: number;
  purchased?: number;
}

// ----------------- Schemas -----------------
const commentSchema = new Schema<IComment>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    question: { type: String, required: true },
    questionReplies: [{ type: Schema.Types.Mixed }], // could also be [commentSchema] for recursive
  },
  { timestamps: true }
);

const reviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, default: 0 },
    comment: { type: String, required: true },
    commentReplies: [commentSchema],
  },
  { timestamps: true }
);

const linkSchema = new Schema<ILink>({
  title: { type: String, required: true },
  url: { type: String, required: true },
});

const courseDataSchema = new Schema<ICourseData>(
  {
    title: String,
    description: String,
    videoUrl: String,
    videoThumbnail: String,
    videoSection: String,
    videoLength: String,
    videoPlayer: String,
    links: [linkSchema],
    suggestion: String,
    questions: [commentSchema],
  },
  { timestamps: true }
);

const courseSchema = new Schema<ICourse>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    estimatePrice: { type: Number },
    thumbnail: {
      public_id: { type: String },
      url: { type: String },
    },
    tags: { type: String, required: true },
    level: { type: String, required: true },
    demoUrl: { type: String, required: true },
    benefits: [{ title: String }],
    prerequisites: [{ title: String }],
    reviews: [reviewSchema],
    courseData: [courseDataSchema],
    rating: { type: Number, default: 0 },
    purchased: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ----------------- Model -----------------
const CourseModel: Model<ICourse> = mongoose.model<ICourse>("Course", courseSchema);
export default CourseModel;
