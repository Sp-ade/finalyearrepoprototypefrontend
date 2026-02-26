import React, { useState } from 'react'
import StudentLogin from '../components/StudentLogin'
import StaffLogin from '../components/StaffLogin'
import AdminLogin from '../components/AdminLogin'

const LoginPage = () => {
    // Login types: 'student', 'staff', 'admin'
    const [loginType, setLoginType] = useState('student')

    const toggleLoginType = () => {
        // Cycle through: student -> staff -> admin -> student
        setLoginType((prev) => {
            if (prev === 'student') return 'staff'
            if (prev === 'staff') return 'admin'
            return 'student'
        })
    }

    return (
        <div>
            {loginType === 'student' && <StudentLogin onSwitch={toggleLoginType} onSetType={setLoginType} />}
            {loginType === 'staff' && <StaffLogin onSwitch={toggleLoginType} onSetType={setLoginType} />}
            {loginType === 'admin' && <AdminLogin onSwitch={toggleLoginType} onSetType={setLoginType} />}
        </div>
    )
}

export default LoginPage
