import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import cloudinary from "cloudinary";
import LayoutModel from "../models/layout.model";
import ErrorHandler from "../utils/ErrorHandler";
const bannerData = {
  type: "",
  faq: [],
  categories: [],
  banner: {},
};
export const createLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { type } = req.body;
    const isTypeExist = await LayoutModel.findOne({ type });
    if (isTypeExist) {
      return next(new ErrorHandler(`${type} already exists`, 400));
    }
    let newBannerData = {};
    if (type === "Banner") {
      const { image, subtitle, title } = req.body;
      const myCloud = await cloudinary.v2.uploader.upload(image, {
        folder: "layout",
      });
      newBannerData = {
        ...bannerData,
        type: type,
        banner: {
          image: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          },
          title,
          subtitle,
        },
      };
      await LayoutModel.create(newBannerData);
    }
    if (type === "Faq") {
      const { faq } = req.body;

      newBannerData = {
        ...bannerData,
        type,
        faq,
      };

      await LayoutModel.create(newBannerData);
    }
    if (type === "Categories") {
      const { categories } = req.body;
      newBannerData = {
        ...bannerData,
        categories: categories,
        type: type,
      };
      await LayoutModel.create(newBannerData);
    }
    return res.status(200).json({
      success: true,
      message: "Layout created successfully",
      newBannerData,
    });
  }
);

// Edit Layout
export const editLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { type } = req.body;
    let newBannerData = {};
    if (type === "Banner") {
      const bannerdata: any = await LayoutModel.findOne({ type });
      const { image, subtitle, title } = req.body;
      if (bannerdata) {
        await cloudinary.v2.uploader.destroy(bannerdata.banner.image.public_id);
      }
      const myCloud = await cloudinary.v2.uploader.upload(image, {
        folder: "layout",
      });
      newBannerData = {
        ...bannerData,
        type: type,
        banner: {
          image: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          },
          title,
          subtitle,
        },
      };
      await LayoutModel.findByIdAndUpdate(bannerdata?._id, newBannerData, {
        new: true,
        runValidators: true,
      });
    }
    if (type === "Faq") {
      const { faq } = req.body;
        const faqItem = await LayoutModel.findOne({type});
      newBannerData = {
        ...bannerData,
        type,
        faq,
      };

      await LayoutModel.findByIdAndUpdate(faqItem?._id,newBannerData,{
        new:true,
        runValidators:true,
      });
    }
    if (type === "Categories") {
      const { categories } = req.body;
      const categoryData = await LayoutModel.findOne({type});
      newBannerData = {
        ...bannerData,
        categories: categories,
        type: type,
      };
      await LayoutModel.findByIdAndUpdate(categoryData?._id,newBannerData,{
        new:true,
        runValidators:true
      });
    }
    return res.status(201).json({
      success: true,
      message: "Layout updated successfully",
      newBannerData,
    });
  }
);

// Get layout by type

export const getLayoutType=CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
   const { type } = req.query as { type?: string };

    // 1. Validate input
    if (!type) {
      return next(new ErrorHandler("Type is required", 400));
    }

    // 2. Query DB
    const layout = await LayoutModel.findOne({ type });

    // 3. Handle not found
    if (!layout) {
      return next(new ErrorHandler(`Layout with type '${type}' not found`, 404));
    }

    // 4. Success response
    res.status(200).json({
      success: true,
      message: "Layout fetched successfully",
      layout,
    });
})