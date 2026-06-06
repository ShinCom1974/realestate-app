// 物件の新規登録・編集に使うモーダルフォーム
// property が null の場合は新規登録、値がある場合は編集モードとして動作する
import { useState } from 'react'
import styles from './PropertyForm.module.css'

const LAYOUT_OPTIONS = ['1R', '1K', '1DK', '1LDK', '2K', '2DK', '2LDK', '3LDK', '4LDK以上']

const EMPTY_FORM = { name: '', rent: '', area: '', layout: '1LDK' }

export default function PropertyForm({ property, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(
    property
      ? { name: property.name, rent: String(property.rent), area: property.area, layout: property.layout }
      : EMPTY_FORM
  )
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const rent = parseInt(form.rent, 10)
    if (isNaN(rent) || rent < 0) {
      setError('家賃は0以上の数値を入力してください。')
      return
    }
    try {
      await onSubmit({ name: form.name.trim(), rent, area: form.area.trim(), layout: form.layout })
    } catch (err) {
      setError('保存に失敗しました。もう一度お試しください。')
    }
  }

  return (
    // モーダルの背景（クリックでキャンセル）
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>{property ? '物件を編集' : '物件を登録'}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            物件名
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={styles.input}
              placeholder="例：サンライズマンション 301号室"
              required
            />
          </label>
          <label className={styles.label}>
            家賃（円）
            <input
              type="number"
              name="rent"
              value={form.rent}
              onChange={handleChange}
              className={styles.input}
              placeholder="例：85000"
              min="0"
              required
            />
          </label>
          <label className={styles.label}>
            エリア名
            <input
              type="text"
              name="area"
              value={form.area}
              onChange={handleChange}
              className={styles.input}
              placeholder="例：東京都新宿区西新宿"
              required
            />
          </label>
          <label className={styles.label}>
            間取り
            <select name="layout" value={form.layout} onChange={handleChange} className={styles.input}>
              {LAYOUT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </label>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.actions}>
            <button type="button" className={styles.cancelButton} onClick={onCancel}>
              キャンセル
            </button>
            <button type="submit" className={styles.submitButton} disabled={submitting}>
              {submitting ? '保存中...' : '保存する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
