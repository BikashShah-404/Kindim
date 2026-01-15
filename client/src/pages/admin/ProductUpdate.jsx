import Input from "@/components/Input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGetAllCategoriesQuery } from "@/redux/api/categorySlice";
import {
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUpdateProductDetailsMutation,
  useUpdateProductImageMutation,
} from "@/redux/api/productSlice";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaFileUpload } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import AdminMenu from "./AdminMenu";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ProductUpdate = () => {
  const [preview, setPreview] = useState(null);
  const [hovered, setHovered] = useState(false);
  const params = useParams();

  const { data: response, isLoading } = useGetProductByIdQuery(params._id);
  const product = response?.data[0];
  const { data: categories } = useGetAllCategoriesQuery();
  const {
    register,
    setValue,
    reset,
    handleSubmit,
    formState: { isSubmitting, errors, dirtyFields },
  } = useForm({
    defaultValues: {
      name: product?.name,
      quantity: product?.quantity,
      description: product?.description,
      brand: product?.brand,
      price: product?.price,
      category: product?.category,
      countInStock: product?.countInStock,
    },
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        quantity: product.quantity,
        description: product.description,
        brand: product.brand,
        price: product.price,
        category: product.category,
        countInStock: product.countInStock,
      });
      console.log(product.category._id);
    }
  }, [product, reset]);

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
      imageRef.current.value = ""; // Reset the file input so it can detect new changes
    }
  };

  const [updateProductImage] = useUpdateProductImageMutation();
  const [updateProductDetails] = useUpdateProductDetailsMutation();
  const handleProductUpdate = async (data) => {
    try {
      if (Object.keys(dirtyFields).length === 0 && !data.image?.name) {
        toast.info("Nothing to Update");
        return;
      } else if (data.image?.name) {
        const formData = new FormData();
        formData.append("image", data.image);
        const imageUploadResponse = await updateProductImage({
          productId: params._id,
          image: formData,
        }).unwrap();
        if (imageUploadResponse.status === 200) {
          toast.success("Product Image Updated...");
          setTimeout(() => {
            setPreview(null);
            setValue("image", null);
          }, 500);
        }
      } else {
        const payload = {};
        Object.keys(dirtyFields).map((eachDirtyField) => {
          payload[eachDirtyField] = data[eachDirtyField];
        });
        const response = await updateProductDetails({
          productId: params._id,
          data: payload,
        });
        if (response.status === 200) {
          toast.success("Product Details Updated...");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.data.message || "Something went wrong...");
    }
  };

  const navigate = useNavigate();
  const [deleteProduct] = useDeleteProductMutation();
  const handleProductDelete = async () => {
    if (window.confirm("Are u sure u want to delete this product?")) {
      try {
        const response = await deleteProduct(params._id).unwrap();
        if (response.data.response.acknowledged) {
          toast.success(`Product ${product.name} deleted...`);
          navigate("/admin/product-all");
        }
      } catch (error) {
        console.log(error);
        toast.error(error.data.message || "Something went wrong...");
      }
    }
  };
  return (
    !isLoading && (
      <div className="w-full h-[calc(100vh-64px)] flex flex-col">
        <AdminMenu />
        <form
          className=" flex flex-col space-y-4 md:space-y-8 p-6 md:p-10 "
          onSubmit={handleSubmit(handleProductUpdate)}
        >
          <div className="flex flex-row items-center space-x-4 sm:pl-10">
            <p>Product Image :</p>
            <div className="w-60 h-40 min-h-40 rounded-3xl overflow-hidden mt-10 relative">
              <img
                src={preview ? preview : product?.image}
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
                            {preview
                              ? "Discard Change"
                              : "Upload Product Image"}
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
                <p className="text-red-700 ml-6">
                  {errors.quantity.message}...
                </p>
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
                defaultValue={product.category}
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
          <div className="mt-8 md:mt-2 w-full  flex flex-col space-y-8 sm:flex-row sm:space-x-20 sm:pl-10 ">
            <div className="w-full sm:w-fit">
              <button
                className={`bg-black w-full md:w-auto px-14 py-2 text-white rounded-md ${
                  isSubmitting ? "cursor-wait" : "cursor-pointer"
                }`}
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? "Updating" : "Update Product"}
              </button>
            </div>
            <div className="w-full sm:w-fit">
              <button
                className={`bg-black w-full md:w-auto px-14 py-2 text-white rounded-md ${
                  isSubmitting ? "cursor-not-allowed" : "cursor-pointer"
                }`}
                disabled={isSubmitting}
                type="button"
                onClick={handleProductDelete}
              >
                {isSubmitting ? "Deleting" : "Delete Product"}
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  );
};

export default ProductUpdate;
