import React, { useEffect, useState } from "react";
import DataTable from "./Topups/topupstatus/Datatable";
// import { columns } from "./Topups/Columns";

export type TopUpData = {
  id: string;
  phonenumber: string;
  amount: number;
  operator: string;
  status: "pending" | "processing" | "success" | "failed";
};

export const topUps: TopUpData[] = [
  {
    id: "728ed52f",
    phonenumber: "254700100200",
    amount: 1000,
    operator: "Safaricom Kenya",
    status: "pending",
  },
  {
    id: "489e1d42",
    phonenumber: "254712786321",
    amount: 500,
    operator: "Airtek Kenya",
    status: "processing",
  },
  {
    id: "a17bc923",
    phonenumber: "254701223344",
    amount: 250,
    operator: "Safaricom Kenya",
    status: "success",
  },
  {
    id: "b32ed784",
    phonenumber: "254702556677",
    amount: 100,
    operator: "Airtel Kenya",
    status: "failed",
  },
  {
    id: "c45fa839",
    phonenumber: "254703998877",
    amount: 2000,
    operator: "Airtel Kenya",
    status: "pending",
  },
  {
    id: "d59be124",
    phonenumber: "254704445566",
    amount: 150,
    operator: "Safaricom Kenya",
    status: "processing",
  },
  {
    id: "e68cf312",
    phonenumber: "254705778899",
    amount: 300,
    operator: "Airtel Kenya",
    status: "success",
  },
  {
    id: "f72aa934",
    phonenumber: "254706112233",
    amount: 1200,
    operator: "Airtel Kenya",
    status: "pending",
  },
  {
    id: "g83db445",
    phonenumber: "254707334455",
    amount: 800,
    operator: "Safaricom Kenya",
    status: "failed",
  },
  {
    id: "h91ec556",
    phonenumber: "254708667788",
    amount: 450,
    operator: "Airtel Kenya",
    status: "processing",
  },
  {
    id: "i04fd667",
    phonenumber: "254709889900",
    amount: 600,
    operator: "Airtel Kenya",
    status: "success",
  },
  {
    id: "j15ae778",
    phonenumber: "254710112244",
    amount: 750,
    operator: "Safaricom Kenya",
    status: "pending",
  },
];

const getData = async () => {
  return Promise.resolve(topUps);
};

const TopupsPage = () => {
  const [data, setData] = useState<TopUpData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const topUpData = await getData();
      setData(topUpData);
    };
    fetchData()
  }, []);
  return (
    <section className="container mx-auto py-10 px-4">
      {/* <DataTable columns={columns} data={data} /> */}
    </section>
  );
};

export default TopupsPage;
