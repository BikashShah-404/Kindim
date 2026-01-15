import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCreateProductMutation } from "@/redux/api/productSlice";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaFileUpload, FaUser } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

import Upload from "../../assets/Upload.png";
import Input from "@/components/Input";
import { useGetAllCategoriesQuery } from "@/redux/api/categorySlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AdminMenu from "./AdminMenu";

const ProductCreate = () => {
  const [preview, setPreview] = useState(null);
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      price: 0,
      quantity: 0,
      countInStock: 0,
    },
  });

  const imageRef = useRef(null);
  const handleProductImageClick = (e) => {
    imageRef.current?.click();
    e.preventDefault();
  };
  const handleProductImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setValue("image", file);
    }
  };
  const handleProductImageRemove = (e) => {
    setPreview(null);
    setValue("image", null);
    e.preventDefault();
    if (imageRef.current) {
      imageRef.current.value = "";
    }
  };

  const { data: categories } = useGetAllCategoriesQuery();
  const [createProduct] = useCreateProductMutation();

  const handleProductCreation = async (data) => {
    try {
      if (!data.image?.name) {
        toast.error("Product-Image is required");
        return;
      }
      console.log(data);
      const formData = new FormData();
      formData.append("image", data.image);
      formData.append("name", data.name);
      formData.append("brand", data.brand);
      formData.append("quantity", data.quantity);
      formData.append("category", data.category);
      formData.append("description", data.description);
      formData.append("price", data.price);

      const response = await createProduct(formData).unwrap();
      if (response.status === 200) {
        reset();
        toast.success("Product Created...");
        navigate("/");
      }
    } catch (err) {
      console.log(err);
      toast.error(err.data.message || "Something went wrong...");
    }
  };

  return (
    <div className="w-full h-[calc(100vh-64px)] flex flex-col  overflow-y-auto">
      <AdminMenu />
      <form
        className=" flex flex-col space-y-4 md:space-y-8 p-6 md:p-10 "
        onSubmit={handleSubmit(handleProductCreation)}
      >
        <div className="flex flex-row items-center space-x-4 sm:pl-10">
          <p>Product Image :</p>
          <div className="w-40 min-h-40 rounded-3xl overflow-hidden mt-10 relative">
            <img
              src={preview ? preview : Upload}
              alt="profilePic.png"
              className="object-cover w-full h-full"
            />
            <div
              role="button"
              onMouseDown={(e) => e.preventDefault()}
              className={`absolute inset-0 hover:bg-gray-200/50  flex rounded-3xl  items-center justify-center ${
                isSubmitting ? "cursor-wait" : "cursor-pointer"
              }`}
              onClick={
                preview ? handleProductImageRemove : handleProductImageClick
              }
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              {hovered && !isSubmitting && (
                <>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        {preview ? (
                          <MdDeleteForever
                            size={30}
                            color="red"
                            className={`${
                              isSubmitting ? "cursor-wait" : "cursor-pointer"
                            }`}
                          />
                        ) : (
                          <FaFileUpload
                            size={30}
                            className={`${
                              isSubmitting ? "cursor-wait" : "cursor-pointer"
                            }`}
                          />
                        )}
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {preview ? "Discard Change" : "Upload Product Image"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </>
              )}
            </div>
            <input
              type="file"
              ref={imageRef}
              accept=".png, .jpg, .jpeg, .svg ,.webp"
              name="profilePic"
              onChange={handleProductImageChange}
              className="hidden"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:w-4/5">
          <div className="flex flex-col w-full -space-y-3">
            <Input
              label="Name :"
              name="name"
              type="text"
              className=""
              {...register("name", { required: "Product-Name is required" })}
            />
            {errors.name && (
              <p className="text-red-700 ml-6">{errors.name.message}...</p>
            )}
          </div>
          <div className="flex flex-col w-full -space-y-3">
            <Input
              label="Price :"
              name="price"
              type="text"
              className=""
              {...register("price", {
                required: "Product-Price is required",
                valueAsNumber: true,
                validate: (v) =>
                  typeof v === "number" && !isNaN(v)
                    ? true
                    : "Product-Price needs to be a number",
              })}
            />
            {errors.price && (
              <p className="text-red-700 ml-6">{errors.price.message}...</p>
            )}
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:w-4/5">
          <div className="flex flex-col w-full -space-y-3">
            <Input
              label="Quantity :"
              name="quantity"
              type="text"
              className=""
              {...register("quantity", {
                required: "Product-Quantity is required",
                valueAsNumber: true,
                validate: (v) =>
                  typeof v === "number" && !isNaN(v)
                    ? true
                    : "Product-Quantity needs to be a number",
              })}
            />
            {errors.quantity && (
              <p className="text-red-700 ml-6">{errors.quantity.message}...</p>
            )}
          </div>
          <div className="flex flex-col w-full -space-y-3">
            <Input
              label="Brand :"
              name="brand"
              type="text"
              className=""
              {...register("brand", {
                required: "Product-Brand is required",
              })}
            />
            {errors.brand && (
              <p className="text-red-700 ml-6">{errors.brand.message}...</p>
            )}
          </div>
        </div>
        <div className="flex flex-col space-y-2 w-full md:w-4/5 px-6">
          <label htmlFor="description">Description:</label>
          <div className="flex flex-col w-full ">
            <textarea
              className="w-full md:w-[80%]   max-w-full h-24 resize bg-gray-800 text-white rounded-lg px-8 py-4"
              {...register("description", {
                required: "Product-Description is required",
              })}
            />
            {errors.description && (
              <p className="text-red-700 ">{errors.description.message}...</p>
            )}
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:w-4/5  items-center ">
          <div className="flex flex-col w-full -space-y-3">
            <Input
              label="Count In Stock :"
              name="countInStock"
              type="text"
              className=" "
              {...register("countInStock", {
                valueAsNumber: true,
                validate: (v) =>
                  typeof v === "number" && !isNaN(v)
                    ? true
                    : "Needs to be a number",
              })}
            />
            {errors.countInStock && (
              <p className="text-red-700 ml-6">
                {errors.countInStock.message}...
              </p>
            )}
          </div>
          <div className="flex flex-col justify-center space-y-2 w-full h-full px-6 md:px-2 mb-[0.6rem] ">
            <label htmlFor="description">Choose Category:</label>
            <select
              className="w-full h-fit bg-gray-800 text-white p-3.5 rounded-lg self-center"
              {...register("category", {
                required: "Product-Category is required",
              })}
            >
              {categories &&
                categories.data.map((eachCategory) => (
                  <option
                    key={eachCategory._id}
                    className="bg-gray-800 text-white"
                    value={eachCategory._id}
                  >
                    {eachCategory.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className="w-full  md:w-4/5 flex justify-center">
          <button
            className={`bg-black px-14 py-2 text-white rounded-md ${
              isSubmitting ? "cursor-wait" : "cursor-pointer"
            }`}
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Creating" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductCreate;
