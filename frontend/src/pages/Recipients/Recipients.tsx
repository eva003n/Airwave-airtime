import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Pen, Trash2 } from "lucide-react";
import recipientColumns, { type RecipientColumn } from "./Columns";
import { DataTable } from "./Datatable";
import { Link } from "react-router-dom";
import { deleteRecipient, getAllRecipients } from "@/api";
import type { RecipientData, RecipientDataApi, } from "@/validation/validators";
import type { AxiosResponse } from "axios";
import  { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import { useEnv } from "@/context/Environment/env.context";
import { fa } from "zod/v4/locales";


const RecipientManagementPage = () => {
  const [search, setSearch] = useState("");
  const [recipients, setRecipients] =
    useState<RecipientData[]>([]);
  const { enabled } = useEnv();

  const [page, setPage] = useState(0)
  const [pages, setPages] = useState(0)
  const [department, setDepartment] = useState("")
  const [branch, setBranch] = useState("")
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false)

    useEffect(() => {
      const fetchRecipients = async() => {
        const branch = searchParams.get("branch") || ""
        const department = searchParams.get("department") || ""
        const name = searchParams.get("name") || ""
        
        setBranch(branch)
        setDepartment(department)
        setSearch(name)
        setLoading(true)
        try {
          const response = await getAllRecipients({
            page,
            limit: 10,
            branch,
            department,
            name
            
          });
          const recipientsData = response.data.data.recipients;
          setLoading(false)
          setRecipients(recipientsData);
          setPage(response.data.data.currentPage);
          setPages(response.data.data.totalPages);
        } catch (error) {
          setLoading(false)
          // console.log(error.message)
        }finally {
          setLoading(false);

        }
       

      }
      fetchRecipients()
    }, [branch, department, page, searchParams, name, enabled])

  // const filtered = recipients.filter(
  //   (r) =>
  //     r.name.toLowerCase().includes(search.toLowerCase()) ||
  //     r.phone.includes(search) ||
  //     r.operator.toLowerCase().includes(search.toLowerCase())
  // );
    const handleDelete = async (id: string) => {
      if (!confirm("Are you sure you want to delete this recipient?")) return;
  
      try {
        const response = await deleteRecipient(id);
        setRecipients((prev) => prev.filter((recipient) => recipient.id !== id));
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
            Recipient Management
          </CardTitle>
          <CardDescription className="py-2 text-gray-500">
            Manage your airtime recipients details, all in one place.
          </CardDescription>
        </div>
        <Link to={"/recipients/recipient"}>
          <Button
            //   variant={"link"}

            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white"
          >
            Add Recipient
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={recipientColumns(handleDelete)}
          data={recipients}
          pages={pages}
          page={page}
          setPage={setPage}
          recipients={recipients}
          setRecipients={setRecipients}
          branch={branch}
          department={department}
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

export default RecipientManagementPage