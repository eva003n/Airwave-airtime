import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Pen, Trash2 } from "lucide-react";
import recipientColumns, { type RecipientColumn } from "./Columns";
import { DataTable } from "./Datatable";
import { Link } from "react-router-dom";
import { deleteRecipient, getAllRecipients } from "@/api";
import type { RecipientData, RecipientDataApi, } from "@/validation/validators";
import type { AxiosResponse } from "axios";
import  { toast } from "react-toastify";


const RECIPIENT_DATA = [
  {
    id: "1",
    name: "John Mwangi",
    phone: "254700123456",
    operator: "Safaricom",
    airtime_amount: 350,
    branch: "Head office",
    createdAt: "10-10-2025",
    updatedAt: "10-10-2025",
  },
  {
    id: "2",
    name: "Grace Wambui",
    phone: "254711987654",
    operator: "Airtel",
    airtime_amount: 250,
    branch: "Kiambu",
    createdAt: "10-10-2025",
    updatedAt: "10-10-2025",
  },
  {
    id: "3",
    name: "Kevin Otieno",
    phone: "254733456789",
    operator: "Telkom",
    airtime_amount: 600,
    branch: "Limuru",
    createdAt: "10-10-2025",
    updatedAt: "10-10-2025",
  },
  {
    id: "4",
    name: "Mary Achieng",
    phone: "254701334455",
    operator: "Safaricom",
    airtime_amount: 120,
    branch: "Githunguri",
    createdAt: "10-10-2025",
    updatedAt: "10-10-2025",
  },
  {
    id: "5",
    name: "Brian Kamau",
    phone: "254712998877",
    operator: "Airtel",
    airtime_amount: 800,
    branch: "Kiriita",
    createdAt: "10-10-2025",
    updatedAt: "10-10-2025",
  },
  {
    id: "6",
    name: "Faith Njeri",
    phone: "254734665544",
    operator: "Telkom",
    airtime_amount: 300,
    branch: "Kagwe",
    createdAt: "10-10-2025",
    updatedAt: "10-10-2025",
  },
  {
    id: "7",
    name: "Samuel Kariuki",
    phone: "254710223344",
    operator: "Safaricom",
    airtime_amount: 950,
    branch: "Kikuyu",
    createdAt: "10-10-2025",
    updatedAt: "10-10-2025",
  },
  {
    id: "8",
    name: "Diana Njoroge",
    phone: "254702887766",
    operator: "Airtel",
    airtime_amount: 400,
    branch: "Wangige",
    createdAt: "10-10-2025",
    updatedAt: "10-10-2025",
  },
  {
    id: "9",
    name: "James Ouma",
    phone: "254735998877",
    operator: "Telkom",
    airtime_amount: 150,
    branch: "Banana",
    createdAt: "10-10-2025",
    updatedAt: "10-10-2025",
  },
  {
    id: "10",
    name: "Ann Wanjiku",
    phone: "254700556677",
    operator: "Safaricom",
    airtime_amount: 500,
    branch: "Mai mahiu",
    createdAt: "10-10-2025",
    updatedAt: "10-10-2025",
  },
  {
    id: "11",
    name: "Peter Ndungu",
    phone: "254711224466",
    operator: "Airtel",
    airtime_amount: 90,
    branch: "Suswa",
    createdAt: "10-10-2025",
    updatedAt: "10-10-2025",
  },
  {
    id: "12",
    name: "Lucy Atieno",
    phone: "254733778899",
    operator: "Telkom",
    airtime_amount: 450,
    branch: "Gikomba",
    createdAt: "10-10-2025",
    updatedAt: "10-10-2025",
  },
  {
    id: "13",
    name: "Michael Mutua",
    phone: "254701112233",
    operator: "Safaricom",
    airtime_amount: 320,
    branch: "Ruaka",
    createdAt: "10-10-2025",
    updatedAt: "10-10-2025",
  },
  {
    id: "14",
    name: "Caroline Aoko",
    phone: "254729887766",
    operator: "Airtel",
    airtime_amount: 780,
    branch: "Wakimbo",
    createdAt: "10-10-2025",
    updatedAt: "10-10-2025",
  },
  {
    id: "15",
    name: "David Kiptoo",
    phone: "254735554433",
    operator: "Telkom",
    airtime_amount: 220,
    branch: "Gikambura",
    createdAt: "10-10-2025",
    updatedAt: "10-10-2025",
  },
  {
    id: "16",
    name: "Esther Wairimu",
    phone: "254701667788",
    operator: "Safaricom",
    airtime_amount: 640,
    branch: "Nairekia",
    createdAt: "10-10-2025",
    updatedAt: "10-10-2025",
  },
  {
    id: "17",
    name: "George Mworia",
    phone: "254711778899",
    operator: "Airtel",
    airtime_amount: 110,
    branch: "Head office",
    createdAt: "10-10-2025",
    updatedAt: "10-10-2025",
  },
];
const getData = () => {
  return Promise.resolve(RECIPIENT_DATA);
};

const RecipientManagementPage = () => {
  const [search, setSearch] = useState("");
  const [recipients, setRecipients] =
    useState<RecipientData[]>([]);

  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)

    useEffect(() => {
      const fetchRecipients = async() => {
        try {
          const response = await getAllRecipients({ page, limit: 10 });
          const recipientsData = response.data.data.recipients;
          setRecipients(recipientsData);
          setPage(response.data.data.currentPage);
          setPages(response.data.data.totalPages);
        } catch (error) {
          console.log(error.message)
        }
       

      }
      fetchRecipients()
    }, [page])

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

  return (
    <Card className="p-4 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="md:text-2xl font-medium tracking-wide bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Recipient Management
        </CardTitle>
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
        />
      </CardContent>
    </Card>
  );
}

export default RecipientManagementPage