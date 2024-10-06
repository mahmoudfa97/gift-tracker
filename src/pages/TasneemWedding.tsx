'use client'

import { useEffect, useState } from 'react'
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"

interface IGift {
    id: number,  recipient: string, visits: string, price: string 
}

export default function TasneemWedding() {
  const [gifts, setGifts] = useState<IGift[]>([])
  const [newGift, setNewGift] = useState<IGift>({id:0, recipient: '', visits: '', price: '' })

  useEffect(() => {
    const savedGifts = localStorage.getItem('tasnem')
    if (savedGifts) setGifts(JSON.parse(savedGifts))
  }, [])

  useEffect(() => {
    localStorage.setItem('tasnem', JSON.stringify(gifts))
  }, [gifts])

  const addOrUpdateGift = () => {
    if (newGift.recipient && newGift.visits && newGift.price) {
      setGifts(prevGifts => {
        const existingGiftIndex = prevGifts.findIndex(gift => gift.recipient.toLowerCase() === newGift.recipient.toLowerCase())

        if (existingGiftIndex !== -1) {
          const updatedGifts = [...prevGifts]
          updatedGifts[existingGiftIndex] = {
            ...updatedGifts[existingGiftIndex],
            visits: (parseInt(updatedGifts[existingGiftIndex].visits) + parseInt(newGift.visits)).toString(),
            price: (parseFloat(updatedGifts[existingGiftIndex].price) + parseFloat(newGift.price)).toFixed(2)
          }
          return updatedGifts
        } else {
          return [...prevGifts, { ...newGift, id: Date.now() }]
        }
      })
      setNewGift({id:0, recipient: '', visits: '', price: '' })
    }
  }

  const removeGift = (id:number) => setGifts(gifts.filter(gift => gift.id !== id))

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
