import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import UsersList from './pages/admin/UsersList';
import StoresList from './pages/admin/StoresList';
import AddUser from './pages/admin/AddUser';
import AddStore from './pages/admin/AddStore';
import UserDetails from './pages/admin/UserDetails';

// User Imports
import UserLayout from './layouts/UserLayout';
import UserDashboard from './pages/user/Dashboard';
import UserStoresList from './pages/user/StoresList';
import UpdatePassword from './pages/user/UpdatePassword';

// Owner Imports
import OwnerLayout from './layouts/OwnerLayout';
import OwnerDashboard from './pages/owner/Dashboard';
import OwnerUpdatePassword from './pages/owner/UpdatePassword';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UsersList />} />
          <Route path="users/new" element={<AddUser />} />
          <Route path="users/:id" element={<UserDetails />} />
          <Route path="stores" element={<StoresList />} />
          <Route path="stores/new" element={<AddStore />} />
        </Route>

        {/* User Routes */}
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<UserDashboard />} />
          <Route path="stores" element={<UserStoresList />} />
          <Route path="security" element={<UpdatePassword />} />
        </Route>

        {/* Owner Routes */}
        <Route path="/owner" element={<OwnerLayout />}>
          <Route index element={<OwnerDashboard />} />
          <Route path="security" element={<OwnerUpdatePassword />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
