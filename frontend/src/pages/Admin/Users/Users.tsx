import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Pen, Trash2 } from "lucide-react";
import userColumns, { type UserColumn } from "./Columns";
import { DataTable } from "./Datatable";
import { Link } from "react-router-dom";
import { deleteRecipient, deleteUser, getAllRecipients, getAllUsers } from "@/api";
import type { RecipientData, RecipientDataApi, UserData, } from "@/validation/validators";
import type { AxiosResponse } from "axios";
import  { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";


const UserManagementPage = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] =
    useState<UserData[]>([]);

  const [page, setPage] = useState(0)
  const [pages, setPages] = useState(0)
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false)

    useEffect(() => {
      const fetchUsers = async() => {
        const name = searchParams.get("name") || ""
        
        setSearch(name)
        setLoading(true)
        const _name = searchParams.get("name") || "";

        try {

            const response = await getAllUsers()
            setUsers(response.data.data.users)

            setPage(response.data.data.currentPage)
            setPages(response.data.data.totalPages)
           setSearch(_name);


          setLoading(false)
        } catch (error) {
          // console.log(error.message)
        }
       

      }
      fetchUsers()
    }, [page, name])

  // const filtered = recipients.filter(
  //   (r) =>
  //     r.name.toLowerCase().includes(search.toLowerCase()) ||
  //     r.phone.includes(search) ||
  //     r.operator.toLowerCase().includes(search.toLowerCase())
  // );
    const handleDelete = async (id: string) => {
      if (!confirm("Are you sure you want to delete this recipient?")) return;
  
      try {
        const response = await deleteUser(id);
        setUsers((prev) => prev.filter((user) => user.id !== id));
         // instantly reflect change
         toast.success(response.data.message)
      } catch (error) {
        toast.error(error.response.data.message || error.message);
      }
    };

    const handleSearchParam = (key: string, value: string) => {
      const params = new URLSearchParams(searchParams)



        if(key && value) {
          params.set(key, value)
        }

      setSearchParams(params)
    }

    const handleClearFilters = () => {
      // setBranch("")
      // setDepartment("")
      setSearchParams({})
    }

  return (
    <Card className=" shadow-md container">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="md:text-2xl font-semibold text-gray-700">
            User Management
          </CardTitle>
          <CardDescription className="py-2 text-gray-500">
            Manage your user details, all in one place.
          </CardDescription>
        </div>
        <Link to={"/admin/users/user"}>
          <Button
            //   variant={"link"}

            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white"
          >
            Add User
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={userColumns(handleDelete)}
          data={users}
          pages={pages}
          page={page}
          setPage={setPage}
          user={users}
          setUser={setUsers}
          name={search}
          setSearch={setSearch}
          handleSearchParam={handleSearchParam}
          handleClearFilters={handleClearFilters}
          loading={loading}
        />
      </CardContent>
    </Card>
  );
}

export default UserManagementPage