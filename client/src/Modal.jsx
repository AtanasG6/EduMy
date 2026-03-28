import { useEffect } from 'react'
import { Icon, faXmark } from './icons'

export default function Modal({ title, children, onClose, maxWidth = 'max-w-lg' }) {
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${maxWidth} max-h-[90vh] flex flex-col border border-gray-100`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-sm font-black text-gray-950 tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <Icon icon={faXmark} className="text-xs" />
          </button>
        </div>
        <div className="px-6 py-5 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
