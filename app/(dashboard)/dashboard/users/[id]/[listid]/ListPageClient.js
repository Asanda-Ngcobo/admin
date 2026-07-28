"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import Loading from "../../../loading";



export default function UserListPage({listData, itemsData, userData}) {
 
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [list, setList] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  

    const fetchData = async () => {
   

      setUser(userData || null);
      setList(listData || null);
      setItems(itemsData || []);
      setLoading(false);
    };

    fetchData();
  }, [listData. itemsData]);

   const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <Loading />
      </div>
    );
  }

  if (!list) {
    return (
      <p className="p-6 text-red-500">
        List not found.{" "}
        <button
          onClick={() => router.back()}
          className="underline text-blue-400"
        >
          Go back
        </button>
      </p>
    );
  }

  const numberOfItems = items.length;

  return (
    <div className="mt-20 ml-[10%] w-[80%] flex flex-row text-black">
   

      {/* Main content */}
      <div className="w-full">
        <Link
          href={`/dashboard/users/${userData.id}`}
          className="text-blue-400 hover:underline mb-4 block"
        >
          ← Back to Lists
        </Link>

        <h1 className="text-2xl font-bold mb-4">List Info</h1>
          <ul className="flex gap-4">
        {/* LIST NAME */}
        <li className="w-1/4 bg-white h-60 rounded-lg flex flex-col justify-center items-center gap-4">
          <div className="flex gap-4 items-center">
        
            <h1>List Name</h1>
          </div>
          <h1 className="text-4xl text-center">{list.list_name}</h1>
        </li>

        {/* Items */}
        <li className="w-1/4 bg-white h-60 rounded-lg flex flex-col justify-center items-center gap-4">
          <div className="flex gap-4 items-center">
          
            <h1>Number of Items</h1>
          </div>
          <h1 className="text-4xl">  {numberOfItems} </h1>
        </li>

    

       
      </ul>
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">

      
        </div>

        {/* Items Table */}
        <h2 className="text-lg font-bold mt-8">Items</h2>
        <div className="mt-4  p-4 rounded-lg h-[60vh] overflow-y-auto">
          {items.length === 0 ? (
            <p className="text-sm opacity-70">No items found for this list.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-(--accent-primary) z-10">
                <tr className="text-left border-b border-gray-600">
                  <th className="p-2">Quantity</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Units</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Total Price</th>
                   <th className="p-2">Shopped at</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="p-2">{item.item_quantity}</td>
                    <td className="p-2">{item.item_name}</td>
                    <td className="p-2">
                      {item.item_volume_mass}
                      {item.item_unit}
                    </td>
                    <td className="p-2">{item.price}</td>
                    <td className="p-2">{item.total_price}</td>
   <td className="p-2">
  {item?.purchased_at
    ? <span className="text-green-300">{formatDate(item.purchased_at)}</span>
    : <span className="text-red-300">Not Shopped</span>}
</td>
                  
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

