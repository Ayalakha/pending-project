import { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { companyService } from '../services/companyService'
import { serviceOrProductService } from '../services/serviceOrProductService'
import { useAuth } from '../contexts/AuthContext'
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  Package
} from 'lucide-react'

const emptyForm = { name: '', description: '', price: '', type: 'service' }

const ItemForm = ({ initialValues, onCancel, onSubmit, isSaving, serverErrors }) => {
  const [formData, setFormData] = useState(initialValues)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    if (formData.price === '' || formData.price === null) {
      newErrors.price = 'Price is required'
    } else if (isNaN(formData.price) || Number(formData.price) < 0) {
      newErrors.price = 'Price must be a positive number'
    } else if (Number(formData.price) > 999999.99) {
      newErrors.price = 'Price is too large'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: formData.price,
      type: formData.type
    })
  }

  const fieldErrors = { ...errors, ...serverErrors }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${fieldErrors.name ? 'border-red-300' : 'border-gray-300'}`}
          placeholder="e.g. Website Design, Office Chairs"
        />
        {fieldErrors.name && (
          <p className="mt-1 text-sm text-red-600">{Array.isArray(fieldErrors.name) ? fieldErrors.name[0] : fieldErrors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors resize-vertical"
          placeholder="Describe this service or product..."
        />
        {fieldErrors.description && (
          <p className="mt-1 text-sm text-red-600">{Array.isArray(fieldErrors.description) ? fieldErrors.description[0] : fieldErrors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
            Price ($) *
          </label>
          <input
            type="number"
            id="price"
            name="price"
            min="0"
            max="999999.99"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${fieldErrors.price ? 'border-red-300' : 'border-gray-300'}`}
            placeholder="0.00"
          />
          {fieldErrors.price && (
            <p className="mt-1 text-sm text-red-600">{Array.isArray(fieldErrors.price) ? fieldErrors.price[0] : fieldErrors.price}</p>
          )}
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
            Type *
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
          >
            <option value="service">Service</option>
            <option value="product">Product</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={isSaving} className="btn-primary disabled:opacity-50">
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  )
}

const ItemCard = ({ item, onEdit, onDelete, isDeleting }) => {
  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              item.type === 'service'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-green-100 text-green-800'
            }`}>
              {item.type}
            </span>
          </div>
          {item.description && (
            <p className="text-gray-600 mb-2">{item.description}</p>
          )}
          <div className="text-xl font-bold text-primary-600">
            ${Number(item.price).toFixed(2)}
          </div>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onEdit(item)}
            className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(item)}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
            title="Delete"
          >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}

const ManageServicesPage = () => {
  const { id } = useParams()
  const { user, isAuthenticated } = useAuth()
  const queryClient = useQueryClient()

  const [mode, setMode] = useState(null) // null | 'add' | item-object being edited
  const [serverErrors, setServerErrors] = useState({})
  const [deletingId, setDeletingId] = useState(null)

  const { data: companyData } = useQuery({
    queryKey: ['company', id],
    queryFn: () => companyService.getCompany(id),
    enabled: isAuthenticated
  })

  const { data: itemsData, isLoading, error } = useQuery({
    queryKey: ['servicesProducts', id],
    queryFn: () => serviceOrProductService.getServicesOrProducts(id),
    enabled: isAuthenticated
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['servicesProducts', id] })

  const createMutation = useMutation({
    mutationFn: (data) => serviceOrProductService.createServiceOrProduct(id, data),
    onSuccess: () => {
      invalidate()
      setMode(null)
      setServerErrors({})
    },
    onError: (error) => {
      if (error.response?.data?.errors) {
        setServerErrors(error.response.data.errors)
      } else {
        alert('Failed to save item. Please try again.')
      }
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ itemId, data }) => serviceOrProductService.updateServiceOrProduct(itemId, data),
    onSuccess: () => {
      invalidate()
      setMode(null)
      setServerErrors({})
    },
    onError: (error) => {
      if (error.response?.data?.errors) {
        setServerErrors(error.response.data.errors)
      } else {
        alert('Failed to save item. Please try again.')
      }
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (itemId) => serviceOrProductService.deleteServiceOrProduct(itemId),
    onMutate: (itemId) => setDeletingId(itemId),
    onSuccess: () => {
      invalidate()
      setDeletingId(null)
    },
    onError: () => {
      alert('Failed to delete item. Please try again.')
      setDeletingId(null)
    }
  })

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user?.role !== 'owner' && user?.role !== 'superAdmin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-red-800 mb-2">Access Denied</h2>
          <p className="text-red-600">Only business owners can access this page.</p>
        </div>
      </div>
    )
  }

  const items = itemsData?.items || []
  const company = companyData?.company

  const handleDelete = (item) => {
    if (window.confirm(`Delete "${item.name}"? This action cannot be undone.`)) {
      deleteMutation.mutate(item.id)
    }
  }

  const startAdd = () => {
    setServerErrors({})
    setMode('add')
  }

  const startEdit = (item) => {
    setServerErrors({})
    setMode(item)
  }

  const cancelForm = () => {
    setServerErrors({})
    setMode(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link to="/my-companies" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to My Companies
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Services & Products</h1>
            <p className="text-gray-600 mt-2">
              {company ? `Manage what "${company.name}" offers` : 'Manage what this company offers'}
            </p>
          </div>
          {mode === null && (
            <button onClick={startAdd} className="btn-primary flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </button>
          )}
        </div>

        {mode === 'add' && (
          <div className="mb-6">
            <ItemForm
              initialValues={emptyForm}
              onCancel={cancelForm}
              onSubmit={(data) => createMutation.mutate(data)}
              isSaving={createMutation.isPending}
              serverErrors={serverErrors}
            />
          </div>
        )}

        {mode && mode !== 'add' && (
          <div className="mb-6">
            <ItemForm
              initialValues={{
                name: mode.name || '',
                description: mode.description || '',
                price: mode.price ?? '',
                type: mode.type || 'service'
              }}
              onCancel={cancelForm}
              onSubmit={(data) => updateMutation.mutate({ itemId: mode.id, data })}
              isSaving={updateMutation.isPending}
              serverErrors={serverErrors}
            />
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <span className="ml-2 text-gray-600">Loading items...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-lg font-medium text-red-800 mb-2">Error Loading Items</h2>
            <p className="text-red-600">Failed to load services and products. Please try again later.</p>
          </div>
        ) : items.length > 0 ? (
          <div className="space-y-4">
            {items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onEdit={startEdit}
                onDelete={handleDelete}
                isDeleting={deletingId === item.id}
              />
            ))}
          </div>
        ) : (
          mode === null && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-medium text-gray-900 mb-4">No Services or Products Yet</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Add what your business offers so customers know what to expect.
              </p>
              <button onClick={startAdd} className="btn-primary inline-flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Add Your First Item
              </button>
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default ManageServicesPage
