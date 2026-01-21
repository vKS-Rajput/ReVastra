import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backEndURL, currency } from '../App';
import { toast } from 'react-toastify';
import { Search, Filter, Trash2, RefreshCw, Package, Eye, EyeOff, Download } from 'lucide-react';

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  // Fetch all products
  const fetchList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(backEndURL + '/api/product/list');
      if (response.data.success) {
        const products = response.data.products.reverse();
        setList(products);
        setFilteredList(products);

        // Extract unique categories
        const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))];
        setCategories(uniqueCategories);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Remove product function
  const removeProduct = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const response = await axios.post(
        backEndURL + '/api/product/remove',
        { id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Update Product Status
  const updateProductStatus = async (id, status) => {
    try {
      const response = await axios.put(
        backEndURL + `/api/product/update-status/${id}`,
        { status },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(`Status updated to "${status}"`);
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to update status');
    }
  };

  // Apply filters
  useEffect(() => {
    let filtered = list;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item._id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => (item.status || 'available') === statusFilter);
    }

    setFilteredList(filtered);
  }, [searchQuery, categoryFilter, statusFilter, list]);

  useEffect(() => {
    fetchList();
  }, []);

  // Stats
  const stats = {
    total: list.length,
    available: list.filter(p => (p.status || 'available') === 'available').length,
    outOfStock: list.filter(p => p.status === 'out_of_stock').length
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Product Inventory</h1>
          <p className="text-gray-500">Manage all listed products</p>
        </div>
        <button
          onClick={fetchList}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-all"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm">Total Products</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500">
          <p className="text-gray-500 text-sm">Available</p>
          <p className="text-2xl font-bold text-green-600">{stats.available}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-orange-500">
          <p className="text-gray-500 text-sm">Out of Stock</p>
          <p className="text-2xl font-bold text-orange-600">{stats.outOfStock}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>

        <p className="text-sm text-gray-500 mt-3">
          Showing {filteredList.length} of {list.length} products
        </p>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase">Product</th>
              <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Category</th>
              <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase">Price</th>
              <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-center py-4 px-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b">
                  <td colSpan="5" className="py-4 px-4">
                    <div className="h-12 bg-gray-100 animate-pulse rounded"></div>
                  </td>
                </tr>
              ))
            ) : filteredList.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-12 text-center text-gray-400">
                  <Package size={48} className="mx-auto mb-3 opacity-50" />
                  <p>No products found</p>
                </td>
              </tr>
            ) : (
              filteredList.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image[0]}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg border"
                      />
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-500">ID: {item._id.slice(-8)}</p>
                        <p className="text-xs text-gray-400">Sizes: {item.sizes?.join(', ') || 'N/A'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 hidden md:table-cell">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-semibold text-gray-800">{currency}{item.price}</p>
                    <p className="text-xs text-blue-600">Rental: {currency}{item.rental_price}/day</p>
                  </td>
                  <td className="py-4 px-4">
                    <select
                      value={item.status || 'available'}
                      onChange={(e) => updateProductStatus(item._id, e.target.value)}
                      className={`text-sm px-3 py-1.5 rounded-full border-0 font-medium cursor-pointer ${(item.status || 'available') === 'available'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                        }`}
                    >
                      <option value="available">✓ Available</option>
                      <option value="out_of_stock">✗ Out of Stock</option>
                    </select>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => removeProduct(item._id, item.name)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete product"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default List;
