import { toast } from "react-toastify";

import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetAllCategoriesQuery,
  useGetACategoryQuery,
} from "../../redux/api/categorySlice.js";
import { useForm } from "react-hook-form";
import Input from "@/components/Input";
import { useEffect, useState } from "react";
import { MdCancel } from "react-icons/md";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ToolTip from "@/components/Tooltip";

const CategoryList = () => {
  const { data: categories, refetch } = useGetAllCategoriesQuery();
  console.log(categories);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const {
    register: registerCategory,
    handleSubmit: handleNewCategoryCreation,
    formState: {
      errors: categoryCreationError,
      isSubmitting: isCategoryCreating,
    },
  } = useForm();

  const [editingCategory, setEditingCategory] = useState(null);

  const {
    register: registerCategoryUpdate,
    handleSubmit: handleCategoryUpdation,
    reset,
    formState: {
      errors: categoryUpdationError,
      isSubmitting: isCategoryUpdating,
    },
  } = useForm();

  useEffect(() => {
    if (editingCategory) {
      reset({ name: editingCategory.name });
    }
  }, [editingCategory, reset]);

  const handleCategoryCreation = async (data) => {
    try {
      const response = await createCategory(data).unwrap();
      if (response.status === 200) {
        toast.success(`Category ${data.name} created...`);
        refetch();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.data.message || "Something went wrong...");
    }
  };

  const handleCategoryUpdate = async (data) => {
    try {
      const response = await updateCategory({
        categoryId: editingCategory._id,
        updateData: data,
      }).unwrap();
      if (response.status === 200) {
        toast.success(`Category updated...`);
        refetch();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.data.message || "Something went wrong...");
    }
  };

  const handleCategoryDelete = async () => {
    if (window.confirm("Are you sure?")) {
      try {
        const response = await deleteCategory(editingCategory._id).unwrap();
        console.log(response);
        if (response.data.acknowledged) {
          toast.success(`Category deleted...`);
          refetch();
          setEditingCategory(null);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.data.message || "Something went wrong...");
      }
    }
  };

  return (
    <div className=" p-6 flex flex-col space-y-8 ">
      <h1 className="text-xl font-semibold">Manage Categories</h1>
      <form
        onSubmit={handleNewCategoryCreation(handleCategoryCreation)}
        className="flex flex-col space-y-6 bg-white shadow-xl p-6 rounded-xl shadow-black/20"
      >
        <div className="flex flex-col -space-y-3 w-full md:w-2/3 lg:w-1/2 ">
          <Input
            label="Category Name :"
            name="name"
            type="text"
            className=""
            {...registerCategory("name", {
              required: "Category-Name is Required...",
            })}
            placeholder="Enter Category Name..."
          />

          {categoryCreationError && (
            <p className="text-red-700 ml-6">
              {" "}
              {categoryCreationError?.name?.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="bg-black px-14 py-2 text-white rounded-md w-fit ml-6  "
        >
          {isCategoryCreating ? "Creating..." : "Create"}
        </button>
      </form>
      <hr />
      <div className="flex flex-col space-y-6 bg-white shadow-xl p-10 rounded-xl  ">
        <span className="text-lg font-medium ">Category-List :</span>
        <div className="flex flex-col gap-y-6  sm:flex-row sm:space-x-6">
          {categories?.data?.map((category) => (
            <div
              className="hover:shadow-2xl text-center  rounded-lg bg-gray-600 hover:bg-gray-800 w-fit text-white/80 px-10 py-2 hover:cursor-pointer hover:text-white  my-0 "
              key={category._id}
              onClick={() => setEditingCategory(category)}
            >
              {category.name}
            </div>
          ))}
        </div>
      </div>

      {editingCategory && (
        <div className="absolute inset-0 flex flex-col md:flex-row justify-center items-center  backdrop-brightness-50">
          <form
            onSubmit={handleCategoryUpdation(handleCategoryUpdate)}
            className="md:w-2/3 lg:w-2/5 w-[95%] shadow-2xl max-w-3xl"
          >
            <Card>
              <CardHeader>
                <CardTitle>Update Category</CardTitle>
                <CardDescription>
                  Update name or delete category
                </CardDescription>
                <CardAction>
                  <ToolTip
                    Icon={<MdCancel size={28} />}
                    Text={"Cancel"}
                    onClick={() => setEditingCategory(null)}
                    type={"button"}
                  />
                </CardAction>
              </CardHeader>
              <CardContent className="-space-y-2">
                <div className="relative w-full flex flex-col -space-y-3 mt-5">
                  <Input
                    className=""
                    label="Category-Name :"
                    type="text"
                    {...registerCategoryUpdate("name", {
                      required: "Category-Name is required",
                    })}
                  />
                  {categoryUpdationError && (
                    <p className="text-red-700 ml-6">
                      {" "}
                      {categoryUpdationError?.name?.message}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col-reverse gap-y-4 sm:flex-row sm:gap-y-0 justify-around w-full  ">
                <button
                  type="button"
                  className="bg-red-700 px-14 py-2 text-white rounded-md align-top "
                  disabled={isCategoryUpdating}
                  onClick={handleCategoryDelete}
                >
                  Delete
                </button>
                <button
                  type="submit"
                  disabled={isCategoryUpdating}
                  className="bg-black px-14 py-2 text-white rounded-md"
                >
                  Update
                </button>
              </CardFooter>
            </Card>
          </form>
        </div>
      )}
    </div>
  );
};

export default CategoryList;
