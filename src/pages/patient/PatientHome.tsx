import { useDispatch } from "react-redux";
import PatientHeader from "../../components/patient/PatientHeader";
import { FaSearch } from "react-icons/fa";
import backgroundImage from '../../assets/bg.png'

const Verify = () => {
  const dispatch = useDispatch();


  return (
    <div>
      <PatientHeader />
      <div className="h-screen bg-cover bg-center flex items-center justify-center flex-col" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="absolute top-32 w-96">
          <FaSearch className="absolute top-1/2 left-6 transform -translate-y-1/2 text-gray-500 text-2xl" />
          <input type="text"
            value=""
            placeholder="Enter your location"
            className="w-full py-4 pl-20 pr-4 text-gray-700 border border-gray-300 rounded-full " />
        </div>
        <div className='p-10 flex justify-center'>
          <p className='text-white text-lg text-center w'>In DocMate you can find by entering your location and <br />
            also you can filter accoridng to various options like specialization, experience. <br />
            Doctor will add prescription for the patients, Patients can also access the prescription from their account.</p>
        </div>
      </div>
    </div>
  );
};

export default Verify;
