import { useMemo, useState } from 'react'
import {
  CalendarDays,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Tags,
  Trash2,
  WalletCards,
} from 'lucide-react'
import categories from '../data/Category.js'
import useExpense from '../hooks/useExpense.js'
import { getCategoryIcon } from '../data/categoryIcons.jsx'

const formatCurrency = (value) => {
  const formatted = new Intl.NumberFormat('ne-NP', {
    maximumFractionDigits: 2,
  }).format(value)
  return `Rs ${formatted}`
}

const blankForm = {
  title: '',
  amount: '',
  category: categories[0]?.value || 'other',
  date: new Date().toISOString().slice(0, 10),
  note: '',
  type: 'expense',
}

function ExpensePage() {
  const {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
  } = useExpense()

  const [form, setForm] = useState(blankForm)
  const [editingId, setEditingId] = useState(null)
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    type: 'all',
    month: 'all',
  })

  const months = useMemo(() => {
    const values = new Set(expenses.map((item) => item.date?.slice(0, 7)))
    return Array.from(values).filter(Boolean).sort().reverse()
  }, [expenses])

  const filtered = useMemo(() => {
    return expenses.filter((item) => {
      const matchesSearch =
        filters.search.trim() === '' ||
        item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.note.toLowerCase().includes(filters.search.toLowerCase())
      const matchesCategory =
        filters.category === 'all' || item.category === filters.category
      const matchesType = filters.type === 'all' || item.type === filters.type
      const matchesMonth =
        filters.month === 'all' ||
        item.date?.slice(0, 7) === filters.month
      return matchesSearch && matchesCategory && matchesType && matchesMonth
    })
  }, [expenses, filters])

  const onSubmit = (event) => {
    event.preventDefault()
    if (!form.title.trim() || Number(form.amount) <= 0) return

    if (editingId) {
      updateExpense(editingId, form)
      setEditingId(null)
    } else {
      addExpense(form)
    }
    setForm(blankForm)
  }

  const onEdit = (expense) => {
    setEditingId(expense.id)
    setForm({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
      note: expense.note || '',
      type: expense.type,
    })
  }

  const onCancel = () => {
    setEditingId(null)
    setForm(blankForm)
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-6">
        <article className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-stone-200/60">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-stone-900">
            <WalletCards size={20} className="text-stone-500" />
            {editingId ? 'Edit Entry' : 'Add Entry'}
          </h2>
          <form className="mt-4 space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-600" htmlFor="title">
                Title
              </label>
              <input
                id="title"
                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm focus:border-stone-400 focus:outline-none"
                type="text"
                value={form.title}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, title: event.target.value }))
                }
                placeholder="Groceries, Paycheck, Ride share"
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-600" htmlFor="amount">
                  Amount
                </label>
                <input
                  id="amount"
                  className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm focus:border-stone-400 focus:outline-none"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.amount}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, amount: event.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-600" htmlFor="type">
                  Type
                </label>
                <select
                  id="type"
                  className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm focus:border-stone-400 focus:outline-none"
                  value={form.type}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, type: event.target.value }))
                  }
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-600" htmlFor="category">
                  Category
                </label>
                <select
                  id="category"
                  className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm focus:border-stone-400 focus:outline-none"
                  value={form.category}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      category: event.target.value,
                    }))
                  }
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-600" htmlFor="date">
                  Date
                </label>
                <input
                  id="date"
                  className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm focus:border-stone-400 focus:outline-none"
                  type="date"
                  value={form.date}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, date: event.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-600" htmlFor="note">
                Note
              </label>
              <textarea
                id="note"
                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm focus:border-stone-400 focus:outline-none"
                rows="3"
                value={form.note}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, note: event.target.value }))
                }
                placeholder="Optional detail for this entry"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-stone-800"
              >
                {editingId ? <Pencil size={16} /> : <Plus size={16} />}
                {editingId ? 'Save Changes' : 'Add Entry'}
              </button>
              {editingId ? (
                <button
                  type="button"
                  className="rounded-full border border-stone-300 px-5 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-100"
                  onClick={onCancel}
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </article>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-stone-200/60">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-semibold text-stone-900">
              <SlidersHorizontal size={20} className="text-stone-500" />
              Activity
            </h2>
            <p className="text-sm text-stone-500">
              {filtered.length} entries shown out of {expenses.length}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <label className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
              />
              <input
                className="w-48 rounded-xl border border-stone-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-stone-400 focus:outline-none"
                type="search"
                placeholder="Search title or note"
                value={filters.search}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    search: event.target.value,
                  }))
                }
              />
            </label>
            <select
              className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm focus:border-stone-400 focus:outline-none"
              value={filters.category}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  category: event.target.value,
                }))
              }
            >
              <option value="all">All categories</option>
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            <select
              className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm focus:border-stone-400 focus:outline-none"
              value={filters.type}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, type: event.target.value }))
              }
            >
              <option value="all">All types</option>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <select
              className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm focus:border-stone-400 focus:outline-none"
              value={filters.month}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, month: event.target.value }))
              }
            >
              <option value="all">All months</option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          {filtered.length === 0 ? (
            <p className="text-sm text-stone-500">No matching entries.</p>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="grid gap-3 rounded-2xl bg-stone-50 px-4 py-4 text-sm sm:grid-cols-[2fr_1fr_1fr_1fr_auto] sm:items-center"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-stone-600 shadow-sm ring-1 ring-stone-200">
                    {(() => {
                      const CategoryIcon = getCategoryIcon(item.category)
                      return <CategoryIcon size={18} />
                    })()}
                  </span>
                  <div>
                    <p className="font-medium text-stone-700">{item.title}</p>
                    {item.note ? (
                      <p className="text-xs text-stone-500">{item.note}</p>
                    ) : null}
                  </div>
                </div>
                <span className="inline-flex items-center gap-2 text-stone-600">
                  <Tags size={15} className="text-stone-400" />
                  {categories.find((cat) => cat.value === item.category)?.label}
                </span>
                <span className="inline-flex items-center gap-2 text-stone-600">
                  <CalendarDays size={15} className="text-stone-400" />
                  {item.date}
                </span>
                <span
                  className={`font-semibold ${
                    item.type === 'income'
                      ? 'text-emerald-600'
                      : 'text-rose-600'
                  }`}
                >
                  {formatCurrency(item.amount)}
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    className="inline-flex items-center gap-1 rounded-full border border-stone-300 px-3 py-1 text-xs font-semibold text-stone-600 hover:bg-stone-100"
                    onClick={() => onEdit(item)}
                  >
                    <Pencil size={14} />
                    Edit
                  </button>
                  <button
                    className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-100"
                    onClick={() => deleteExpense(item.id)}
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}

export default ExpensePage
