import { useParams } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'

function RoomPage() {
  const { roomId } = useParams()
  return (
    <MainLayout>
      <p className="p-8 text-gray-400">Room: {roomId} (editor comes in Step 6)</p>
    </MainLayout>
  )
}

export default RoomPage