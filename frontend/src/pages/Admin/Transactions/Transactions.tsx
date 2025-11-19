import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Pen, Trash2 } from "lucide-react";
import userColumns from "./Columns";
import { DataTable } from "./Datatable";
import { Link } from "react-router-dom";
import { deleteRecipient, deleteTransactionAdmin, deleteUser, getAllRecipients, getAllUsers, getTransactions } from "@/api";
import type { RecipientData, RecipientDataApi, TransactionData, UserData, } from "@/validation/validators";
import type { AxiosResponse } from "axios";
import  { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import transactionColumns from "./Columns";
import { TransactionStatus } from "./TransactionStatus";
import { useEnv } from "@/context/Environment/env.context";


const TransactionManagementPage = () => {
  const [search, setSearch] = useState("");
  const [transactions, setTransactions] =
    useState<TransactionData[]>([]);
  const { enabled } = useEnv();

  const [page, setPage] = useState(0)
  const [pages, setPages] = useState(0)
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false)

    useEffect(() => {
      const fetchTransactions = async() => {
        const name = searchParams.get("name") || ""
        
        setSearch(name)
        setLoading(true)
        const _name = searchParams.get("name") || "";

        try {

            const response = await getTransactions()
            setTransactions(response.data.data.transactions)

            setPage(response.data.data.currentPage)
            setPages(response.data.data.totalPages)
           setSearch(_name);


          setLoading(false)
        } catch (error) {
            setLoading(false);

          // console.log(error.message)
        }finally {
            setLoading(false)
        }
       

      }
      fetchTransactions()
    }, [page, name, enabled])

  // const filtered = recipients.filter(
  //   (r) =>
  //     r.name.toLowerCase().includes(search.toLowerCase()) ||
  //     r.phone.includes(search) ||
  //     r.operator.toLowerCase().includes(search.toLowerCase())
  // );
    const handleDelete = async (id: string) => {
      if (!confirm("Are you sure you want to delete this recipient?")) return;
  
      try {
        const response = await deleteTransactionAdmin(id);
        setTransactions((prev) => prev.filter((t) => t.id !== id));
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
        <div className="flex justify-between w-full">
          <div>
            <CardTitle className="md:text-2xl font-semibold text-gray-700">
              Transactions Management
            </CardTitle>
            <CardDescription className="py-2 text-gray-500">
              Manage your transaction details, all in one place.
            </CardDescription>
          </div>
          <div>
            <TransactionStatus/>
          </div>
        </div>
        {/* <Link to={"/admin/users/user"}>
          <Button
            //   variant={"link"}

            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white"
          >
            Add User
          </Button>
        </Link> */}
      </CardHeader>
      <CardContent>
        <DataTable
          columns={transactionColumns(handleDelete)}
          data={transactions}
          pages={pages}
          page={page}
          setPage={setPage}
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

export default TransactionManagementPage