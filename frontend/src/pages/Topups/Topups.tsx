import React, { useEffect, useState } from "react";
import type { TopUpColumn, TopupStatus } from "./Topups/Columns";
import topUpColumns from "./Topups/Columns";
import { TopUpDataTable } from "./Topups/Datatable";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link, useSearchParams } from "react-router-dom";
import { deleteTopUp, getAllTopUps } from "@/api";
import type { RecipientForm, TopUpDataApi } from "@/validation/validators";

import type { TopUpData } from "@/validation/validators";
import { toast } from "react-toastify";

const TopUpsPage = () => {
  const [search, setSearch] = useState("");
  const [topUpData, setTopUpData] = useState<TopUpData[]>([]);
 
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [department, setDepartment] = useState("");
  const [branch, setBranch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchDataTopUps = async () => {
      const branch = searchParams.get("branch") || "";
      const department = searchParams.get("department") || "";
      const name = searchParams.get("name") || "";

      setBranch(branch);
      setDepartment(department);
      setSearch(name);
      setLoading(true)
      try {

       const response = await getAllTopUps({
         page,
         limit: 10,
         name,
         department,
         branch,
       });
       setTopUpData(response.data.data.topups);
       setLoading(false)
       setPages(response.data.data.totalPages);
       setPage(response.data.data.currentPage);
        
      } catch (error) {
        
      }
     
    };
    fetchDataTopUps();
  }, [branch, department, page, searchParams, name]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this airtime topup?")) return;

    try {
      const response = await deleteTopUp(id);
      setTopUpData((prev) => prev.filter((topUp) => topUp.id !== id));

      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message || error.message);
    }
  };

  const handleSearchParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);

    if (key && value) {
      params.set(key, value);
    }

    setSearchParams(params);
  };

  const handleClearFilters = () => {
    // setBranch("")
    // setDepartment("")
    setSearchParams({});
  };
  return (
    <section className="container mx-auto p-4">
      <Card className="p-4 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="md:text-2xl font-semibold text-gray-700">
            Top up Management
          </CardTitle>
          <div className="flex gap-4">
            <Link to={"/top-ups/make-topup"}>
              <Button
                //   variant={"link"}

                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white"
              >
                Make top up
              </Button>
            </Link>
            <Link to={"/top-ups/bulk"}>
              <Button
                //   variant={"link"}

                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white"
              >
                Top jobs
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <CardContent>
            <TopUpDataTable
              columns={topUpColumns(handleDelete)}
              data={topUpData}
              page={page}
              setPage={setPage}
              pages={pages}
              branch={branch}
              department={department}
              name={search}
              setSearch={setSearch}
              handleSearchParam={handleSearchParam}
              handleClearFilters={handleClearFilters}
              loading={loading}
              // topUps={}
            />
          </CardContent>
        </CardContent>
      </Card>
    </section>
  );
};

export default TopUpsPage;
