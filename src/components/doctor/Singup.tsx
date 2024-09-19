import React from 'react'
import backgroundImage from '../../assets/bg.png'
import { FaSearch } from 'react-icons/fa'


const Singup = () => {
    return (
        <div className="h-screen bg-cover bg-center flex items-center justify-center flex-col" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="relative w-96 mb-10">
                <FaSearch className="absolute top-1/2 left-6 transform -translate-y-1/2 text-gray-500 text-2xl" />
                <input type="text"
                    value="DocMate"
                    className="w-full py-4 pl-20 pr-4 text-gray-700 text-3xl border border-gray-300 rounded-full font-bold" readOnly />
            </div>
            <div className="flex flex-col space-y-4 p-4">
                <div className="flex space-x-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        className="w-full py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="E-mail"
                        className="w-full py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex space-x-4">
                    <div className="flex justify-center space-x-4">
                        <input
                            type="text"
                            name="location"
                            placeholder="Location"
                            className="w-full py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <label className="flex items-center text-white space-x-2">
                            <input
                                type="radio"
                                name="gender"
                                value="Male"
                                className="form-radio text-blue-500"
                            />
                            <span>Male</span>
                        </label>
                        <label className="flex items-center text-white space-x-2">
                            <input
                                type="radio"
                                name="gender"
                                value="Female"
                                className="form-radio text-blue-500"
                            />
                            <span>Female</span>
                        </label>
                    </div>
                </div>
                <div className="flex space-x-4">
                    <input
                        type="text"
                        name="specialization"
                        placeholder="Specialization"
                        className="w-full py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="number"
                        name="experience"
                        placeholder="Experience"
                        className="w-full py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex space-x-4">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="w-full py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        name="confirm-password"
                        placeholder="Confirm Password"
                        className="w-full py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
        </div>
    )
}

export default Singup
