import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ConfirmLogout = ({ trigger }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        trigger.setConfirmLogout(false)
        navigate('/login');
    };

    return (
        <div className="fixed h-screen inset-0 z-50 flex items-center justify-center bg-[#00000066]">
            <div className="bg-white rounded-xl p-6 shadow-xl m-6 w-full max-w-md">
                <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
                <p className="mb-6">Are you sure you want to Logout this Account?</p>
                <div className="flex justify-end space-x-4 text-sm font-medium">
                    <button
                        onClick={() => {trigger.setConfirmLogout(false)}}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600/90 hover:bg-red-600 text-white rounded cursor-pointer"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmLogout