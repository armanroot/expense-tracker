import {
  ArrowDownRight,
  ArrowUpRight,
  Clock3,
  LayoutGrid,
  PiggyBank,
  Wallet,
} from 'lucide-react'
import WelcomeBanner from '../components/home/WelcomeBanner.jsx'
import useExpense from '../hooks/useExpense.js'
import categories from '../data/Category.js'
import { getCategoryIcon } from '../data/categoryIcons.jsx'

const formatCurrency = (value) => {
  const formatted = new Intl.NumberFormat('ne-NP', {
    maximumFractionDigits: 0,
  }).format(value)
  return `Rs ${formatted}`
}

const findLabel = (value) =>
  categories.find((category) => category.value === value)?.label || 'Other'

function Home() {
  const { stats, monthlyBudget, setMonthlyBudget, expenses } = useExpense()
  const topCategories = Object.entries(stats.byCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)

  const recent = expenses.slice(0, 3)

  return (
    <div className="space-y-10">
      <WelcomeBanner />
      <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr_1fr]">
        <article className="rounded-3xl bg-gradient-to-br from-white to-stone-50 p-6 shadow-xl ring-1 ring-stone-200/60">
          <div className="flex items-center justify-between gap-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-stone-900">
              <Wallet size={18} className="text-stone-500" />
              Monthly Snapshot
            </h3>
            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-500">
              {stats.month}
            </span>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div>
              <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-stone-400">
                <ArrowUpRight size={14} />
                Income
              </p>
              <p className="text-lg font-semibold text-emerald-600">
                {formatCurrency(stats.income)}
              </p>
            </div>
            <div>
              <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-stone-400">
                <ArrowDownRight size={14} />
                Spending
              </p>
              <p className="text-lg font-semibold text-rose-600">
                {formatCurrency(stats.spending)}
              </p>
            </div>
            <div>
              <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-stone-400">
                <PiggyBank size={14} />
                Budget Remaining
              </p>
              <p
                className={`text-lg font-semibold ${
                  stats.budgetRemaining < 0
                    ? 'text-rose-600'
                    : 'text-emerald-600'
                }`}
              >
                {formatCurrency(stats.budgetRemaining)}
              </p>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            <label
              className="text-sm font-medium text-stone-600"
              htmlFor="monthlyBudget"
            >
              Monthly Budget
            </label>
            <input
              id="monthlyBudget"
              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm focus:border-stone-400 focus:outline-none"
              type="number"
              min="0"
              step="10"
              value={monthlyBudget}
              onChange={(event) => setMonthlyBudget(event.target.value)}
            />
          </div>
        </article>
        <article className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-stone-200/60">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-stone-900">
            <LayoutGrid size={18} className="text-stone-500" />
            Top Categories
          </h3>
          {topCategories.length === 0 ? (
            <p className="mt-4 text-sm text-stone-500">
              Add expenses to see category insights.
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {topCategories.map(([category, total]) => {
                const CategoryIcon = getCategoryIcon(category)

                return (
                  <div
                    key={category}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-stone-100 text-stone-600">
                        <CategoryIcon size={18} />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-stone-700">
                          {findLabel(category)}
                        </p>
                        <p className="text-base font-semibold text-stone-900">
                          {formatCurrency(total)}
                        </p>
                      </div>
                    </div>
                    <div className="h-2 w-32 overflow-hidden rounded-full bg-stone-200">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-red-500 via-orange-400 to-amber-300"
                        style={{
                          width: `${Math.min(
                            (total / stats.spending) * 100 || 0,
                            100,
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </article>
        <article className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-stone-200/60">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-stone-900">
            <Clock3 size={18} className="text-stone-500" />
            Recent Activity
          </h3>
          {recent.length === 0 ? (
            <p className="mt-4 text-sm text-stone-500">
              No activity yet. Add your first expense.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {recent.map((item) => {
                const CategoryIcon = getCategoryIcon(item.category)

                return (
                  <li
                    key={item.id}
                    className="flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-stone-600 shadow-sm ring-1 ring-stone-200">
                        <CategoryIcon size={18} />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-stone-700">
                          {item.title}
                        </p>
                        <p className="text-xs text-stone-500">{item.date}</p>
                      </div>
                    </div>
                    <p
                      className={`inline-flex items-center gap-1 text-sm font-semibold ${
                        item.type === 'income'
                          ? 'text-emerald-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {item.type === 'income' ? (
                        <ArrowUpRight size={15} />
                      ) : (
                        <ArrowDownRight size={15} />
                      )}
                      {formatCurrency(item.amount)}
                    </p>
                  </li>
                )
              })}
            </ul>
          )}
        </article>
      </section>
    </div>
  )
}

export default Home
