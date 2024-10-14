import React, { useEffect, useState } from 'react';
import DoctorHeader from '../../components/doctor/DoctorHeader';
import { AiOutlineCoffee } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { generateTimeSlots } from '../../services/generateTimeSlotes';
import axios from 'axios';
import api from '../../services/axiosInstance';

const ManageTokens: React.FC = () => {
    const [slots, setSlots] = useState<{ start: string, end: string }[]>([]);
    const [selectedDay, setSelectedDay] = useState<string>('Monday');
    const [breaks, setBreaks] = useState([{ start: '13:00', end: '14:00' }]);
    const [startTime, setStartTime] = useState<string>('09:00');
    const [endTime, setEndTime] = useState<string>('17:00');
    const [consultDuration, setConsultDuration] = useState<number>(30)

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const handleDayClick = (day: string) => {
        setSelectedDay(day);
    };

    const addBreak = () => {
        setBreaks([...breaks, { start: '', end: '' }]);
    };
    const handleDeleteBreak = (index: number) => {
        setBreaks(breaks.filter((_, i) => i !== index));
    };

    const handApply = async (e: React.FormEvent) => {
        e.preventDefault()
        const requestData = {
            selectedDay,
            slots,
        };        
        try {
            
            const response = await api.post('/doctor/save-slots', requestData); 
            if (response.status === 200) {
                console.log('Slots saved successfully:');
                // You can add any success notification here
            } else {
                console.error('Failed to save slots:', response.status);
            }
        } catch (error) {
            console.error('Error saving slots:', error);
        }

    }

    useEffect(() => {
        const generatedSlots = generateTimeSlots(startTime, endTime, consultDuration, breaks);
        setSlots(generatedSlots);
    }, [startTime, endTime, consultDuration, breaks]);


    return (
        <div>
            <DoctorHeader />
            <div className="min-h-screen flex">
                {/* Sidebar */}
                <aside className="w-1/5 bg-black p-4">
                    <h2 className="text-lg font-bold text-white mb-4">Select Day</h2>
                    <ul className="space-y-2">
                        {days.map((day) => (
                            <li key={day}>
                                <button
                                    onClick={() => handleDayClick(day)}
                                    className={`block w-full text-left px-4 py-2 rounded-full hover:bg-white transition ${selectedDay === day
                                        ? 'bg-[#FAF9F6] text-black'
                                        : 'bg-gray-800 text-white hover:text-black'
                                        }`}
                                >
                                    {day}
                                </button>
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* Main Content */}
                <div className="w-4/5 p-6 pl-10 pr-10 bg-[#FAF9F6]">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl font-bold">Create default number of Tokens for all {selectedDay}</h1>
                        <button className="bg-white text-red-700 py-2 px-4 rounded-full hover:bg-accent">
                            Mark {selectedDay} as Leave
                        </button>
                    </div>

                    <form className="space-y-4">
                        {/* Row 1: Start Time and End Time */}
                        <div className="flex space-x-6">
                            <div className="w-1/2">
                                <label className="block font-semibold mb-2">Start Time</label>
                                <input
                                    type="time"
                                    className="border rounded-full p-2 w-full"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="w-1/2">
                                <label className="block font-semibold mb-2">End Time</label>
                                <input
                                    type="time"
                                    className="border rounded-full p-2 w-full"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Row 2: Average Time to Consult and Add Break */}
                        <div className="flex space-x-6">
                            <div className="w-1/2">
                                <label className="block font-semibold mb-2">Average Time needed to consult a patient (in minutes)</label>
                                <input
                                    type="number"
                                    className="border rounded-full p-2 w-full"
                                    value={consultDuration}
                                    onChange={(e) => setConsultDuration(Number(e.target.value))}
                                    placeholder="e.g., 15"
                                    required
                                />
                            </div>
                        </div>

                        {/* Breaks */}
                        {breaks.map((breakItem, index) => (
                            <div key={index} className="space-y-2">
                                <label className="font-semibold flex items-center">
                                    Break {index + 1}
                                    <MdDelete
                                        className="ml-2 text-gray-500 hover:cursor-pointer"
                                        onClick={() => handleDeleteBreak(index)} // Delete on click
                                    />
                                </label>
                                <div className="flex space-x-6">
                                    <div className="w-1/2">
                                        <label className="block text-sm">Start Time</label>
                                        <input
                                            type="time"
                                            className="border rounded-full p-2 w-full"
                                            value={breakItem.start}
                                            onChange={(e) =>
                                                setBreaks(
                                                    breaks.map((b, i) =>
                                                        i === index ? { ...b, start: e.target.value } : b
                                                    )
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="block text-sm">End Time</label>
                                        <input
                                            type="time"
                                            className="border rounded-full p-2 w-full"
                                            value={breakItem.end}
                                            onChange={(e) =>
                                                setBreaks(
                                                    breaks.map((b, i) =>
                                                        i === index ? { ...b, end: e.target.value } : b
                                                    )
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}


                        {/* Apply Buttons */}
                        <div className="flex justify-between mt-4">
                            {/* Add Another Break button on the left */}
                            <div>
                                <button
                                    type="button"
                                    className="bg-secondary hover:bg-[#8F8F8F]  text-black py-2 px-4 rounded-full flex items-center space-x-1"
                                    onClick={addBreak}
                                >
                                    <span>Add Another Break</span>
                                    <AiOutlineCoffee />
                                </button>
                            </div>

                            {/* Apply buttons on the right */}
                            <div className="flex space-x-4">
                                <button onClick={handApply} className="bg-primary hover:bg-[#3A3A3A] text-white py-2 px-4 rounded-full">
                                    Apply for {selectedDay}
                                </button>
                                <button className="bg-primary hover:bg-[#3A3A3A] text-white py-2 px-4 rounded-full">
                                    Apply for All Days
                                </button>
                            </div>
                        </div>
                    </form>
                    <div>
                        {/* <h3 className="text-lg font-semibold mb-4">Generated Slots:</h3> */}
                        <br />
                        {slots.length > 0 ? (
                            <div className="flex flex-wrap gap-4">
                                {slots.map((slot, index) => (
                                    <div
                                        key={index}
                                        className="border border-gray-300 rounded-lg p-4 shadow-md min-w-[100px] text-center"
                                    >
                                        <p>{slot.start} - {slot.end}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No slots generated yet.</p>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ManageTokens;
