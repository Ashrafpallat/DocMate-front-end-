import React, { useState } from 'react';
import DoctorHeader from '../../components/doctor/DoctorHeader';
import { AiOutlineCoffee } from "react-icons/ai";
import { MdDelete } from "react-icons/md";


const ManageTokens: React.FC = () => {
    const [selectedDay, setSelectedDay] = useState<string>('Monday');
    const [breaks, setBreaks] = useState([{ start: '', end: '', type: 'Tea break' }]);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const handleDayClick = (day: string) => {
        setSelectedDay(day);
    };

    const addBreak = () => {
        setBreaks([...breaks, { start: '', end: '', type: 'Tea break' }]);
    };
    const handleDeleteBreak = (index: number) => {
        setBreaks(breaks.filter((_, i) => i !== index));
      };      

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
                        <button className="bg-white text-red-700 py-2 px-4 rounded-full hover:bg-red-700 hover:text-white">
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
                                    required
                                />
                            </div>

                            <div className="w-1/2">
                                <label className="block font-semibold mb-2">End Time</label>
                                <input
                                    type="time"
                                    className="border rounded-full p-2 w-full"
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
                                    placeholder="e.g., 15"
                                    required
                                />
                            </div>
                        </div>

                        {/* Breaks */}
                        {breaks.map((breakItem, index) => (
                            <div key={index} className="space-y-2">
                                <label className="font-semibold flex items-center">
                                    Break {index + 1} ({breakItem.type})
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
                                    className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-full flex items-center space-x-1"
                                    onClick={addBreak}
                                >
                                    <span>Add Another Break</span>
                                    <AiOutlineCoffee />
                                </button>
                            </div>

                            {/* Apply buttons on the right */}
                            <div className="flex space-x-4">
                                <button className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-full">
                                    Apply for {selectedDay}
                                </button>
                                <button className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-full">
                                    Apply for All Days
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ManageTokens;
