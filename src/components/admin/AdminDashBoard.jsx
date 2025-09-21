import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/button'

const AdminDashBoard = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <Link to="/">
        <Button variant="outline">Manage Users</Button>
      </Link>
      <Link to="/admin/settings">
        <Button variant="outline">Settings</Button>
      </Link>
    </div>
  )
}

export default AdminDashBoard