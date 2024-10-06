'use client'

import { useState } from 'react'
import GiftTrackerPage from '@/pages/GiftTrackerPage'
import TasneemWedding from '@/pages/TasneemWedding'
import { Button } from "../components/ui/button"
export default function Home() {
  const [isClicked, setisClicked] = useState(false)
  return (
    <main className="min-h-screen bg-background flex flex-col items-center p-4">
      <Button onClick={()=> setisClicked(!isClicked)}>{isClicked? 'نقوطنا' :   'عرس تسنيم'}</Button>
      <div className="flex-1 flex items-center justify-center">
        {isClicked? <TasneemWedding /> : <GiftTrackerPage />}
     
      </div>
    </main>
  )
}
