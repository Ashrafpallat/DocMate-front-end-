import DoctorHeader from '../../components/doctor/DoctorHeader'
import backgroundImage from '../../assets/bg.png'

const DoctorDashboard = () => {
  return (
    <div className="h-screen bg-cover bg-center " style={{ backgroundImage: `url(${backgroundImage})` }}>
      <DoctorHeader />
      <div className='pt-24'>
        
      </div>
    </div>
  )
}

export default DoctorDashboard
