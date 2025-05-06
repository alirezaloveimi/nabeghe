import { Schema, model, models } from "mongoose";

type CategorySceham = {
  title: string;
  name: string;
};

const categorySchema = new Schema<CategorySceham>(
  {
    title: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Category = models.Category || model("Category", categorySchema);
export default Category;
