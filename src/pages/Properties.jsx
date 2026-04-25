import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  fetchProperties,
  createProperty,
  updateProperty,
  deleteProperty,
} from '../lib/propertiesApi'
import PropertyForm from '../components/PropertyForm'

export default function Properties() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')

  // モーダル制御: null=非表示, 'create'=新規登録, property オブジェクト=編集
  const [modalState, setModalState] = useState(null)

  // 物件一覧を Supabase から取得
  const loadProperties = useCallback(async () => {
    setLoading(true)
    setFetchError('')
    try {
      const data = await fetchProperties()
      setProperties(data)
    } catch {
      setFetchError('物件データの取得に失敗しました。')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProperties()
  }, [loadProperties])

  // 新規登録
  const handleCreate = async (form) => {
    const created = await createProperty(form)
    // 先頭に追加してリストを更新（再フェッチ不要）
    setProperties((prev) => [created, ...prev])
  }

  // 編集保存
  const handleUpdate = async (form) => {
    const updated = await updateProperty(modalState.id, form)
    setProperties((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    )
  }

  // 削除（確認ダイアログ付き）
  const handleDelete = async (id, name) => {
    if (!window.confirm(`「${name}」を削除してもよろしいですか？`)) return
    try {
      await deleteProperty(id)
      setProperties((prev) => prev.filter((p) => p.id !== id))
    } catch {
      alert('削除に失敗しました。')
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="properties-wrapper">
      {/* ヘッダー */}
      <header className="properties-header">
        <h1 className="site-title">不動産管理システム</h1>
        <div className="header-right">
          <span className="user-email">{user?.email}</span>
          <button onClick={handleSignOut} className="btn-logout">
            ログアウト
          </button>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="properties-main">
        <div className="section-header">
          <div>
            <h2 className="section-title">物件一覧</h2>
            {!loading && (
              <p className="property-count">全 {properties.length} 件</p>
            )}
          </div>
          <button
            className="btn-add"
            onClick={() => setModalState('create')}
          >
            ＋ 物件を登録
          </button>
        </div>

        {/* エラー表示 */}
        {fetchError && <p className="error-msg">{fetchError}</p>}

        {/* ローディング */}
        {loading ? (
          <div className="list-loading">読み込み中...</div>
        ) : properties.length === 0 ? (
          <div className="empty-state">
            <p>登録された物件はありません。</p>
            <p>「＋ 物件を登録」から追加してください。</p>
          </div>
        ) : (
          <div className="property-grid">
            {properties.map((property) => (
              <div key={property.id} className="property-card">
                <div className="property-card-header">
                  <h3 className="property-name">{property.name}</h3>
                  <span className="property-layout">{property.layout}</span>
                </div>
                <div className="property-card-body">
                  <p className="property-rent">
                    <span className="rent-label">家賃</span>
                    <span className="rent-value">
                      {property.rent.toLocaleString()}
                      <span className="rent-unit">円 / 月</span>
                    </span>
                  </p>
                  <p className="property-detail">
                    <span className="detail-label">エリア</span>
                    <span>{property.area}</span>
                  </p>
                </div>
                {/* 編集・削除ボタン */}
                <div className="property-card-actions">
                  <button
                    className="btn-edit"
                    onClick={() => setModalState(property)}
                  >
                    編集
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(property.id, property.name)}
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 新規登録 / 編集モーダル */}
      {modalState && (
        <PropertyForm
          property={modalState === 'create' ? null : modalState}
          onSubmit={modalState === 'create' ? handleCreate : handleUpdate}
          onClose={() => setModalState(null)}
        />
      )}
    </div>
  )
}
