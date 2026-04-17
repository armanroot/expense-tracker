import { Github, Sparkles } from 'lucide-react'

function Footer() {
  return (
    <footer className="px-5 pb-8 pt-4 text-center text-sm text-stone-500 sm:px-8">
      <p className="inline-flex items-center gap-2">
        <Sparkles size={15} aria-hidden="true" />
        Expense Tracker • Focused on clarity, powered by you.
      </p>
      <a
        href="https://github.com/armanroot/expense-tracker.git"
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-flex items-center gap-2 text-stone-600 underline decoration-stone-300 underline-offset-4 transition hover:text-stone-900"
      >
        <Github size={16} aria-hidden="true" />
        Original project on GitHub
      </a>
    </footer>
  )
}

export default Footer

