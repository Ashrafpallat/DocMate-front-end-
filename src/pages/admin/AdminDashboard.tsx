import AdminLayout from "../../components/admin/AdminLayout";
import { useEffect, useState } from "react";
import { getAllPrescriptions, getDoctors, getPatients } from "../../services/adminService";
import { FaUserMd, FaUser, FaPrescriptionBottleAlt, FaMoneyBillWave } from "react-icons/fa";
import { BarChart } from "@mui/x-charts/BarChart";
import api from "../../services/axiosInstance";

interface MonthlyDoctorData {
  month: string;
  doctorCount: number;
}

interface YearlyDoctorData {
  year: number;
  doctorCount: number;
}

interface MonthlyPatientData {
  month: string;
  patientCount: number;
}

interface YearlyPatientData {
  year: number;
  patientCount: number;
}

const Verify = () => {
  const [totalDoctors, setTotalDoctors] = useState<number>(0);
  const [totalPatients, setTotalPatients] = useState<number>(0);
  const [totalPrescriptions, setTotalPrescriptions] = useState<number>(0);
  const [totalEarnings, setTotalEarnings] = useState<number>(0);

  const [monthlyPatientData, setMonthlyPatientData] = useState<MonthlyPatientData[]>([]);
  const [yearlyPatientData, setYearlyPatientData] = useState<YearlyPatientData[]>([]);

  const [monthlyDoctorData, setMonthlyDoctorData] = useState<MonthlyDoctorData[]>([]);
  const [yearlyDoctorData, setYearlyDoctorData] = useState<YearlyDoctorData[]>([]);

  const [isMonthly, setIsMonthly] = useState<boolean>(true); // Toggle between Monthly and Yearly data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctors, patients, prescriptions] = await Promise.all([
          getDoctors(),
          getPatients(),
          getAllPrescriptions(),
        ]);
        setTotalDoctors(doctors.length);
        setTotalPatients(patients.length);
        setTotalPrescriptions(prescriptions.length);
        setTotalEarnings(prescriptions.length * 200);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchMonthlyPatientData = async () => {
      try {
        const response = await api.get<MonthlyPatientData[]>("admin/getPatientsByMonth");
        setMonthlyPatientData(response.data);
      } catch (error) {
        console.error("Error fetching monthly patient data:", error);
      }
    };

    fetchMonthlyPatientData();
  }, []);

  useEffect(() => {
    const fetchMonthlyDoctorData = async () => {
      try {
        const response = await api.get<MonthlyDoctorData[]>("admin/getDoctorsByMonth");
        setMonthlyDoctorData(response.data);
      } catch (error) {
        console.error("Error fetching monthly doctor data:", error);
      }
    };

    fetchMonthlyDoctorData();
  }, []);

  useEffect(() => {
    const fetchYearlyPatientData = async () => {
      try {
        const response = await api.get<YearlyPatientData[]>("admin/getPatientsByYear");
        setYearlyPatientData(response.data);
      } catch (error) {
        console.error("Error fetching yearly patient data:", error);
      }
    };

    fetchYearlyPatientData();
  }, []);

  useEffect(() => {
    const fetchYearlyDoctorData = async () => {
      try {
        const response = await api.get<YearlyDoctorData[]>("admin/getDoctorsByYear");
        setYearlyDoctorData(response.data);
      } catch (error) {
        console.error("Error fetching yearly doctor data:", error);
      }
    };

    fetchYearlyDoctorData();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Doctors */}
          <div className="bg-white shadow-md rounded-lg p-4 flex items-center">
            <FaUserMd className="text-blue-500 text-4xl mr-4" />
            <div>
              <h3 className="text-sm font-semibold text-gray-500">Total Doctors</h3>
              <p className="text-2xl font-bold text-gray-800">{totalDoctors}</p>
            </div>
          </div>

          {/* Total Patients */}
          <div className="bg-white shadow-md rounded-lg p-4 flex items-center">
            <FaUser className="text-green-500 text-4xl mr-4" />
            <div>
              <h3 className="text-sm font-semibold text-gray-500">Total Patients</h3>
              <p className="text-2xl font-bold text-gray-800">{totalPatients}</p>
            </div>
          </div>

          {/* Total Prescriptions */}
          <div className="bg-white shadow-md rounded-lg p-4 flex items-center">
            <FaPrescriptionBottleAlt className="text-orange-500 text-4xl mr-4" />
            <div>
              <h3 className="text-sm font-semibold text-gray-500">Total Prescriptions</h3>
              <p className="text-2xl font-bold text-gray-800">{totalPrescriptions}</p>
            </div>
          </div>

          {/* Total Earnings */}
          <div className="bg-white shadow-md rounded-lg p-4 flex items-center">
            <FaMoneyBillWave className="text-yellow-500 text-4xl mr-4" />
            <div>
              <h3 className="text-sm font-semibold text-gray-500">Total Earnings</h3>
              <p className="text-2xl font-bold text-gray-800">₹{totalEarnings}</p>
            </div>
          </div>
        </div>

        {/* Toggle Buttons */}
        <div className="flex justify-center mt-10">
          <button
            className={`px-4 py-2 rounded-l-lg ${isMonthly ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
              }`}
            onClick={() => setIsMonthly(true)}
          >
            Monthly
          </button>
          <button
            className={`px-4 py-2 rounded-r-lg ${!isMonthly ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
              }`}
            onClick={() => setIsMonthly(false)}
          >
            Yearly
          </button>
        </div>

        {/* Combined Patient and Doctor Charts */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Patient Chart */}
          <div>
            <h2 className="text-xl font-bold mb-4">
              {isMonthly ? "Monthly Patient Statistics" : "Yearly Patient Statistics"}
            </h2>
            <BarChart
              width={500}
              height={300}
              series={[
                {
                  data: isMonthly
                    ? monthlyPatientData.map((item) => item.patientCount)
                    : yearlyPatientData.map((item) => item.patientCount),
                  label: "Patients",
                },
              ]}
              xAxis={[
                {
                  data: isMonthly
                    ? monthlyPatientData.map((item) => item.month)
                    : yearlyPatientData.map((item) => item.year.toString()),
                  scaleType: "band",
                  label: isMonthly ? "Months" : "Years",
                },
              ]}
            />
          </div>

          {/* Doctor Chart */}
          <div>
            <h2 className="text-xl font-bold mb-4">
              {isMonthly ? "Monthly Doctor Statistics" : "Yearly Doctor Statistics"}
            </h2>
            <BarChart
              width={500}
              height={300}
              series={[
                {
                  data: isMonthly
                    ? monthlyDoctorData.map((item) => item.doctorCount)
                    : yearlyDoctorData.map((item) => item.doctorCount),
                  label: "Doctors",
                },
              ]}
              xAxis={[
                {
                  data: isMonthly
                    ? monthlyDoctorData.map((item) => item.month)
                    : yearlyDoctorData.map((item) => item.year.toString()),
                  scaleType: "band",
                  label: isMonthly ? "Months" : "Years",
                },
              ]}
            />
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default Verify;
