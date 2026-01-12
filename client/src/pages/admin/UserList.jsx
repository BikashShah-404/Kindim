import { useEffect, useState } from "react";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserDetailsMutation,
} from "../../redux/api/userSlice";
import Input from "@/components/Input";
import ToolTip from "@/components/Tooltip";

import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { MdCancel } from "react-icons/md";
import { FaSave } from "react-icons/fa";

import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  console.log(users);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors, dirtyFields },
  } = useForm();

  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserDetailsMutation();

  const [editableUser, setEditableUser] = useState(null);

  const handleUserUpdate = async (data) => {
    try {
      if (!editableUser) return;
      if (!dirtyFields.username && !dirtyFields.email && !dirtyFields.isAdmin)
        return;
      const response = await updateUser({
        userId: editableUser._id,
        ...data,
      }).unwrap();
      if (response.status === 200) {
        refetch();
        toast.success("User updated...");
        setEditableUser(null);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.data.message || "Something went wrong...");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are u sure?")) {
      try {
        const response = await deleteUser(userId).unwrap();
        if (response.data.response.acknowledged) {
          toast.success("User deleted...");
        }
      } catch (error) {
        console.log(error);
        toast.error(error.data.message || "Something went wrong...");
      }
    }
  };

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (editableUser) {
      reset({
        username: editableUser.username,
        email: editableUser.email,
        isAdmin: editableUser.isAdmin,
      });
    }
  }, [editableUser, reset]);

  return (
    <div className="mt-10 px-4  ">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h1 className="font-bold text-xl">User Information:</h1>
          <div className="min-w-full flex flex-col md:flex-row mt-10 shadow-2xl  shadow-accent-foreground py-4 rounded-xl overflow-auto">
            {/* {<AdminMenu/>} */}
            <form className="w-full" onSubmit={handleSubmit(handleUserUpdate)}>
              <table className="min-w-full md:w-4/5 mx-auto overflow-x-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">UserName</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Admin</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.data.map((user) => (
                    <tr key={user._id}>
                      <td className="px-4 py-2">{user._id}</td>
                      {editableUser?._id === user._id ? (
                        <>
                          <td className="px-4 py-2">
                            <div className="flex items-center">
                              <input
                                name="username"
                                type="text"
                                className="px-2 py-1 rounded-md bg-gray-800 text-white text-center"
                                {...register(
                                  "username",
                                  "Username is required"
                                )}
                              />
                            </div>
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex items-center">
                              <input
                                name="email"
                                type="text"
                                className="px-2 py-1 rounded-md bg-gray-800 text-white text-center"
                                {...register("email", "Email is required")}
                              />
                            </div>
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex items-center">
                              <input
                                name="isAdmin"
                                type="text"
                                className="px-2 py-1 rounded-md bg-gray-800 text-white text-center"
                                {...register("isAdmin", "Email is required")}
                              />
                            </div>
                          </td>
                          <td className="px-4 py-2 flex space-x-4 xs:flex-col sm:flex-row">
                            <div className="">
                              <ToolTip
                                className={"cursor-pointer"}
                                Icon={
                                  <FaSave
                                    size={20}
                                    color="green"
                                    className="cursor-pointer"
                                  />
                                }
                                Text={"Edit"}
                                type={"submit"}
                              />
                            </div>
                            <div>
                              <ToolTip
                                className={"cursor-pointer"}
                                onClick={() => setEditableUser(null)}
                                Icon={
                                  <MdCancel
                                    size={20}
                                    color="red"
                                    className="cursor-pointer"
                                  />
                                }
                                Text={"Delete"}
                                type={"button"}
                              />
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-2"> {user.username} </td>
                          <td className="px-4 py-2"> {user.email} </td>
                          <td className="px-4 py-2">
                            {user.isAdmin ? "true" : "false"}{" "}
                          </td>
                          <td className="px-4 py-2 flex space-x-4 xs:flex-col sm:flex-row">
                            <div className="">
                              <ToolTip
                                className={"cursor-pointer"}
                                onClick={() => {
                                  setEditableUser(user);
                                }}
                                Icon={
                                  <CiEdit
                                    size={20}
                                    color="blue"
                                    className="cursor-pointer"
                                  />
                                }
                                Text={"Edit"}
                                type="button"
                              />
                            </div>
                            <div>
                              <ToolTip
                                className={"cursor-pointer"}
                                onClick={() => handleDeleteUser(user._id)}
                                Icon={
                                  <MdDelete
                                    size={20}
                                    color="red"
                                    className="cursor-pointer"
                                  />
                                }
                                Text={"Delete"}
                                type={"button"}
                              />
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </form>
          </div>
        </>
      )}
    </div>
  );
};
export default UserList;
