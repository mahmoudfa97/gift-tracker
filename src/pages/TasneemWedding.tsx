'use client'

import { useEffect, useState } from 'react'
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import axios from 'axios'
 
interface IGift {
    id: number,  recipient: string, visits: string, price: string 
}

export default function TasneemWedding() {
  const [gifts, setGifts] = useState<IGift[]>([])
  const [newGift, setNewGift] = useState<IGift>({id:0, recipient: '', visits: '', price: '' })

  const apiBaseUrl = 'http://localhost:3001/api/gifts'; // Make sure to match this with your backend port

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        const response = await axios.get(apiBaseUrl!);
        setGifts(response.data);
      } catch (error) {
        console.error('Failed to fetch gifts:', error);
      }
    };
    fetchGifts();
  }, []);


  const addOrUpdateGift = async () => {
    if (newGift.recipient && newGift.visits && newGift.price) {
      try {
        const response = await axios.post(apiBaseUrl!, newGift);
        setGifts(response.data);
        setNewGift({id:0, recipient: '', visits: '', price: '' }); // Clear input fields
      } catch (error) {
        console.error('Failed to add gift:', error);
      }
    }
  };

  const removeGift = async (id:number) => {
    try {
      await axios.delete(`${apiBaseUrl}/${id}`);
      setGifts(gifts.filter(gift => gift.id !== id));
    } catch (error) {
      console.error('Failed to remove gift:', error);
    }
  };
  return (
    <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg">
    <h1 className="text-2xl font-bold mb-6">نقوط عرس تسنيم</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div>
        <Label htmlFor="recipient">الاسم</Label>
        <Input
          id="recipient"
          value={newGift.recipient}
          onChange={(e) => setNewGift({ ...newGift, recipient: e.target.value })}
          placeholder="Enter recipient name"
        />
      </div>
      <div>
        <Label htmlFor="visits">الزيارات</Label>
        <Input
          id="visits"
          value={newGift.visits}
          onChange={(e) => setNewGift({ ...newGift, visits: e.target.value })}
          placeholder="Enter number of visits"
          type="number"
        />
      </div>
      <div>
        <Label htmlFor="price">المبلغ</Label>
        <Input
          id="price"
          value={newGift.price}
          onChange={(e) => setNewGift({ ...newGift, price: e.target.value })}
          placeholder="Enter price"
          type="number"
          step="0.01"
        />
      </div>
    </div>
    <Button onClick={addOrUpdateGift} className="mb-6">اضافة</Button>
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>الاسم</TableHead>
            <TableHead>الزيارات</TableHead>
            <TableHead>المبلغ الكلي</TableHead>
            <TableHead>اعدادات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gifts.map((gift) => (
            <TableRow key={gift.id}>
              <TableCell>{gift.recipient}</TableCell>
              <TableCell>{gift.visits}</TableCell>
              <TableCell>₪{parseFloat(gift.price).toFixed(2)}</TableCell>
              <TableCell>
                <Button variant="destructive" onClick={() => removeGift(gift.id)}>ازالة</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
  )
}
