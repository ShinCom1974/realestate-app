import { useState, useEffect } from 'react'

// 物件の新規登録・編集に共用するモーダルフォーム
// property が渡されたとき → 編集モード、null のとき → 新規登録モード
export default function PropertyForm({ property, onSubmit, onClose }) {
  const isEdit = Boolean(property)

  const [form, setForm] = useState({
    name: '',
    rent: '',
    area: '',
    layout: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // 編集モード時は既存データをフォームにセット
  useEffect(() => {
    if (property) {
      setForm({
        name: property.name,
        rent: String(property.rent),
        area: property.area,
        layout: property.layout,
      })
    }
  }, [property])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.rent || !form.area || !form.layout) {
      setError('すべての項目を入力してください。')
      return
    }
    setSubmitting(true)
    try {
      await onSubmit(form)
      onClose()
    } catch (err) {
      setError('保存に失敗しました。再度お試しください。')
    } finally {
      setSubmitting(false)
    }
  }

  // モーダル背景クリックで閉じる
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? '物件を編集' : '物件を新規登録'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="閉じる">✕</button>
        </div>

        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleSubmit} className="property-form">
          <div className="form-group">
            <label htmlFor="name">物件名</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="例: グランドメゾン渋谷"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="rent">家賃（円）</label>
            <input
              id="rent"
              name="rent"
              type="number"
              value={form.rent}
              onChange={handleChange}
              placeholder="例: 150000"
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="area">エリア</label>
            <input
              id="area"
              name="area"
              type="text"
              value={form.area}
              onChange={handleChange}
              placeholder="例: 東京都渋谷区"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="layout">間取り</label>
            <input
              id="layout"
              name="layout"
              type="text"
              value={form.layout}
              onChange={handleChange}
              placeholder="例: 1LDK"
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              キャンセル
            </button>
            <button type="submit" className="btn-primary form-submit" disabled={submitting}>
              {submitting ? '保存中...' : isEdit ? '更新する' : '登録する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
